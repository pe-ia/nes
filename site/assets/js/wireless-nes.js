/* Week 10, Wireless Networked Embedded Systems: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";
  const sup = (s) => "<sup>" + s + "</sup>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "wired-vs-wireless": [
      {
        q: "According to the lecture, in which situation is a wireless embedded system <em>necessary</em> rather than just convenient?",
        options: [
          ["A fitness tracker worn on a runner's wrist", true, "Mobile embedded systems (wearables, vehicles) cannot drag a cable around. The slide lists them as cases where wireless is necessary."],
          ["A sensor mounted right next to an existing network cable in a factory", false, "A cable is easy to run here, so wireless is optional: it might be chosen for cost or flexibility, but it is not necessary."],
          ["A safety interlock where reliability matters more than anything else", false, "This points to wired: the slide says wired systems are more reliable, being less vulnerable to interference and environmental noise."],
          ["A door controller that must resist physical tampering", false, "This points to wired too: the slide calls wired systems more secure, less vulnerable to physical attacks."],
        ],
      },
      {
        q: "Which advantage does the lecture give to <em>wired</em> networked embedded systems?",
        options: [
          ["They are cheaper, more flexible and easier to install", false, "That is the slide's list of advantages for <em>wireless</em> systems."],
          ["They are needed where there is no infrastructure", false, "It is the other way round: wireless is necessary where there is no easy access to infrastructure."],
          ["They are more reliable and more secure", true, "Wired links are less vulnerable to interference and environmental noise (reliability) and to physical attacks (security). Wireless can be made reliable and secure, \"but...\" it takes more effort."],
          ["They support mobility", false, "Mobility is exactly what cables prevent; it is a reason to go wireless."],
        ],
      },
    ],

    "radio-basics": [
      {
        q: "What does a transmitting antenna do?",
        options: [
          ["It amplifies the signal coming from the radio", false, "Antennas are passive components (slide 10): they reshape the signal but do not amplify it."],
          ["It demodulates the data", false, "Demodulation happens in the receiving radio, after the receiving antenna has turned the wave back into a current."],
          ["It turns the electric current supplied by the radio into an electromagnetic (radio) wave", true, "The transmitter generates a current and supplies it to the antenna, which radiates the energy as a radio wave. At the other end the receiving antenna does the reverse."],
          ["It splits the data into bits", false, "Bits are a digital concept handled long before the antenna; the antenna only sees an electric current."],
        ],
      },
      {
        q: "Where are the data carried in a radio transmission?",
        options: [
          ["In a separate clock signal sent alongside, as in SPI", false, "There is no separate clock line in the air. Like the asynchronous links of Weeks 5 and 7, the receiver recovers timing from the signal itself."],
          ["In the DC level of the antenna current", false, "An antenna does not radiate a DC level; information must be put into a changing wave."],
          ["Only in the cable between radio and antenna", false, "The cable carries the signal to the antenna, but the point of radio is that the data travel through the air."],
          ["In physical properties of the radio wave, such as its frequency or phase", true, "The transmitter encodes the data in the wave's properties (frequency, phase, amplitude); the receiver filters, amplifies and demodulates to recover them."],
        ],
      },
    ],

    decibels: [
      {
        q: "Using the slide's rules of thumb, +17 dB is approximately a factor of?",
        options: [
          ["×50", true, "+17 dB = +10 dB +10 dB -3 dB, so ×10 ×10 ÷2 = ×50. (Exactly, 10" + sup("1.7") + " ≈ 50.1.)"],
          ["×17", false, "Decibels are logarithmic. Adding dB multiplies the linear power, so 17 dB is much more than ×17."],
          ["×170", false, "That treats +17 dB as ×10 and then ×17. Break it into the known steps instead: +10, +10, -3."],
          ["×1.7", false, "That would be 10 log" + sub("10") + "(1.7) ≈ 2.3 dB, far less than 17 dB."],
        ],
      },
      {
        q: "A signal is transmitted at 0.2 W and reaches the receiver with 0.1 pW (slide 5). How large is that attenuation in dB?",
        options: [
          ["About 12.3 dB", false, "12.3 dB is only a factor of about 17. The real ratio is two million million."],
          ["About 123 dB", true, "The ratio is 0.2 W / 10" + sup("-13") + " W = 2 × 10" + sup("12") + ", and 10 log" + sub("10") + "(2 × 10" + sup("12") + ") ≈ 123 dB. That huge dynamic range is why radio people use dB."],
          ["2 × 10" + sup("12") + " dB", false, "That is the linear ratio itself. In dB it becomes 10 log" + sub("10") + " of that number."],
          ["-3 dB", false, "-3 dB only halves the power. The signal lost far more than half of its power."],
        ],
      },
      {
        q: "-6 dB corresponds to approximately?",
        options: [
          ["Dividing by 6", false, "dB values do not map directly to factors. Use the rule of thumb: each -3 dB halves."],
          ["Multiplying by 0.6", false, "That is about -2.2 dB."],
          ["Dividing by 2", false, "Halving is -3 dB. -6 dB is two halvings."],
          ["Dividing by 4", true, "-6 dB = -3 dB -3 dB = ÷2 ÷2 = ÷4. Adding in the log domain is multiplying in the linear domain."],
        ],
      },
    ],

    dbm: [
      {
        q: "A -10 dBm signal goes through a 3 dB amplifier. What comes out?",
        options: [
          ["-13 dBm", false, "An amplifier with a 3 dB gain adds 3 dB; subtracting would describe a 3 dB loss."],
          ["-30 dBm", false, "Multiplying dB values together has no meaning. Gains and losses in dB are added."],
          ["-7 dBm, about 0.2 mW", true, "-10 dBm + 3 dB = -7 dBm. Linearly: -10 dBm is 0.1 mW, and the 3 dB amplifier doubles it to about 0.2 mW. This mixes an absolute power (dBm) with a relative gain (dB), which is fine."],
          ["+3 dBm", false, "The amplifier only adds 3 dB to the input level of -10 dBm."],
        ],
      },
      {
        q: "What does 0 dBm mean?",
        options: [
          ["No power at all", false, "0 dBm means a ratio of 1 to the reference of 1 mW. No power at all would be minus infinity dBm."],
          ["1 W, the maximum allowed power", false, "1 W = 1000 mW is 30 dBm, the slide's example for a WiFi router."],
          ["The thermal noise level", false, "Thermal noise is far below: the slide lists it at -174 dBm."],
          ["1 mW, a typical transmission power of small embedded systems", true, "dBm is referenced to 1 mW, so 0 dBm = 1 mW. The slide's table lists it as the typical transmission power of small embedded systems."],
        ],
      },
      {
        q: "How many times more power does a 30 dBm WiFi router transmit than a 0 dBm sensor node?",
        options: [
          ["1000 times", true, "30 dB = 10 dB + 10 dB + 10 dB = ×10 ×10 ×10 = ×1000 (1 W versus 1 mW)."],
          ["30 times", false, "The difference is 30 dB, and dB are logarithmic: 30 dB is not a factor of 30."],
          ["3 times", false, "A factor of 3 is only about 4.8 dB."],
          ["100 times", false, "100 times is 20 dB. The difference here is 30 dB."],
        ],
      },
    ],

    "link-budget": [
      {
        q: "P" + sub("TX") + " = 0 dBm, G" + sub("TX") + " = 2 dBi, L" + sub("TX") + " = 1 dB, L" + sub("P") + " = 90 dB, G" + sub("RX") + " = 2 dBi, L" + sub("RX") + " = 1 dB. What is the received power?",
        options: [
          ["-86 dBm", false, "That forgets the 1 dB cable and connector losses on each side."],
          ["-90 dBm", false, "That only applies the path loss. The antenna gains and the losses also count."],
          ["-92 dBm", false, "That subtracts the antenna gains instead of adding them."],
          ["-88 dBm", true, "P" + sub("RX") + " = P" + sub("TX") + " + G" + sub("TX") + " - L" + sub("TX") + " - L" + sub("P") + " + G" + sub("RX") + " - L" + sub("RX") + " = 0 + 2 - 1 - 90 + 2 - 1 = -88 dBm. In dB everything is a simple sum."],
        ],
      },
      {
        q: "With that link (P" + sub("RX") + " = -88 dBm) and a receiver sensitivity of -97 dBm, how much margin is left?",
        options: [
          ["9 dB", true, "Margin = P" + sub("RX") + " - sensitivity = -88 - (-97) = 9 dB. The signal could get almost 8 times weaker (for example through fading) and still be perceived."],
          ["-9 dB", false, "A negative margin would mean the signal is below the sensitivity. -88 dBm is stronger than -97 dBm."],
          ["97 dB", false, "The margin compares the received power with the sensitivity; it is not the sensitivity itself."],
          ["0 dB", false, "0 dB margin would mean the signal sits exactly at the sensitivity threshold."],
        ],
      },
      {
        q: "Which term of the link budget can be estimated from the RSSI reported by the receiver?",
        options: [
          ["The transmission power P" + sub("TX"), false, "P" + sub("TX") + " is a setting chosen in the transmitter's software, not something to estimate."],
          ["The path loss L" + sub("P"), true, "Slide 8: RSSI can be used to estimate the path loss. With known P" + sub("TX") + ", gains and losses, L" + sub("P") + " ≈ P" + sub("TX") + " + G" + sub("TX") + " - L" + sub("TX") + " + G" + sub("RX") + " - L" + sub("RX") + " - RSSI."],
          ["The antenna gains", false, "Antenna gains come from the antenna datasheet; they do not change from packet to packet."],
          ["The cable losses", false, "Cable and connector losses are fixed properties of the hardware."],
        ],
      },
    ],

    "path-loss": [
      {
        q: "The slide's office link never moves, yet its RSSI jumps around by 20 dB and more during working hours. Why?",
        options: [
          ["The transmitter keeps changing its power", false, "The transmission power is constant in that measurement; the variation comes from the propagation."],
          ["Path loss only depends on distance, so the measurement must be broken", false, "In free space it would only depend on distance and frequency. Down on Earth the environment matters too."],
          ["Multipath fading and shadowing: people and objects moving around change how reflected rays add up and what blocks the path", true, "Rays reflect off surfaces and arrive with small delays (phase shifts), adding constructively or destructively. Obstacles attenuate (metal blocks completely). All of it changes as the room changes, even at a constant distance."],
          ["RSSI is measured with an ADC, and ADCs are noisy", false, "Quantisation noise (Week 4) is tiny compared with 20 dB swings."],
        ],
      },
      {
        q: "In free space, doubling the distance increases the path loss by about?",
        options: [
          ["3 dB", false, "3 dB would mean the power only halves. But the energy spreads over a sphere whose area grows with d², so it drops to a quarter."],
          ["2 dB", false, "Path loss in dB grows with 20 log" + sub("10") + "(d) in free space, and 20 log" + sub("10") + "(2) is about 6, not 2."],
          ["6 dB", true, "Free-space path loss grows as d² (inverse-square law), so doubling d costs 20 log" + sub("10") + "(2) ≈ 6 dB, a factor of 4 in power."],
          ["12 dB", false, "12 dB per doubling corresponds to a path-loss exponent of 4, typical of cluttered indoor or ground-level links, not free space."],
        ],
      },
    ],

    "antenna-gain": [
      {
        q: "An antenna's datasheet says 6 dBi. What does that mean?",
        options: [
          ["It amplifies the signal by 6 dB using a small built-in amplifier", false, "Antennas are passive: they cannot add energy, they only redistribute it."],
          ["In its best direction it delivers about 4 times the power an isotropic antenna would, and less in others", true, "dBi is gain relative to the isotropic reference: 6 dB ≈ ×4 in the peak direction. The energy that goes there is missing from other directions."],
          ["It radiates 6 dB more total power than the radio supplies", false, "That would break energy conservation. A real antenna radiates slightly less than it receives (losses), just unevenly."],
          ["It only works on 6 GHz", false, "dBi is a unit of gain, not of frequency."],
        ],
      },
      {
        q: "A wearable moves around, so its gateway could be in any direction. Which antenna suits it best?",
        options: [
          ["A highly directive antenna pointed at the gateway", false, "Pointing works for fixed point-to-point links. Once the wearer turns, the gateway falls outside the narrow beam."],
          ["An isotropic antenna", false, "Isotropic antennas are theoretical, used as a reference. Real antennas always have some directivity."],
          ["No antenna: the radio chip radiates by itself", false, "Without an antenna (printed or external) the radio would radiate very poorly."],
          ["An antenna with low directivity", true, "Low directivity is good when the source location is unknown, for example with mobility: no direction is much better or much worse than the others."],
        ],
      },
    ],

    "antenna-radio": [
      {
        q: "What does a balun do?",
        options: [
          ["It converts the radio's balanced (differential) output into the unbalanced input an antenna expects, usually with an integrated matching circuit", true, "That is the slide's definition, and the BALF-CC26-05 in the figure sits exactly between the CC26xx RF pins and the 50 Ω antenna. Some radios integrate the balun so you just connect the antenna."],
          ["It amplifies the signal before the antenna", false, "A balun is a passive conversion and matching network; it does not add gain."],
          ["It filters out WiFi interference", false, "Filtering is not its purpose. It converts balanced to unbalanced and matches impedances."],
          ["It converts digital data to an analogue signal", false, "That is the job of the radio's modulator (or a DAC, Week 4), well before the balun."],
        ],
      },
      {
        q: "Why is a matching circuit placed between the radio and the antenna?",
        options: [
          ["To limit the current, like a series resistor for an LED", false, "Matching is about impedance at radio frequencies, not about limiting DC current."],
          ["To maximise the power emitted and minimise the power reflected back into the radio", true, "If the radio, the line and the antenna are not matched, part of the power bounces back instead of being radiated."],
          ["To encrypt the signal", false, "Encryption is done digitally, far up the stack. A matching circuit is a few passive components."],
          ["To lower the carrier frequency", false, "The frequency is set by the radio; matching circuits are designed for the frequency in use."],
        ],
      },
    ],

    reception: [
      {
        q: "A receiver's sensitivity is -97 dBm. A packet arrives at -100 dBm and there is no interference. What happens?",
        options: [
          ["It is received, since there is no interference", false, "Interference is only the second requirement. The first one, enough power to be perceived, already fails."],
          ["It is received with a 3 dB margin", false, "Check the sign: -100 dBm is 3 dB <em>below</em> -97 dBm."],
          ["The receiver amplifies it until it becomes readable", false, "The sensitivity already includes the receiver's best amplification. Below it, amplifying only amplifies noise too."],
          ["It is too weak: the receiver perceives it as noise and the packet is lost", true, "Sensitivity is the lowest power from which the receiver can extract information. A weaker signal is perceived as noise."],
        ],
      },
      {
        q: "A packet arrives at -80 dBm, far above the -97 dBm sensitivity, but an interfering signal arrives at -82 dBm. Why may it still fail?",
        options: [
          ["Because the signal must be sufficiently stronger than the sum of all interference, and 2 dB is very little", true, "That is the second requirement. Interference introduces bit errors in decoding. With the wanted signal only about 1.6 times stronger than the interference, decoding is likely to fail."],
          ["Because -80 dBm is too strong and saturates the receiver", false, "Saturation happens at far higher levels (think -20 dBm at very short distance)."],
          ["It cannot fail: the sensitivity requirement is met", false, "Meeting the sensitivity is necessary but not sufficient."],
          ["Because interference adds to the signal and pushes it above the sensitivity", false, "Interference does not help: it is the unwanted signal the receiver must overcome."],
        ],
      },
    ],

    interference: [
      {
        q: "Two interfering transmitters each arrive at the receiver with -90 dBm. What is the total interference power?",
        options: [
          ["-180 dBm", false, "Adding dBm values would mean multiplying milliwatts. Powers must be added in linear units."],
          ["-90 dBm", false, "Two equal interferers carry twice the power of one."],
          ["About -87 dBm", true, "Two equal powers add up to double: +3 dB, so -90 dBm + 3 dB ≈ -87 dBm (exactly 10 log" + sub("10") + "(2 × 10" + sup("-9") + " mW) ≈ -87 dBm)."],
          ["-45 dBm", false, "Averaging or halving dBm values has no physical meaning."],
        ],
      },
      {
        q: "The slide says \"interference is subjective\". What does that mean?",
        options: [
          ["Each user decides whether they find the interference annoying", false, "It is not about opinions: interference is measurable power."],
          ["The same signal is the wanted signal for one receiver and interference for every other receiver", true, "All signals are broadcast and every receiver collects all of them. Like voices in a room: the speaker you want to hear is everyone else's background noise."],
          ["Interference only exists in licensed bands", false, "Unlicensed bands are, if anything, more crowded."],
          ["Interference can only come from other electronics like microwaves", false, "The slide's first sources are other transmitters of the same network and of overlapping networks; other electronics come last."],
        ],
      },
    ],

    capture: [
      {
        q: "Tx1 and Tx2 transmit at the same time with equal power. Tx2 is much closer to the receiver. Which packet can be received?",
        options: [
          ["Neither: simultaneous transmissions always destroy each other", false, "Not always. That is exactly what the capture effect is about."],
          ["Tx1's, because it is the reference transmitter", false, "Tx1's signal arrives weaker and faces strong interference from the nearby Tx2."],
          ["Both, each at half the data rate", false, "A narrowband receiver decodes one signal at a time; the other one is interference."],
          ["Tx2's: from its perspective the interference (Tx1) is weak", true, "The closest transmission can be received without errors. For Tx2 the interference is low; for Tx1 it is high, so only Tx1's packet is lost."],
        ],
      },
      {
        q: "With free-space path loss (power ∝ 1/d²), Tx2 is at half the distance of Tx1. How much stronger is Tx2 at the receiver?",
        options: [
          ["About 6 dB (4 times)", true, "Halving the distance divides the path loss by 4: 20 log" + sub("10") + "(2) ≈ 6 dB. With a cluttered environment (exponent 3 or 4) the difference would be even larger."],
          ["About 3 dB (2 times)", false, "That would be true if power fell as 1/d. In free space it falls as 1/d²."],
          ["About 12 dB", false, "12 dB per halving corresponds to a path-loss exponent of 4, not free space."],
          ["0 dB, since they transmit with equal power", false, "Equal transmit power does not mean equal received power: the path loss differs."],
        ],
      },
    ],

    coverage: [
      {
        q: "In the slide's measurements, which packets have the higher packet error rate at the same RSSI?",
        options: [
          ["The 21-byte packets", false, "Shorter packets contain fewer bits that can be hit by an error."],
          ["The 39-byte packets", true, "More bits, more chances that one of them is wrong. For each technology the 39 B curve (solid) lies above the 21 B curve (dashed). Packet size is one of the PER factors listed on the slide."],
          ["Both equal: PER only depends on RSSI", false, "RSSI matters most, but the slide lists packet size and transmission rate as well."],
          ["It depends only on the distance", false, "Distance acts through the RSSI; at the same RSSI the packet size still makes a difference."],
        ],
      },
      {
        q: "BER = 10" + sup("-3") + ", a 21-byte packet (168 bits), independent bit errors and no error correction. Roughly what is the PER?",
        options: [
          ["0.1%", false, "That is the bit error rate. A packet fails if <em>any</em> of its 168 bits fails."],
          ["About 100%", false, "That would need a much higher BER; 99.9% of the bits are still right."],
          ["About 15%", true, "PER = 1 - (1 - BER)" + sup("bits") + " = 1 - 0.999" + sup("168") + " ≈ 0.155. The quick estimate 168 × 0.001 = 16.8% is close but slightly too high."],
          ["168%", false, "A probability cannot exceed 100%. Multiplying the bit count by the BER only works as an approximation when the result is small."],
        ],
      },
    ],

    carrier: [
      {
        q: "With BFSK on a carrier of frequency f" + sub("c") + ", how is a '1' sent?",
        options: [
          ["As the frequency f" + sub("c") + " - f" + sub("0"), false, "f" + sub("c") + " - f" + sub("0") + " represents '0' in the slide's example."],
          ["By switching the carrier off", false, "Switching the carrier on and off is amplitude keying (on-off keying), a different modulation."],
          ["By flipping the phase of the carrier", false, "That is phase-shift keying (PSK). BFSK changes the frequency."],
          ["As the frequency f" + sub("c") + " + f" + sub("0"), true, "Binary Frequency Shift Keying shifts the carrier up by f" + sub("0") + " for '1' and down by f" + sub("0") + " for '0'."],
        ],
      },
      {
        q: "Why put the data on top of a carrier wave at all?",
        options: [
          ["The receiver can use a bandpass filter around f" + sub("c") + ", removing signals at other frequencies, so different frequencies can carry parallel transmissions", true, "That is the slide's advantage list: filter out everything not near the carrier, limit interference to signals close to f" + sub("c") + ", and enable parallel interference-free transmissions on different frequencies."],
          ["Because a carrier makes the signal immune to all interference", false, "It only limits interference to signals near the carrier frequency; those still interfere."],
          ["To save energy by not transmitting during '0' bits", false, "In BFSK the carrier is transmitted for both '0' and '1', just at slightly different frequencies."],
          ["Because a carrier wave needs no antenna", false, "The modulated carrier is exactly what the antenna radiates."],
        ],
      },
    ],

    bands: [
      {
        q: "Compared with 2.4 GHz, what does a sub-GHz radio (e.g. 868 MHz) typically offer?",
        options: [
          ["Higher bitrate and smaller antennas", false, "It is the opposite: lower bands have less capacity for data, lower bitrates and bigger antennas."],
          ["Less interference", false, "The slide lists <em>more</em> interference for lower bands: signals travel further and penetrate more, so more transmitters reach you."],
          ["Lower path loss, more obstacle penetration and more coverage, but lower bitrate and bigger antennas", true, "That is the slide's trade-off list for lower frequency bands."],
          ["Shorter range", false, "Lower frequencies have lower path loss and penetrate obstacles better, so the range is longer."],
        ],
      },
      {
        q: "What is the wavelength of a 2.4 GHz radio wave?",
        options: [
          ["About 2.4 m", false, "λ = c / f, not f in GHz read as metres."],
          ["About 1.25 mm", false, "That is the wavelength around 240 GHz, a hundred times higher in frequency."],
          ["About 12.5 cm", true, "λ = c / f = 3 × 10" + sup("8") + " m/s / 2.4 × 10" + sup("9") + " Hz = 0.125 m. A quarter-wave antenna is then about 3 cm long, small enough for a PCB trace."],
          ["About 125 m", false, "That is the wavelength around 2.4 MHz."],
        ],
      },
    ],

    "band-rules": [
      {
        q: "According to the slide's table, which unlicensed band is available worldwide?",
        options: [
          ["433.05 to 434.79 MHz", false, "That one is available in Europe, Africa and the Middle East only."],
          ["902 to 928 MHz", false, "That one is for North and South America."],
          ["2.4 to 2.5 GHz", true, "2.4 GHz is a worldwide ISM band, which is one reason why WiFi, BLE and IEEE 802.15.4 all use it, and why it is crowded."],
          ["The cellular bands", false, "Cellular bands are licensed: rented to telecom providers, illegal to transmit in without a license."],
        ],
      },
      {
        q: "Why are frequency bands regulated by governments?",
        options: [
          ["Because radio waves above 1 GHz are dangerous", false, "Radio waves and microwaves are not ionising; the slide marks radiation above visible light as dangerous."],
          ["The spectrum is limited, so they decide who can use a band, how often, and with what maximum transmission power", true, "That is the slide's list. Licensed bands need a license; unlicensed (ISM) bands can be used by anyone within the rules."],
          ["To guarantee that unlicensed bands are free of interference", false, "Unlicensed bands are shared by everyone who follows the rules, so interference is part of life there."],
          ["Because each country uses different physics", false, "The physics is the same everywhere; the allocations differ by region (for example 868 MHz in Europe, 915 MHz in the Americas)."],
        ],
      },
    ],

    channels: [
      {
        q: "Two WiFi networks in the 2.4 GHz band should not interfere with each other. Which pair of channels should they use?",
        options: [
          ["1 and 3", false, "Channel centres are only 5 MHz apart, so channels 1 and 3 (10 MHz apart) overlap heavily with 22 MHz wide signals."],
          ["6 and 7", false, "Adjacent channels overlap almost completely."],
          ["11 and 13", false, "Also only 10 MHz apart: overlapping."],
          ["1 and 6", true, "Their centres (2412 and 2437 MHz) are 25 MHz apart, more than the 22 MHz channel width, so they are orthogonal. That is why 1, 6 and 11 are the classic non-overlapping set."],
        ],
      },
      {
        q: "What is FDMA?",
        options: [
          ["Transmitters taking turns in dedicated time slots", false, "That is TDMA (Time Division Multiple Access), the basis of guaranteed time slots later in the lecture."],
          ["Transmitting in parallel on different orthogonal channels without interfering", true, "Frequency Division Multiple Access separates transmitters in frequency instead of time."],
          ["Sensing the channel before transmitting", false, "That is carrier sensing, the CS in CSMA/CA."],
          ["Using a carrier wave", false, "A carrier is needed for FDMA, but FDMA is about giving different transmitters different channels."],
        ],
      },
    ],

    "radio-states": [
      {
        q: "Why can't a wireless radio detect a collision while it is transmitting?",
        options: [
          ["It cannot receive while it transmits: the radio is either in transmit or in receive mode", true, "So collisions cannot be detected as they happen. Wired Ethernet could listen while sending (CSMA/CD, Week 7); radios have to find out afterwards, for example from a missing acknowledgement."],
          ["Collisions do not happen in wireless networks", false, "They do, which is why CSMA/CA and acknowledgements exist."],
          ["The preamble prevents collisions", false, "The preamble is a synchronisation phrase that lets a receiver lock on to a frame; it does not prevent overlaps."],
          ["Because wireless links are full duplex", false, "It is the opposite: a typical radio is half duplex, transmit or receive."],
        ],
      },
      {
        q: "A radio waits for frames, but nothing arrives. Energetically, which state is it in?",
        options: [
          ["Sleep, because no data is being received", false, "To notice an incoming frame the radio must be in receive mode, and that costs receive power."],
          ["Receive: listening (receiving noise) is the same state as receiving data", true, "The slide is explicit: receive and listen are the same state. Idle listening costs as much as receiving, which motivates duty cycling."],
          ["Transmit", false, "The radio is not sending anything."],
          ["Off", false, "An off radio cannot detect incoming frames, which is exactly the problem duty cycling has to solve."],
        ],
      },
    ],

    star: [
      {
        q: "In the slide's star topology, what is the AP?",
        options: [
          ["The node that collects the data or bridges the wireless network to the wired one, also called sink or gateway", true, "All devices talk directly to it."],
          ["Any device that has data to send", false, "Devices D1 to D3 send data; the AP is the one they all talk to."],
          ["A repeater between two devices", false, "Relaying on behalf of others belongs to multi-hop topologies, later in the lecture."],
          ["The antenna of a device", false, "AP stands for Access Point, a network role."],
        ],
      },
      {
        q: "How can overlapping star networks reduce the interference between them?",
        options: [
          ["By all using the same channel and sending at the same time", false, "That maximises interference between them."],
          ["By increasing the transmission power", false, "More power makes each network interfere more with the others."],
          ["By using a different channel", true, "Different (ideally orthogonal) channels let the networks run in parallel, the FDMA idea from slide 19."],
          ["By removing the access point", false, "Without the AP the star has no centre at all."],
        ],
      },
    ],

    "csma-ca": [
      {
        q: "In CSMA/CA, what does a device do if the clear channel assessment (CCA) finds the channel busy?",
        options: [
          ["Transmits anyway, since it cannot detect collisions", false, "That would guarantee a collision with the ongoing transmission."],
          ["Sends a jam signal", false, "Jamming belongs to wired CSMA/CD (Week 7), which can detect collisions while sending."],
          ["Waits a random time, with binary exponential backoff, and then senses again", true, "Random waiting makes it unlikely that waiting devices retry at the same moment, and doubling the window after each failure adapts to load."],
          ["Drops the frame", false, "Frames are only dropped after the maximum number of attempts."],
        ],
      },
      {
        q: "Two devices perform CCA at the same moment and both find the channel free. What happens next?",
        options: [
          ["The one with the lower ID wins the arbitration, as on a CAN bus", false, "CAN's bitwise arbitration relies on a wired-AND bus (Week 7). A radio cannot listen while it transmits."],
          ["Both transmit and their frames collide at the AP", true, "CCA only reduces the probability of collisions (collision avoidance); it cannot prevent two devices from deciding at the same time."],
          ["CCA reserves the channel for whoever sensed first", false, "Sensing does not reserve anything; both saw an idle channel."],
          ["The AP decodes both frames at once", false, "Overlapping frames on the same channel interfere. Only the capture effect can save the stronger one."],
        ],
      },
    ],

    acks: [
      {
        q: "How does a wireless sender find out that its frame was lost?",
        options: [
          ["It hears the collision while transmitting", false, "It cannot: radios cannot receive while transmitting."],
          ["The AP sends a negative acknowledgement for every corrupted frame", false, "A corrupted frame cannot be decoded, so the AP may not even know who sent it."],
          ["It does not need to know; frames are never lost with CSMA/CA", false, "Collision avoidance reduces collisions but does not eliminate them, and interference and obstacles cause errors too."],
          ["No acknowledgement (ACK) arrives after the frame, so it retransmits", true, "Every frame is acknowledged; no ACK means retransmit, and after the maximum number of attempts the frame is dropped."],
        ],
      },
      {
        q: "A link delivers 70% of frames per attempt. With up to 3 retransmissions (4 attempts in total), what is the probability that a frame gets through eventually?",
        options: [
          ["70%", false, "That is the success probability of a single attempt, without any retransmission."],
          ["About 91%", false, "That is 1 - 0.3² with only one retransmission."],
          ["About 99.2%", true, "The frame is lost only if all 4 attempts fail: 0.3" + sup("4") + " = 0.0081. So 1 - 0.0081 ≈ 99.2% are delivered, at the cost of extra transmissions and delay."],
          ["100%", false, "With a maximum number of attempts, there is always a small chance that every attempt fails."],
        ],
      },
    ],

    "duty-cycle": [
      {
        q: "Using the slide's CC2650 numbers, how does listening for frames compare with receiving them?",
        options: [
          ["It costs the same: listening is RX mode, about 5.9 to 6.1 mA", true, "Listening requires the same power as receiving, so idle listening wastes as much energy as real reception."],
          ["Listening is free; only decoding costs energy", false, "The receiver chain (filtering, amplifying) runs whenever the radio is in RX mode, frame or no frame."],
          ["Listening costs about as much as sleeping", false, "Sleep is microamps; RX is milliamps, more than a thousand times more."],
          ["Listening costs more than transmitting at 5 dBm", false, "TX at 5 dBm draws 9.1 mA, more than RX at 5.9 to 6.1 mA."],
        ],
      },
      {
        q: "A node keeps its radio in RX all the time and runs from a 225 mAh coin cell. Ignoring everything else, how long does the battery last?",
        options: [
          ["About 2 hours", false, "225 mAh / 5.9 mA is much more than 2 hours."],
          ["About 38 hours", true, "225 mAh / 5.9 mA ≈ 38 h, less than two days. That is why always-on listening is not an option for battery-powered nodes."],
          ["About 38 days", false, "Check the units: mAh divided by mA gives hours, not days."],
          ["About a year", false, "A year needs an average current around 0.026 mA, far below 5.9 mA."],
        ],
      },
      {
        q: "The same node turns its radio on 1% of the time (RX, 5.9 mA) and sleeps at 1 µA otherwise. What is the average current?",
        options: [
          ["About 0.06 mA", true, "0.01 × 5.9 mA + 0.99 × 0.001 mA ≈ 0.059 + 0.001 = 0.06 mA. The battery now lasts about 225 / 0.06 ≈ 3750 h, roughly 5 months."],
          ["5.9 mA", false, "That is the current while the radio is on, not the average over time."],
          ["About 0.59 mA", false, "That would be a 10% duty cycle."],
          ["0.001 mA", false, "That is only the sleep current; the 1% of radio time dominates."],
        ],
      },
    ],

    asymmetric: [
      {
        q: "In duty-cycled CSMA in a star topology, who keeps the radio on all the time?",
        options: [
          ["Every node, so that no frame is missed", false, "Battery-powered nodes would drain within days (about 38 h on a coin cell with an always-on receiver)."],
          ["Nobody: all radios are duty cycled", false, "That is the symmetric case for later. Here the AP has no energy limitations."],
          ["The mains-powered AP/GW, which is always in RX mode unless it transmits", true, "The energy budget is asymmetric: the AP can afford to listen continuously, so the battery-powered nodes can sleep and wake up only when they have data."],
          ["The node with the most data", false, "Roles are fixed by the energy supply, not by the traffic."],
        ],
      },
      {
        q: "What challenge does slide 26 raise about duty-cycled CSMA?",
        options: [
          ["The nodes cannot send uplink data", false, "Uplink works well: nodes wake up, do CCA, transmit and wait for the ACK."],
          ["The AP cannot reach the nodes with downlink data, because they are asleep whenever they have nothing to send", true, "The AP does not know when a node will be awake. The next slide's answer: piggyback on the uplink."],
          ["The AP runs out of battery", false, "The AP is mains-powered in this scenario."],
          ["CCA does not work when the AP is always listening", false, "CCA is done by the nodes and works as before."],
        ],
      },
    ],

    downlink: [
      {
        q: "How does the AP deliver downlink data to a duty-cycled node?",
        options: [
          ["It transmits whenever it wants; the node will wake up", false, "The AP cannot initiate a transfer to a sleeping node: the node would not be listening."],
          ["It requests, in the ACK of the node's uplink frame, that the node stay awake in RX for a receive window", true, "The node's own uplink is the moment the AP knows it is awake, so the downlink data follow inside that receive window."],
          ["It wakes the node up with a stronger signal", false, "A sleeping radio does not receive anything, however strong the signal."],
          ["It sends the data to a neighbour of the node", false, "There are no neighbours to relay through in a star topology."],
        ],
      },
      {
        q: "A node sends an uplink frame every 60 s. Downlink messages for it arrive at the AP at random times. What is the average downlink delay?",
        options: [
          ["About 60 s", false, "60 s is the worst case, for a message that arrives just after an uplink."],
          ["About 0 s", false, "The message has to wait for the next uplink."],
          ["About 120 s", false, "The next uplink is never more than one period away."],
          ["About 30 s", true, "A message arriving at a random moment waits uniformly between 0 and 60 s for the next uplink, 30 s on average. Delay for downlink traffic is listed as a disadvantage of this approach."],
        ],
      },
    ],

    contention: [
      {
        q: "When is a contention-free MAC (allocated slots) more efficient than CSMA/CA?",
        options: [
          ["At high traffic: no collisions, and every allocated slot is likely to be used", true, "With heavy traffic, contention leads to many collisions. Fixed slots stay collision-free and are rarely wasted."],
          ["With sporadic, unpredictable traffic", false, "Then most allocated slots stay empty, which is where contention-based access is better."],
          ["When the network changes often", false, "Contention-free MACs are less flexible: the slot allocation has to be updated, which costs overhead."],
          ["When there is strong external interference", false, "Slots are still vulnerable to external interference, which does not follow the schedule."],
        ],
      },
      {
        q: "In the slide's analogy \"car lanes vs bus lanes\", which one is the contention-free MAC?",
        options: [
          ["The car lanes", false, "Car lanes are shared by everyone who wants to drive: that is contention."],
          ["Both, since both are lanes", false, "The point is the difference between them."],
          ["Neither: the analogy is about speed", false, "It is about who may use the lane."],
          ["The bus lanes: reserved for specific vehicles, guaranteed free when a bus comes, and empty otherwise", true, "That is exactly the trade-off: guarantees for important users, wasted capacity when they have nothing to send."],
        ],
      },
    ],

    gts: [
      {
        q: "In the guaranteed time slot scheme, what happens if a device has nothing to send in its slot?",
        options: [
          ["Another device takes over the slot", false, "Nobody else is allowed in it, which is why the slot is guaranteed."],
          ["The slot stays idle", true, "The slot is reserved, so it is wasted when its owner is silent: inefficient for unpredictable traffic."],
          ["The AP uses it for retransmissions", false, "Not in this scheme. The slot belongs to its device."],
          ["The schedule is cancelled", false, "The schedule continues with the next beacon."],
        ],
      },
      {
        q: "Why must a device joining the network stay in RX mode until it receives the first beacon?",
        options: [
          ["To measure the channel's RSSI", false, "Useful, but not the reason. It needs the schedule."],
          ["Because beacons are only sent to new devices", false, "Beacons are broadcast periodically for everyone."],
          ["It does not know the schedule or the timing yet; the beacon tells it when its slot is", true, "Until it hears a beacon, it has no idea when to wake up or when it may transmit. TDMA needs a shared notion of time, as in Week 9."],
          ["To charge its battery from the beacon", false, "Radio beacons do not deliver useful energy to the device."],
        ],
      },
    ],

    "asym-summary": [
      {
        q: "Which of these is a disadvantage of radio duty cycling with asymmetric energy availability?",
        options: [
          ["It is complex to implement", false, "The slide lists \"simple to implement and maintain\" as an advantage."],
          ["The end devices consume a lot of energy", false, "It is very energy-efficient for end devices."],
          ["It cannot support device-to-device and multi-hop (mesh) topologies", true, "Every exchange needs a receiver that is always listening, and only the AP is. Delay for downlink traffic is another disadvantage."],
          ["Synchronisation is the devices' problem", false, "The overhead of synchronisation falls on the AP/GW, which is an advantage for the devices."],
        ],
      },
      {
        q: "Which technology is <em>not</em> listed on the slide as using a variation of this paradigm?",
        options: [
          ["BLE (Bluetooth Low Energy)", false, "BLE is on the slide's list: a phone or gateway listens, the peripheral sleeps."],
          ["LoRaWAN", false, "LoRaWAN is on the slide's list: battery-powered end devices, always-listening gateways."],
          ["IEEE 802.15.4 (Zigbee, Thread)", false, "IEEE 802.15.4 is on the slide's list, with Zigbee and Thread as examples."],
          ["Wired Ethernet", true, "Ethernet is wired (Week 7) and does not duty cycle a radio. The slide lists IEEE 802.15.4, BLE, LoRaWAN and low-power WiFi."],
        ],
      },
    ],

    "multi-hop": [
      {
        q: "A frame from D1 crosses 3 hops to reach the GW. How many times is it transmitted, at least?",
        options: [
          ["Once, since the others only listen", false, "In multi-hop every relay receives the frame and transmits it again."],
          ["3 times: once per hop", true, "Each hop is one transmission (and one reception). That is the cost increase the slide mentions, before counting any retransmissions."],
          ["6 times", false, "6 counts receptions as transmissions. Each hop has one of each."],
          ["9 times", false, "Nothing grows quadratically here; each hop adds one transmission."],
        ],
      },
      {
        q: "Why can multi-hop reduce the total cost even though frames are transmitted several times?",
        options: [
          ["Relays compress the frames", false, "Relays forward frames on behalf of others; they do not compress them."],
          ["Multi-hop links use a different frequency band", false, "They usually use the same radio and band."],
          ["Relays transmit at higher power", false, "Shorter hops typically allow the same or less power."],
          ["Short links are more robust than long links, so fewer retransmissions are needed", true, "A long, weak link may need many attempts (or never work). Several short, strong links can need fewer transmissions in total."],
        ],
      },
    ],

    symmetric: [
      {
        q: "When are the energy limitations symmetric?",
        options: [
          ["When both transmitter and receiver must duty cycle their radios, as in multi-hop topologies or a star with a battery-powered GW", true, "Then nobody can afford to listen all the time, and the two sides must somehow meet."],
          ["When both devices use the same frequency band", false, "Symmetry here refers to the energy constraints, not to frequencies."],
          ["When the AP is mains-powered", false, "That is the asymmetric case of the previous part."],
          ["When devices transmit and receive at the same current", false, "Similar TX and RX currents are common, but the term is about which side has an energy limitation."],
        ],
      },
      {
        q: "Alice and Bob keep their battery-powered walkie-talkies off as much as possible. What must they agree on before they separate?",
        options: [
          ["Only the channel to use", false, "Necessary, but not enough: if one radio is off while the other speaks, the message is lost."],
          ["A radio duty cycle strategy, so that one is listening when the other speaks", true, "That is the question the slide poses. The rest of the lecture answers it: asynchronous schemes (sender- or receiver-initiated, wakeup radio) or synchronous schedules."],
          ["To speak louder", false, "Volume does not help when the other walkie-talkie is off."],
          ["Nothing: walkie-talkies always hear each other", false, "Only while switched on and in listen mode, which is what they want to avoid."],
        ],
      },
    ],

    "sender-initiated": [
      {
        q: "In low-power listening (preamble sampling), how long does a sender transmit preambles on average before the receiver wakes up?",
        options: [
          ["About half of the listening PERIOD", true, "The receiver samples the channel once per PERIOD at a moment the sender does not know. Data appear at a random point, so the wait is uniform between 0 and one PERIOD: half on average, a full PERIOD in the worst case."],
          ["One full PERIOD every time", false, "A full PERIOD is the worst case, when the receiver has just finished sampling."],
          ["No time: the receiver is always listening", false, "In this scheme the receiver only samples briefly once per PERIOD."],
          ["Exactly the length of one frame", false, "The preamble or RTS train lasts until the receiver's next sample, which has nothing to do with the frame length."],
        ],
      },
      {
        q: "What does making the listening PERIOD longer do?",
        options: [
          ["It increases the receivers' idle listening", false, "A longer PERIOD means fewer channel samples, so less idle listening."],
          ["It reduces idle listening for the receivers, but increases the sender's delay and energy", true, "The PERIOD bounds idle listening and defines the sender's delay and energy cost (slide 34). Light traffic favours a long PERIOD, heavy traffic a short one."],
          ["It has no effect on the sender", false, "The sender has to keep strobing until the receiver's next sample, so a longer PERIOD costs it more."],
          ["It reduces both delay and energy for everyone", false, "There is a trade-off: the receivers save, the sender pays."],
        ],
      },
    ],

    "receiver-initiated": [
      {
        q: "In receiver-initiated asynchronous MAC, what does an idle node do periodically?",
        options: [
          ["It sends a preamble to all neighbours", false, "That is the sender-initiated scheme. Here the receiver takes the initiative."],
          ["It transmits a beacon (CTS, clear to send) and keeps its radio in RX for a short while", true, "A node with data listens until it hears the beacon of its destination and then sends the frame."],
          ["It stays in RX mode permanently", false, "That would remove the duty cycle and its energy savings."],
          ["It synchronises its clock with the AP", false, "The scheme is asynchronous: the duty cycles are not synchronised."],
        ],
      },
      {
        q: "How does the slide compare receiver-initiated and sender-initiated approaches?",
        options: [
          ["Receiver-initiated is always better", false, "The slide says their performance is comparable."],
          ["Sender-initiated is always better", false, "Again, comparable."],
          ["Receiver-initiated needs time synchronisation", false, "Both are asynchronous."],
          ["Their performance is comparable", true, "Both are bounded by the listening PERIOD. Who pays the waiting differs: in sender-initiated the sender transmits preambles, in receiver-initiated the sender listens for the beacon."],
        ],
      },
    ],

    "wakeup-radio": [
      {
        q: "Why can a wakeup radio be kept listening all the time?",
        options: [
          ["It has a very low power consumption, because it only supports very low data rates (just enough for an ID) and limited coverage", true, "Those are the slide's three properties: very low power, very low data rate, typically limited coverage."],
          ["It is powered by the received signal", false, "Some research designs harvest energy, but the slide describes a very low-power radio, not a free one."],
          ["It only listens once per PERIOD", false, "It listens continuously, which is what removes the PERIOD delay."],
          ["It uses the main radio's antenna at higher gain", false, "The figure shows separate antennas for the main radio and the wakeup radio."],
        ],
      },
      {
        q: "In the slide 36 timeline, what does the RTS sent on the wakeup radio trigger?",
        options: [
          ["The receiver puts its main radio in RX mode and waits for the frame", true, "The sender then switches its main radio to TX and sends the frame, and the receiver answers with an ACK on the main radio."],
          ["The receiver sends its data back on the wakeup radio", false, "The wakeup radio only carries the short RTS; data go over the main radio."],
          ["All nodes in range wake up their main radios", false, "The RTS carries an ID, so only the addressed node wakes up."],
          ["Nothing until the next PERIOD", false, "There is no PERIOD to wait for: the wakeup radio is always listening."],
        ],
      },
    ],

    synchronous: [
      {
        q: "What does synchronous MAC require that asynchronous MAC does not?",
        options: [
          ["A wakeup radio", false, "That is a different, asynchronous approach."],
          ["A mains-powered AP", false, "Synchronous duty cycling is meant for the symmetric case, where nobody is mains-powered."],
          ["A common notion of time, kept by periodic time synchronisation", true, "Nodes must agree when the active periods start, which needs the time synchronisation of Week 9, repeated periodically because clocks drift."],
          ["CSMA/CA inside the active period", false, "The active period can use any MAC scheme, CSMA/CA or guaranteed time slots."],
        ],
      },
      {
        q: "Two nodes with ±20 ppm crystals resynchronise every 10 s. What is the worst-case drift between them just before the next synchronisation?",
        options: [
          ["About 0.2 ms", false, "That is the drift of one clock against perfect time. The two clocks can drift in opposite directions."],
          ["About 4 ms", false, "Check the powers of ten: 40 × 10" + sup("-6") + " × 10 s = 4 × 10" + sup("-4") + " s."],
          ["40 s", false, "ppm means parts per million, so drift is a tiny fraction of the interval."],
          ["About 0.4 ms", true, "Relative drift up to 2 × 20 = 40 ppm (Week 9), times 10 s = 400 µs. Each node must wake up that much earlier (a guard time) so it does not miss the start of the active period."],
        ],
      },
    ],

    "mac-classes": [
      {
        q: "A star network whose GW is mains-powered while the sensors run on batteries belongs to which class?",
        options: [
          ["No energy constraints: no duty cycle", false, "The sensors are battery-powered, so they have constraints."],
          ["Energy constraints only on end devices: the end devices duty cycle", true, "That is the asymmetric case: duty-cycled CSMA, guaranteed time slots, and technologies such as BLE or LoRaWAN."],
          ["Energy constraints on all devices: synchronous duty cycles", false, "The GW has no constraint, so it can stay awake."],
          ["Energy constraints on all devices: wakeup radio", false, "A wakeup radio is for when every device has to save energy."],
        ],
      },
      {
        q: "Which three asynchronous duty cycle approaches does the lecture classify?",
        options: [
          ["CSMA/CA, TDMA and FDMA", false, "Those are ways of handling contention and sharing the medium, a separate axis of the classification."],
          ["Star, tree and mesh", false, "Those are topologies."],
          ["BLE, Zigbee and LoRaWAN", false, "Those are technologies."],
          ["Sender-initiated, receiver-initiated and wakeup radio", true, "All three let duty-cycled nodes meet without agreeing on a schedule. The alternative is synchronous duty cycles."],
        ],
      },
    ],
  };

  /* =====================================================================
     Helpers
     ===================================================================== */
  const C_LIGHT = 299792458;
  const dbmToMw = (x) => Math.pow(10, x / 10);
  const mwToDbm = (p) => 10 * Math.log10(p);
  const dbSum = (list) => mwToDbm(list.reduce((s, x) => s + dbmToMw(x), 0));
  const fspl1m = (f) => 20 * Math.log10((4 * Math.PI * f) / C_LIGHT);
  const nice = (e) => { const v = Math.pow(10, e); const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
  const sig = (v, d) => { const a = Math.abs(v); if (a === 0) return "0"; const p = Math.max(0, (d || 3) - 1 - Math.floor(Math.log10(a))); return v.toFixed(Math.min(p, 6)); };

  function fmtW(mW) {
    const W = mW / 1000;
    const P = [[1e24, "YW"], [1e21, "ZW"], [1e18, "EW"], [1e15, "PW"], [1e12, "TW"], [1e9, "GW"], [1e6, "MW"], [1e3, "kW"], [1, "W"], [1e-3, "mW"], [1e-6, "µW"], [1e-9, "nW"], [1e-12, "pW"], [1e-15, "fW"], [1e-18, "aW"], [1e-21, "zW"]];
    for (const [k, u] of P) if (W >= k * 0.9995) return sig(W / k, 3) + " " + u;
    return W.toExponential(2) + " W";
  }
  function fmtCur(mA) {
    if (mA >= 1) return sig(mA, 3) + " mA";
    if (mA >= 1e-3) return sig(mA * 1000, 3) + " µA";
    return sig(mA * 1e6, 3) + " nA";
  }
  function fmtLife(hours) {
    if (!isFinite(hours)) return "unlimited";
    if (hours < 48) return sig(hours, 3) + " h";
    if (hours < 24 * 90) return sig(hours / 24, 3) + " days";
    if (hours < 24 * 365 * 2) return sig(hours / (24 * 30.44), 3) + " months";
    return sig(hours / (24 * 365.25), 3) + " years";
  }
  function fmtTime(ms) {
    if (ms < 1) return sig(ms * 1000, 3) + " µs";
    if (ms < 1000) return sig(ms, 3) + " ms";
    if (ms < 120000) return sig(ms / 1000, 3) + " s";
    if (ms < 7200000) return sig(ms / 60000, 3) + " min";
    return sig(ms / 3600000, 3) + " h";
  }
  const fmtDb = (x, dp) => (x > 0 ? "+" : "") + x.toFixed(dp == null ? 1 : dp) + " dB";
  const fmtDbm = (x, dp) => x.toFixed(dp == null ? 1 : dp) + " dBm";

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
  function textInput(parent, o) {
    const id = "wn-in-" + Math.random().toString(36).slice(2, 8);
    const input = h("input", { id, type: "text", class: "wn-text", value: o.value, maxlength: o.max || 16, spellcheck: "false", autocomplete: "off" });
    parent.append(h("div", { class: "ctl" }, [h("label", { class: "ctl-label", for: id }, [h("span", { html: o.label })]), input]));
    return input;
  }

  /* Radio-state timelines in the slides' colours (blue transmit, green receive, yellow listen, hatched sleep). */
  const STATE_VAR = { tx: "--wn-tx", rx: "--wn-rx", listen: "--wn-listen", sleep: "--wn-sleep", wtx: "--wn-wtx", wrx: "--wn-wrx" };
  function drawBlock(ctx, x, y, w, hgt, st, label, flag) {
    ctx.fillStyle = NES.css(STATE_VAR[st] || "--wn-sleep");
    ctx.fillRect(x, y, w, hgt);
    if (st === "sleep") {
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, hgt); ctx.clip();
      ctx.strokeStyle = NES.css("--wn-hatch"); ctx.lineWidth = 1;
      for (let k = x - hgt; k < x + w; k += 5) { ctx.beginPath(); ctx.moveTo(k, y + hgt); ctx.lineTo(k + hgt, y); ctx.stroke(); }
      ctx.restore();
    }
    ctx.strokeStyle = flag === "bad" ? NES.css("--bad") : NES.css("--wn-edge");
    ctx.lineWidth = flag === "bad" ? 2 : 1;
    ctx.strokeRect(x + 0.5, y + 0.5, Math.max(0, w - 1), hgt - 1);
    if (label) {
      ctx.font = "10.5px " + NES.css("--font");
      if (ctx.measureText(label).width + 6 <= w) text(ctx, label, x + w / 2, y + hgt / 2, flag === "bad" ? NES.css("--bad") : NES.css("--wn-label"), "center", 10.5, flag === "bad");
    }
  }
  function drawTimeline(ctx, w, hh, rows, span, opt) {
    opt = opt || {};
    const padL = opt.padL == null ? 50 : opt.padL, padR = 6, padT = 4, padB = opt.axis ? 18 : 4;
    const rowH = (hh - padT - padB) / rows.length, bh = Math.min(24, rowH - 6);
    const X = (t) => padL + (t / span) * (w - padL - padR);
    rows.forEach((r, i) => {
      const yc = padT + rowH * (i + 0.5);
      text(ctx, r.name, 2, yc, NES.css("--tech"), "left", 11, true);
      if (r.base) drawBlock(ctx, X(0), yc - bh / 2, X(span) - X(0), bh, r.base);
      r.segs.forEach(([t0, t1, st, label, flag]) => {
        const x0 = X(Math.max(0, t0)), x1 = X(Math.min(t1, span));
        const minW = opt.minW || 0;
        if (x1 - x0 <= 0 && !minW) return;
        drawBlock(ctx, x0, yc - bh / 2, Math.max(x1 - x0, minW), bh, st, label, flag);
      });
    });
    if (opt.axis) opt.axis(X, hh - 8);
    return X;
  }
  function stateLegend(states) {
    const names = { tx: "transmit", rx: "receive", listen: "listen", sleep: "sleep", wtx: "transmit (wakeup)", wrx: "receive (wakeup)" };
    return h("div", { class: "legend", html: states.map((s) => `<span><i class="wn-sw wn-sw-${s}"></i>${names[s]}</span>`).join("") });
  }

  /* Generic sorter: classify scenarios into categories, one at a time. */
  function sorterLab(el, cfg) {
    const { controls, view } = NES.lab(el, { title: cfg.title, hint: cfg.hint });
    const stats = NES.stats(controls, [{ key: "n", label: "Progress" }, { key: "ok", label: "Right on first try" }]);
    const restart = h("button", { class: "btn", type: "button", text: "Start over" });
    controls.append(restart);
    const card = h("div", { class: "stage wn-sort" });
    const item = h("p", { class: "wn-sort-item" });
    const btns = cfg.choices.map(([key, label]) => h("button", { type: "button", class: "btn wn-choice", text: label, "data-k": key }));
    card.append(item, h("div", { class: "wn-choices wn-choices-" + cfg.choices.length }, btns));
    view.append(card);
    const verdict = verdictBox(view);
    const next = h("button", { type: "button", class: "btn", text: "Next" });
    view.append(next);
    let i = 0, right = 0, answered = false;
    function show() {
      const done = i >= cfg.items.length;
      item.textContent = done ? "All done." : cfg.items[i][0];
      btns.forEach((b) => { b.disabled = done; b.className = "btn wn-choice"; });
      next.style.display = "none";
      answered = false;
      stats.set("n", Math.min(i + 1, cfg.items.length) + " / " + cfg.items.length);
      stats.set("ok", String(right), done ? (right === cfg.items.length ? "good" : "warn") : "");
      if (done) setVerdict(verdict, right === cfg.items.length ? "good" : "warn", "<b>" + right + " of " + cfg.items.length + " right first time.</b> " + cfg.summary);
      else setVerdict(verdict, "", cfg.ask);
    }
    function pick(b) {
      if (i >= cfg.items.length) return;
      const [, ans, why] = cfg.items[i];
      const ok = b.dataset.k === ans;
      if (!answered && ok) right++;
      answered = true;
      b.classList.add(ok ? "right" : "wrong");
      setVerdict(verdict, ok ? "good" : "bad", "<b>" + (ok ? "Correct." : "Not quite.") + "</b> " + why);
      stats.set("ok", String(right));
      if (ok) { btns.forEach((x) => (x.disabled = true)); next.style.display = ""; }
    }
    btns.forEach((b) => b.addEventListener("click", () => pick(b)));
    next.addEventListener("click", () => { i++; show(); });
    restart.addEventListener("click", () => { i = 0; right = 0; show(); });
    show();
  }

  function labSortWired(el) {
    sorterLab(el, {
      title: "Wired or wireless?",
      hint: "Slide 3 gives reasons for each. Pick the better fit for every scenario.",
      ask: "Which kind of network fits this scenario better?",
      choices: [["wireless", "Wireless"], ["wired", "Wired"]],
      items: [
        ["A heart-rate sensor in a running watch", "wireless", "A wearable is mobile, so wireless is necessary: nobody runs with a cable."],
        ["Soil-moisture sensors spread over a farm, far from any network infrastructure", "wireless", "Wireless is necessary where there is no easy access to infrastructure."],
        ["Safety-critical brake signals between ECUs inside a car", "wired", "Reliability comes first, so the in-car CAN bus of Week 7 is wired: less vulnerable to interference and noise."],
        ["Adding a temperature sensor to every room of an old building", "wireless", "No new cables through old walls: wireless is cheaper, more flexible and easier to install."],
        ["A door-lock controller that must resist tampering", "wired", "Wired is more secure: less vulnerable to physical attacks such as jamming or eavesdropping from outside."],
        ["Tracking the position of delivery vans across a city", "wireless", "Vehicles are mobile embedded systems, the slide's own example where wireless is necessary."],
        ["Machine interlocks in a factory hall full of electrical noise", "wired", "A wired link is less vulnerable to interference and environmental noise."],
      ],
      summary: "Wireless when it is necessary (mobility, no infrastructure) or simply cheaper and easier; wired when reliability or security matter most.",
    });
  }

  /* =====================================================================
     LAB: decibel rules of thumb
     ===================================================================== */
  function decompose(n) {
    let best = null;
    for (let a = -6; a <= 6; a++) {
      const r = n - 10 * a;
      if (r % 3 !== 0) continue;
      const b = r / 3, cost = Math.abs(a) + Math.abs(b);
      if (!best || cost < best.cost) best = { a, b, cost };
    }
    return best;
  }
  function labDb(el) {
    const { controls, view } = NES.lab(el, {
      title: "Decibels with the rules of thumb",
      hint: "Pick a gain (+) or loss (-) in dB. It is broken into the slide's steps: +10 dB is ×10, +3 dB is ×2. Start with the slide's question: +17 dB.",
    });
    const db = NES.slider(controls, { label: "Gain or loss", min: -30, max: 30, step: 1, value: 17, fmt: (v) => (v > 0 ? "+" : "") + v + " dB" });
    const steps = h("div", { class: "wn-steps", "aria-label": "Rule of thumb steps" });
    view.append(h("div", { class: "stage" }, [steps]));
    const stats = NES.stats(view, [
      { key: "rule", label: "Rule of thumb" },
      { key: "exact", label: "Exact factor 10<sup>dB/10</sup>" },
      { key: "err", label: "Rule-of-thumb error" },
    ]);
    const verdict = verdictBox(view);
    function update() {
      const n = db.value, d = decompose(n);
      const parts = [];
      for (let k = 0; k < Math.abs(d.a); k++) parts.push(d.a > 0 ? ["+10 dB", "×10", "hi"] : ["-10 dB", "÷10", "lo"]);
      for (let k = 0; k < Math.abs(d.b); k++) parts.push(d.b > 0 ? ["+3 dB", "×2", "hi"] : ["-3 dB", "÷2", "lo"]);
      steps.innerHTML = parts.length ? parts.map(([a, b, c]) => `<span class="wn-step ${c}"><b>${a}</b><i>${b}</i></span>`).join("") : `<span class="wn-step"><b>0 dB</b><i>×1</i></span>`;
      const approx = Math.pow(10, d.a) * Math.pow(2, d.b), exact = Math.pow(10, n / 10);
      const show = (v) => (v >= 1 ? "×" + sig(v, 3) : "÷" + sig(1 / v, 3));
      stats.set("rule", show(approx));
      stats.set("exact", show(exact));
      const err = (approx / exact - 1) * 100;
      stats.set("err", (err >= 0 ? "+" : "") + err.toFixed(1) + "%", Math.abs(err) < 5 ? "good" : "warn");
      setVerdict(verdict, "", "<b>" + (n > 0 ? "+" : "") + n + " dB = " + parts.map((p) => p[0]).join(" ") + "</b>" + (parts.length ? " so the power is " + parts.map((p) => p[1]).join(" ") + " = " + show(approx) + "." : ".") +
        " Adding in the log domain is multiplying in the linear domain. (The slide's balloon example: 0.2 W shrinking to 0.1 pW is a factor 2 × 10<sup>12</sup>, or -123 dB.)");
    }
    db.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: dBm and milliwatts
     ===================================================================== */
  const DBM_REF = [
    [30, "WiFi router max"], [27, "phone max"], [0, "small embedded TX"], [-20, "WiFi, very close"], [-97, "sensitivity (slide 12)"], [-100, "WiFi minimum"],
  ];
  function labDbm(el) {
    const { controls, view } = NES.lab(el, {
      title: "Absolute power in dBm",
      hint: "dBm is power relative to 1 mW. Set a power, then pass it through an amplifier or attenuator: gains and losses in dB simply add to the dBm value.",
    });
    const p = NES.slider(controls, { label: "Input power", min: -120, max: 40, step: 1, value: -10, fmt: (v) => v + " dBm" });
    const g = NES.seg(controls, { label: "Then apply", options: [[0, "0 dB"], [3, "+3 dB"], [-3, "-3 dB"], [10, "+10 dB"], [-10, "-10 dB"]], value: 3 });
    const cv = h("canvas", { style: "height:150px", "aria-label": "dBm scale with reference powers" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [
      { key: "in", label: "Input in watts" },
      { key: "out", label: "Output" },
      { key: "outw", label: "Output in watts" },
    ]);
    const verdict = verdictBox(view);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const lo = -130, hi = 40, padL = 10, padR = 10, yAxis = hh - 30;
      const X = (v) => padL + ((v - lo) / (hi - lo)) * (w - padL - padR);
      line(ctx, X(lo), yAxis, X(hi), yAxis, NES.css("--line-2"), 2);
      for (let v = -120; v <= 40; v += 40) { line(ctx, X(v), yAxis - 4, X(v), yAxis + 4, NES.css("--muted")); text(ctx, v + " dBm", X(v), yAxis + 14, NES.css("--muted"), v === -120 ? "left" : v === 40 ? "right" : "center", 10); }
      const narrow = w < 520;
      DBM_REF.forEach(([v, label], i) => {
        const x = X(v), y = 14 + (i % 3) * 22;
        line(ctx, x, y + 7, x, yAxis, NES.css("--grid"), 1, [2, 3]);
        const lab = narrow ? v + "" : label;
        text(ctx, lab, x, y, NES.css("--muted"), x < 70 ? "left" : x > w - 70 ? "right" : "center", 10);
      });
      const vin = p.value, vout = p.value + g.value;
      [[vin, "--tech", "in"], [vout, "--accent", "out"]].forEach(([v, c, l], k) => {
        if (v < lo || v > hi) return;
        ctx.fillStyle = NES.css(c); ctx.beginPath(); ctx.arc(X(v), yAxis, k ? 6 : 5, 0, Math.PI * 2); ctx.fill();
      });
    });
    function update() {
      const vin = p.value, vout = vin + g.value;
      stats.set("in", fmtW(dbmToMw(vin)));
      stats.set("out", vout + " dBm");
      stats.set("outw", fmtW(dbmToMw(vout)));
      const near = DBM_REF.reduce((b, r) => (Math.abs(r[0] - vout) < Math.abs(b[0] - vout) ? r : b));
      setVerdict(verdict, "", "<b>" + vin + " dBm " + (g.value ? (g.value > 0 ? "+ " : "- ") + Math.abs(g.value) + " dB " : "") + "= " + vout + " dBm</b> (" + fmtW(dbmToMw(vout)) + "). " +
        (vin === -10 && g.value === 3 ? "This is the slide's example: -10 dBm (0.1 mW) through a 3 dB amplifier gives -7 dBm, about 0.2 mW. " : "") +
        "Closest reference from the slide's table: " + near[1] + " (" + near[0] + " dBm). The table spans 296 dBm (the sun) to -174 dBm (thermal noise, per hertz of bandwidth): 470 dB of range.");
      draw();
    }
    p.onchange = g.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: link budget waterfall
     ===================================================================== */
  function labBudget(el) {
    const { controls, view } = NES.lab(el, {
      title: "Add up a link budget",
      hint: "P<sub>RX</sub> = P<sub>TX</sub> + G<sub>TX</sub> - L<sub>TX</sub> - L<sub>P</sub> + G<sub>RX</sub> - L<sub>RX</sub>. Everything is in dB, so the chain is a plain sum. The defaults match the quiz below.",
    });
    const g1 = NES.group(controls, "Transmitter");
    const ptx = NES.slider(g1, { label: "P<sub>TX</sub>", min: -20, max: 20, step: 1, value: 0, fmt: (v) => v + " dBm" });
    const gtx = NES.slider(g1, { label: "G<sub>TX</sub>", min: 0, max: 12, step: 1, value: 2, fmt: (v) => v + " dBi" });
    const ltx = NES.slider(g1, { label: "L<sub>TX</sub>", min: 0, max: 5, step: 0.5, value: 1, fmt: (v) => v + " dB" });
    const lp = NES.slider(controls, { label: "Path loss L<sub>P</sub>", min: 40, max: 130, step: 1, value: 90, fmt: (v) => v + " dB" });
    const g2 = NES.group(controls, "Receiver");
    const grx = NES.slider(g2, { label: "G<sub>RX</sub>", min: 0, max: 12, step: 1, value: 2, fmt: (v) => v + " dBi" });
    const lrx = NES.slider(g2, { label: "L<sub>RX</sub>", min: 0, max: 5, step: 0.5, value: 1, fmt: (v) => v + " dB" });
    const sens = NES.slider(g2, { label: "Sensitivity", min: -110, max: -80, step: 1, value: -97, fmt: (v) => v + " dBm" });
    const cv = h("canvas", { style: "height:240px", "aria-label": "Link budget waterfall" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "prx", label: "Received power P<sub>RX</sub>" }, { key: "m", label: "Margin" }, { key: "max", label: "Max tolerable path loss" }]);
    const verdict = verdictBox(view);
    const steps = () => [["P_TX", ptx.value], ["+G_TX", gtx.value], ["-L_TX", -ltx.value], ["-L_P", -lp.value], ["+G_RX", grx.value], ["-L_RX", -lrx.value]];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const lo = -130, hi = 30, padL = 44, padR = 8, padT = 10, padB = 26;
      const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (hh - padT - padB);
      for (let v = -120; v <= 20; v += 20) { line(ctx, padL, Y(v), w - padR, Y(v), NES.css("--grid")); text(ctx, String(v), padL - 6, Y(v), NES.css("--muted"), "right", 10); }
      text(ctx, "dBm", padL - 6, padT + 2, NES.css("--muted"), "right", 10);
      const s = steps(), cols = s.length + 1, cw = (w - padL - padR) / cols;
      let level = 0;
      s.forEach(([name, val], i) => {
        const from = i === 0 ? 0 : level, to = i === 0 ? val : level + val;
        const x = padL + i * cw + cw * 0.18, bw = cw * 0.64;
        const top = Y(Math.max(from, to)), bot = Y(Math.min(from, to));
        ctx.fillStyle = NES.css(i === 0 ? "--tech" : val >= 0 ? "--ok" : "--bad");
        ctx.globalAlpha = i === 0 ? 0.85 : 0.75;
        ctx.fillRect(x, i === 0 ? Y(Math.max(val, lo)) : top, bw, i === 0 ? Y(lo) - Y(Math.max(val, lo)) : Math.max(2, bot - top));
        ctx.globalAlpha = 1;
        if (i > 0) line(ctx, x - cw * 0.36, Y(from), x, Y(from), NES.css("--muted"), 1, [2, 2]);
        level = to;
        text(ctx, name.replace("_", ""), x + bw / 2, hh - 12, NES.css("--muted"), "center", w < 480 ? 9 : 10);
      });
      const x = padL + s.length * cw + cw * 0.18, bw = cw * 0.64;
      const ok = level >= sens.value;
      ctx.fillStyle = NES.css(ok ? "--accent" : "--bad");
      ctx.fillRect(x, Y(Math.max(level, lo)), bw, Y(lo) - Y(Math.max(level, lo)));
      text(ctx, "PRX", x + bw / 2, hh - 12, NES.css("--ink"), "center", w < 480 ? 9 : 10, true);
      line(ctx, padL, Y(sens.value), w - padR, Y(sens.value), NES.css("--warn"), 1.5, [6, 4]);
      text(ctx, "sensitivity " + sens.value + " dBm", w - padR, Y(sens.value) - 8, NES.css("--warn"), "right", 10);
    });
    function update() {
      const prx = ptx.value + gtx.value - ltx.value - lp.value + grx.value - lrx.value;
      const m = prx - sens.value, maxLp = ptx.value + gtx.value - ltx.value + grx.value - lrx.value - sens.value;
      stats.set("prx", fmtDbm(prx));
      stats.set("m", fmtDb(m), m >= 10 ? "good" : m >= 0 ? "warn" : "bad");
      stats.set("max", maxLp.toFixed(1) + " dB");
      if (m < 0) setVerdict(verdict, "bad", "<b>Below sensitivity by " + (-m).toFixed(1) + " dB.</b> The receiver perceives the signal as noise. Raise the power, use better antennas, or reduce the path loss (shorter distance, fewer obstacles, lower frequency).");
      else if (m < 10) setVerdict(verdict, "warn", "<b>Received, but only " + m.toFixed(1) + " dB above sensitivity.</b> Fading of a few dB (slide 9) or some interference (slide 12) could push the link below the threshold.");
      else setVerdict(verdict, "good", "<b>" + m.toFixed(1) + " dB of margin.</b> The link can absorb that much extra fading or path loss before packets start to be lost.");
      draw();
    }
    [ptx, gtx, ltx, lp, grx, lrx, sens].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: path loss vs distance, frequency and environment, plus fading
     ===================================================================== */
  const BANDS_PL = [[433e6, "433 MHz"], [868e6, "868 MHz"], [2.44e9, "2.4 GHz"], [5.8e9, "5.8 GHz"]];
  function labPathloss(el) {
    const { controls, view } = NES.lab(el, {
      title: "Path loss: distance, frequency and a real room",
      hint: "Model: free-space loss at 1 m, then 10·n·log<sub>10</sub>(d) with the path-loss exponent n of the environment. Link: 0 dBm, 0 dBi antennas, sensitivity -97 dBm. The lower plot adds random shadowing and multipath fading at the chosen distance.",
    });
    const d = NES.slider(controls, { label: "Distance", min: 0, max: 3, step: 0.01, value: Math.log10(50), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => (v >= 1000 ? "1 km" : v + " m") });
    const f = NES.seg(controls, { label: "Frequency", options: BANDS_PL.map(([v, l]) => [v, l]), value: 2.44e9 });
    const n = NES.seg(controls, { label: "Environment (exponent n)", options: [[2, "free space (2)"], [3, "indoor (3)"], [4, "obstructed (4)"]], value: 3 });
    const fade = NES.slider(controls, { label: "Shadowing σ", min: 0, max: 10, step: 0.5, value: 4, fmt: (v) => v + " dB" });
    const reroll = h("button", { class: "btn", type: "button", text: "New random room" });
    controls.append(reroll);
    const cv = h("canvas", { style: "height:200px", "aria-label": "RSSI versus distance" });
    const cv2 = h("canvas", { style: "height:120px", "aria-label": "RSSI over time at the chosen distance" });
    view.append(h("div", { class: "stage" }, [cv]), h("div", { class: "stage" }, [cv2]));
    const stats = NES.stats(view, [{ key: "pl", label: "Mean path loss" }, { key: "rssi", label: "Mean RSSI" }, { key: "range", label: "Range (mean RSSI = -97)" }, { key: "out", label: "Time below sensitivity" }]);
    const verdict = verdictBox(view);
    const SENS = -97, PTX = 0;
    let seed = 11, trace = [];
    const loss = (dist) => fspl1m(f.value) + 10 * n.value * Math.log10(Math.max(1, dist));
    function regen() {
      const r = NES.rng(seed); let sh = 0; trace = [];
      for (let i = 0; i < 300; i++) {
        sh = 0.97 * sh + Math.sqrt(1 - 0.97 * 0.97) * NES.gauss(r);
        const re = NES.gauss(r), im = NES.gauss(r);
        const mp = 10 * Math.log10((re * re + im * im) / 2 + 1e-9);
        trace.push([sh, mp]);
      }
    }
    regen();
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 8, padT = 10, padB = 22, lo = -140, hi = -20;
      const X = (dist) => padL + (Math.log10(dist) / 3) * (w - padL - padR);
      const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (hh - padT - padB);
      for (let v = -140; v <= -20; v += 20) { line(ctx, padL, Y(v), w - padR, Y(v), NES.css("--grid")); text(ctx, String(v), padL - 5, Y(v), NES.css("--muted"), "right", 10); }
      [1, 10, 100, 1000].forEach((dd) => { line(ctx, X(dd), padT, X(dd), hh - padB, NES.css("--grid")); text(ctx, dd >= 1000 ? "1 km" : dd + " m", X(dd), hh - 9, NES.css("--muted"), dd === 1 ? "left" : dd === 1000 ? "right" : "center", 10); });
      line(ctx, padL, Y(SENS), w - padR, Y(SENS), NES.css("--warn"), 1.5, [6, 4]);
      text(ctx, "-97 dBm", w - padR, Y(SENS) - 8, NES.css("--warn"), "right", 10);
      const curve = (nn, color, lw, dash) => {
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash || []); ctx.beginPath();
        for (let k = 0; k <= 120; k++) { const dd = Math.pow(10, (3 * k) / 120); const v = PTX - (fspl1m(f.value) + 10 * nn * Math.log10(dd)); const y = Y(Math.max(lo, v)); k ? ctx.lineTo(X(dd), y) : ctx.moveTo(X(dd), y); }
        ctx.stroke(); ctx.setLineDash([]);
      };
      if (n.value !== 2) curve(2, NES.css("--muted"), 1.2, [4, 4]);
      curve(n.value, NES.css("--tech"), 2.2);
      const v = PTX - loss(d.value);
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(d.value), Y(Math.max(lo, v)), 5, 0, Math.PI * 2); ctx.fill();
    });
    const draw2 = NES.canvas(cv2, (ctx, w, hh) => {
      const padL = 40, padR = 8, padT = 8, padB = 16;
      const mean = PTX - loss(d.value), lo = mean - 40, hi = mean + 15;
      const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (hh - padT - padB);
      const X = (i) => padL + (i / (trace.length - 1)) * (w - padL - padR);
      text(ctx, Math.round(hi) + "", padL - 5, Y(hi) + 4, NES.css("--muted"), "right", 10);
      text(ctx, Math.round(lo) + "", padL - 5, Y(lo) - 4, NES.css("--muted"), "right", 10);
      if (SENS > lo && SENS < hi) { line(ctx, padL, Y(SENS), w - padR, Y(SENS), NES.css("--warn"), 1.5, [6, 4]); }
      line(ctx, padL, Y(mean), w - padR, Y(mean), NES.css("--muted"), 1, [2, 3]);
      ctx.strokeStyle = NES.css("--lo"); ctx.lineWidth = 1.1; ctx.beginPath();
      trace.forEach(([sh, mp], i) => { const v = mean + fade.value * sh + (fade.value > 0 ? mp : 0); const y = Y(Math.max(lo, Math.min(hi, v))); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); });
      ctx.stroke();
      text(ctx, "RSSI over time, same distance", padL + 4, hh - 6, NES.css("--muted"), "left", 10);
    });
    function update() {
      const pl = loss(d.value), rssi = PTX - pl;
      const range = Math.pow(10, (PTX - SENS - fspl1m(f.value)) / (10 * n.value));
      let below = 0;
      trace.forEach(([sh, mp]) => { if (rssi + fade.value * sh + (fade.value > 0 ? mp : 0) < SENS) below++; });
      const out = below / trace.length;
      stats.set("pl", pl.toFixed(1) + " dB");
      stats.set("rssi", fmtDbm(rssi), rssi >= SENS + 10 ? "good" : rssi >= SENS ? "warn" : "bad");
      stats.set("range", range >= 1000 ? sig(range / 1000, 3) + " km" : sig(range, 3) + " m");
      stats.set("out", (out * 100).toFixed(0) + "%", out < 0.02 ? "good" : out < 0.2 ? "warn" : "bad");
      setVerdict(verdict, out < 0.02 ? "good" : out < 0.2 ? "warn" : "bad", "<b>At " + d.value + " m the mean RSSI is " + rssi.toFixed(1) + " dBm</b>, but the measured value moves around it. " +
        (fade.value > 0 ? "With " + fade.value + " dB shadowing plus multipath dips the link is below -97 dBm " + (out * 100).toFixed(0) + "% of the time, even though nothing moves in the model. That is why links need a margin." : "Without fading, the RSSI would be perfectly steady, which only happens in free space.") +
        " Doubling the distance costs " + (3.01 * n.value).toFixed(0) + " dB here (" + (n.value === 2 ? "inverse-square law" : "exponent " + n.value) + ").");
      draw(); draw2();
    }
    [d, f, n, fade].forEach((c) => (c.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 48271 + 7) % 2147483647; regen(); update(); });
    update();
  }

  /* =====================================================================
     LAB: antenna directivity (polar cut)
     ===================================================================== */
  function labAntenna(el) {
    const { controls, view } = NES.lab(el, {
      title: "Directivity: more in one direction, less in all others",
      hint: "An illustrative family of antenna patterns (power ∝ cos<sup>2m</sup>(θ/2)) whose peak gain is (m + 1) times isotropic. Point the receiver in different directions and compare with the isotropic reference circle.",
    });
    const OPTS = [[0, "0 dBi"], [1, "3 dBi"], [3, "6 dBi"], [9, "10 dBi"], [31, "15 dBi"]];
    const m = NES.seg(controls, { label: "Directivity", options: OPTS, value: 3 });
    const loss = NES.slider(controls, { label: "Antenna losses", min: 0, max: 3, step: 0.5, value: 0, fmt: (v) => v + " dB" });
    const ang = NES.slider(controls, { label: "Direction of the receiver", min: 0, max: 180, step: 5, value: 30, fmt: (v) => v + "°" });
    const cv = h("canvas", { style: "height:240px", "aria-label": "Antenna radiation pattern" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i>this antenna</span><span><i class="dash" style="color:var(--muted)"></i>isotropic (0 dBi)</span><span><i style="background:var(--accent)"></i>direction of the receiver</span>` }));
    const stats = NES.stats(view, [{ key: "peak", label: "Peak gain" }, { key: "dir", label: "Gain towards receiver" }, { key: "bw", label: "Half-power beamwidth" }]);
    const verdict = verdictBox(view);
    const gainDb = (mm, th) => { const c = Math.cos(th / 2); const lin = (mm + 1) * Math.pow(c * c, mm); return lin > 1e-6 ? 10 * Math.log10(lin) : -60; };
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const cx = w / 2, cy = hh / 2, R = Math.min(w / 2 - 12, hh / 2 - 10);
      const FLOOR = -20, TOP = 16;
      const rad = (g) => (Math.max(FLOOR, Math.min(TOP, g)) - FLOOR) / (TOP - FLOOR) * R;
      [-10, 0, 10].forEach((g) => { ctx.strokeStyle = NES.css(g === 0 ? "--muted" : "--grid"); ctx.setLineDash(g === 0 ? [4, 4] : []); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, rad(g), 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); text(ctx, g + " dBi", cx + 3, cy - rad(g) - 6, NES.css("--muted"), "left", 9.5); });
      line(ctx, cx - R, cy, cx + R, cy, NES.css("--grid"));
      ctx.fillStyle = NES.css("--tech"); ctx.globalAlpha = 0.18; ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2;
      ctx.beginPath();
      for (let k = 0; k <= 360; k++) {
        const th = (k * Math.PI) / 180; const g = gainDb(m.value, th) - loss.value; const r = rad(g);
        const x = cx + r * Math.cos(th), y = cy - r * Math.sin(th);
        k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
      const th = (ang.value * Math.PI) / 180;
      line(ctx, cx, cy, cx + R * Math.cos(th), cy - R * Math.sin(th), NES.css("--accent"), 2);
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(cx + R * Math.cos(th), cy - R * Math.sin(th), 5, 0, Math.PI * 2); ctx.fill();
      text(ctx, "RX", cx + (R + 0) * Math.cos(th) + (Math.cos(th) >= 0 ? 8 : -8), cy - R * Math.sin(th) - 8, NES.css("--accent"), Math.cos(th) >= 0 ? "left" : "right", 10, true);
    });
    function update() {
      const peak = 10 * Math.log10(m.value + 1) - loss.value;
      const g = gainDb(m.value, (ang.value * Math.PI) / 180) - loss.value;
      const half = m.value ? 2 * (2 * Math.acos(Math.pow(0.5, 1 / (2 * m.value))) * 180) / Math.PI : 360;
      stats.set("peak", peak.toFixed(1) + " dBi");
      stats.set("dir", (g < -40 ? "< -40" : g.toFixed(1)) + " dBi", g >= 0 ? "good" : g > -10 ? "warn" : "bad");
      stats.set("bw", m.value ? half.toFixed(0) + "°" : "all directions");
      setVerdict(verdict, g >= 0 ? "good" : "warn", m.value === 0
        ? "<b>Isotropic: 0 dBi in every direction.</b> A theoretical antenna, used as the reference for directivity."
        : "<b>Peak " + peak.toFixed(1) + " dBi, but " + (g < -40 ? "almost nothing" : g.toFixed(1) + " dBi") + " towards a receiver at " + ang.value + "°.</b> The antenna is passive: the energy sent forward is missing elsewhere. " +
          (m.value >= 9 ? "Great for a fixed point-to-point link, poor when the other side could be anywhere." : "Moderate directivity still covers a wide range of directions.") +
          (loss.value ? " Antenna gain = directivity - losses: " + (10 * Math.log10(m.value + 1)).toFixed(1) + " - " + loss.value + " dB." : ""));
      draw();
    }
    [m, loss, ang].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: the two requirements for reception
     ===================================================================== */
  function labReception(el) {
    const { controls, view } = NES.lab(el, {
      title: "Strong enough, and stronger than the interference",
      hint: "Requirement 1: the signal is above the sensitivity. Requirement 2: it is sufficiently stronger than the <em>sum</em> of all interference. The required signal-to-interference ratio depends on the modulation; the value here is an assumption.",
    });
    const s = NES.slider(controls, { label: "Wanted signal", min: -110, max: -40, step: 1, value: -80, fmt: (v) => v + " dBm" });
    const sens = NES.slider(controls, { label: "Sensitivity", min: -105, max: -85, step: 1, value: -97, fmt: (v) => v + " dBm" });
    const nI = NES.seg(controls, { label: "Interferers", options: [[0, "none"], [1, "one"], [2, "two"]], value: 2 });
    const i1 = NES.slider(controls, { label: "Interferer 1", min: -120, max: -50, step: 1, value: -90, fmt: (v) => v + " dBm" });
    const i2 = NES.slider(controls, { label: "Interferer 2", min: -120, max: -50, step: 1, value: -90, fmt: (v) => v + " dBm" });
    const req = NES.slider(controls, { label: "Required S/I (assumed)", min: 0, max: 15, step: 1, value: 6, fmt: (v) => v + " dB" });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "it", label: "Total interference" }, { key: "r1", label: "1: above sensitivity" }, { key: "sir", label: "2: signal / interference" }]);
    const verdict = verdictBox(view);
    function update() {
      i1.wrap.style.display = nI.value >= 1 ? "" : "none";
      i2.wrap.style.display = nI.value >= 2 ? "" : "none";
      const ints = [i1.value, i2.value].slice(0, nI.value);
      const it = ints.length ? dbSum(ints) : -Infinity;
      const sir = s.value - it, ok1 = s.value >= sens.value, ok2 = !ints.length || sir >= req.value;
      const lo = -120, hi = -40, pct = (v) => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
      const row = (label, v, color) => `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${pct(v)}%;background:${color}"></div><span class="meter-mark" style="left:${pct(sens.value)}%" title="sensitivity"></span></div><span class="m-val">${isFinite(v) ? v.toFixed(1) : "-"} dBm</span></div>`;
      meter.innerHTML = row("Signal", s.value, "var(--ok)") + (ints.length ? ints.map((v, k) => row("Interferer " + (k + 1), v, "var(--warn)")).join("") + row("Sum", it, "var(--bad)") : "") +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">scale -120 to -40 dBm; the mark is the sensitivity</span><span></span></div>`;
      stats.set("it", ints.length ? fmtDbm(it) : "none");
      stats.set("r1", ok1 ? "met" : "failed", ok1 ? "good" : "bad");
      stats.set("sir", ints.length ? fmtDb(sir) : "no interference", ok2 ? "good" : "bad");
      if (!ok1) setVerdict(verdict, "bad", "<b>Lost: below sensitivity.</b> At " + s.value + " dBm the receiver perceives the signal as noise, whatever the interference.");
      else if (!ok2) setVerdict(verdict, "bad", "<b>Lost: interference too strong.</b> The signal is only " + sir.toFixed(1) + " dB above the summed interference (" + it.toFixed(1) + " dBm), less than the " + req.value + " dB assumed for clean decoding. Bit errors corrupt the packet." + (ints.length === 2 && i1.value === i2.value ? " Note how two equal interferers add up to 3 dB more than one." : ""));
      else setVerdict(verdict, "good", "<b>Received.</b> " + (s.value - sens.value) + " dB above sensitivity" + (ints.length ? " and " + sir.toFixed(1) + " dB above the summed interference." : ", with no interference."));
    }
    [s, sens, nI, i1, i2, req].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: capture effect
     ===================================================================== */
  function labCapture(el) {
    const { controls, view } = NES.lab(el, {
      title: "Two transmitters, one receiver",
      hint: "Tx1 and Tx2 send at the same moment with the same power (0 dBm, 2.4 GHz). Each packet survives only if it is above the sensitivity (-97 dBm) and stronger than the other by the capture threshold. The threshold depends on the radio; the default is an assumption.",
    });
    const d1 = NES.slider(controls, { label: "Tx1 to Rx", min: 5, max: 100, step: 1, value: 40, fmt: (v) => v + " m" });
    const d2 = NES.slider(controls, { label: "Tx2 to Rx", min: 5, max: 100, step: 1, value: 15, fmt: (v) => v + " m" });
    const n = NES.seg(controls, { label: "Environment (exponent n)", options: [[2, "free space (2)"], [3, "indoor (3)"]], value: 2 });
    const thr = NES.slider(controls, { label: "Capture threshold (assumed)", min: 0, max: 10, step: 0.5, value: 3, fmt: (v) => v + " dB" });
    const stage = h("div", { class: "stage" });
    view.append(stage);
    const stats = NES.stats(view, [{ key: "p1", label: "Tx1 at Rx" }, { key: "p2", label: "Tx2 at Rx" }, { key: "ratio", label: "Distance ratio needed" }]);
    const verdict = verdictBox(view);
    const SENS = -97, F1 = fspl1m(2.44e9);
    function update() {
      const p1 = -(F1 + 10 * n.value * Math.log10(d1.value)), p2 = -(F1 + 10 * n.value * Math.log10(d2.value));
      const ok1 = p1 >= SENS && p1 - p2 >= thr.value, ok2 = p2 >= SENS && p2 - p1 >= thr.value;
      const W = 440, Hh = 170, rx = 400, scale = 330 / 100;
      const x1 = rx - d1.value * scale, x2 = rx - d2.value * scale;
      const node = (x, y, lbl) => `<line class="w" x1="${x}" y1="${y - 14}" x2="${x}" y2="${y + 4}"/><path class="w" d="M${x - 9} ${y - 26} L${x} ${y - 14} L${x + 9} ${y - 26} Z"/><rect class="box" x="${x - 18}" y="${y + 4}" width="36" height="24" rx="3"/><text x="${x}" y="${y + 21}" text-anchor="middle" class="lbl">${lbl}</text>`;
      const arrow = (xa, ya, xb, yb, ok) => { const cls = ok ? "t-ok" : "t-bad"; const ang = Math.atan2(yb - ya, xb - xa); const hx = xb - 10 * Math.cos(ang), hy = yb - 10 * Math.sin(ang);
        return `<line x1="${xa}" y1="${ya}" x2="${hx}" y2="${hy}" style="stroke:var(--${ok ? "ok" : "bad"});stroke-width:2.5"/><path d="M${xb} ${yb} L${hx - 5 * Math.sin(ang)} ${hy + 5 * Math.cos(ang)} L${hx + 5 * Math.sin(ang)} ${hy - 5 * Math.cos(ang)} Z" style="fill:var(--${ok ? "ok" : "bad"})"/>`; };
      let s = `<svg class="sch" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Capture effect geometry">`;
      s += arrow(x1 + 20, 44, rx - 22, 44, ok1) + arrow(x2 + 20, 118, rx - 20, 56, ok2);
      s += node(x1, 40, "Tx1") + node(x2, 114, "Tx2") + node(rx, 40, "Rx");
      s += `<text x="${(x1 + rx) / 2}" y="34" text-anchor="middle" class="state ${ok1 ? "t-ok" : "t-bad"}">${p1.toFixed(0)} dBm</text>`;
      s += `<text x="${Math.min((x2 + rx) / 2 + 12, W - 62)}" y="101" text-anchor="start" class="state ${ok2 ? "t-ok" : "t-bad"}">${p2.toFixed(0)} dBm</text>`;
      s += `<text x="8" y="${Hh - 6}" class="small">0 to 100 m scale</text></svg>`;
      stage.innerHTML = s;
      stats.set("p1", fmtDbm(p1), ok1 ? "good" : "bad");
      stats.set("p2", fmtDbm(p2), ok2 ? "good" : "bad");
      stats.set("ratio", "× " + Math.pow(10, thr.value / (10 * n.value)).toFixed(2));
      const diff = Math.abs(p1 - p2);
      if (ok1 || ok2) setVerdict(verdict, "good", "<b>Capture: " + (ok1 ? "Tx1" : "Tx2") + "'s packet is received.</b> It arrives " + diff.toFixed(1) + " dB stronger. From its perspective the interference is low; for the other transmitter it is high, so that packet is lost. The stronger one only needs to be " + Math.pow(10, thr.value / (10 * n.value)).toFixed(2) + "× closer with these settings.");
      else if (Math.max(p1, p2) < SENS) setVerdict(verdict, "bad", "<b>Both lost: too weak.</b> Neither signal reaches the -97 dBm sensitivity.");
      else setVerdict(verdict, "bad", "<b>Collision: both packets lost.</b> They arrive only " + diff.toFixed(1) + " dB apart, below the " + thr.value + " dB capture threshold, so each corrupts the other.");
    }
    [d1, d2, n, thr].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: bit errors to packet errors
     ===================================================================== */
  function labPer(el) {
    const { controls, view } = NES.lab(el, {
      title: "From bit errors to packet errors",
      hint: "A packet is lost if any of its bits is wrong. With independent bit errors and no error correction, PER = 1 - (1 - BER)<sup>bits</sup>. 21 B and 39 B are the packet sizes in the slide's measurement.",
    });
    const ber = NES.slider(controls, { label: "Bit error rate", min: -6, max: -1.5, step: 0.1, value: -3, map: (e) => Math.pow(10, e), unmap: (v) => Math.log10(v), fmt: (v) => v.toExponential(1) });
    const len = NES.seg(controls, { label: "Packet size", options: [[21, "21 B"], [39, "39 B"], [127, "127 B"]], value: 21 });
    const cv = h("canvas", { style: "height:210px", "aria-label": "Packet error rate versus bit error rate" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--lo)"></i>21 B</span><span><i style="background:var(--hi)"></i>39 B</span><span><i style="background:var(--muted)"></i>127 B</span>` }));
    const stats = NES.stats(view, [{ key: "per", label: "Packet error rate" }, { key: "tx", label: "Transmissions per delivery" }, { key: "approx", label: "Quick estimate bits × BER" }]);
    const verdict = verdictBox(view);
    const PER = (b, L) => 1 - Math.pow(1 - b, 8 * L);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 38, padR = 8, padT = 8, padB = 22;
      const X = (e) => padL + ((e + 6) / 4.5) * (w - padL - padR);
      const Y = (p) => padT + (1 - p) * (hh - padT - padB);
      [0, 0.25, 0.5, 0.75, 1].forEach((p) => { line(ctx, padL, Y(p), w - padR, Y(p), NES.css("--grid")); text(ctx, (p * 100).toFixed(0) + "%", padL - 5, Y(p), NES.css("--muted"), "right", 10); });
      [-6, -5, -4, -3, -2].forEach((e) => text(ctx, "1e" + e, X(e), hh - 9, NES.css("--muted"), "center", 10));
      [[21, "--lo"], [39, "--hi"], [127, "--muted"]].forEach(([L, c]) => {
        ctx.strokeStyle = NES.css(c); ctx.lineWidth = L === len.value ? 2.6 : 1.4; ctx.beginPath();
        for (let k = 0; k <= 90; k++) { const e = -6 + (4.5 * k) / 90; const y = Y(PER(Math.pow(10, e), L)); k ? ctx.lineTo(X(e), y) : ctx.moveTo(X(e), y); }
        ctx.stroke();
      });
      const e = Math.log10(ber.value);
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(e), Y(PER(ber.value, len.value)), 5, 0, Math.PI * 2); ctx.fill();
      text(ctx, "BER", w - padR, hh - 22, NES.css("--muted"), "right", 10);
    });
    function update() {
      const p = PER(ber.value, len.value), bits = 8 * len.value;
      stats.set("per", (p * 100).toFixed(p < 0.01 ? 2 : 1) + "%", p < 0.05 ? "good" : p < 0.3 ? "warn" : "bad");
      stats.set("tx", p > 0.999 ? "link unusable" : (1 / (1 - p)).toFixed(2));
      stats.set("approx", (bits * ber.value * 100).toFixed(1) + "%");
      setVerdict(verdict, p < 0.05 ? "good" : p < 0.3 ? "warn" : "bad", "<b>" + bits + " bits, BER " + ber.value.toExponential(1) + ": PER = 1 - (1 - BER)<sup>" + bits + "</sup> = " + (p * 100).toFixed(1) + "%.</b> " +
        "At the same bit error rate, longer packets fail more often: compare " + (PER(ber.value, 21) * 100).toFixed(1) + "% (21 B) with " + (PER(ber.value, 39) * 100).toFixed(1) + "% (39 B). " +
        "The quick estimate bits × BER only works while the result is small.");
      draw();
    }
    ber.onchange = len.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: BFSK on a carrier
     ===================================================================== */
  function labBfsk(el) {
    const { controls, view } = NES.lab(el, {
      title: "Binary frequency shift keying",
      hint: "Type a few bits. '0' is sent at f<sub>c</sub> - f<sub>0</sub>, '1' at f<sub>c</sub> + f<sub>0</sub>, as on slide 16. Frequencies are given in carrier cycles per bit so the waves stay visible.",
    });
    const bits = textInput(controls, { label: "Bits (0 and 1, up to 12)", value: "0110", max: 12 });
    const fc = NES.seg(controls, { label: "Carrier f<sub>c</sub>", options: [[3, "3 per bit"], [4, "4 per bit"], [6, "6 per bit"]], value: 4 });
    const f0 = NES.slider(controls, { label: "Deviation f<sub>0</sub>", min: 0.5, max: 2, step: 0.5, value: 1, fmt: (v) => v + " per bit" });
    const cv = h("canvas", { style: "height:230px", "aria-label": "Data, carrier and BFSK signal" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "f0", label: "'0' frequency" }, { key: "f1", label: "'1' frequency" }, { key: "bw", label: "Spread between them" }]);
    const verdict = verdictBox(view);
    const clean = () => (bits.value.replace(/[^01]/g, "").slice(0, 12) || "0");
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const b = clean(), N = b.length, padL = 58, padR = 6, rowH = hh / 3;
      const X = (t) => padL + (t / N) * (w - padL - padR);
      const rows = [["data", "--hi"], ["carrier", "--ok"], ["BFSK", "--lo"]];
      rows.forEach(([name, c], r) => {
        const y0 = r * rowH + 6, y1 = (r + 1) * rowH - 6, ym = (y0 + y1) / 2, amp = (y1 - y0) / 2 - 2;
        for (let k = 0; k < N; k++) if (b[k] === "1") { ctx.fillStyle = NES.css("--grid"); ctx.fillRect(X(k), y0, X(k + 1) - X(k), y1 - y0); }
        text(ctx, name, 4, ym, NES.css("--muted"), "left", 11, true);
        ctx.strokeStyle = NES.css(c); ctx.lineWidth = 1.6; ctx.beginPath();
        const steps = Math.max(200, Math.round((w - padL) * 1.5));
        let phase = 0, prevT = 0;
        for (let s = 0; s <= steps; s++) {
          const t = (s / steps) * N, bit = b[Math.min(N - 1, Math.floor(t))];
          let y;
          if (r === 0) y = bit === "1" ? ym - amp : ym + amp;
          else {
            const f = r === 1 ? fc.value : fc.value + (bit === "1" ? f0.value : -f0.value);
            phase += 2 * Math.PI * f * (t - prevT); prevT = t;
            y = ym - amp * Math.sin(phase);
          }
          s ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y);
        }
        ctx.stroke();
      });
      for (let k = 0; k < N; k++) text(ctx, b[k], (X(k) + X(k + 1)) / 2, 10, NES.css("--ink"), "center", 10, true);
    });
    function update() {
      const lo = fc.value - f0.value, hi = fc.value + f0.value;
      stats.set("f0", lo + " cycles/bit");
      stats.set("f1", hi + " cycles/bit");
      stats.set("bw", (2 * f0.value) + " cycles/bit");
      setVerdict(verdict, "", "<b>Bits " + clean() + ":</b> the modulated wave runs at " + lo + " cycles per bit for '0' and " + hi + " for '1' (shaded). The receiver only needs a bandpass filter around f<sub>c</sub> to ignore signals at other frequencies; a real radio uses a carrier of 2.4 GHz with a deviation of a few hundred kHz, millions of cycles per bit.");
      draw();
    }
    bits.addEventListener("input", update);
    fc.onchange = f0.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: frequency band trade-offs
     ===================================================================== */
  const BANDS = [
    [433e6, "433 MHz", "Europe, Africa, Middle East"], [868e6, "868 MHz", "Europe (863 to 870 MHz)"], [915e6, "915 MHz", "North/South America (902 to 928)"],
    [2.44e9, "2.4 GHz", "worldwide (2.4 to 2.5 GHz)"], [5.8e9, "5.8 GHz", "worldwide (5.725 to 5.875)"], [24.1e9, "24 GHz", "worldwide (24 to 24.25)"], [61.25e9, "61 GHz", "subject to local acceptance"],
  ];
  function labBand(el) {
    const { controls, view } = NES.lab(el, {
      title: "Low band or high band?",
      hint: "Pick a band from the slide's table. Wavelength λ = c / f sets the size of a quarter-wave antenna; free-space path loss with fixed-gain antennas grows with f², so the range for the same link budget scales with 1/f.",
    });
    const b = NES.seg(controls, { label: "Band", options: BANDS.map(([f, l]) => [f, l]), value: 868e6 });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "lam", label: "Wavelength λ" }, { key: "ant", label: "Quarter-wave antenna" }, { key: "pl", label: "Free-space loss at 100 m" }, { key: "where", label: "Availability" }]);
    const verdict = verdictBox(view);
    const fmtLen = (m) => (m >= 1 ? sig(m, 3) + " m" : m >= 0.01 ? sig(m * 100, 3) + " cm" : sig(m * 1000, 3) + " mm");
    function update() {
      const f = b.value, lam = C_LIGHT / f, ref = 2.44e9;
      const range = ref / f, ant = lam / 4;
      const row = (label, frac, color, txt) => `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${Math.max(1.5, Math.min(100, frac * 100))}%;background:${color}"></div></div><span class="m-val">${txt}</span></div>`;
      meter.innerHTML = row("Range", range / (ref / 433e6), "var(--ok)", "× " + sig(range, 2)) + row("Antenna", ant / (C_LIGHT / 433e6 / 4), "var(--tech)", fmtLen(ant)) + row("Bitrate", Math.log10(f / 1e8) / Math.log10(61.25e9 / 1e8), "var(--hi)", f < 1e9 ? "lower" : f < 10e9 ? "higher" : "highest") +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">range relative to 2.4 GHz with the same link budget (free space); bitrate is qualitative</span><span></span></div>`;
      const item = BANDS.find((x) => x[0] === f);
      stats.set("lam", fmtLen(lam));
      stats.set("ant", fmtLen(ant));
      stats.set("pl", (fspl1m(f) + 40).toFixed(1) + " dB");
      stats.set("where", item[2]);
      setVerdict(verdict, "", f < 1e9
        ? "<b>Sub-GHz:</b> lower path loss, more obstacle penetration and more coverage (about " + sig(range, 2) + "× the 2.4 GHz range here), but more interference from distant transmitters, less capacity for data and a bigger antenna (" + fmtLen(ant) + ")."
        : f < 10e9 ? "<b>UHF/SHF:</b> the sweet spot of most embedded radios. Antennas fit on a PCB (" + fmtLen(ant) + "); 2.4 GHz is available worldwide, which is also why it is crowded."
        : "<b>Millimetre-ish waves:</b> tiny antennas (" + fmtLen(ant) + ") and room for very high bitrates, but high path loss and almost no obstacle penetration. Ranges of metres, not kilometres.");
    }
    b.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: 2.4 GHz channels (WiFi, IEEE 802.15.4, BLE)
     ===================================================================== */
  function labChannels(el) {
    const { controls, view } = NES.lab(el, {
      title: "Overlapping and orthogonal channels at 2.4 GHz",
      hint: "WiFi channel n is centred at 2407 + 5n MHz and about 22 MHz wide (slide 19, top). IEEE 802.15.4 channels 11 to 26 sit at 2405 + 5(k - 11) MHz and are 2 MHz wide. Pick the channels of two WiFi networks and see which 802.15.4 channels stay free.",
    });
    const a = NES.slider(controls, { label: "WiFi network A", min: 1, max: 13, step: 1, value: 1, fmt: (v) => "channel " + v });
    const bOn = NES.seg(controls, { label: "Second WiFi network", options: [[1, "on"], [0, "off"]], value: 1 });
    const b = NES.slider(controls, { label: "WiFi network B", min: 1, max: 13, step: 1, value: 6, fmt: (v) => "channel " + v });
    const cv = h("canvas", { style: "height:180px", "aria-label": "Channel map of the 2.4 GHz band" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--lo);height:8px"></i>WiFi A</span><span><i style="background:var(--hi);height:8px"></i>WiFi B</span><span><i style="background:var(--wn-154);height:8px"></i>802.15.4 free</span><span><i style="background:var(--grid);height:8px"></i>802.15.4 overlapped</span>` }));
    const stats = NES.stats(view, [{ key: "sep", label: "A to B" }, { key: "free", label: "Free 802.15.4 channels" }]);
    const verdict = verdictBox(view);
    const wf = (n) => 2407 + 5 * n, zf = (k) => 2405 + 5 * (k - 11);
    function update() {
      b.wrap.style.display = bOn.value ? "" : "none";
      const nets = [a.value].concat(bOn.value ? [b.value] : []);
      const free = [];
      for (let k = 11; k <= 26; k++) if (nets.every((n) => Math.abs(zf(k) - wf(n)) >= 12)) free.push(k);
      const sep = bOn.value ? Math.abs(wf(a.value) - wf(b.value)) : null, overlap = sep !== null && sep < 22;
      stats.set("sep", sep === null ? "one network" : sep + " MHz apart", sep === null ? "" : overlap ? "bad" : "good");
      stats.set("free", free.length ? free.join(", ") : "none", free.length ? "good" : "bad");
      if (sep === null) setVerdict(verdict, "", "<b>One WiFi network on channel " + a.value + "</b> (" + wf(a.value) + " MHz) covers " + (wf(a.value) - 11) + " to " + (wf(a.value) + 11) + " MHz.");
      else if (overlap) setVerdict(verdict, "bad", "<b>Overlapping:</b> centres only " + sep + " MHz apart, less than the 22 MHz width. The two networks interfere with each other. Move them at least 5 channel numbers apart (1, 6, 11).");
      else setVerdict(verdict, "good", "<b>Orthogonal:</b> " + sep + " MHz apart, more than the 22 MHz width, so both can transmit in parallel (FDMA). " + (free.length ? "802.15.4 channels " + free.join(", ") + " fall between or beside them." : ""));
      draw();
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const lo = 2398, hi = 2486, padL = 8, padR = 8, base = hh - 26;
      const X = (f) => padL + ((f - lo) / (hi - lo)) * (w - padL - padR);
      line(ctx, X(lo), base, X(hi), base, NES.css("--line-2"), 1.5);
      for (let f = 2400; f <= 2480; f += 20) { line(ctx, X(f), base, X(f), base + 4, NES.css("--muted")); text(ctx, String(f), X(f), base + 14, NES.css("--muted"), "center", 10); }
      const nets = [[a.value, "--lo"]].concat(bOn.value ? [[b.value, "--hi"]] : []);
      nets.forEach(([n, c], i) => {
        const f = wf(n), rx = X(f + 11) - X(f), ry = base - 40 - i * 14;
        ctx.fillStyle = NES.css(c); ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.ellipse(X(f), base, rx, base - ry, 0, Math.PI, 2 * Math.PI); ctx.fill();
        ctx.globalAlpha = 1; ctx.strokeStyle = NES.css(c); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(X(f), base, rx, base - ry, 0, Math.PI, 2 * Math.PI); ctx.stroke();
        text(ctx, "ch " + n, X(f), ry - 8, NES.css(c), "center", 11, true);
      });
      for (let k = 11; k <= 26; k++) {
        const f = zf(k), isFree = nets.every(([n]) => Math.abs(f - wf(n)) >= 12);
        const x0 = X(f - 1), x1 = X(f + 1);
        ctx.fillStyle = isFree ? NES.css("--wn-154") : NES.css("--grid");
        ctx.fillRect(x0, base - 22, Math.max(2, x1 - x0), 22);
        if (isFree && w > 420) text(ctx, String(k), (x0 + x1) / 2, base - 30, NES.css("--wn-154"), "center", 9.5, true);
      }
    });
    [a, bOn, b].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: CSMA/CA with acknowledgements (slot simulation)
     ===================================================================== */
  function simCsma(o) {
    const rand = NES.rng(o.seed);
    const base = [0, 3, 5, 8];
    const devs = [];
    for (let i = 0; i < o.N; i++) devs.push({ name: "Dev " + (i + 1), arr: o.spread ? base[i] + Math.floor(rand() * 3) : 0, state: "idle", next: -1, be: 1, retries: 0, segs: [], result: null, end: 0 });
    const tx = [], ap = [];
    let collisions = 0, frames = 0;
    const busy = (t) => tx.some((x) => x.s <= t && t < x.e);
    const backoff = (d, t, label) => {
      const wait = 1 + Math.floor(rand() * Math.pow(2, d.be));
      d.be = Math.min(d.be + 1, 5);
      d.segs.push([t, t + wait, "listen", label]);
      d.next = t + wait; d.state = "ready";
    };
    for (let t = 0; t < 90; t++) {
      devs.forEach((d) => { if (d.state === "idle" && d.arr === t) { d.state = "ready"; d.next = t; } });
      const cca = devs.filter((d) => d.state === "ready" && d.next === t);
      if (!cca.length) { if (devs.every((d) => d.state === "done")) break; continue; }
      cca.forEach((d) => d.segs.push([t, t + 1, "rx", "cca"]));
      if (busy(t)) { cca.forEach((d) => backoff(d, t + 1, "backoff")); continue; }
      const s = t + 1, e = s + o.F, bad = cca.length > 1;
      frames += cca.length;
      if (bad) collisions++;
      ap.push([s, e, "rx", bad ? "collision" : "frame", bad ? "bad" : null]);
      cca.forEach((d) => { d.segs.push([s, e, "tx", "frame", bad ? "bad" : null]); tx.push({ s, e }); });
      if (!bad && o.acks) { tx.push({ s: e, e: e + 1 }); ap.push([e, e + 1, "tx", "ack"]); }
      cca.forEach((d) => {
        if (!o.acks) { d.state = "done"; d.result = bad ? "lost" : "ok"; d.end = e; return; }
        if (!bad) { d.segs.push([e, e + 1, "rx", "ack"]); d.state = "done"; d.result = "ok"; d.end = e + 1; return; }
        d.segs.push([e, e + 1, "listen", "no ack"]);
        d.retries++;
        if (d.retries > o.R) { d.state = "done"; d.result = "dropped"; d.end = e + 1; return; }
        backoff(d, e + 1, "backoff");
      });
    }
    const end = Math.max(12, ...devs.map((d) => d.end), ...ap.map((x) => x[1])) + 2;
    return { devs, ap, end, collisions, frames };
  }
  function labCsmaca(el) {
    const { controls, view } = NES.lab(el, {
      title: "CSMA/CA with acknowledgements",
      hint: "Each device senses the channel (CCA, one slot). If it is free it transmits, then listens for the AP's ACK. If the channel is busy, or no ACK comes back, it waits a random backoff of 1 to 2<sup>BE</sup> slots, doubling the window each time (binary exponential backoff). Slot model, frames of a few slots, seeded random draws.",
    });
    const N = NES.seg(controls, { label: "Devices", options: [[2, "2"], [3, "3"], [4, "4"]], value: 3 });
    const spread = NES.seg(controls, { label: "Frames ready", options: [[1, "at different times"], [0, "all at once"]], value: 1 });
    const acks = NES.seg(controls, { label: "Acknowledgements", options: [[1, "on"], [0, "off"]], value: 1 });
    const F = NES.seg(controls, { label: "Frame length", options: [[3, "3 slots"], [5, "5 slots"]], value: 5 });
    const R = NES.slider(controls, { label: "Max retransmissions", min: 0, max: 5, step: 1, value: 3, fmt: (v) => String(v) });
    const reroll = h("button", { class: "btn", type: "button", text: "New random backoffs" });
    controls.append(reroll);
    const cv = h("canvas", { style: "height:170px", "aria-label": "CSMA/CA timeline" });
    view.append(h("div", { class: "stage" }, [cv]), stateLegend(["tx", "rx", "listen"]));
    const stats = NES.stats(view, [{ key: "ok", label: "Delivered" }, { key: "col", label: "Collisions" }, { key: "re", label: "Retransmissions" }, { key: "lost", label: "Dropped or lost" }]);
    const verdict = verdictBox(view);
    let seed = 5, sim = null;
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const rows = sim.devs.map((d) => ({ name: d.name, base: "listen", segs: d.segs })).concat([{ name: "AP", base: "listen", segs: sim.ap }]);
      drawTimeline(ctx, w, hh, rows, sim.end, { axis: (X, y) => { for (let t = 0; t <= sim.end; t += 5) text(ctx, String(t), X(t), y, NES.css("--muted"), "center", 9.5); } });
    });
    function update() {
      sim = simCsma({ N: N.value, spread: !!spread.value, acks: !!acks.value, F: F.value, R: R.value, seed });
      const ok = sim.devs.filter((d) => d.result === "ok").length, lost = sim.devs.filter((d) => d.result !== "ok").length;
      const re = sim.devs.reduce((s, d) => s + d.retries, 0) - sim.devs.filter((d) => d.result === "dropped").length;
      R.wrap.style.opacity = acks.value ? "" : "0.5";
      stats.set("ok", ok + " / " + N.value, ok === N.value ? "good" : "warn");
      stats.set("col", String(sim.collisions), sim.collisions ? "warn" : "good");
      stats.set("re", acks.value ? String(Math.max(0, re)) : "none (no ACKs)");
      stats.set("lost", String(lost), lost ? "bad" : "good");
      const unnoticed = sim.devs.filter((d) => d.result === "lost").length;
      if (!acks.value && unnoticed) setVerdict(verdict, "bad", "<b>" + unnoticed + " frame" + (unnoticed > 1 ? "s" : "") + " lost without anyone noticing.</b> The senders cannot hear the collision while they transmit, and without ACKs they believe the frames arrived. Turn acknowledgements on.");
      else if (sim.collisions) setVerdict(verdict, lost ? "bad" : "warn", "<b>" + sim.collisions + " collision" + (sim.collisions > 1 ? "s" : "") + ".</b> Devices that sense in the same slot both see a free channel and transmit together: collision avoidance reduces collisions but cannot rule them out. " + (acks.value ? "The missing ACK triggers a retransmission after a random backoff" + (lost ? ", until the retry limit drops the frame." : ".") : ""));
      else setVerdict(verdict, "good", "<b>No collisions this time.</b> Devices that found the channel busy backed off for a random number of slots and tried again. Try \"all at once\" or new random backoffs.");
      draw();
    }
    [N, spread, acks, F, R].forEach((c) => (c.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 16807 + 3) % 2147483647; update(); });
    update();
  }

  /* =====================================================================
     LAB: retransmissions
     ===================================================================== */
  function labRetx(el) {
    const { controls, view } = NES.lab(el, {
      title: "How far do retransmissions get you?",
      hint: "Each attempt succeeds (frame and ACK both arrive) with probability p, independently. After the maximum number of retransmissions the frame is dropped.",
    });
    const p = NES.slider(controls, { label: "Success per attempt p", min: 10, max: 100, step: 5, value: 70, fmt: (v) => v + "%" });
    const R = NES.slider(controls, { label: "Max retransmissions", min: 0, max: 7, step: 1, value: 3, fmt: (v) => String(v) });
    const cv = h("canvas", { style: "height:180px", "aria-label": "Delivery probability per attempt" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech);height:8px"></i>delivered at this attempt</span><span><i style="background:var(--ok)"></i>delivered so far</span>` }));
    const stats = NES.stats(view, [{ key: "pd", label: "Eventually delivered" }, { key: "drop", label: "Dropped" }, { key: "et", label: "Transmissions per frame" }]);
    const verdict = verdictBox(view);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const q = 1 - p.value / 100, K = R.value + 1, padL = 36, padR = 8, padT = 8, padB = 20;
      const Y = (v) => padT + (1 - v) * (hh - padT - padB);
      [0, 0.5, 1].forEach((v) => { line(ctx, padL, Y(v), w - padR, Y(v), NES.css("--grid")); text(ctx, v * 100 + "%", padL - 5, Y(v), NES.css("--muted"), "right", 10); });
      const cw = (w - padL - padR) / 8;
      let cum = 0;
      ctx.strokeStyle = NES.css("--ok"); ctx.lineWidth = 2;
      const pts = [];
      for (let k = 1; k <= K; k++) {
        const pk = Math.pow(q, k - 1) * (1 - q); cum += pk;
        const x = padL + (k - 1) * cw + cw * 0.2;
        ctx.fillStyle = NES.css("--tech"); ctx.fillRect(x, Y(pk), cw * 0.6, Y(0) - Y(pk));
        text(ctx, "#" + k, x + cw * 0.3, hh - 8, NES.css("--muted"), "center", 10);
        pts.push([x + cw * 0.3, Y(cum)]);
      }
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      pts.forEach(([x, y]) => { ctx.fillStyle = NES.css("--ok"); ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); });
    });
    function update() {
      const pp = p.value / 100, q = 1 - pp, K = R.value + 1;
      const pd = 1 - Math.pow(q, K), et = pp === 0 ? K : (1 - Math.pow(q, K)) / pp;
      stats.set("pd", (pd * 100).toFixed(pd > 0.999 ? 3 : 1) + "%", pd > 0.99 ? "good" : pd > 0.9 ? "warn" : "bad");
      stats.set("drop", (Math.pow(q, K) * 100).toFixed(Math.pow(q, K) < 0.001 ? 4 : 2) + "%");
      stats.set("et", et.toFixed(2));
      setVerdict(verdict, pd > 0.99 ? "good" : "warn", "<b>P(delivered) = 1 - (1 - p)<sup>" + K + "</sup> = " + (pd * 100).toFixed(2) + "%.</b> A frame is only lost if all " + K + " attempts fail. The price: on average " + et.toFixed(2) + " transmissions per frame, each costing energy and adding delay.");
      draw();
    }
    p.onchange = R.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: radio duty cycle and battery life
     ===================================================================== */
  const I_RX = 5.9, I_TX0 = 6.1, I_TX5 = 9.1, I_SLEEP = 0.001;
  const BATT = [[225, "CR2032 (225 mAh)"], [2500, "2 × AA (2500 mAh)"]];
  function labDutycycle(el) {
    const { controls, view } = NES.lab(el, {
      title: "Duty cycle the radio, stretch the battery",
      hint: "Radio currents from the slide's CC2650 datasheet excerpt (RX 5.9 mA, TX 6.1 mA at 0 dBm, 9.1 mA at 5 dBm). Assumed: sleep 1 µA, battery capacity as chosen, nothing else on the board draws current.",
    });
    const dc = NES.slider(controls, { label: "Radio on (duty cycle)", min: -4, max: 0, step: 0.05, value: -2, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => sig(v * 100, 2) + "%" });
    const act = NES.seg(controls, { label: "While on", options: [["rx", "listen only"], ["tx0", "10% TX 0 dBm"], ["tx5", "10% TX 5 dBm"]], value: "rx" });
    const batt = NES.seg(controls, { label: "Battery", options: BATT, value: 225 });
    const cv = h("canvas", { style: "height:210px", "aria-label": "Battery life versus duty cycle" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "i", label: "Average current" }, { key: "life", label: "Battery life" }, { key: "on", label: "Current while on" }]);
    const verdict = verdictBox(view);
    const onI = () => (act.value === "rx" ? I_RX : act.value === "tx0" ? 0.9 * I_RX + 0.1 * I_TX0 : 0.9 * I_RX + 0.1 * I_TX5);
    const avg = (D) => D * onI() + (1 - D) * I_SLEEP;
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 48, padR = 8, padT = 8, padB = 22, ylo = 0, yhi = 6;
      const X = (e) => padL + ((e + 4) / 4) * (w - padL - padR);
      const Y = (lh) => padT + (1 - (lh - ylo) / (yhi - ylo)) * (hh - padT - padB);
      [[1, "1 h"], [24, "1 day"], [24 * 30, "1 month"], [24 * 365, "1 year"], [24 * 3650, "10 years"]].forEach(([hrs, l]) => { const y = Y(Math.log10(hrs)); line(ctx, padL, y, w - padR, y, NES.css("--grid")); text(ctx, l, padL - 5, y, NES.css("--muted"), "right", 9.5); });
      [-4, -3, -2, -1, 0].forEach((e) => text(ctx, sig(Math.pow(10, e) * 100, 2) + "%", X(e), hh - 9, NES.css("--muted"), e === -4 ? "left" : e === 0 ? "right" : "center", 10));
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let k = 0; k <= 100; k++) { const e = -4 + (4 * k) / 100; const lh = Math.log10(batt.value / avg(Math.pow(10, e))); const y = Y(Math.max(ylo, Math.min(yhi, lh))); k ? ctx.lineTo(X(e), y) : ctx.moveTo(X(e), y); }
      ctx.stroke();
      const e = Math.log10(dc.value), lh = Math.log10(batt.value / avg(dc.value));
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(e), Y(Math.max(ylo, Math.min(yhi, lh))), 5, 0, Math.PI * 2); ctx.fill();
    });
    function update() {
      const D = dc.value, I = avg(D), life = batt.value / I;
      stats.set("i", fmtCur(I));
      stats.set("life", fmtLife(life), life > 24 * 365 ? "good" : life > 24 * 30 ? "warn" : "bad");
      stats.set("on", fmtCur(onI()));
      const sleepShare = ((1 - D) * I_SLEEP) / I;
      setVerdict(verdict, life > 24 * 365 ? "good" : life > 24 * 30 ? "warn" : "bad", "<b>" + sig(D * 100, 2) + "% on: " + fmtCur(I) + " on average, " + fmtLife(life) + ".</b> " +
        (D >= 0.999 ? "Always listening drains a coin cell in under two days: idle listening costs as much as receiving. " : "The radio still dominates the average (" + ((1 - sleepShare) * 100).toFixed(0) + "% of the charge). ") +
        (life > 24 * 365 * 10 ? "Beyond about ten years, battery self-discharge and the rest of the board would matter more than the radio." : "Every factor of 10 in duty cycle gives roughly a factor of 10 in lifetime, until the sleep current takes over."));
      draw();
    }
    [dc, act, batt].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: asymmetric energy, uplink with duty-cycled CSMA
     ===================================================================== */
  const T_CCA = 0.128, T_FRAME = 2, T_ACKW = 1;
  function labUplink(el) {
    const { controls, view } = NES.lab(el, {
      title: "Battery node, mains-powered AP",
      hint: "The node sleeps, wakes up when it has data, does CCA, sends its frame and listens for the ACK. The AP listens all the time. Assumed durations: CCA 0.128 ms, frame 2 ms, ACK wait 1 ms; sleep 1 µA; coin cell 225 mAh. Not to scale in the timeline.",
    });
    const T = NES.slider(controls, { label: "One report every", min: 0, max: 3.556, step: 0.02, value: Math.log10(60), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtTime(v * 1000) });
    const ptx = NES.seg(controls, { label: "TX power", options: [[I_TX0, "0 dBm (6.1 mA)"], [I_TX5, "5 dBm (9.1 mA)"]], value: I_TX0 });
    const cv = h("canvas", { style: "height:96px", "aria-label": "Duty-cycled CSMA timeline" });
    view.append(h("div", { class: "stage" }, [cv]), stateLegend(["tx", "rx", "listen", "sleep"]));
    const stats = NES.stats(view, [{ key: "dc", label: "Node radio duty cycle" }, { key: "node", label: "Node average current" }, { key: "life", label: "Node battery life" }, { key: "ap", label: "AP average current" }]);
    const verdict = verdictBox(view);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const rows = [
        { name: "Dev", base: "sleep", segs: [[3, 4, "rx", "cca"], [4, 9, "tx", "frame"], [9, 10.5, "rx", "ack"]] },
        { name: "AP", base: "listen", segs: [[4, 9, "rx", "frame"], [9, 10.5, "tx", "ack"]] },
      ];
      drawTimeline(ctx, w, hh, rows, 16, {});
    });
    function update() {
      const Tms = T.value * 1000, q = I_RX * (T_CCA + T_ACKW) + ptx.value * T_FRAME, on = T_CCA + T_FRAME + T_ACKW;
      const node = q / Tms + I_SLEEP * (1 - on / Tms), life = 225 / node;
      stats.set("dc", sig((on / Tms) * 100, 2) + "%");
      stats.set("node", fmtCur(node));
      stats.set("life", fmtLife(life), life > 24 * 365 ? "good" : "warn");
      stats.set("ap", fmtCur(I_RX), "warn");
      setVerdict(verdict, "good", "<b>The AP draws about " + sig(I_RX / node, 2) + " times more current than the node.</b> That is fine because it is mains-powered: by staying in RX permanently it lets every battery node sleep and wake up only when it has something to say. " +
        "Per report the node spends " + q.toFixed(1) + " µC; the rest of the time it sleeps." + (life > 24 * 365 * 10 ? " (Over decades, battery self-discharge and the rest of the board would limit the lifetime long before the radio does.)" : ""));
      draw();
    }
    T.onchange = ptx.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: downlink through the receive window
     ===================================================================== */
  function labDownlink(el) {
    const { controls, view } = NES.lab(el, {
      title: "Waiting for the next uplink",
      hint: "The AP cannot reach a sleeping node. A downlink message waits at the AP until the node's next uplink; the ACK then asks the node to stay in RX for a receive window. Messages arrive at random times (seeded).",
    });
    const T = NES.slider(controls, { label: "Uplink every", min: 0, max: 2.78, step: 0.02, value: Math.log10(60), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtTime(v * 1000) });
    const again = h("button", { class: "btn", type: "button", text: "New downlink message" });
    controls.append(again);
    const cv = h("canvas", { style: "height:110px", "aria-label": "Downlink delay timeline" });
    view.append(h("div", { class: "stage" }, [cv]), stateLegend(["tx", "rx", "listen", "sleep"]));
    const stats = NES.stats(view, [{ key: "this", label: "This message waited" }, { key: "avg", label: "Average wait" }, { key: "max", label: "Worst case" }]);
    const verdict = verdictBox(view);
    let seed = 21, frac = 0.37;
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const span = 3.3, up = [0.15, 1.15, 2.15], arr = 0.2 + frac * 1.9, deliver = up.find((u) => u > arr);
      const blk = 0.09;
      const dev = { name: "Node", base: "sleep", segs: [] }, apr = { name: "AP", base: "listen", segs: [] };
      up.forEach((u) => {
        dev.segs.push([u, u + blk, "tx", ""], [u + blk, u + 2 * blk, "rx", ""]);
        apr.segs.push([u, u + blk, "rx", ""], [u + blk, u + 2 * blk, "tx", ""]);
        if (u === deliver) { dev.segs.push([u + 2 * blk, u + 4 * blk, "rx", "data"]); apr.segs.push([u + 2 * blk, u + 4 * blk, "tx", "data"]); }
      });
      const X = drawTimeline(ctx, w, hh - 18, [dev, apr], span, { minW: 3 });
      const y = hh - 10;
      line(ctx, X(arr), 6, X(arr), hh - 22, NES.css("--accent"), 1.5, [3, 3]);
      text(ctx, "message arrives", X(arr) + 4, y, NES.css("--accent"), "left", 10);
      line(ctx, X(arr), hh - 24, X(deliver), hh - 24, NES.css("--accent"), 2);
    });
    function update() {
      const Tms = T.value * 1000, arr = 0.2 + frac * 1.9, k = [0.15, 1.15, 2.15].find((u) => u > arr);
      const wait = (k - arr) * Tms;
      stats.set("this", fmtTime(wait));
      stats.set("avg", fmtTime(Tms / 2));
      stats.set("max", fmtTime(Tms));
      setVerdict(verdict, Tms <= 10000 ? "good" : "warn", "<b>Average downlink delay = T / 2 = " + fmtTime(Tms / 2) + ".</b> A message arriving at a random moment waits between 0 and one uplink period. Reporting more often cuts the delay but costs the node energy: the downlink delay is the price of letting the node sleep.");
      draw();
    }
    T.onchange = update;
    again.addEventListener("click", () => { const r = NES.rng(seed); seed = (seed * 69621 + 1) % 2147483647; frac = r(); update(); });
    update();
  }

  /* =====================================================================
     LAB: contention-based vs contention-free
     ===================================================================== */
  function labContention(el) {
    const { controls, view } = NES.lab(el, {
      title: "Car lanes or bus lanes?",
      hint: "Simplified cycle model. Each of N devices has a frame in a cycle with probability p (the traffic load). Contention-free: N reserved slots, one per device. Contention-based: K shared slots, each active device picks one at random and succeeds only if it is alone.",
    });
    const N = NES.slider(controls, { label: "Devices N", min: 2, max: 30, step: 1, value: 10, fmt: (v) => String(v) });
    const K = NES.slider(controls, { label: "Shared slots K", min: 1, max: 30, step: 1, value: 4, fmt: (v) => String(v) });
    const p = NES.slider(controls, { label: "Traffic load p", min: 1, max: 100, step: 1, value: 15, fmt: (v) => v + "%" });
    const cv = h("canvas", { style: "height:210px", "aria-label": "Airtime per delivered frame versus load" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--lo)"></i>contention-free (N slots)</span><span><i style="background:var(--hi)"></i>contention-based (K slots)</span>` }));
    const stats = NES.stats(view, [{ key: "cf", label: "Free: slots per delivery" }, { key: "cb", label: "Contention: slots per delivery" }, { key: "lost", label: "Contention: frames collided" }, { key: "waste", label: "Free: idle slots per cycle" }]);
    const verdict = verdictBox(view);
    const ps = (pp) => Math.pow(1 - pp / K.value, N.value - 1);
    const cfCost = (pp) => N.value / (N.value * pp), cbCost = (pp) => K.value / (N.value * pp * ps(pp));
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 8, padT = 8, padB = 22, ylo = 0, yhi = 2.5;
      const X = (pp) => padL + pp * (w - padL - padR);
      const Y = (v) => padT + (1 - (Math.log10(v) - ylo) / (yhi - ylo)) * (hh - padT - padB);
      [1, 3, 10, 30, 100, 300].forEach((v) => { line(ctx, padL, Y(v), w - padR, Y(v), NES.css("--grid")); text(ctx, String(v), padL - 5, Y(v), NES.css("--muted"), "right", 10); });
      [0, 0.25, 0.5, 0.75, 1].forEach((pp) => text(ctx, pp * 100 + "%", X(pp), hh - 9, NES.css("--muted"), pp === 0 ? "left" : pp === 1 ? "right" : "center", 10));
      [[cfCost, "--lo"], [cbCost, "--hi"]].forEach(([fn, c]) => {
        ctx.strokeStyle = NES.css(c); ctx.lineWidth = 2.2; ctx.beginPath(); let started = false;
        for (let k = 1; k <= 100; k++) { const pp = k / 100, v = fn(pp); if (!isFinite(v) || v <= 0) continue; const y = Y(Math.min(Math.pow(10, yhi), Math.max(1, v))); started ? ctx.lineTo(X(pp), y) : (ctx.moveTo(X(pp), y), (started = true)); }
        ctx.stroke();
      });
      line(ctx, X(p.value / 100), padT, X(p.value / 100), hh - padB, NES.css("--accent"), 1.5, [4, 3]);
      text(ctx, "slots of airtime per delivered frame", padL + 4, padT + 6, NES.css("--muted"), "left", 10);
    });
    function update() {
      const pp = p.value / 100, n = N.value, k = K.value;
      const cf = cfCost(pp), cb = cbCost(pp), succ = ps(pp);
      stats.set("cf", cf.toFixed(1), cf <= cb ? "good" : "");
      stats.set("cb", isFinite(cb) ? cb.toFixed(1) : "∞", cb < cf ? "good" : "");
      stats.set("lost", ((1 - succ) * 100).toFixed(0) + "%", succ > 0.8 ? "" : "bad");
      stats.set("waste", (n * (1 - pp)).toFixed(1) + " of " + n);
      setVerdict(verdict, "", cb < cf
        ? "<b>Contention wins at this load.</b> Few devices are active, so " + k + " shared slots rarely collide (" + ((1 - succ) * 100).toFixed(0) + "% of frames), while the reserved slots of silent devices sit idle (" + (n * (1 - pp)).toFixed(1) + " per cycle). Car lanes: shared, fine when traffic is light."
        : "<b>Reserved slots win at this load.</b> With many active devices, " + ((1 - succ) * 100).toFixed(0) + "% of contending frames collide (and would have to be retransmitted), while every reserved slot carries a frame most of the time. Bus lanes: guaranteed, efficient when traffic is heavy and predictable.");
      draw();
    }
    [N, K, p].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: multi-hop, many short links or one long link
     ===================================================================== */
  const perCurve = (rssi) => 1 / (1 + Math.exp((rssi + 96.5) / 0.9));
  function labMultihop(el) {
    const { controls, view } = NES.lab(el, {
      title: "One long hop or several short ones?",
      hint: "Split a distance into k equal hops. Each hop's RSSI follows the path-loss model (2.4 GHz, exponent n), its packet error rate follows a curve shaped like the slide 15 measurement (illustrative), and each hop retries until it succeeds: 1 / (1 - PER) transmissions on average.",
    });
    const D = NES.slider(controls, { label: "Total distance", min: 50, max: 400, step: 10, value: 300, fmt: (v) => v + " m" });
    const k = NES.slider(controls, { label: "Hops k", min: 1, max: 6, step: 1, value: 3, fmt: (v) => String(v) });
    const n = NES.seg(controls, { label: "Environment (exponent n)", options: [[2.5, "open (2.5)"], [3, "indoor (3)"]], value: 3 });
    const ptx = NES.seg(controls, { label: "TX power", options: [[0, "0 dBm"], [5, "5 dBm"]], value: 0 });
    const cv = h("canvas", { style: "height:200px", "aria-label": "Total transmissions per delivered frame versus hop count" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "rssi", label: "RSSI per hop" }, { key: "per", label: "PER per hop" }, { key: "tot", label: "Transmissions per frame" }, { key: "best", label: "Best hop count" }]);
    const verdict = verdictBox(view);
    const F1 = fspl1m(2.44e9);
    const calc = (kk) => { const d = D.value / kk, rssi = ptx.value - (F1 + 10 * n.value * Math.log10(d)), per = perCurve(rssi); return { d, rssi, per, tot: per > 0.995 ? Infinity : kk / (1 - per) }; };
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 34, padR = 8, padT = 10, padB = 22, cap = 20;
      const Y = (v) => padT + (1 - Math.min(cap, v) / cap) * (hh - padT - padB);
      [0, 5, 10, 15, 20].forEach((v) => { line(ctx, padL, Y(v), w - padR, Y(v), NES.css("--grid")); text(ctx, String(v), padL - 5, Y(v), NES.css("--muted"), "right", 10); });
      const cw = (w - padL - padR) / 6;
      let best = null;
      for (let kk = 1; kk <= 6; kk++) { const c = calc(kk); if (!best || c.tot < best.tot) best = { kk, tot: c.tot }; }
      for (let kk = 1; kk <= 6; kk++) {
        const c = calc(kk), x = padL + (kk - 1) * cw + cw * 0.2, bw = cw * 0.6;
        ctx.fillStyle = NES.css(kk === k.value ? "--accent" : best && kk === best.kk ? "--ok" : "--tech");
        ctx.globalAlpha = kk === k.value ? 1 : 0.6;
        const v = isFinite(c.tot) ? c.tot : cap;
        ctx.fillRect(x, Y(v), bw, Y(0) - Y(v));
        ctx.globalAlpha = 1;
        text(ctx, isFinite(c.tot) ? c.tot.toFixed(1) : "no link", x + bw / 2, Y(v) - 8, NES.css("--ink"), "center", 10, true);
        text(ctx, kk + (kk === 1 ? " hop" : ""), x + bw / 2, hh - 9, NES.css("--muted"), "center", 10);
      }
    });
    function update() {
      const c = calc(k.value);
      let best = null;
      for (let kk = 1; kk <= 6; kk++) { const cc = calc(kk); if (!best || cc.tot < best.tot) best = { kk, tot: cc.tot }; }
      stats.set("rssi", fmtDbm(c.rssi) + " over " + sig(c.d, 3) + " m");
      stats.set("per", c.per > 0.995 ? "≈ 100%" : (c.per * 100).toFixed(c.per < 0.01 ? 2 : 1) + "%", c.per < 0.05 ? "good" : c.per < 0.5 ? "warn" : "bad");
      stats.set("tot", isFinite(c.tot) ? c.tot.toFixed(2) : "link unusable", isFinite(c.tot) ? (k.value === best.kk ? "good" : "") : "bad");
      stats.set("best", isFinite(best.tot) ? best.kk + " hops, " + best.tot.toFixed(2) : "none works", "good");
      setVerdict(verdict, isFinite(c.tot) ? (k.value === best.kk ? "good" : "warn") : "bad", !isFinite(c.tot)
        ? "<b>No usable link:</b> hops of " + sig(c.d, 3) + " m arrive at " + c.rssi.toFixed(1) + " dBm, where almost every packet is lost. Add hops to shorten the links."
        : "<b>" + k.value + " hop" + (k.value > 1 ? "s" : "") + ": " + c.tot.toFixed(2) + " transmissions per delivered frame.</b> More hops mean more transmissions (cost increase), but shorter links are more robust (cost decrease). Here the best trade-off is " + best.kk + " hops; beyond it, extra hops only add transmissions.");
      draw();
    }
    [D, k, n, ptx].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: duty-cycled MAC for symmetric energy limits (4 schemes)
     ===================================================================== */
  const I_WUR = 0.005;
  const DUR = { sample: 1.5, rts: 0.5, gap: 0.5, cts: 0.5, frame: 2, ack: 0.5, beacon: 0.5, riListen: 2, wake: 2, cca: 0.128, sync: 0.5 };
  function asyncModel(mode, P, Tp, A) {
    let idle, send, recv, delay;
    if (mode === "lpl") {
      idle = (I_RX * DUR.sample) / P;
      send = (P / 2) * ((I_TX0 * DUR.rts + I_RX * DUR.gap) / (DUR.rts + DUR.gap)) + I_RX * DUR.cts + I_TX0 * DUR.frame + I_RX * DUR.ack;
      recv = I_TX0 * DUR.cts + I_RX * DUR.frame + I_TX0 * DUR.ack;
      delay = P / 2;
    } else if (mode === "ri") {
      idle = (I_TX0 * DUR.beacon + I_RX * DUR.riListen) / P;
      send = (P / 2) * I_RX + I_TX0 * DUR.frame + I_RX * DUR.ack;
      recv = I_RX * DUR.frame + I_TX0 * DUR.ack;
      delay = P / 2;
    } else if (mode === "wur") {
      idle = I_WUR;
      send = I_TX0 * DUR.wake + I_TX0 * DUR.frame + I_RX * DUR.ack;
      recv = I_RX * DUR.frame + I_TX0 * DUR.ack;
      delay = DUR.wake + DUR.frame;
    } else {
      const guard = 40e-6 * P;
      idle = (I_RX * (A + 2 * guard + DUR.sync)) / P;
      send = I_RX * DUR.cca + I_TX0 * DUR.frame + I_RX * DUR.ack;
      recv = I_RX * DUR.frame + I_TX0 * DUR.ack;
      delay = P / 2;
    }
    const traffic = (send + recv) / Tp;
    return { idle, traffic, total: I_SLEEP + idle + traffic, delay };
  }
  const MODES = [["lpl", "Sender"], ["ri", "Receiver"], ["wur", "Wakeup"], ["sync", "Sync"]];
  const MODE_NAME = { lpl: "Sender-initiated (LPL)", ri: "Receiver-initiated", wur: "Wakeup radio", sync: "Synchronous" };
  function exchangeRows(mode) {
    const s = 0.07;
    if (mode === "lpl") {
      const d1 = { name: "Dev 1", base: "sleep", segs: [[0.3, 0.3 + s, "listen", ""]] }, d2 = { name: "Dev 2", base: "sleep", segs: [[0.1, 0.1 + s, "listen", ""]] };
      for (let t = 0.45; t < 1.1; t += 0.14) d1.segs.push([t, t + 0.07, "tx", "rts"], [t + 0.07, t + 0.14, "listen", ""]);
      const t0 = 1.13;
      d2.segs.push([1.1, t0, "listen", ""], [t0, t0 + 0.07, "rx", "rts"], [t0 + 0.07, t0 + 0.14, "tx", "cts"], [t0 + 0.14, t0 + 0.42, "rx", "frame"], [t0 + 0.42, t0 + 0.5, "tx", "ack"], [2.1, 2.1 + s, "listen", ""]);
      d1.segs.push([t0, t0 + 0.07, "tx", "rts"], [t0 + 0.07, t0 + 0.14, "rx", "cts"], [t0 + 0.14, t0 + 0.42, "tx", "frame"], [t0 + 0.42, t0 + 0.5, "rx", "ack"], [1.9, 1.9 + s, "listen", ""]);
      return [d1, d2];
    }
    if (mode === "ri") {
      const d1 = { name: "Dev 1", base: "sleep", segs: [[0.3, 0.37, "tx", "cts"], [0.37, 0.44, "listen", ""], [0.45, 1.1, "listen", ""]] };
      const d2 = { name: "Dev 2", base: "sleep", segs: [[0.1, 0.17, "tx", "cts"], [0.17, 0.24, "listen", ""]] };
      const t0 = 1.1;
      d2.segs.push([t0, t0 + 0.07, "tx", "cts"], [t0 + 0.07, t0 + 0.35, "rx", "frame"], [t0 + 0.35, t0 + 0.43, "tx", "ack"], [2.1, 2.17, "tx", "cts"], [2.17, 2.24, "listen", ""]);
      d1.segs.push([t0, t0 + 0.07, "rx", "cts"], [t0 + 0.07, t0 + 0.35, "tx", "frame"], [t0 + 0.35, t0 + 0.43, "rx", "ack"], [1.9, 1.97, "tx", "cts"], [1.97, 2.04, "listen", ""]);
      return [d1, d2];
    }
    if (mode === "wur") {
      const t0 = 0.45;
      return [
        { name: "Dev 1", base: "listen", segs: [[t0, t0 + 0.08, "wtx", "rts"], [t0 + 0.08, t0 + 0.36, "tx", "frame"], [t0 + 0.36, t0 + 0.44, "rx", "ack"]] },
        { name: "Dev 2", base: "listen", segs: [[t0, t0 + 0.08, "wrx", "rts"], [t0 + 0.08, t0 + 0.36, "rx", "frame"], [t0 + 0.36, t0 + 0.44, "tx", "ack"]] },
      ];
    }
    const act = (a) => [[0.1, 0.1 + a, "listen", ""], [1.1, 1.1 + a, "listen", ""], [2.1, 2.1 + a, "listen", ""]];
    const a = 0.32;
    return [
      { name: "Dev 1", base: "sleep", segs: act(a).concat([[1.14, 1.16, "rx", ""], [1.16, 1.36, "tx", "frame"], [1.36, 1.42, "rx", "ack"]]) },
      { name: "Dev 2", base: "sleep", segs: act(a).concat([[1.16, 1.36, "rx", "frame"], [1.36, 1.42, "tx", "ack"]]) },
    ];
  }
  function makeAsyncLab(defaultMode) {
    return function (el) {
      const { controls, view } = NES.lab(el, {
        title: "Duty-cycled MAC without a mains-powered receiver",
        hint: "Two battery nodes, each sending one frame to the other every T<sub>p</sub>. Energy model with the CC2650 currents and assumed durations (channel sample 1.5 ms, RTS/CTS/beacon 0.5 ms, frame 2 ms, ACK 0.5 ms, wakeup receiver 5 µA, sleep 1 µA, coin cell 225 mAh). The timeline sketches one exchange, not to scale.",
      });
      const mode = NES.seg(controls, { label: "Scheme", options: MODES, value: defaultMode });
      const P = NES.slider(controls, { label: "Listening PERIOD", min: 1, max: 3.3, step: 0.02, value: Math.log10(250), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtTime(v) });
      const Tp = NES.slider(controls, { label: "One frame every T<sub>p</sub>", min: 0, max: 2.78, step: 0.02, value: Math.log10(60), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtTime(v * 1000) });
      const A = NES.slider(controls, { label: "Active period (sync)", min: 2, max: 50, step: 1, value: 10, fmt: (v) => v + " ms" });
      const cvT = h("canvas", { style: "height:86px", "aria-label": "One exchange in the chosen scheme" });
      const cv = h("canvas", { style: "height:190px", "aria-label": "Average current versus listening period" });
      const legend = h("div");
      view.append(h("div", { class: "stage" }, [cvT]), legend, h("div", { class: "stage" }, [cv]));
      const stats = NES.stats(view, [{ key: "i", label: "Average current per node" }, { key: "life", label: "Battery life" }, { key: "delay", label: "Average delay" }, { key: "idle", label: "Idle (no traffic) share" }]);
      const verdict = verdictBox(view);
      const drawT = NES.canvas(cvT, (ctx, w, hh) => { drawTimeline(ctx, w, hh, exchangeRows(mode.value), 2.4, {}); });
      const draw = NES.canvas(cv, (ctx, w, hh) => {
        const padL = 46, padR = 8, padT = 24, padB = 22, xlo = 1, xhi = 3.3, ylo = -2.7, yhi = 0;
        const X = (e) => padL + ((e - xlo) / (xhi - xlo)) * (w - padL - padR);
        const Y = (I) => padT + (1 - (Math.log10(I) - ylo) / (yhi - ylo)) * (hh - padT - padB);
        [0.003, 0.01, 0.03, 0.1, 0.3, 1].forEach((I) => { line(ctx, padL, Y(I), w - padR, Y(I), NES.css("--grid")); text(ctx, fmtCur(I).replace(" ", ""), padL - 4, Y(I), NES.css("--muted"), "right", 9.5); });
        [[1, "10 ms"], [2, "100 ms"], [3, "1 s"]].forEach(([e, l]) => text(ctx, l, X(e), hh - 9, NES.css("--muted"), "center", 10));
        MODES.forEach(([m]) => {
          ctx.strokeStyle = NES.css(m === mode.value ? "--accent" : "--line-2"); ctx.lineWidth = m === mode.value ? 2.4 : 1.2; ctx.beginPath();
          for (let k = 0; k <= 80; k++) { const e = xlo + ((xhi - xlo) * k) / 80; const I = asyncModel(m, Math.pow(10, e), Tp.value * 1000, A.value).total; const y = Y(Math.min(1, Math.max(Math.pow(10, ylo), I))); k ? ctx.lineTo(X(e), y) : ctx.moveTo(X(e), y); }
          ctx.stroke();
        });
        const I = asyncModel(mode.value, P.value, Tp.value * 1000, A.value).total;
        ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(Math.log10(P.value)), Y(Math.min(1, Math.max(Math.pow(10, ylo), I))), 5, 0, Math.PI * 2); ctx.fill();
        text(ctx, "average current vs PERIOD (grey: the other schemes)", padL + 4, 9, NES.css("--muted"), "left", 10);
      });
      function update() {
        const r = asyncModel(mode.value, P.value, Tp.value * 1000, A.value), life = 225 / r.total;
        A.wrap.style.display = mode.value === "sync" ? "" : "none";
        P.wrap.style.opacity = mode.value === "wur" ? "0.5" : "";
        legend.replaceChildren(stateLegend(mode.value === "wur" ? ["tx", "rx", "wtx", "wrx", "listen"] : ["tx", "rx", "listen", "sleep"]));
        stats.set("i", fmtCur(r.total));
        stats.set("life", fmtLife(life), life > 24 * 365 ? "good" : life > 24 * 60 ? "warn" : "bad");
        stats.set("delay", fmtTime(r.delay), r.delay < 50 ? "good" : r.delay < 1000 ? "warn" : "bad");
        stats.set("idle", ((r.idle / r.total) * 100).toFixed(0) + "%");
        let best = null;
        for (let k = 0; k <= 115; k++) { const e = 1 + (2.3 * k) / 115; const I = asyncModel(mode.value, Math.pow(10, e), Tp.value * 1000, A.value).total; if (!best || I < best.I) best = { P: Math.pow(10, e), I }; }
        const txt = {
          lpl: "Receivers only sample the channel briefly once per PERIOD; a sender strobes RTS until the receiver's next sample, half a PERIOD on average. Short PERIOD: more idle sampling. Long PERIOD: senders strobe longer and wait longer.",
          ri: "Every node beacons once per PERIOD and listens briefly; a sender listens until its destination's beacon, half a PERIOD on average. The curve is close to sender-initiated, as the slide says: comparable performance.",
          wur: "The wakeup receiver listens all the time at microwatt level, so there is no PERIOD to wait for: delay is a few milliseconds and idle listening costs almost nothing. The price is extra hardware and limited wakeup range.",
          sync: "Nodes agree on when the active periods start (Week 9 synchronisation), with a guard time for the up to 40 ppm relative drift. Idle listening is limited to the active period: reduced, but not eliminated.",
        }[mode.value];
        setVerdict(verdict, "", "<b>" + MODE_NAME[mode.value] + ": " + fmtCur(r.total) + " per node, " + fmtLife(life) + ".</b> " + txt + (mode.value !== "wur" ? " For this traffic the lowest current is at a PERIOD of about " + fmtTime(best.P) + "." : ""));
        drawT(); draw();
      }
      [mode, P, Tp, A].forEach((c) => (c.onchange = update));
      update();
    };
  }

  function labSortMac(el) {
    sorterLab(el, {
      title: "Which class of MAC protocol?",
      hint: "Slide 38 classifies MAC protocols by who has to duty cycle the radio. Decide for each scenario.",
      ask: "Who has energy constraints here?",
      choices: [["none", "No duty cycle"], ["end", "End devices duty cycle"], ["all", "All devices duty cycle"]],
      items: [
        ["A WiFi router and a desktop PC, both on mains power", "none", "No energy constraints anywhere, so no radio needs to sleep: plain CSMA/CA as on slide 22."],
        ["Battery sensors reporting to a mains-powered gateway (star)", "end", "Energy constraints only on the end devices: duty-cycled CSMA or guaranteed time slots, with the gateway always listening."],
        ["A mesh of battery-powered nodes relaying each other's data", "all", "Every node is both sender and receiver and runs on batteries: symmetric energy limitations, so all radios duty cycle (synchronously or asynchronously)."],
        ["Alice and Bob with two battery-powered walkie-talkies", "all", "The slide's own example of symmetric energy limitations."],
        ["LoRaWAN sensors talking to an always-on gateway on mains power", "end", "LoRaWAN is listed as a variation of duty cycling with asymmetric energy availability."],
        ["A star network whose gateway also runs on batteries", "all", "Slide 33: symmetric limitations also arise in star topologies when the GW is battery-powered."],
      ],
      summary: "No duty cycle when nobody has energy limits; end devices duty cycle when an always-on AP/GW exists; all devices duty cycle (synchronous, or asynchronous: sender-initiated, receiver-initiated, wakeup radio) when nobody can listen all the time.",
    });
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    "sort-wired": labSortWired,
    db: labDb,
    dbm: labDbm,
    budget: labBudget,
    pathloss: labPathloss,
    antenna: labAntenna,
    reception: labReception,
    capture: labCapture,
    per: labPer,
    bfsk: labBfsk,
    band: labBand,
    channels: labChannels,
    csmaca: labCsmaca,
    retx: labRetx,
    dutycycle: labDutycycle,
    uplink: labUplink,
    downlink: labDownlink,
    contention: labContention,
    multihop: labMultihop,
    "async-lpl": makeAsyncLab("lpl"),
    "async-ri": makeAsyncLab("ri"),
    "async-wur": makeAsyncLab("wur"),
    "async-sync": makeAsyncLab("sync"),
    "sort-mac": labSortMac,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("wireless-nes", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
