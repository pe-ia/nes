/* Week 9, Time Synchronisation: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "why-time": [
      {
        q: "Which of these is an <em>application-level</em> use of time, rather than a system-level one?",
        options: [
          ["Timestamping sensor samples so data from several boards can be fused", true, "Timestamping distributed events or sensor data for data fusion is listed under application-level functions: the application needs to know when each reading was taken."],
          ["Scheduling the radio to wake up every 100 ms", false, "Waking up hardware on schedule is a system-level function: the operating system or MAC protocol does it for every application."],
          ["Giving up waiting for an acknowledgement after a timeout", false, "Timeouts are a system-level function, used by protocols and drivers underneath the application."],
          ["Generating the clock signal for an SPI bus", false, "Generating clock signals is a system-level function, done by peripherals for every user of the bus."],
        ],
      },
      {
        q: "Why does a car (slide 3) need its many embedded systems to agree on time, and not just keep time individually?",
        options: [
          ["It does not: each ECU only needs its own clock", false, "A single ECU can run its own periodic tasks, but as soon as events from different ECUs are compared or combined, their clocks must agree."],
          ["Because CAN frames carry no data, only timestamps", false, "CAN frames carry data (up to 8 bytes in classic CAN); time synchronisation is a separate concern."],
          ["Because every ECU must show the time to the driver", false, "Only the dashboard shows the time; most ECUs never display anything."],
          ["Distributed functions (sensor fusion, coordinated actions, logging) compare events that were timestamped by different nodes", true, "If two nodes' clocks disagree, events timestamped by them cannot be ordered or fused correctly. That is what makes time a distributed-systems problem."],
        ],
      },
    ],

    oscillators: [
      {
        q: "What does a crystal oscillator do for an MCU?",
        options: [
          ["It stores the current date and time", false, "The crystal stores nothing. A counter driven by it keeps time; the crystal only provides the regular pulses."],
          ["It generates a signal at a specific, stable frequency that the MCU counts to keep track of time", true, "The crystal resonates at its nominal frequency (from kHz to GHz). Counting its periods is how the MCU measures time."],
          ["It converts the supply voltage into a clean DC level", false, "That is a voltage regulator's job (Week 2)."],
          ["It synchronises the MCU with UTC automatically", false, "A crystal has no idea what time it is; it only ticks, and it drifts. Synchronisation is a separate step."],
        ],
      },
      {
        q: "A 32768 Hz oscillator: how long is one period?",
        options: [
          ["About 30.5 µs", true, "T = 1 / f = 1 / 32768 Hz ≈ 30.518 µs. The waveform on slide 5 shows about 3.3 periods in 0.1 ms."],
          ["About 30.5 ms", false, "That is the time for 1000 periods (slide 6), not one."],
          ["About 3.05 µs", false, "That would be a 327.68 kHz oscillator, ten times faster."],
          ["Exactly 1 s", false, "One second is 32768 periods. That is why 32768 = 2<sup>15</sup> is such a popular choice: a 15-bit counter overflows exactly once per second."],
        ],
      },
    ],

    "prog-timer": [
      {
        q: "A programmable timer driven by a 32768 Hz crystal is loaded with 1000. When does the interrupt fire?",
        options: [
          ["After 1000 / 32768 s ≈ 30.5 ms", true, "Each pulse decrements the counter; after 1000 pulses it reaches zero and raises the clock interrupt: 1000 / f = 30.5 ms, the slide's example."],
          ["After 1000 ms", false, "The counter counts pulses, not milliseconds. 1000 pulses at 32768 Hz take far less than a second."],
          ["After 32768 / 1000 s ≈ 32.8 s", false, "That inverts the ratio. The time is pulses divided by pulse rate."],
          ["After 30.5 µs", false, "That is the length of a single pulse; the counter needs 1000 of them."],
        ],
      },
      {
        q: "In the programmable timer (slide 6), what is the holding register for?",
        options: [
          ["It counts the number of interrupts so far", false, "Counting interrupts is software's job (for example the UPTIME variable on slide 10)."],
          ["It stores the crystal frequency", false, "The frequency is a property of the crystal; nothing stores it in the timer."],
          ["It holds the initial value that is loaded into the counter", true, "The holding register keeps the start value so the counter can be (re)loaded with it, which is what makes periodic mode possible without software intervention."],
          ["It buffers bytes for the UART", false, "That is a UART data register, unrelated to the timer."],
        ],
      },
    ],

    "timer-modes": [
      {
        q: "A 24 MHz clock goes through a prescaler of 8, and the timer counts down from 3000 in periodic mode. What is the interrupt rate?",
        options: [
          ["1000 interrupts per second", true, "Timer frequency = 24 MHz / 8 = 3 MHz; each period takes 3000 / 3 MHz = 1 ms, so 1000 interrupts per second."],
          ["8000 interrupts per second", false, "That would ignore the counter: the prescaler slows the counting, it does not multiply the interrupts."],
          ["125 interrupts per second", false, "That applies the prescaler twice. 24 MHz / 8 = 3 MHz, divided by 3000 gives 1000 Hz."],
          ["One interrupt, then it stops", false, "That is one-off mode. In periodic mode the counter reloads automatically after every interrupt."],
        ],
      },
      {
        q: "You need a single timeout: \"if no reply arrives within 50 ms, give up\". Which mode fits?",
        options: [
          ["Periodic mode", false, "Periodic mode would keep firing every 50 ms, so you would have to stop it by hand after the first interrupt."],
          ["Square-wave mode", false, "Square-wave mode is another name for periodic mode."],
          ["No timer is needed: busy-wait for 50 ms", false, "Busy-waiting wastes the CPU and energy (Week 3). The timer exists so the CPU can sleep or do other work."],
          ["One-off mode", true, "One-off mode starts from the initial value and issues one interrupt at zero: exactly a timeout or alarm."],
        ],
      },
    ],

    resolution: [
      {
        q: "Your MCU timestamps events with a 32768 Hz clock. Two events are 10 µs apart. What can the timestamps tell you?",
        options: [
          ["That they are exactly 10 µs apart", false, "The clock cannot see anything shorter than one tick (30.5 µs)."],
          ["That they are 10 ms apart", false, "Nothing in the clock scales time up by 1000."],
          ["Most likely nothing: both may get the same tick, or one tick (30.5 µs) apart", true, "Clocks measure in ticks. With a 30.5 µs tick, a 10 µs interval is counted as 0 or 1 tick depending on where it falls."],
          ["That they happened at the same time, always", false, "If the interval happens to straddle a tick edge, the timestamps differ by one tick."],
        ],
      },
      {
        q: "Why do embedded devices often carry both a 24 MHz (or similar) and a 32 kHz crystal?",
        options: [
          ["The fast one keeps the real time while the MCU sleeps", false, "It is the other way round: the fast crystal costs too much energy to keep running in sleep."],
          ["The fast crystal clocks the CPU and gives fine resolution while active; the low-power 32 kHz one keeps real time and schedules wake-ups even when the system is off", true, "Higher frequency means higher energy consumption, so each crystal is used where its trade-off fits (the HF vs LF timer choice from Week 3)."],
          ["Two crystals average out each other's drift", false, "They are used for different jobs, not combined into one clock."],
          ["Radio regulations require two crystals", false, "There is no such rule; the reason is the resolution versus energy trade-off."],
        ],
      },
      {
        q: "What is the tick length of a 24 MHz crystal?",
        options: [
          ["41.667 ps", false, "That is what slide 8 prints, but 1 / 24 MHz = 41.667 × 10<sup>-9</sup> s, which is nanoseconds. Picoseconds would need a 24 THz clock."],
          ["30.518 µs", false, "That is the tick of a 32768 Hz crystal."],
          ["41.667 µs", false, "That would be a 24 kHz clock, a thousand times slower."],
          ["41.667 ns", true, "T = 1 / f = 1 / (24 × 10<sup>6</sup> Hz) ≈ 41.667 ns."],
        ],
      },
    ],

    uptime: [
      {
        q: "Slide 10's uptime counter (32768 Hz crystal, periodic timer loaded with 32768, UPTIME++ on every interrupt) runs for exactly one day. What does UPTIME show?",
        options: [
          ["About 86400, but usually not exactly: with a ±20 ppm crystal anywhere from about 86398 to 86401", true, "Nominally one interrupt per second gives 86400. A ±20 ppm crystal is off by up to 20 × 10<sup>-6</sup> × 86400 s ≈ 1.7 s per day, in either direction."],
          ["Exactly 86400, always", false, "Only with a perfect crystal. Real crystals are slightly off their nominal frequency, so the count drifts (slides 11 and 12)."],
          ["32768 × 86400", false, "The counter counts pulses, but UPTIME is only incremented once per 32768 pulses."],
          ["It overflows", false, "A uint32 counting seconds overflows after 2<sup>32</sup> s, about 136 years."],
        ],
      },
      {
        q: "By mistake the timer is loaded with 32767 instead of 32768 (and the crystal is perfect). What happens to UPTIME?",
        options: [
          ["Nothing measurable", false, "One pulse in 32768 is about 30.5 ppm: 2.6 s per day. That is larger than the crystal's own error."],
          ["It counts slightly slow", false, "A smaller start value makes each period shorter, so interrupts come slightly more often."],
          ["It counts slightly fast, gaining about 2.6 s per day", true, "Each 'second' is now 32767 pulses long: the clock runs 32768 / 32767 - 1 ≈ 30.5 ppm fast, and 30.5 ppm × 86400 s ≈ 2.6 s per day."],
          ["It stops counting", false, "Any non-zero start value still produces periodic interrupts."],
        ],
      },
    ],

    drift: [
      {
        q: "A 32768 Hz crystal has a maximum drift of ±20 ppm. What is the range of its actual frequency?",
        options: [
          ["32748 Hz to 32788 Hz", false, "That treats 20 ppm as 20 Hz. 20 ppm of 32768 Hz is only 0.655 Hz."],
          ["32767.98 Hz to 32768.02 Hz", false, "That would be about ±0.6 ppm, much better than the crystal in the example."],
          ["32767.34464 Hz to 32768.65536 Hz", true, "20 ppm = 20 × 10<sup>-6</sup>; 32768 × 20 × 10<sup>-6</sup> = 0.65536 Hz either side of nominal, the slide's example."],
          ["Exactly 32768 Hz, the ppm only matters at extreme temperatures", false, "Production spread alone shifts every crystal slightly off nominal at room temperature."],
        ],
      },
      {
        q: "How large is the worst-case error of a ±20 ppm clock after one day?",
        options: [
          ["20 µs", false, "That is the error after one second (20 × 10<sup>-6</sup> × 1 s)."],
          ["0.02 s", false, "That would be about 0.23 ppm."],
          ["20 s", false, "That is 20 ppm over about 11.6 days, not one."],
          ["About 1.73 s", true, "Error = drift × time = 20 × 10<sup>-6</sup> × 86400 s ≈ 1.728 s."],
        ],
      },
    ],

    error: [
      {
        q: "Slide 12 defines error as true time minus UPTIME. A crystal runs at -10 ppm (slow). What is the sign of the error?",
        options: [
          ["Positive: UPTIME falls behind true time", true, "A slow crystal produces fewer pulses than nominal, so UPTIME counts less than the real time that passed and true - UPTIME is positive. That is why the -ppm curves on slide 12 go up."],
          ["Negative", false, "Negative error means UPTIME is ahead of true time, which happens with a fast (+ppm) crystal."],
          ["Zero, because -10 ppm is within tolerance", false, "Being within the datasheet tolerance does not make the error zero; it only bounds it."],
          ["It alternates", false, "A constant drift produces an error that grows steadily in one direction."],
        ],
      },
      {
        q: "The curves on slide 12 look like they explode near the end. How does the error really grow over time for a constant drift?",
        options: [
          ["Exponentially", false, "The bending is an effect of the logarithmic time axis. On a linear axis the same curves are straight lines."],
          ["Linearly: error = drift × elapsed time", true, "A constant ppm offset adds the same tiny amount of error every second. The time axis on slide 12 is logarithmic (1 m, 1 h, 1 d, 1 w), which makes a straight line look like it shoots up."],
          ["It saturates at the ppm value", false, "ppm is a rate, not an upper bound on the error. The error keeps growing until the clock is resynchronised."],
          ["Quadratically", false, "Quadratic growth would need the drift itself to grow over time; with a constant drift it is linear."],
        ],
      },
    ],

    "other-drift": [
      {
        q: "An FC-135 crystal drifts at most -0.04 ppm/°C² away from 25 °C. What is the worst-case temperature drift at -5 °C?",
        options: [
          ["-1.2 ppm", false, "That multiplies by the temperature difference (30 °C) instead of its square."],
          ["+36 ppm", false, "The coefficient is negative: the crystal slows down away from 25 °C in both directions."],
          ["-36 ppm", true, "Δf/f = -0.04 × (T - 25)² = -0.04 × (-30)² = -0.04 × 900 = -36 ppm. Far more than the ±20 ppm production spread."],
          ["0 ppm, crystals only drift when heated", false, "The parabola goes down on both sides of 25 °C: cold slows the crystal down just as much as heat."],
        ],
      },
      {
        q: "A node uses a crystal with +8 ppm production error, it is 2 years old with ageing of -3 ppm/year, and it runs at 25 °C. What is its total drift (linear ageing model)?",
        options: [
          ["+8 ppm", false, "The ageing contribution is missing: different sources of drift add up."],
          ["-6 ppm", false, "That is the ageing alone; the +8 ppm production error is still there."],
          ["+14 ppm", false, "That adds the ageing with the wrong sign: -3 ppm/year makes the crystal slower."],
          ["+2 ppm", true, "+8 ppm + 2 years × (-3 ppm/year) + 0 ppm (at 25 °C the temperature term is zero) = +2 ppm. Sources can partly cancel, but you cannot count on it."],
        ],
      },
    ],

    blink: [
      {
        q: "MCU1 drifts +10 ppm and MCU2 drifts +10 ppm. Are their blinking LEDs in sync with each other a day later?",
        options: [
          ["No, they are 0.86 s apart", false, "Each is 0.86 s ahead of true time, but by the same amount, so not apart from each other."],
          ["No, relative drift is +20 ppm", false, "Relative drift subtracts the drifts, it does not add them."],
          ["Yes: relative drift is 0 ppm, although both are off from true time", true, "Relative drift = MCU1 drift - MCU2 drift = 0 ppm. Two clocks can be in sync with each other while both drift from true time."],
          ["Only if they also see the same temperature", false, "Temperature would change the drifts, but with the drifts as given (+10 and +10) the relative drift is zero."],
        ],
      },
      {
        q: "Both MCUs use a ±20 ppm crystal. What is the worst-case offset between their blinks after one hour?",
        options: [
          ["72 ms", false, "That is one crystal's worst case (20 ppm × 3600 s). The relative worst case is double."],
          ["0 ms, because both crystals have the same tolerance", false, "Same tolerance does not mean same error: one can be at -20 ppm and the other at +20 ppm."],
          ["1.44 s", false, "That is 40 ppm over 10 hours."],
          ["144 ms", true, "Worst-case relative drift is 40 ppm (one at +20, the other at -20): 40 × 10<sup>-6</sup> × 3600 s = 0.144 s, already visible to the eye."],
        ],
      },
    ],

    "true-time": [
      {
        q: "Why do we not simply put an atomic clock in every embedded system?",
        options: [
          ["Atomic clocks are less accurate than crystals", false, "Atomic clocks are the most accurate means we have to measure time."],
          ["Atomic clocks cannot be read by software", false, "They can be read like any other clock; cost is the problem."],
          ["Atomic clocks only work outdoors", false, "That is a limitation of GPS reception, not of atomic clocks."],
          ["They are expensive (the slide quotes $30K+), so we periodically synchronise cheap imperfect clocks instead", true, "Exactly the slide's conclusion: an atomic clock per node is not affordable, so nodes synchronise their crystals to a better reference from time to time."],
        ],
      },
      {
        q: "What is the relationship between International Atomic Time (TAI) and UTC?",
        options: [
          ["They are identical", false, "UTC includes leap seconds; TAI does not, so they differ by a whole number of seconds."],
          ["UTC is 37 s ahead of TAI", false, "That is what slide 17 states, but it is the other way round. Leap seconds are inserted into UTC, which makes UTC fall behind: TAI - UTC = 37 s."],
          ["TAI is 37 s ahead of UTC, because UTC inserts leap seconds for the Earth's slowing rotation", true, "TAI runs continuously; every leap second holds UTC back by one more second. Since 2017, TAI - UTC = 37 s."],
          ["UTC is the average of 450 atomic clocks, TAI follows the Sun", false, "It is the other way round: TAI is the weighted average of the atomic clocks, and UTC is adjusted to stay close to the Earth's rotation."],
        ],
      },
    ],

    unidirectional: [
      {
        q: "Alice sends her timestamp T1 = 10.000 s; Bob receives it at his local time T2 = 10.025 s. The message delay is known to be 5 ms. What is Bob's offset relative to Alice?",
        options: [
          ["+25 ms", false, "That is T2 - T1, which still contains the message delay."],
          ["+30 ms", false, "The delay has to be subtracted, not added."],
          ["+20 ms", true, "T2 = T1 + D + o, so o = T2 - T1 - D = 25 ms - 5 ms = +20 ms: Bob's clock is 20 ms ahead."],
          ["-20 ms", false, "Bob's timestamp is later than Alice's plus the delay, so Bob is ahead (positive offset)."],
        ],
      },
      {
        q: "Why can Bob not simply measure the one-way delay D?",
        options: [
          ["Because the message is too short", false, "Message length affects the delay, not whether it can be measured."],
          ["Because measuring it would need both clocks to be synchronised already: exactly the problem we are trying to solve", true, "D = T2 - T1 - o: with o unknown, the delay and the offset cannot be separated from a single one-way message."],
          ["Because radios do not timestamp messages", false, "Timestamps can be taken in software or hardware; that is not the obstacle."],
          ["Because the delay is always zero", false, "The delay is never zero (slide 19 lists its components); the issue is that it cannot be separated from the offset."],
        ],
      },
    ],

    "delay-parts": [
      {
        q: "A 100-byte packet is sent at 250 kbit/s over 30 m. Which delay component is larger, and by how much?",
        options: [
          ["Transmission: 3.2 ms versus 0.1 µs of propagation", true, "Transmission = L/R = 800 bits / 250 000 bit/s = 3.2 ms. Propagation = d/s = 30 m / (3 × 10<sup>8</sup> m/s) = 0.1 µs. At short distances propagation is negligible."],
          ["Propagation: 0.1 s versus 3.2 ms", false, "30 m at the speed of light takes 0.1 µs, not 0.1 s."],
          ["They are equal", false, "They depend on completely different things (bits and bit rate versus distance and speed) and differ by a factor of about 30 000 here."],
          ["Transmission: 0.4 ms", false, "That treats 100 bytes as 100 bits. 100 bytes = 800 bits."],
        ],
      },
      {
        q: "Which delay components make one-way synchronisation hard, because they vary from message to message?",
        options: [
          ["Transmission and propagation", false, "Both are easy to calculate (L/R and d/s) and stay constant for a given packet and distance."],
          ["Only propagation, at satellite distances", false, "Propagation is large for satellites but predictable."],
          ["The operating system and access delays: scheduling, processing, queuing and waiting for the medium", true, "These depend on what else the system and the network are doing, so they are unpredictable. That is what reference broadcasts and hardware timestamping try to cancel or avoid."],
          ["None: all delays are constant", false, "Scheduling, queuing and access delays change constantly with load."],
        ],
      },
    ],

    gps: [
      {
        q: "Why is a GPS receiver able to synchronise its clock so precisely?",
        options: [
          ["It has its own atomic clock", false, "The satellites carry the atomic clocks; the receiver uses a cheap crystal."],
          ["Each satellite carries an atomic clock and broadcasts its time; the delay is bounded by the propagation delay, which the receiver solves for along with its position", true, "The receiver gets 1-hop access to an atomic clock. Solving the position equations also solves its clock offset."],
          ["It asks an NTP server over the internet", false, "GPS needs no internet connection; it works from the satellite signals alone."],
          ["GPS signals arrive instantly", false, "They take tens of milliseconds to arrive; GPS works because that delay is known once the position is known."],
        ],
      },
      {
        q: "Which is a disadvantage of GPS-based synchronisation for a battery-powered indoor sensor?",
        options: [
          ["Its accuracy is worse than NTP", false, "GPS is one of the most precise options, with 1-hop access to atomic clocks."],
          ["It needs a time server on the local network", false, "That is NTP or PTP, not GPS."],
          ["It cannot provide real-world (true) time", false, "GPS time is traceable to atomic clocks: it is true time."],
          ["It needs line of sight to the satellites and the receiver consumes significant energy", true, "GPS typically only works outdoors, and keeping a receiver on drains a battery. A car has one GPS receiver, not one per sensor."],
        ],
      },
    ],

    "gps-1d": [
      {
        q: "In the 1D example, the receiver's clock is 2 s ahead of the satellites (signals travel at 1 m/s). S1 is at 0 m and R at 200 m. What position does R estimate from S1 alone?",
        options: [
          ["202 m", true, "T2' = T1 + d/s + 2, so R computes d = (T2' - T1) · s = 200 + 2 = 202 m: each second of offset is 1 m of error at s = 1 m/s."],
          ["198 m", false, "A clock that is ahead makes the signal seem to arrive later, so the distance looks longer, not shorter."],
          ["200 m", false, "Only if R were in sync with S1."],
          ["400 m", false, "The offset adds 2 s × 1 m/s = 2 m, not a factor of two."],
        ],
      },
      {
        q: "Why does a GPS receiver need a fourth satellite in 3D?",
        options: [
          ["Three satellites only work in 2D", false, "Three spheres do narrow the position to two points in 3D, but only if the receiver's clock is perfect."],
          ["As a backup in case one fails", false, "Spare satellites help availability, but the fourth signal is needed even when all are healthy."],
          ["To solve for the receiver's clock offset, the fourth unknown besides x, y and z", true, "Position has three unknowns; the receiver's clock offset is the fourth. Four signals give four equations, which is why GPS synchronises time as a by-product."],
          ["To measure the speed of light", false, "The signal speed is known; it is the receiver's clock that is not."],
        ],
      },
    ],

    bidirectional: [
      {
        q: "B sends at T1 = 100 ms (B's clock); A receives at T2 = 160 ms and replies at T3 = 170 ms (A's clock); B receives at T4 = 130 ms (B's clock). What is the offset o of A relative to B?",
        options: [
          ["+60 ms", false, "That is T2 - T1, which still contains the forward delay."],
          ["+50 ms", true, "o = ((T2 - T1) - (T4 - T3)) / 2 = (60 - (-40)) / 2 = 50 ms. The one-way delay is ((T2 - T1) + (T4 - T3)) / 2 = (60 - 40) / 2 = 10 ms."],
          ["+10 ms", false, "10 ms is the one-way delay D = ((T2 - T1) + (T4 - T3)) / 2, not the offset."],
          ["-50 ms", false, "A's timestamps are larger than B's, so A's clock is ahead: the offset of A relative to B is positive."],
        ],
      },
      {
        q: "Bidirectional synchronisation assumes the delay is the same in both directions. What happens if the request takes 10 ms and the reply 30 ms?",
        options: [
          ["The estimated offset is wrong by (10 - 30) / 2 = -10 ms", true, "o_estimated = o + (D_forward - D_back) / 2. Half of any asymmetry ends up as offset error, which is why NTP is vulnerable to asymmetric routes."],
          ["The estimate is still exact, only the delay estimate is off", false, "The delay estimate (20 ms) is the average, and the offset estimate absorbs half of the difference."],
          ["The estimate is wrong by the full 20 ms", false, "Only half the asymmetry appears in the offset, because the formula divides by two."],
          ["The exchange fails and must be repeated", false, "Nothing detects the asymmetry: the formula silently returns a biased answer."],
        ],
      },
    ],

    ntp: [
      {
        q: "What is the difference between NTP and SNTP?",
        options: [
          ["SNTP is more accurate because it is simpler", false, "Simpler means less accurate: SNTP makes one query and applies the result."],
          ["NTP synchronises to GPS, SNTP to the internet", false, "Both talk to time servers; the servers themselves may use GPS."],
          ["SNTP makes one query to a single server; NTP queries several servers, keeps a history of clock drift and applies corrections", true, "SNTP is the lightweight client: less accurate, but cheap enough for small embedded devices."],
          ["SNTP uses unidirectional synchronisation", false, "SNTP still uses the same four-timestamp bidirectional exchange; it just does it once."],
        ],
      },
      {
        q: "NTP achieves milliseconds over the internet but better than a millisecond on a local network. Why?",
        options: [
          ["Local networks use a faster version of the protocol", false, "It is the same protocol."],
          ["Local networks have shorter, more symmetric and less congested paths, so the equal-delay assumption holds better", true, "NTP is vulnerable to congestion and asymmetric routes. On a LAN, queuing is small and both directions take the same path."],
          ["The speed of light is higher in Ethernet cables", false, "Signals in cables are slower than in air (about two thirds of c), and propagation is not the limiting factor here anyway."],
          ["Internet servers are less accurate", false, "Public servers are typically very accurate; the network between you and them is the problem."],
        ],
      },
    ],

    ptp: [
      {
        q: "Why is PTP (Precision Time Protocol) more accurate than NTP, even though it uses the same offset formula?",
        options: [
          ["It uses a different formula that removes asymmetry", false, "The slide shows the same formula and the same assumptions (symmetric delay, constant offset)."],
          ["It only works with GPS", false, "PTP needs a good master clock, but that clock may come from anywhere."],
          ["It sends more messages per second", false, "Message rate alone does not remove the OS-related and queuing errors."],
          ["A time master on the local network mitigates queuing and routing delays, and hardware timestamps mitigate OS-related delays", true, "Taking the timestamp in the network hardware, at the moment the frame passes, removes the scheduling and processing jitter that software timestamps include."],
        ],
      },
      {
        q: "In PTP (slide 27), who starts the exchange?",
        options: [
          ["The time server (master) broadcasts a message with its timestamp; the devices then send a request to measure the round-trip delay", true, "That is the variation: the master sends T1 first, the device answers with a request at T3, and the master returns T4."],
          ["The device always starts, like an NTP client", false, "In NTP the client starts; in PTP the master's broadcast comes first."],
          ["A GPS satellite", false, "PTP runs on a local network; GPS may discipline the master clock, but it is not part of the exchange."],
          ["Nobody, PTP uses unidirectional synchronisation only", false, "PTP is a variation of bidirectional synchronisation: it needs the request and response to cancel the delay."],
        ],
      },
    ],

    reference: [
      {
        q: "What does reference-based synchronisation provide that GPS, NTP and PTP do not aim for?",
        options: [
          ["Synchronisation with true time (UTC)", false, "That is exactly what GPS, NTP, SNTP and PTP provide. Reference-based synchronisation is relative."],
          ["Relative synchronisation: devices agree with each other by timestamping a shared event, without needing true time", true, "The relative offset between two clocks is the difference between their timestamps of the same event."],
          ["Higher accuracy than any atomic clock", false, "It can be cheap and precise, but it does not beat an atomic clock."],
          ["No need for any communication at all", false, "The devices still have to exchange their timestamps to compute the offset."],
        ],
      },
      {
        q: "How does a cinema clapperboard synchronise a camera and a separate microphone?",
        options: [
          ["It sends a radio signal to both", false, "A classic clapperboard has no electronics."],
          ["It contains a tiny atomic clock", false, "It contains no clock at all."],
          ["It forces both devices to start recording at the same time", false, "They can start whenever they like; the alignment happens afterwards."],
          ["It creates one distinct audio-visual event; aligning the clap in the picture with the clap in the sound gives the offset between the two recordings", true, "Each device timestamps the same event on its own clock, and the difference is the relative offset."],
        ],
      },
    ],

    rbs: [
      {
        q: "In Reference-Broadcast Synchronisation, A receives the beacon at T1 = 2.450 s and B at T2 = 2.470 s (each on its own clock). What does B compute?",
        options: [
          ["B is 20 ms ahead of A: o = T2 - T1 = +20 ms", true, "Both timestamped the same beacon, so their difference is the relative offset. The beacon's own send time never enters the calculation."],
          ["B is 20 ms behind A", false, "B's timestamp of the same event is larger, so B's clock reads later: B is ahead."],
          ["B must also know when R sent the beacon", false, "That is the point of RBS: the sender's delays affect both receivers equally and cancel."],
          ["The offset is 4.92 s", false, "Timestamps are subtracted, not added."],
        ],
      },
      {
        q: "Which errors are left in RBS?",
        options: [
          ["The sender's scheduling, processing and access delays", false, "Those affect the beacon identically for every receiver, so they cancel in T2 - T1."],
          ["Only the differences in receiver-side delays (and a tiny difference in propagation)", true, "The critical path starts when the beacon is on the air: what remains is how differently A and B receive and timestamp it."],
          ["The full round-trip delay", false, "There is no round trip in RBS."],
          ["None at all", false, "Receivers do not process the beacon in exactly the same time, so some error always remains."],
        ],
      },
    ],

    periodic: [
      {
        q: "Two nodes have a relative drift of 10 ppm and resynchronise every 2 minutes (sync brings the error to zero). What is the largest error between syncs?",
        options: [
          ["12 ms", false, "That is what the chart on slide 30 shows, but 10 ppm × 120 s = 1.2 ms. The plotted values correspond to 100 ppm."],
          ["1.2 ms", true, "Maximum error = relative drift × sync interval = 10 × 10<sup>-6</sup> × 120 s = 1.2 ms, reached just before each sync."],
          ["10 µs", false, "That is the error after one second."],
          ["It grows without bound", false, "Periodic synchronisation is exactly what bounds it."],
        ],
      },
      {
        q: "You need nodes with 40 ppm worst-case relative drift to stay within 2 ms of each other. How often must they synchronise, at least?",
        options: [
          ["Every 500 s", false, "That would let the error reach 40 ppm × 500 s = 20 ms."],
          ["Every 5 s", false, "That works, but is ten times more often than needed and costs energy and bandwidth."],
          ["Every 80 s", false, "That would allow 3.2 ms."],
          ["Every 50 s", true, "Interval ≤ allowed error / drift = 2 × 10<sup>-3</sup> s / 40 × 10<sup>-6</sup> = 50 s."],
        ],
      },
    ],

    "trade-offs": [
      {
        q: "A swarm of sensors only needs to agree with each other on when events happened, not on the time of day. What is the cheapest suitable approach?",
        options: [
          ["A GPS receiver on every node", false, "It works outdoors but costs energy and money, and provides true time you do not need."],
          ["Relative synchronisation, e.g. reference-broadcast synchronisation", true, "Real-time synchronisation requires more resources than relative synchronisation. If the nodes only need to agree with each other, a shared reference event is enough."],
          ["NTP to an internet time server from every node", false, "That needs internet connectivity and gives true time, more than required."],
          ["No synchronisation: crystals are accurate enough", false, "Even ±20 ppm crystals drift apart by up to 3.5 s per day."],
        ],
      },
      {
        q: "Which trade-off does the conclusion slide state about synchronisation frequency?",
        options: [
          ["Synchronising more often makes clocks drift faster", false, "Synchronisation does not change the drift rate, only the accumulated error."],
          ["Synchronisation frequency does not matter once the clocks are synchronised", false, "Error starts accumulating again immediately after every sync."],
          ["The frequency of synchronisation bounds the error, but each synchronisation costs resources", true, "More frequent syncs mean a smaller maximum error but more messages, more radio time and more energy."],
          ["Loose synchronisation needs more resources than precise synchronisation", false, "The conclusion says the opposite: high precision requires more resources than loose synchronisation."],
        ],
      },
    ],
  };

  /* =====================================================================
     Formatting helpers
     ===================================================================== */
  function fmtSec(s, digits) {
    const d = digits == null ? 3 : digits;
    const a = Math.abs(s);
    const sig = (v) => {
      const p = Math.max(0, d - 1 - Math.floor(Math.log10(Math.abs(v) || 1)));
      return v.toFixed(Math.min(p, 6));
    };
    if (a === 0) return "0 s";
    if (a < 1e-6) return sig(s * 1e9) + " ns";
    if (a < 1e-3) return sig(s * 1e6) + " µs";
    if (a < 1) return sig(s * 1e3) + " ms";
    if (a < 120) return sig(s) + " s";
    if (a < 7200) return sig(s / 60) + " min";
    if (a < 172800) return sig(s / 3600) + " h";
    if (a < 3 * 365 * 86400) return sig(s / 86400) + " days";
    return sig(s / (365 * 86400)) + " years";
  }
  function fmtHz(f) {
    if (f >= 1e6) return +(f / 1e6).toPrecision(6) + " MHz";
    if (f >= 1e3) return +(f / 1e3).toPrecision(6) + " kHz";
    return +f.toPrecision(6) + " Hz";
  }
  const signed = (v, txt) => (v > 0 ? "+" : v < 0 ? "-" : "") + txt;
  const fmtMs = (s, dp) => signed(s, Math.abs(s * 1000).toFixed(dp == null ? 1 : dp) + " ms");
  const nice = (e) => { const v = Math.pow(10, e); const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };

  function verdictBox(view) { const v = h("div", { class: "verdict" }); view.append(v); return v; }
  function setVerdict(v, tone, html) { v.className = "verdict" + (tone ? " " + tone : ""); v.innerHTML = html; }

  function text(ctx, s, x, y, color, align, px, bold) {
    ctx.font = (bold ? "600 " : "") + (px || 11) + "px " + NES.css("--font");
    ctx.fillStyle = color || NES.css("--muted");
    ctx.textAlign = align || "left";
    ctx.textBaseline = "middle";
    ctx.fillText(s, x, y);
    ctx.textAlign = "left";
  }
  function line(ctx, x1, y1, x2, y2, color, lw, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1; ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.setLineDash([]);
  }

  /* =====================================================================
     LAB: which functions need time? (sorter)
     ===================================================================== */
  function labSort(el) {
    const ITEMS = [
      ["Wake the radio every 100 ms to listen for packets", "sys", "Scheduling wake-up events is a system-level function: the protocol stack does it for every application."],
      ["Read the temperature sensor every 10 s", "app", "Scheduling periodic events for its own purposes is an application-level function."],
      ["Give up waiting for an acknowledgement after 20 ms", "sys", "Timeouts are a system-level function used by protocols and drivers."],
      ["Attach a timestamp to every accelerometer sample so several boards can be fused", "app", "Timestamping distributed events or sensor data (data fusion) is listed under application-level functions."],
      ["Generate the clock for the SPI bus", "sys", "Generating clock signals is a system-level function (the SPI clock from Week 5)."],
      ["Ring a buzzer at 07:00", "app", "Alarms are an application-level function, and this one even needs real-world time."],
      ["Run the scheduler's periodic tick", "sys", "A periodic system event: the OS scheduler (Week 3) relies on it."],
      ["Show the date and time on the display", "app", "Real-world time for the user is an application-level function."],
    ];
    const { controls, view } = NES.lab(el, {
      title: "System-level or application-level?",
      hint: "Slide 4 sorts the reasons for keeping time into two groups. Classify each job.",
    });
    const stats = NES.stats(controls, [{ key: "n", label: "Progress" }, { key: "ok", label: "Right on first try" }]);
    const restart = h("button", { class: "btn", type: "button", text: "Start over" });
    controls.append(restart);
    const card = h("div", { class: "stage ts-sort" });
    const item = h("p", { class: "ts-sort-item" });
    const bSys = h("button", { type: "button", class: "btn ts-choice", text: "System-level" });
    const bApp = h("button", { type: "button", class: "btn ts-choice", text: "Application-level" });
    const next = h("button", { type: "button", class: "btn", text: "Next" });
    card.append(item, h("div", { class: "ts-choices" }, [bSys, bApp]));
    view.append(card);
    const verdict = verdictBox(view);
    view.append(next);
    let i = 0, right = 0, answered = false;
    function show() {
      const done = i >= ITEMS.length;
      item.textContent = done ? "All done." : ITEMS[i][0];
      bSys.disabled = bApp.disabled = done;
      bSys.className = bApp.className = "btn ts-choice";
      next.style.display = "none";
      answered = false;
      stats.set("n", Math.min(i + 1, ITEMS.length) + " / " + ITEMS.length);
      stats.set("ok", String(right), done ? (right === ITEMS.length ? "good" : "warn") : "");
      if (done) setVerdict(verdict, right === ITEMS.length ? "good" : "warn", "<b>" + right + " of " + ITEMS.length + " right first time.</b> System-level: periodic system events, timeouts, wake-ups, clock signals. Application-level: periodic events, timestamps for data fusion, alarms, real-world time.");
      else setVerdict(verdict, "", "Which group does this job belong to?");
    }
    function pick(choice, btn) {
      if (i >= ITEMS.length) return;
      const [, ans, why] = ITEMS[i];
      const ok = choice === ans;
      if (!answered && ok) right++;
      answered = true;
      btn.classList.add(ok ? "right" : "wrong");
      setVerdict(verdict, ok ? "good" : "bad", "<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + why);
      stats.set("ok", String(right));
      if (ok) { bSys.disabled = bApp.disabled = true; next.style.display = ""; }
    }
    bSys.addEventListener("click", () => pick("sys", bSys));
    bApp.addEventListener("click", () => pick("app", bApp));
    next.addEventListener("click", () => { i++; show(); });
    restart.addEventListener("click", () => { i = 0; right = 0; show(); });
    show();
  }

  /* =====================================================================
     LAB: programmable timer (prescaler, initial value, mode)
     ===================================================================== */
  function labTimer(el) {
    const { controls, view } = NES.lab(el, {
      title: "Configure a programmable timer",
      hint: "The counter is decremented on every (prescaled) pulse and raises the clock interrupt at zero. Start with the slide's example: 32768 Hz, no prescaler, initial value 1000.",
    });
    const osc = NES.seg(controls, { label: "Crystal", options: [[32768, "32768 Hz"], [1e6, "1 MHz"], [24e6, "24 MHz"]], value: 32768 });
    const PRE = [1, 2, 4, 8, 16, 32, 64, 128, 256];
    const pre = NES.slider(controls, { label: "Prescaler N", min: 0, max: PRE.length - 1, step: 1, value: 0, map: (i) => PRE[i], unmap: (v) => PRE.indexOf(v), fmt: (v) => "÷ " + v });
    const init = NES.slider(controls, { label: "Initial counter value", min: 1, max: 65535, step: 1, value: 1000, fmt: (v) => String(v) });
    const mode = NES.seg(controls, { label: "Mode", options: [["once", "One-off"], ["periodic", "Periodic"]], value: "periodic" });
    const cv = h("canvas", { style: "height:200px", "aria-label": "Counter value over time" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i>counter value</span><span><i style="background:var(--accent);height:8px;width:8px;border-radius:50%"></i>clock interrupt</span>` }));
    const stats = NES.stats(view, [
      { key: "ft", label: "Timer frequency" },
      { key: "tick", label: "One count" },
      { key: "t", label: "Time to interrupt" },
      { key: "rate", label: "Interrupt rate" },
    ]);
    const verdict = verdictBox(view);

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const ft = osc.value / pre.value, C = init.value, T = C / ft;
      const span = 3.5 * T, padL = 44, padR = 10, padT = 14, padB = 24;
      const X = (t) => padL + (t / span) * (w - padL - padR);
      const Y = (c) => padT + (1 - c / C) * (hh - padT - padB);
      line(ctx, padL, Y(0), w - padR, Y(0), NES.css("--line-2"));
      line(ctx, padL, Y(C), w - padR, Y(C), NES.css("--grid"));
      text(ctx, String(C), padL - 6, Y(C), NES.css("--muted"), "right");
      text(ctx, "0", padL - 6, Y(0), NES.css("--muted"), "right");
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(X(0), Y(C));
      const periods = mode.value === "periodic" ? 4 : 1;
      for (let k = 0; k < periods; k++) {
        const t0 = k * T, t1 = Math.min(span, t0 + T);
        if (t0 > span) break;
        ctx.lineTo(X(t1), Y(C * (1 - (t1 - t0) / T)));
        if (t1 < span && mode.value === "periodic") ctx.lineTo(X(t1), Y(C));
      }
      if (mode.value === "once") ctx.lineTo(X(span), Y(0));
      ctx.stroke();
      for (let k = 1; k <= periods; k++) {
        const t = k * T;
        if (t > span) break;
        ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(t), Y(0), 5, 0, Math.PI * 2); ctx.fill();
      }
      text(ctx, "0", padL, hh - 8);
      text(ctx, fmtSec(span), w - padR, hh - 8, NES.css("--muted"), "right");
      if (mode.value === "once") text(ctx, "stopped", X(T) + 8, Y(0) - 10, NES.css("--muted"));
    });

    function update() {
      const ft = osc.value / pre.value, C = init.value, T = C / ft;
      stats.set("ft", fmtHz(ft));
      stats.set("tick", fmtSec(1 / ft));
      stats.set("t", fmtSec(T));
      stats.set("rate", mode.value === "periodic" ? +(1 / T).toPrecision(4) + " per s" : "once", mode.value === "periodic" ? "" : "warn");
      const longest = 65535 / ft;
      setVerdict(verdict, "", "<b>" + C + " counts ÷ " + fmtHz(ft) + " = " + fmtSec(T) + ".</b> " +
        (mode.value === "periodic"
          ? "In periodic mode the holding register reloads the counter after every interrupt, so the period repeats with no software involved."
          : "In one-off mode the timer fires once and stops: a timeout or an alarm.") +
        " With a 16-bit counter (an assumption for this lab) the longest interval at this setting is " + fmtSec(longest) + "; a larger prescaler stretches it, at the cost of a coarser count.");
      draw();
    }
    [osc, pre, init, mode].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: time resolution (measuring an interval in ticks)
     ===================================================================== */
  function labResolution(el) {
    const { controls, view } = NES.lab(el, {
      title: "Measure an interval in ticks",
      hint: "A clock only sees whole ticks. Start and stop timestamps are taken on the tick counter, so the measured interval is a whole number of ticks. Move the start within a tick to see the ±1 tick uncertainty.",
    });
    const f = NES.seg(controls, { label: "Clock", options: [[32768, "32 kHz"], [1e6, "1 MHz"], [24e6, "24 MHz"]], value: 32768 });
    const dur = NES.slider(controls, { label: "True interval", min: -6, max: -2, step: 0.02, value: -4, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtSec(v) });
    const phase = NES.slider(controls, { label: "Start position within a tick", min: 0, max: 0.99, step: 0.01, value: 0.3, fmt: (v) => Math.round(v * 100) + "%" });
    const cv = h("canvas", { style: "height:130px", "aria-label": "Ticks and interval" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [
      { key: "tick", label: "Tick length" },
      { key: "n", label: "Ticks counted" },
      { key: "m", label: "Measured interval" },
      { key: "e", label: "Error" },
    ]);
    const verdict = verdictBox(view);
    function calc() {
      const T = 1 / f.value, n = Math.floor(phase.value + dur.value * f.value);
      return { T, n, meas: n * T, err: n * T - dur.value };
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const { T, n } = calc(), D = dur.value, ph = phase.value;
      const padL = 10, padR = 10;
      const span = Math.max(D + 2.2 * T, T * 3);
      const t0 = ph * T; // start time, measured from the tick edge before it
      const X = (t) => padL + ((t + 0.6 * T) / span) * (w - padL - padR);
      const nT = Math.floor(span / T) + 2;
      const yTick = 30, yBar = 70;
      if (nT <= 160) {
        for (let k = 0; k < nT; k++) {
          const x = X(k * T);
          if (x > w - padR) break;
          line(ctx, x, yTick - 10, x, yTick + 10, NES.css("--ink-2"), 1.3);
        }
      } else {
        ctx.fillStyle = NES.css("--ink-2"); ctx.globalAlpha = 0.35; ctx.fillRect(X(0), yTick - 10, w - padR - X(0), 20); ctx.globalAlpha = 1;
      }
      text(ctx, "clock ticks", padL, yTick - 18, NES.css("--muted"));
      ctx.fillStyle = NES.css("--accent"); ctx.globalAlpha = 0.25;
      ctx.fillRect(X(t0), yBar - 10, Math.max(2, X(t0 + D) - X(t0)), 20); ctx.globalAlpha = 1;
      line(ctx, X(t0), yBar - 14, X(t0), yBar + 14, NES.css("--accent"), 2);
      line(ctx, X(t0 + D), yBar - 14, X(t0 + D), yBar + 14, NES.css("--accent"), 2);
      text(ctx, "true interval", X(t0), yBar + 24, NES.css("--accent"));
      if (nT <= 160) {
        // highlight the tick edges that fall inside the interval (each one increments the counter)
        for (let k = 1; k <= n; k++) { const x = X(k * T); ctx.fillStyle = NES.css("--ok"); ctx.beginPath(); ctx.arc(x, yTick, 4, 0, Math.PI * 2); ctx.fill(); }
      }
    });
    function update() {
      const { T, n, meas, err } = calc();
      stats.set("tick", fmtSec(T, 5));
      stats.set("n", String(n), n === 0 ? "bad" : "");
      stats.set("m", fmtSec(meas));
      stats.set("e", n === 0 ? "everything" : signed(err, fmtSec(Math.abs(err))), Math.abs(err) > dur.value * 0.1 ? "bad" : Math.abs(err) > dur.value * 0.01 ? "warn" : "good");
      if (n === 0) setVerdict(verdict, "bad", "<b>Invisible.</b> The interval fits between two ticks, so both timestamps read the same count. You need a faster clock to see it.");
      else setVerdict(verdict, Math.abs(err) > dur.value * 0.1 ? "warn" : "good", "<b>" + n + " tick" + (n === 1 ? "" : "s") + " × " + fmtSec(T, 4) + " = " + fmtSec(meas) + ".</b> The error is always less than one tick; it is only small compared to the interval when the interval spans many ticks.");
      draw();
    }
    [f, dur, phase].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: uptime counter
     ===================================================================== */
  function labUptime(el) {
    const { controls, view } = NES.lab(el, {
      title: "Run slide 10's uptime counter",
      hint: "A periodic timer on a 32768 Hz crystal is loaded with 32768, and every interrupt increments UPTIME. Give the crystal an error, or load the wrong start value, and see what UPTIME reads.",
    });
    const ppm = NES.slider(controls, { label: "Crystal error", min: -50, max: 50, step: 1, value: 0, fmt: (v) => signed(v, Math.abs(v) + " ppm") });
    const start = NES.slider(controls, { label: "Timer start value", min: 32760, max: 32776, step: 1, value: 32768, fmt: (v) => String(v) });
    const dur = NES.seg(controls, { label: "Run for exactly", options: [[3600, "1 h"], [86400, "1 day"], [604800, "1 week"], [31536000, "1 year"]], value: 86400 });
    const stats = NES.stats(view, [
      { key: "up", label: "UPTIME" },
      { key: "true", label: "True seconds" },
      { key: "err", label: "Error (true - UPTIME)" },
      { key: "eff", label: "Effective clock error" },
    ]);
    const verdict = verdictBox(view);
    function update() {
      const d = ppm.value * 1e-6, N = start.value, t = dur.value;
      const fAct = 32768 * (1 + d);
      const ticks = t * fAct / N;
      const up = Math.floor(ticks + 1e-9);
      const eff = (fAct / N - 1) * 1e6;
      stats.set("up", String(up), up === t ? "good" : "warn");
      stats.set("true", String(t));
      const err = t - up;
      stats.set("err", (err > 0 ? "+" : "") + err + " s", err === 0 ? "good" : Math.abs(err) > 5 ? "bad" : "warn");
      stats.set("eff", signed(eff, Math.abs(eff).toFixed(1) + " ppm"));
      if (up === t) setVerdict(verdict, "good", "<b>UPTIME = " + up + ".</b> With a perfect crystal and the right start value, one interrupt per 32768 pulses is exactly one per second.");
      else setVerdict(verdict, Math.abs(err) > 5 ? "bad" : "warn", "<b>UPTIME = " + up + ", " + (err > 0 ? "behind" : "ahead of") + " true time by " + Math.abs(err) + " s.</b> " +
        (N !== 32768 ? "A start value of " + N + " makes every 'second' " + N + " pulses long, an error of " + Math.abs((32768 / N - 1) * 1e6).toFixed(1) + " ppm on its own. " : "") +
        (ppm.value !== 0 ? "A " + signed(ppm.value, Math.abs(ppm.value) + " ppm") + " crystal makes the pulses " + (ppm.value > 0 ? "come faster" : "come slower") + " than nominal. " : "") +
        "The error grows with the running time.");
    }
    [ppm, start, dur].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: ppm calculator
     ===================================================================== */
  function labPpm(el) {
    const { controls, view } = NES.lab(el, {
      title: "From ppm to frequency, period and error",
      hint: "Pick a crystal and its tolerance. The defaults reproduce slide 11: 32768 Hz at ±20 ppm.",
    });
    const f = NES.seg(controls, { label: "Nominal frequency", options: [[32768, "32768 Hz"], [24e6, "24 MHz"]], value: 32768 });
    const p = NES.slider(controls, { label: "Tolerance", min: 1, max: 100, step: 1, value: 20, fmt: (v) => "± " + v + " ppm" });
    const stats = NES.stats(view, [
      { key: "f", label: "Actual frequency between" },
      { key: "T", label: "Period between" },
    ]);
    const table = h("div", { class: "table-wrap" });
    view.append(table);
    function update() {
      const fn = f.value, d = p.value * 1e-6;
      const fmin = fn * (1 - d), fmax = fn * (1 + d);
      const dpF = fn >= 1e6 ? 2 : 5;
      stats.set("f", (fn >= 1e6 ? (fmin / 1e6).toFixed(6) + " and " + (fmax / 1e6).toFixed(6) + " MHz" : fmin.toFixed(dpF) + " and " + fmax.toFixed(dpF) + " Hz"));
      const Tmin = 1 / fmax, Tmax = 1 / fmin;
      stats.set("T", fn >= 1e6 ? (Tmin * 1e9).toFixed(5) + " and " + (Tmax * 1e9).toFixed(5) + " ns" : (Tmin * 1e9).toFixed(2) + " and " + (Tmax * 1e9).toFixed(2) + " ns");
      const rows = [["1 second", 1], ["1 minute", 60], ["1 hour", 3600], ["1 day", 86400], ["1 week", 604800], ["1 year", 31536000]];
      table.innerHTML = `<table class="tt"><thead><tr><th>After</th><th class="out">Worst-case error</th></tr></thead><tbody>` +
        rows.map(([n, t]) => `<tr><td>${n}</td><td class="out">± ${fmtSec(d * t)}</td></tr>`).join("") + "</tbody></table>";
    }
    [f, p].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: error over time (linear vs log axis)
     ===================================================================== */
  function labError(el) {
    const { controls, view } = NES.lab(el, {
      title: "Watch the error add up",
      hint: "Error = true time - UPTIME = -drift × time. The coloured curves are slide 12's crystals; the thick dashed one is yours. Switch the time axis between logarithmic (as on the slide) and linear.",
    });
    const mine = NES.slider(controls, { label: "Your crystal", min: -40, max: 40, step: 1, value: -15, fmt: (v) => signed(v, Math.abs(v) + " ppm") });
    const horizon = NES.seg(controls, { label: "Show up to", options: [[3600, "1 h"], [86400, "1 day"], [604800, "1 week"]], value: 604800 });
    const axis = NES.seg(controls, { label: "Time axis", options: [["log", "Log"], ["lin", "Linear"]], value: "log" });
    const cv = h("canvas", { style: "height:240px", "aria-label": "Error over time" });
    view.append(h("div", { class: "stage" }, [cv]));
    const SET = [[-20, "--hi"], [-10, "--warn"], [-5, "--ok"], [0, "--muted"], [5, "--tech"], [10, "--lo"], [20, "--accent"]];
    view.append(h("div", { class: "legend", html: SET.map(([d, c]) => `<span><i style="background:var(${c})"></i>${d > 0 ? "+" : ""}${d} ppm</span>`).join("") + `<span><i class="dash" style="color:var(--ink)"></i>yours</span>` }));
    const stats = NES.stats(view, [{ key: "e", label: "Your error at the end" }, { key: "s1", label: "Time until 1 s off" }, { key: "ms", label: "Time until 1 ms off" }]);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const tEnd = horizon.value, t0 = 60, log = axis.value === "log";
      const emax = Math.max(40e-6 * tEnd, 1e-9) * 1.05;
      const padL = 52, padR = 10, padT = 10, padB = 26;
      const X = (t) => padL + (log ? (Math.log10(t) - Math.log10(t0)) / (Math.log10(tEnd) - Math.log10(t0)) : t / tEnd) * (w - padL - padR);
      const Y = (e) => padT + (1 - (e + emax) / (2 * emax)) * (hh - padT - padB);
      let lastX = -1e9;
      if (!log) { text(ctx, "0", padL, hh - 10, NES.css("--muted"), "center"); lastX = padL; }
      [[60, "1m"], [3600, "1h"], [86400, "1d"], [604800, "1w"]].forEach(([t, lab]) => {
        if (t > tEnd || (!log && t === 60)) return;
        line(ctx, X(t), padT, X(t), hh - padB, NES.css("--grid"));
        if (X(t) - lastX < 24) return; // keep tick labels from colliding on narrow screens
        text(ctx, lab, X(t), hh - 10, NES.css("--muted"), "center");
        lastX = X(t);
      });
      line(ctx, padL, Y(0), w - padR, Y(0), NES.css("--line-2"));
      [emax / 1.05, -emax / 1.05].forEach((e) => text(ctx, signed(e, fmtSec(Math.abs(e), 2)), padL - 4, Y(e), NES.css("--muted"), "right"));
      const curve = (d, color, lw, dash) => {
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const t = log ? Math.pow(10, Math.log10(t0) + (i / 200) * (Math.log10(tEnd) - Math.log10(t0))) : (i / 200) * tEnd;
          const e = -d * 1e-6 * t;
          i ? ctx.lineTo(X(Math.max(t, log ? t0 : 0)), Y(e)) : ctx.moveTo(X(Math.max(t, log ? t0 : 0)), Y(e));
        }
        ctx.stroke(); ctx.setLineDash([]);
      };
      SET.forEach(([d, c]) => curve(d, NES.css(c), 1.4));
      curve(mine.value, NES.css("--ink"), 2.6, [7, 5]);
    });
    function update() {
      const d = mine.value * 1e-6, tEnd = horizon.value;
      const e = -d * tEnd;
      stats.set("e", d === 0 ? "0 s" : signed(e, fmtSec(Math.abs(e))), Math.abs(e) > 1 ? "bad" : Math.abs(e) > 1e-3 ? "warn" : "good");
      stats.set("s1", d === 0 ? "never" : fmtSec(1 / Math.abs(d)));
      stats.set("ms", d === 0 ? "never" : fmtSec(1e-3 / Math.abs(d)));
      draw();
    }
    [mine, horizon, axis].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: production spread + ageing + temperature
     ===================================================================== */
  function labTemp(el) {
    const { controls, view } = NES.lab(el, {
      title: "Add up the sources of drift",
      hint: "Total drift = production error + ageing + temperature, with the slide's FC-135 worst cases: ageing up to ±3 ppm per year and -0.04 ppm/°C² away from 25 °C. The ageing is modelled as linear for simplicity.",
    });
    const spread = NES.slider(controls, { label: "Production error", min: -20, max: 20, step: 1, value: 5, fmt: (v) => signed(v, Math.abs(v) + " ppm") });
    const age = NES.slider(controls, { label: "Ageing rate", min: -3, max: 3, step: 0.5, value: -1, fmt: (v) => signed(v, Math.abs(v) + " ppm/year") });
    const years = NES.slider(controls, { label: "Age", min: 0, max: 10, step: 1, value: 2, fmt: (v) => v + (v === 1 ? " year" : " years") });
    const temp = NES.slider(controls, { label: "Temperature", min: -20, max: 70, step: 1, value: 25, fmt: (v) => v + " °C" });
    const cv = h("canvas", { style: "height:220px", "aria-label": "Drift versus temperature" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i>total drift vs temperature</span><span><i class="dash" style="color:var(--muted)"></i>±20 ppm production tolerance</span><span><i style="background:var(--accent);height:8px;width:8px;border-radius:50%"></i>now</span>` }));
    const stats = NES.stats(view, [
      { key: "tt", label: "Temperature term" },
      { key: "ag", label: "Ageing term" },
      { key: "tot", label: "Total drift" },
      { key: "day", label: "Error per day" },
    ]);
    const tempTerm = (T) => -0.04 * (T - 25) * (T - 25);
    const total = (T) => spread.value + age.value * years.value + tempTerm(T);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 10, padT = 10, padB = 24, vmin = -110, vmax = 40;
      const X = (T) => padL + ((T + 20) / 90) * (w - padL - padR);
      const Y = (v) => padT + (1 - (NES.clamp(v, vmin, vmax) - vmin) / (vmax - vmin)) * (hh - padT - padB);
      [-100, -50, 0, 20, -20].forEach((v) => { line(ctx, padL, Y(v), w - padR, Y(v), v === 0 ? NES.css("--line-2") : NES.css("--grid"), 1, Math.abs(v) === 20 ? [4, 4] : null); text(ctx, String(v), padL - 4, Y(v), NES.css("--muted"), "right"); });
      [-20, 0, 25, 50, 70].forEach((T) => text(ctx, T + "°", X(T), hh - 9, NES.css("--muted"), "center"));
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let T = -20; T <= 70; T += 1) { T === -20 ? ctx.moveTo(X(T), Y(total(T))) : ctx.lineTo(X(T), Y(total(T))); }
      ctx.stroke();
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(temp.value), Y(total(temp.value)), 5.5, 0, Math.PI * 2); ctx.fill();
      text(ctx, "ppm", 4, padT + 4, NES.css("--muted"));
    });
    function update() {
      const tt = tempTerm(temp.value), ag = age.value * years.value, tot = total(temp.value);
      stats.set("tt", signed(tt, Math.abs(tt).toFixed(1) + " ppm"));
      stats.set("ag", signed(ag, Math.abs(ag).toFixed(1) + " ppm"));
      stats.set("tot", signed(tot, Math.abs(tot).toFixed(1) + " ppm"), Math.abs(tot) > 20 ? "bad" : Math.abs(tot) > 5 ? "warn" : "good");
      const e = tot * 1e-6 * 86400;
      stats.set("day", tot === 0 ? "0 s" : (tot > 0 ? "gains " : "loses ") + fmtSec(Math.abs(e)));
      draw();
    }
    [spread, age, years, temp].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: synchronised blinking (relative drift)
     ===================================================================== */
  function labBlink(el) {
    const { controls, view } = NES.lab(el, {
      title: "Two LEDs that started in sync",
      hint: "Both MCUs blink with a 1 s period from the same button press (slide 14). Give each crystal a drift and look at the LEDs a minute, an hour or a day later. The top row is a perfect clock.",
    });
    const d1 = NES.slider(controls, { label: "MCU1 drift", min: -20, max: 20, step: 1, value: 20, fmt: (v) => signed(v, Math.abs(v) + " ppm") });
    const d2 = NES.slider(controls, { label: "MCU2 drift", min: -20, max: 20, step: 1, value: -20, fmt: (v) => signed(v, Math.abs(v) + " ppm") });
    const when = NES.seg(controls, { label: "Look after", options: [[0, "0 s"], [60, "1 min"], [3600, "1 h"], [86400, "1 day"]], value: 3600 });
    const cv = h("canvas", { style: "height:150px", "aria-label": "LED timelines" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [
      { key: "rel", label: "Relative drift" },
      { key: "off", label: "MCU1 ahead of MCU2 by" },
      { key: "vis", label: "Visible blink shift" },
      { key: "tt", label: "MCU1 / MCU2 vs true time" },
    ]);
    const verdict = verdictBox(view);
    const vis = (x) => { const r = x - Math.round(x); return r; }; // phase shift in [-0.5, 0.5] s
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const t0 = when.value, span = 3, padL = 58, padR = 10;
      const rows = [["true time", 0, "--muted"], ["MCU1", d1.value * 1e-6, "--hi"], ["MCU2", d2.value * 1e-6, "--lo"]];
      const X = (t) => padL + ((t - t0) / span) * (w - padL - padR);
      rows.forEach(([name, d, c], r) => {
        const y = 18 + r * 40;
        text(ctx, name, 4, y + 9, NES.css("--ink-2"), "left", 11, true);
        ctx.fillStyle = NES.css("--lab-bg"); ctx.fillRect(padL, y, w - padL - padR, 18);
        ctx.fillStyle = NES.css(c);
        // MCU clock reads (1 + d) * t; LED on while the local phase is in the first half of a second
        const steps = Math.max(300, Math.round(w - padL - padR));
        let on = null, xs = 0;
        for (let i = 0; i <= steps; i++) {
          const t = t0 + (i / steps) * span;
          const local = t * (1 + d);
          const ph = local - Math.floor(local);
          const isOn = ph < 0.5;
          if (isOn && on !== true) { xs = X(t); on = true; }
          if ((!isOn || i === steps) && on === true) { ctx.fillRect(xs, y, Math.max(1, X(t) - xs), 18); on = false; }
          if (!isOn) on = false;
        }
      });
      for (let k = 0; k <= span; k++) { const x = X(t0 + k); line(ctx, x, 12, x, 140, NES.css("--grid"), 1, [3, 3]); }
      text(ctx, { 0: "at the start", 60: "after 1 min", 3600: "after 1 h", 86400: "after 1 day" }[t0] || "after " + fmtSec(t0), padL, hh - 6, NES.css("--muted"));
      text(ctx, "+3 s", w - padR, hh - 6, NES.css("--muted"), "right");
    });
    function update() {
      const a = d1.value, b = d2.value, t = when.value;
      const rel = a - b, off = rel * 1e-6 * t, shift = vis(off);
      stats.set("rel", signed(rel, Math.abs(rel) + " ppm"));
      stats.set("off", t === 0 ? "0 s" : signed(off, fmtSec(Math.abs(off))));
      stats.set("vis", signed(shift, fmtSec(Math.abs(shift))), Math.abs(shift) < 0.05 ? "good" : "bad");
      stats.set("tt", (t === 0 ? "0 / 0" : signed(a, fmtSec(Math.abs(a * 1e-6 * t), 2)) + " / " + signed(b, fmtSec(Math.abs(b * 1e-6 * t), 2))));
      const cycles = Math.round(off);
      let msg;
      if (Math.abs(shift) < 0.05 && cycles === 0) msg = ["good", "<b>Still in sync.</b> The offset is below the roughly 50 ms you would notice by eye (an assumption for this lab)."];
      else if (Math.abs(shift) < 0.05) msg = ["warn", "<b>Looks in sync, but is not.</b> MCU1 is " + Math.abs(cycles) + " whole blink" + (Math.abs(cycles) === 1 ? "" : "s") + " " + (off > 0 ? "ahead" : "behind") + "; the shift only happens to wrap around to almost zero."];
      else msg = ["bad", "<b>Out of sync.</b> The LEDs are " + fmtSec(Math.abs(off)) + " apart" + (Math.abs(off) >= 0.5 ? " (more than half a period, so the visible shift is " + fmtSec(Math.abs(shift)) + ")" : "") + "."];
      if (rel === 0 && a !== 0) msg = ["good", "<b>In sync with each other, not with true time.</b> Both drift the same way (relative drift 0 ppm), so they agree, while both are " + fmtSec(Math.abs(a * 1e-6 * t)) + " " + (a > 0 ? "ahead of" : "behind") + " true time."];
      setVerdict(verdict, msg[0], msg[1]);
      draw();
    }
    [d1, d2, when].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Timeline SVG for message exchanges (A on top, B below)
     ===================================================================== */
  function arrowHead(x1, y1, x2, y2, cls) {
    const a = Math.atan2(y2 - y1, x2 - x1), L = 9;
    const p1 = [x2 - L * Math.cos(a - 0.4), y2 - L * Math.sin(a - 0.4)], p2 = [x2 - L * Math.cos(a + 0.4), y2 - L * Math.sin(a + 0.4)];
    return `<path class="${cls || "ts-ah"}" d="M${x2} ${y2} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z"/>`;
  }
  function msg(x1, y1, x2, y2, cls) {
    return `<line class="ts-msg ${cls || ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>` + arrowHead(x1, y1, x2, y2, "ts-ah " + (cls || ""));
  }
  const svgText = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" class="${cls || ""}" text-anchor="${anchor || "middle"}">${s}</text>`;

  /* =====================================================================
     LAB: unidirectional synchronisation
     ===================================================================== */
  function labOneway(el) {
    const { controls, view } = NES.lab(el, {
      title: "One message, one guess",
      hint: "Alice sends T1, Bob timestamps T2 = T1 + D + o. Bob can only subtract his <em>estimate</em> of the delay, so any error in that estimate becomes an error in the offset.",
    });
    const o = NES.slider(controls, { label: "True offset o (Bob - Alice)", min: -50, max: 50, step: 1, value: 20, fmt: (v) => signed(v, Math.abs(v) + " ms") });
    const D = NES.slider(controls, { label: "True delay D", min: 0, max: 50, step: 1, value: 12, fmt: (v) => v + " ms" });
    const De = NES.slider(controls, { label: "Bob's estimate of D", min: 0, max: 50, step: 1, value: 5, fmt: (v) => v + " ms" });
    const stage = h("div", { class: "stage" });
    view.append(stage);
    const stats = NES.stats(view, [{ key: "t1", label: "T1 (Alice's clock)" }, { key: "t2", label: "T2 (Bob's clock)" }, { key: "oh", label: "Bob's offset estimate" }, { key: "e", label: "Error" }]);
    const verdict = verdictBox(view);
    function update() {
      const T1 = 1000, T2 = T1 + D.value + o.value, oh = T2 - T1 - De.value, err = oh - o.value;
      const xs = 90, xr = xs + 60 + D.value * 4;
      stage.innerHTML = `<svg class="sch ts-svg" viewBox="0 0 440 150" role="img" aria-label="Alice sends a timestamp to Bob">` +
        `<line class="ts-axis" x1="40" y1="40" x2="425" y2="40"/>` + arrowHead(40, 40, 428, 40, "ts-ah") +
        `<line class="ts-axis" x1="40" y1="112" x2="425" y2="112"/>` + arrowHead(40, 112, 428, 112, "ts-ah") +
        svgText(20, 45, "A", "lbl") + svgText(20, 117, "B", "lbl") +
        msg(xs, 40, xr, 112) + `<circle class="dot" cx="${xs}" cy="40" r="4.5"/><circle class="dot" cx="${xr}" cy="112" r="4.5"/>` +
        svgText(xs, 26, "T1 = " + T1 + " ms", "small") + svgText(xr, 134, "T2 = " + T2 + " ms", "small") +
        svgText((xs + xr) / 2 + 30, 72, "Msg: T1", "small", "start") +
        `</svg>`;
      stats.set("t1", T1 + " ms");
      stats.set("t2", T2 + " ms");
      stats.set("oh", signed(oh, Math.abs(oh) + " ms"));
      stats.set("e", signed(err, Math.abs(err) + " ms"), err === 0 ? "good" : Math.abs(err) > 5 ? "bad" : "warn");
      setVerdict(verdict, err === 0 ? "good" : "warn", "<b>o ≈ T2 - T1 - D<sub>est</sub> = " + (T2 - T1) + " - " + De.value + " = " + oh + " ms.</b> " + (err === 0 ? "A perfect delay estimate gives the exact offset." : "The offset is off by exactly the delay estimation error, D - D<sub>est</sub> = " + (D.value - De.value) + " ms. The more accurate the estimate, the more accurate the synchronisation."));
    }
    [o, D, De].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: components of message delay
     ===================================================================== */
  function labDelay(el) {
    const { controls, view } = NES.lab(el, {
      title: "Where does the delay come from?",
      hint: "Transmission (L/R) and propagation (d/s) are easy to calculate. The operating-system and access delays vary from message to message, and that variation is what limits one-way synchronisation. The OS and access ranges are illustrative.",
    });
    const L = NES.slider(controls, { label: "Packet size L", min: 10, max: 1500, step: 10, value: 100, fmt: (v) => v + " bytes" });
    const R = NES.seg(controls, { label: "Bit rate R", options: [[250e3, "250 kbit/s"], [1e6, "1 Mbit/s"], [100e6, "100 Mbit/s"]], value: 250e3 });
    const d = NES.slider(controls, { label: "Distance d", min: 0, max: 7.6, step: 0.05, value: 1.5, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => (v >= 1000 ? +(v / 1000).toPrecision(3) + " km" : +v.toPrecision(3) + " m") });
    const g = NES.group(controls, "Variable delays (max)");
    const os = NES.slider(g, { label: "OS at sender", min: 0, max: 20, step: 0.5, value: 4, fmt: (v) => v + " ms" });
    const acc = NES.slider(g, { label: "Medium access", min: 0, max: 20, step: 0.5, value: 6, fmt: (v) => v + " ms" });
    const rx = NES.slider(g, { label: "OS at receiver", min: 0, max: 20, step: 0.5, value: 2, fmt: (v) => v + " ms" });
    const hops = NES.slider(controls, { label: "Hops", min: 1, max: 5, step: 1, value: 1, fmt: (v) => String(v) });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "min", label: "Total delay (best case)" }, { key: "max", label: "Total delay (worst case)" }, { key: "unc", label: "Uncertainty" }]);
    const verdict = verdictBox(view);
    function update() {
      const tx = (L.value * 8) / R.value, pr = d.value / 3e8, n = hops.value;
      const parts = [
        ["OS at sender", 0, os.value / 1000, "var(--warn)", false],
        ["Access", 0, acc.value / 1000, "var(--warn)", false],
        ["Transmission", tx, tx, "var(--tech)", true],
        ["Propagation", pr, pr, "var(--tech)", true],
        ["OS at receiver", 0, rx.value / 1000, "var(--warn)", false],
      ];
      const maxAll = parts.reduce((s, p) => Math.max(s, p[2]), 1e-9);
      meter.innerHTML = parts.map(([name, lo, hi, c, fixed]) =>
        `<div class="meter-row"><span class="m-label">${name}</span><div class="meter-track"><div class="meter-fill" style="width:${Math.max(0.6, (hi / maxAll) * 100)}%;background:${c};opacity:${fixed ? 1 : 0.75}"></div></div><span class="m-val">${fixed ? fmtSec(hi, 2) : "0 to " + fmtSec(hi, 2)}</span></div>`).join("") +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">blue: predictable, orange: varies per message. Per hop.</span><span></span></div>`;
      const fixed = (tx + pr) * n, variable = (os.value + acc.value + rx.value) / 1000 * n;
      stats.set("min", fmtSec(fixed));
      stats.set("max", fmtSec(fixed + variable));
      stats.set("unc", fmtSec(variable), variable > fixed ? "bad" : "warn");
      setVerdict(verdict, variable > fixed ? "warn" : "", "<b>" + (variable > fixed ? "The unpredictable part dominates." : "The predictable part dominates.") + "</b> A receiver can subtract the calculable " + fmtSec(fixed) + ", but not the " + fmtSec(variable) + " of jitter" + (n > 1 ? " (" + n + " hops add up)" : "") + ". " + (pr > 1e-3 ? "At this distance propagation is considerable, as for satellites." : "Propagation is negligible at this distance."));
    }
    [L, R, d, os, acc, rx, hops].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: GPS 1D example
     ===================================================================== */
  function labGps(el) {
    const { controls, view } = NES.lab(el, {
      title: "Find the receiver's position and clock offset",
      hint: "Slide 21 and 22's line world: S1 at 0 m, S2 at 300 m, signals at 1 m/s, both sent at satellite time 0. The receiver's clock is off, so each satellite gives a different position. Adjust the correction until they agree.",
    });
    const xr = NES.slider(controls, { label: "Receiver's true position", min: 10, max: 290, step: 1, value: 200, fmt: (v) => v + " m" });
    const off = NES.slider(controls, { label: "Receiver clock offset", min: -10, max: 10, step: 0.5, value: 1, fmt: (v) => signed(v, Math.abs(v) + " s") });
    const corr = NES.slider(controls, { label: "Correction applied by R", min: -10, max: 10, step: 0.5, value: 0, fmt: (v) => signed(v, Math.abs(v) + " s") });
    const solve = h("button", { class: "btn", type: "button", text: "Solve for the offset" });
    controls.append(solve);
    const stage = h("div", { class: "stage" });
    view.append(stage);
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi);height:8px;width:8px;border-radius:50%"></i>estimate from S1</span><span><i style="background:var(--lo);height:8px;width:8px;border-radius:50%"></i>estimate from S2</span>` }));
    const stats = NES.stats(view, [{ key: "p1", label: "Position from S1" }, { key: "p2", label: "Position from S2" }, { key: "gap", label: "Disagreement" }, { key: "solved", label: "Offset from both" }]);
    const verdict = verdictBox(view);
    function calc() {
      const x = xr.value, o = off.value, c = corr.value;
      const T2p = x + o, T4p = 300 - x + o; // local arrival timestamps (T1 = T3 = 0)
      const p1 = T2p - c, p2 = 300 - (T4p - c);
      const oSolved = (T2p + T4p - 300) / 2;
      return { x, p1, p2, oSolved, T2p, T4p };
    }
    function update() {
      const { x, p1, p2, oSolved, T2p, T4p } = calc();
      const X = (m) => 30 + (NES.clamp(m, -20, 320) / 300) * 380;
      stage.innerHTML = `<svg class="sch ts-svg" viewBox="0 0 440 120" role="img" aria-label="Satellites and receiver on a line">` +
        `<line class="ts-axis" x1="${X(0)}" y1="60" x2="${X(300)}" y2="60"/>` +
        `<rect class="box" x="${X(0) - 9}" y="51" width="18" height="18" rx="3"/>` + svgText(X(0), 40, "S1", "lbl") + svgText(X(0), 92, "0 m", "small") +
        `<rect class="box" x="${X(300) - 9}" y="51" width="18" height="18" rx="3"/>` + svgText(X(300), 40, "S2", "lbl") + svgText(X(300), 92, "300 m", "small") +
        `<rect class="ts-rx" x="${X(x) - 6}" y="48" width="12" height="24" rx="3"/>` + svgText(X(x), 22, "R (" + x + " m)", "lbl") +
        `<circle class="ts-est1" cx="${X(p1)}" cy="106" r="6"/>` + `<circle class="ts-est2" cx="${X(p2)}" cy="106" r="6"/>` +
        `</svg>`;
      stats.set("p1", p1.toFixed(1) + " m");
      stats.set("p2", p2.toFixed(1) + " m");
      const gap = p1 - p2;
      stats.set("gap", Math.abs(gap).toFixed(1) + " m", Math.abs(gap) < 1e-9 ? "good" : "bad");
      stats.set("solved", signed(oSolved, Math.abs(oSolved).toFixed(1) + " s"));
      if (Math.abs(gap) < 1e-9) setVerdict(verdict, "good", "<b>Both satellites agree on " + p1.toFixed(1) + " m.</b> The correction equals the clock offset, so the receiver now knows both its position and the satellites' time.");
      else setVerdict(verdict, "warn", "<b>S1 says " + p1.toFixed(1) + " m, S2 says " + p2.toFixed(1) + " m.</b> Local timestamps: T2' = " + T2p.toFixed(1) + " s, T4' = " + T4p.toFixed(1) + " s. With the satellites on both sides, a clock error moves the two estimates in opposite directions, so the receiver can solve for it: o = (T2' + T4' - 300 m / s) / 2 = " + oSolved.toFixed(1) + " s.");
    }
    [xr, off, corr].forEach((c) => (c.onchange = update));
    solve.addEventListener("click", () => { corr.set(calc().oSolved); update(); });
    update();
  }

  /* =====================================================================
     LAB: bidirectional (two-way) synchronisation
     ===================================================================== */
  function labTwoway(el) {
    const { controls, view } = NES.lab(el, {
      title: "Four timestamps, two unknowns",
      hint: "As on slide 25: B sends at T1 (B's clock), A receives at T2 and replies at T3 (A's clock), B receives at T4 (B's clock). B solves for the offset o of A's clock and the delay D. Make the two directions unequal to see the error.",
    });
    const o = NES.slider(controls, { label: "True offset o (A - B)", min: -100, max: 100, step: 1, value: 30, fmt: (v) => signed(v, Math.abs(v) + " ms") });
    const df = NES.slider(controls, { label: "Delay B to A", min: 1, max: 80, step: 1, value: 20, fmt: (v) => v + " ms" });
    const db = NES.slider(controls, { label: "Delay A to B", min: 1, max: 80, step: 1, value: 20, fmt: (v) => v + " ms" });
    const ta = NES.slider(controls, { label: "A's turnaround (T3 - T2)", min: 0, max: 60, step: 1, value: 15, fmt: (v) => v + " ms" });
    const stage = h("div", { class: "stage" });
    view.append(stage);
    const stats = NES.stats(view, [
      { key: "ts", label: "T1, T2, T3, T4" },
      { key: "oh", label: "Offset estimate" },
      { key: "dh", label: "Delay estimate" },
      { key: "e", label: "Offset error" },
    ]);
    const verdict = verdictBox(view);
    function update() {
      const T1 = 500;
      const T2 = T1 + df.value + o.value, T3 = T2 + ta.value, T4 = T3 + db.value - o.value;
      const oh = ((T2 - T1) - (T4 - T3)) / 2, dh = ((T2 - T1) + (T4 - T3)) / 2, err = oh - o.value;
      // positions on the true-time axis
      const tB1 = 0, tA2 = df.value, tA3 = tA2 + ta.value, tB4 = tA3 + db.value;
      const span = Math.max(tB4, 60);
      const X = (t) => 60 + (t / span) * 330;
      const yA = 38, yB = 118;
      stage.innerHTML = `<svg class="sch ts-svg" viewBox="0 0 440 160" role="img" aria-label="Two-way time exchange">` +
        `<line class="ts-axis" x1="40" y1="${yA}" x2="425" y2="${yA}"/>` + arrowHead(40, yA, 428, yA, "ts-ah") +
        `<line class="ts-axis" x1="40" y1="${yB}" x2="425" y2="${yB}"/>` + arrowHead(40, yB, 428, yB, "ts-ah") +
        svgText(20, yA + 5, "A", "lbl") + svgText(20, yB + 5, "B", "lbl") +
        msg(X(tB1), yB, X(tA2), yA, "fwd") + msg(X(tA3), yA, X(tB4), yB, "back") +
        [[tB1, yB], [tA2, yA], [tA3, yA], [tB4, yB]].map(([t, y]) => `<circle class="dot" cx="${X(t).toFixed(1)}" cy="${y}" r="4.5"/>`).join("") +
        svgText(X(tB1), yB + 22, "T1", "small") + svgText(X(tA2) - (ta.value < 8 ? 8 : 0), yA - 12, "T2", "small") + svgText(X(tA3) + (ta.value < 8 ? 8 : 0), yA - 12, "T3", "small") + svgText(X(tB4), yB + 22, "T4", "small") +
        svgText((X(tB1) + X(tA2)) / 2 - 12, (yA + yB) / 2, df.value + " ms", "small t-tech", "end") + svgText((X(tA3) + X(tB4)) / 2 + 12, (yA + yB) / 2, db.value + " ms", "small t-tech", "start") +
        `</svg>`;
      stats.set("ts", [T1, T2, T3, T4].join(", ") + " ms");
      stats.set("oh", signed(oh, Math.abs(oh).toFixed(1) + " ms"));
      stats.set("dh", dh.toFixed(1) + " ms");
      stats.set("e", Math.abs(err) < 1e-9 ? "0 ms" : signed(err, Math.abs(err).toFixed(1) + " ms"), Math.abs(err) < 1e-9 ? "good" : Math.abs(err) > 5 ? "bad" : "warn");
      if (Math.abs(err) < 1e-9) setVerdict(verdict, "good", "<b>o = ((T2 - T1) - (T4 - T3)) / 2 = ((" + (T2 - T1) + ") - (" + (T4 - T3) + ")) / 2 = " + oh.toFixed(1) + " ms.</b> With symmetric delays the delay cancels exactly. The round-trip delay (T4 - T1) - (T3 - T2) = " + ((T4 - T1) - (T3 - T2)) + " ms is measured on each clock separately, so the offset does not disturb it.");
      else setVerdict(verdict, Math.abs(err) > 5 ? "bad" : "warn", "<b>Asymmetry: the estimate is off by " + Math.abs(err).toFixed(1) + " ms.</b> The formula assumes equal delays; half of the difference (" + df.value + " - " + db.value + ") / 2 = " + err.toFixed(1) + " ms ends up in the offset, and nothing in the four timestamps reveals it.");
    }
    [o, df, db, ta].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: SNTP vs NTP-style filtering
     ===================================================================== */
  function labNtp(el) {
    const { controls, view } = NES.lab(el, {
      title: "One query or many?",
      hint: "Each query crosses a network where queues randomly delay each direction (exponential, illustrative model: 10 ms fixed each way plus random queuing). SNTP takes the first answer. An NTP-style filter keeps the query with the smallest round-trip delay, the one least likely to be distorted by asymmetric queuing.",
    });
    const q = NES.slider(controls, { label: "Mean queuing delay per direction", min: 0, max: 20, step: 0.5, value: 6, fmt: (v) => v + " ms" });
    const n = NES.slider(controls, { label: "Queries", min: 1, max: 16, step: 1, value: 8, fmt: (v) => String(v) });
    const reroll = h("button", { class: "btn", type: "button", text: "New random delays" });
    controls.append(reroll);
    const cv = h("canvas", { style: "height:210px", "aria-label": "Offset error versus round-trip delay" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--muted);height:8px;width:8px;border-radius:50%"></i>one query</span><span><i style="background:var(--warn);height:8px;width:8px;border-radius:50%"></i>first query (SNTP)</span><span><i style="background:var(--ok);height:8px;width:8px;border-radius:50%"></i>lowest delay (NTP-style)</span>` }));
    const stats = NES.stats(view, [{ key: "s", label: "SNTP error" }, { key: "nf", label: "Min-delay error" }, { key: "avg", label: "Average of all" }]);
    let seed = 46;
    let samples = [];
    function gen() {
      const r = NES.rng(seed);
      const ex = (m) => (m <= 0 ? 0 : -m * Math.log(1 - r()));
      samples = Array.from({ length: 16 }, () => { const f = 10 + ex(q.value), b = 10 + ex(q.value); return { rt: f + b, err: (f - b) / 2 }; });
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const S = samples.slice(0, n.value);
      const padL = 46, padR = 10, padT = 10, padB = 26;
      const rtMax = Math.max(40, ...S.map((s) => s.rt)) * 1.08, eMax = Math.max(5, ...S.map((s) => Math.abs(s.err))) * 1.15;
      const X = (rt) => padL + ((rt - 20) / (rtMax - 20)) * (w - padL - padR);
      const Y = (e) => padT + (1 - (e + eMax) / (2 * eMax)) * (hh - padT - padB);
      line(ctx, padL, Y(0), w - padR, Y(0), NES.css("--line-2"));
      // wedge: |error| <= (rt - 20) / 2
      ctx.strokeStyle = NES.css("--grid"); ctx.setLineDash([4, 4]); ctx.beginPath();
      ctx.moveTo(X(20), Y(0)); ctx.lineTo(X(rtMax), Y((rtMax - 20) / 2)); ctx.moveTo(X(20), Y(0)); ctx.lineTo(X(rtMax), Y(-(rtMax - 20) / 2)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "+" + eMax.toFixed(0) + " ms", padL - 4, Y(eMax / 1.15), NES.css("--muted"), "right");
      text(ctx, "-" + eMax.toFixed(0) + " ms", padL - 4, Y(-eMax / 1.15), NES.css("--muted"), "right");
      text(ctx, "0", padL - 4, Y(0), NES.css("--muted"), "right");
      text(ctx, "round-trip 20 ms", padL, hh - 9, NES.css("--muted"));
      text(ctx, rtMax.toFixed(0) + " ms", w - padR, hh - 9, NES.css("--muted"), "right");
      const best = S.reduce((b, s, i) => (s.rt < S[b].rt ? i : b), 0);
      S.forEach((s, i) => {
        ctx.fillStyle = NES.css(i === best ? "--ok" : i === 0 ? "--warn" : "--muted");
        ctx.beginPath(); ctx.arc(X(s.rt), Y(s.err), i === best || i === 0 ? 6 : 4, 0, Math.PI * 2); ctx.fill();
      });
    });
    function update() {
      const S = samples.slice(0, n.value);
      const best = S.reduce((b, s) => (s.rt < b.rt ? s : b), S[0]);
      const avg = S.reduce((a, s) => a + s.err, 0) / S.length;
      const tone = (e) => (Math.abs(e) < 1 ? "good" : Math.abs(e) < 4 ? "warn" : "bad");
      stats.set("s", fmtMs(S[0].err / 1000, 2), tone(S[0].err));
      stats.set("nf", fmtMs(best.err / 1000, 2), tone(best.err));
      stats.set("avg", fmtMs(avg / 1000, 2), tone(avg));
      draw();
    }
    q.onchange = () => { gen(); update(); };
    n.onchange = update;
    reroll.addEventListener("click", () => { seed = (seed * 48271 + 7) % 2147483647; gen(); update(); });
    gen();
    update();
  }

  /* =====================================================================
     LAB: sender-receiver vs reference broadcast
     ===================================================================== */
  function labRbs(el) {
    const { controls, view } = NES.lab(el, {
      title: "Sender-receiver versus reference broadcast",
      hint: "200 synchronisation rounds with random delays (uniform, illustrative ranges). One-way: A sends its timestamp to B, who subtracts the average delay. RBS: R broadcasts a beacon and A and B compare their receive timestamps, so the sender-side delays cancel.",
    });
    const snd = NES.slider(controls, { label: "Sender-side delay (send + access), up to", min: 0, max: 20, step: 0.5, value: 8, fmt: (v) => v + " ms" });
    const rcv = NES.slider(controls, { label: "Receiver-side delay, up to", min: 0, max: 2, step: 0.05, value: 0.3, fmt: (v) => v + " ms" });
    const path = NES.slider(controls, { label: "Path length difference A vs B", min: 0, max: 3000, step: 10, value: 30, fmt: (v) => v + " m" });
    const reroll = h("button", { class: "btn", type: "button", text: "New random rounds" });
    controls.append(reroll);
    const cv = h("canvas", { style: "height:170px", "aria-label": "Error distributions" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "ow", label: "One-way: RMS error" }, { key: "owm", label: "One-way: worst" }, { key: "rb", label: "RBS: RMS error" }, { key: "rbm", label: "RBS: worst" }]);
    const verdict = verdictBox(view);
    let seed = 5, oneway = [], rbs = [];
    function run() {
      const r = NES.rng(seed), N = 200, S = snd.value, Rr = rcv.value, prop = path.value / 3e8 * 1000; // ms
      oneway = []; rbs = [];
      for (let i = 0; i < N; i++) {
        // one-way: delay = sender + receiver; B subtracts the mean of both
        const ds = r() * S, drB = r() * Rr;
        oneway.push((ds - S / 2) + (drB - Rr / 2));
        // RBS: sender delay is common; receivers differ
        const ra = r() * Rr, rb = r() * Rr;
        rbs.push((rb - ra) + prop);
      }
    }
    const rms = (a) => Math.sqrt(a.reduce((s, x) => s + x * x, 0) / a.length);
    const worst = (a) => a.reduce((m, x) => Math.max(m, Math.abs(x)), 0);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const lim = Math.max(1, worst(oneway), worst(rbs)) * 1.1;
      const padL = 74, padR = 10;
      const X = (e) => padL + ((e + lim) / (2 * lim)) * (w - padL - padR);
      [["one-way", oneway, "--warn", 40], ["RBS", rbs, "--ok", 100]].forEach(([name, arr, c, y]) => {
        text(ctx, name, 4, y, NES.css("--ink-2"), "left", 11, true);
        line(ctx, padL, y, w - padR, y, NES.css("--grid"));
        ctx.fillStyle = NES.css(c); ctx.globalAlpha = 0.45;
        const r = NES.rng(99);
        arr.forEach((e) => { ctx.beginPath(); ctx.arc(X(e), y + (r() - 0.5) * 26, 2.6, 0, Math.PI * 2); ctx.fill(); });
        ctx.globalAlpha = 1;
      });
      line(ctx, X(0), 18, X(0), 124, NES.css("--line-2"), 1, [3, 3]);
      text(ctx, "-" + lim.toFixed(1) + " ms", padL, hh - 10, NES.css("--muted"));
      text(ctx, "0", X(0), hh - 10, NES.css("--muted"), "center");
      text(ctx, "+" + lim.toFixed(1) + " ms", w - padR, hh - 10, NES.css("--muted"), "right");
    });
    function update() {
      run();
      const a = rms(oneway), b = rms(rbs);
      stats.set("ow", a.toFixed(3) + " ms", "warn");
      stats.set("owm", worst(oneway).toFixed(3) + " ms");
      stats.set("rb", b.toFixed(3) + " ms", b < a ? "good" : "warn");
      stats.set("rbm", worst(rbs).toFixed(3) + " ms");
      const prop = path.value / 3e8 * 1e6;
      setVerdict(verdict, b < a ? "good" : "warn", "<b>RBS is " + (b > 0 ? (a / b).toFixed(1) + "× " + (b < a ? "more" : "less") + " precise" : "exact") + " here.</b> The sender's delays never enter T2 - T1. What remains is the difference in receiver-side delays, plus a propagation difference of " + prop.toFixed(2) + " µs, which is almost the same at short distances.");
      draw();
    }
    [snd, rcv, path].forEach((c) => (c.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 48271 + 3) % 2147483647; update(); });
    update();
  }

  /* =====================================================================
     LAB: periodic synchronisation
     ===================================================================== */
  function labPeriodic(el) {
    const { controls, view } = NES.lab(el, {
      title: "How often must we resynchronise?",
      hint: "Between syncs the error grows by drift × time; each sync brings it back to (close to) zero. Choose the drift, the sync interval and the error you can tolerate.",
    });
    const drift = NES.slider(controls, { label: "Relative drift", min: 1, max: 100, step: 1, value: 10, fmt: (v) => v + " ppm" });
    const iv = NES.slider(controls, { label: "Sync interval", min: 1, max: 4.94, step: 0.02, value: Math.log10(120), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtSec(v) });
    const res = NES.slider(controls, { label: "Error left right after a sync", min: 0, max: 2, step: 0.05, value: 0, fmt: (v) => v + " ms" });
    const target = NES.slider(controls, { label: "Tolerable error", min: -1, max: 3, step: 0.05, value: Math.log10(2), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => +v.toPrecision(3) + " ms" });
    const cv = h("canvas", { style: "height:200px", "aria-label": "Synchronisation error over time" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "max", label: "Max error" }, { key: "need", label: "Longest allowed interval" }, { key: "day", label: "Syncs per day" }]);
    const verdict = verdictBox(view);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const d = drift.value * 1e-6, I = iv.value, r = res.value / 1000, span = 5 * I;
      const maxE = r + d * I, tgt = target.value / 1000;
      const top = Math.max(maxE, tgt) * 1.25;
      const padL = 54, padR = 10, padT = 10, padB = 24;
      const X = (t) => padL + (t / span) * (w - padL - padR);
      const Y = (e) => padT + (1 - e / top) * (hh - padT - padB);
      line(ctx, padL, Y(0), w - padR, Y(0), NES.css("--line-2"));
      line(ctx, padL, Y(tgt), w - padR, Y(tgt), NES.css("--bad"), 1.4, [6, 4]);
      text(ctx, "tolerable", w - padR, Y(tgt) - 8, NES.css("--bad"), "right");
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      for (let k = 0; k < 5; k++) {
        const t0 = k * I;
        ctx.moveTo(X(t0), Y(r)); ctx.lineTo(X(t0 + I), Y(maxE));
        ctx.lineTo(X(t0 + I), Y(r));
      }
      ctx.stroke();
      text(ctx, fmtSec(maxE, 3), padL - 4, Y(maxE), NES.css("--muted"), "right");
      text(ctx, "0", padL, hh - 9, NES.css("--muted"));
      text(ctx, fmtSec(span), w - padR, hh - 9, NES.css("--muted"), "right");
      for (let k = 1; k < 5; k++) { ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(k * I), Y(r), 3.5, 0, Math.PI * 2); ctx.fill(); }
    });
    function update() {
      const d = drift.value * 1e-6, I = iv.value, r = res.value / 1000, tgt = target.value / 1000;
      const maxE = r + d * I;
      stats.set("max", fmtSec(maxE), maxE <= tgt ? "good" : "bad");
      const need = tgt > r ? (tgt - r) / d : 0;
      stats.set("need", need > 0 ? fmtSec(need) : "impossible", need > 0 ? "" : "bad");
      stats.set("day", +(86400 / I).toPrecision(3) + "");
      if (tgt <= r) setVerdict(verdict, "bad", "<b>Impossible.</b> The error left right after each sync is already above what you can tolerate: no sync frequency can fix that, you need a more precise synchronisation method.");
      else if (maxE <= tgt) setVerdict(verdict, "good", "<b>Within budget.</b> Max error = " + (r > 0 ? fmtSec(r) + " + " : "") + drift.value + " ppm × " + fmtSec(I) + " = " + fmtSec(maxE) + ". You could stretch the interval to " + fmtSec(need) + " and save " + Math.max(0, Math.round(86400 / I - 86400 / need)) + " syncs per day.");
      else setVerdict(verdict, "bad", "<b>Too rare.</b> The error reaches " + fmtSec(maxE) + " before the next sync. Synchronise at least every " + fmtSec(need) + ".");
      draw();
    }
    [drift, iv, res, target].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    sort: labSort,
    timer: labTimer,
    resolution: labResolution,
    uptime: labUptime,
    ppm: labPpm,
    error: labError,
    temp: labTemp,
    blink: labBlink,
    oneway: labOneway,
    delay: labDelay,
    gps: labGps,
    twoway: labTwoway,
    ntp: labNtp,
    rbs: labRbs,
    periodic: labPeriodic,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("time-sync", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
