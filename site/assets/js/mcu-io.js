/* MCU Input/Output: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const VS = 3.3;
  const sub = (s) => "<sub>" + s + "</sub>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "digital-logic": [
      {
        q: "A 3.3 V MCU uses a single threshold at V" + sub("S") + "/2. The line is measured at 2.1 V. What does the MCU read?",
        options: [
          ["'0', because 2.1 V is far from 3.3 V", false, "The input does not care how close the voltage is to V" + sub("S") + ". It only checks which side of the threshold (3.3 / 2 = 1.65 V) the voltage is on. 2.1 V is above it."],
          ["'1', because 2.1 V is above 1.65 V", true, "The threshold is V" + sub("S") + "/2 = 1.65 V. Everything above it counts as '1', even if it is well below the ideal 3.3 V. That tolerance is exactly what makes digital logic robust."],
          ["Nothing: only exactly 0 V or 3.3 V are valid", false, "Real wires never sit at exactly 0 V or 3.3 V. If only perfect values were accepted, digital logic would not work at all. A threshold maps a whole range of voltages to each bit."],
          ["It reads the number 2.1", false, "Producing a number from a voltage is the job of an ADC. A digital input only ever gives you one bit: '0' or '1'."],
        ],
      },
      {
        q: "Why is a digital signal robust against noise?",
        options: [
          ["Digital wires are shielded, so noise cannot enter", false, "Digital wires pick up noise just like analog ones (look at the wiggly trace in the slide figure). The robustness comes from how the voltage is interpreted, not from the wire."],
          ["The MCU averages many readings of every bit", false, "Averaging (oversampling) is an ADC technique. A plain digital input makes one threshold decision per read."],
          ["Small disturbances do not move the voltage across the threshold, so the bit is recovered exactly", true, "As long as the noise is smaller than the distance to the threshold, the decision comes out the same and the original bit is recovered perfectly. Analog values, by contrast, are permanently changed by any noise."],
          ["Noise only affects '0' bits", false, "Noise is added to the whole signal regardless of the bit value. Both '0' and '1' can be flipped if the noise is large enough."],
        ],
      },
    ],

    gpio: [
      {
        q: "Which of these is <em>not</em> something a plain GPIO pin can do?",
        options: [
          ["Drive the line high ('1')", false, "Setting a pin high is one of the three basic GPIO operations."],
          ["Drive the line low ('0')", false, "Setting a pin low is one of the three basic GPIO operations."],
          ["Read whether the line is high or low", false, "Reading the logic level of the line is the third basic GPIO operation."],
          ["Tell you the line is at 1.37 V", true, "A GPIO only deals in logic levels. Measuring an actual voltage needs an ADC, which on the nRF52832 is reachable on specific pins labelled AIN0 to AIN7."],
        ],
      },
      {
        q: "On the nRF52832 pin diagram, pin P0.02 is also labelled AIN0. What does that tell you?",
        options: [
          ["The pin is shared: it can be a GPIO or an analog (ADC) input, depending on how software configures it", true, "Chips have more internal functions than physical pins, so pins are multiplexed. Firmware decides which function is connected to the pin at any time."],
          ["There are two physical pins with the number 2", false, "It is a single physical pin with two names, one per function it can take on."],
          ["The pin can only ever be used as an analog input", false, "The P0.02 name shows it is also a normal GPIO. The analog function is optional."],
          ["The pin is reserved and must not be used", false, "Reserved pins are usually marked NC or not listed. AIN0 is a real, useful function."],
        ],
      },
    ],

    "push-pull": [
      {
        q: "A push-pull GPIO outputs '0'. What is the state of its two internal switches?",
        options: [
          ["Upper switch (to V" + sub("S") + ") closed, lower switch (to ground) open", false, "That is the state for '1': the pin is pushed up to V" + sub("S") + "."],
          ["Upper switch open, lower switch closed", true, "The MCU pulls the pin to ground by closing the lower switch, and opens the upper one so V" + sub("S") + " is not connected at the same time."],
          ["Both closed", false, "That would connect V" + sub("S") + " directly to ground inside the chip: a short circuit. The two switches are always driven in opposite states."],
          ["Both open", false, "Both open means the pin is disconnected (high impedance). Plain push-pull cannot do that: it always actively drives one of the two levels."],
        ],
      },
      {
        q: "Why is the mode called push-pull?",
        options: [
          ["The user pushes a button and the MCU pulls the value", false, "The name is about how the output drives the line, not about user input."],
          ["It needs an external pull-up resistor to push the line high", false, "That describes open-drain. Push-pull drives both levels by itself and needs no resistor."],
          ["It actively pushes the line up to V" + sub("S") + " for '1' and actively pulls it down to ground for '0'", true, "Both levels are driven with a low-resistance switch, which also gives fast, clean edges in both directions."],
          ["It alternates between push and pull very fast", false, "It holds one state until software changes it. Fast switching would be PWM, a different topic."],
        ],
      },
    ],

    "source-sink": [
      {
        q: "An LED (with resistor) is connected from V" + sub("S") + " to a GPIO, so the GPIO is a current sink. Your code writes '1' to the pin. What happens?",
        options: [
          ["The LED turns on", false, "That would be true for a source configuration (LED to ground). In a sink configuration the LED lights only when the pin pulls its end down to ground, i.e. when you write '0'."],
          ["The LED turns off", true, "Both ends of the LED branch are now at V" + sub("S") + ". With no voltage difference there is no current, so the LED is dark. The logic is reversed (active-low)."],
          ["The LED glows at half brightness", false, "A digital output is either at V" + sub("S") + " or at ground. There is no half state. Half brightness is what PWM is for."],
          ["The GPIO is damaged", false, "Nothing unusual happens: no current flows at all when both ends are at V" + sub("S") + "."],
        ],
      },
      {
        q: "A 3.3 V GPIO drives a red LED (forward voltage about 2 V) through a 47 Ω resistor. What is the problem?",
        options: [
          ["47 Ω is too large, so the LED will not light", false, "A larger resistor means less current. 47 Ω is actually too small."],
          ["The current is about (3.3 - 2) / 47 ≈ 28 mA, far above the few mA a normal GPIO can supply", true, "GPIO outputs are typically limited to about 2 to 12 mA. A resistor of around 330 Ω gives (1.3 V / 330 Ω) ≈ 4 mA, which is safe and still clearly visible."],
          ["LEDs can never be powered from a GPIO", false, "Small indicator LEDs are the classic GPIO load, as long as the current stays within the pin limit."],
          ["It is fine if the LED is wired as a sink instead", false, "Sink current is limited too. Changing the direction does not remove the limit."],
        ],
      },
    ],

    "two-mcus": [
      {
        q: "MCU1 and MCU2 share a line, both in push-pull mode. MCU1 writes '1' and MCU2 writes '0'. What happens?",
        options: [
          ["The line is '1', because a '1' always wins", false, "Neither side wins. Both actively drive, so the line sits at an undefined voltage somewhere in between while a large current flows."],
          ["The line is '0', because a '0' always wins", false, "'0 wins' is how an open-drain bus with a pull-up behaves. With push-pull, both drivers fight."],
          ["A short circuit: current flows from V" + sub("S") + " through MCU1 and MCU2 to ground", true, "MCU1 closes its upper switch and MCU2 its lower switch. That forms a low-resistance path from supply to ground, limited only by the transistors' tiny on-resistance. The pins heat up and can be destroyed."],
          ["Nothing bad, the value is just unknown", false, "The value is unknown, but that is the smaller problem. The large short-circuit current can damage both chips."],
        ],
      },
      {
        q: "What does the lecture conclude is needed to share a line safely?",
        options: [
          ["An option to disconnect the output, so only one device drives the line at a time", true, "Two states ('0' and '1') are not enough. A third, disconnected state lets every device that is not talking step off the line."],
          ["A higher supply voltage", false, "A higher voltage only makes the short-circuit current larger."],
          ["Making both MCUs always write the same value", false, "That only works by perfect coordination. A single firmware bug or timing slip would cause a short. The robust fix is the ability to disconnect."],
          ["Faster MCUs", false, "Speed has nothing to do with it. The conflict is electrical, not about timing."],
        ],
      },
    ],

    tristate: [
      {
        q: "A GPIO output has EN = 0 and A = 1. What is on the output pin?",
        options: [
          ["'1'", false, "A = 1 is ignored while the output is disabled. A only matters when EN = 1."],
          ["'0'", false, "EN = 0 does not mean 'drive 0'. It means 'do not drive at all'."],
          ["Hi-Z: the pin is disconnected", true, "With EN = 0 the enable switch is open, so neither V" + sub("S") + " nor ground reaches the pin, whatever A says."],
          ["A short circuit", false, "Disabling the output is the opposite of a short: no current path exists at all."],
        ],
      },
      {
        q: "What does 'high impedance' (Hi-Z) mean electrically?",
        options: [
          ["The output is at a high voltage", false, "Hi-Z is about resistance, not voltage. A Hi-Z pin has no voltage of its own; the rest of the circuit decides it."],
          ["The output behaves like a huge resistance, so practically no current flows through it: an open circuit", true, "The transistors are switched fully off. Their resistance is so high (megaohms or more) that the pin is effectively not connected."],
          ["The output supplies extra current", false, "It is the opposite: a Hi-Z output supplies essentially no current."],
          ["The output toggles between '0' and '1'", false, "That describes what you might <em>read</em> from a floating line. Hi-Z itself is a steady, disconnected state."],
        ],
      },
    ],

    hysteresis: [
      {
        q: "An input with V" + sub("S") + " = 3.3 V and hysteresis V" + sub("H") + " = 0.3 V currently reads '0'. The voltage slowly rises to 1.8 V. What does it read?",
        options: [
          ["'1', because 1.8 V is above 1.65 V", false, "That is the rule for a plain comparator. With hysteresis the rising threshold moves up to 1.65 + 0.3 = 1.95 V."],
          ["'0'", true, "To go from '0' to '1' the voltage has to exceed V" + sub("S") + "/2 + V" + sub("H") + " = 1.95 V. 1.8 V is not enough, so the input stays at '0'."],
          ["It oscillates between '0' and '1'", false, "Oscillation around a single threshold is exactly the problem hysteresis removes."],
          ["It is undefined", false, "The output is always defined. Inside the band it simply keeps its previous value."],
        ],
      },
      {
        q: "Same input (switches up at 1.95 V, down at 1.35 V) now reads '1'. The voltage falls to 1.5 V. What does it read?",
        options: [
          ["'1'", true, "To return to '0' the voltage must fall below 1.35 V. 1.5 V is inside the hysteresis band, so the input keeps its previous value. The input has memory."],
          ["'0', because 1.5 V is below V" + sub("S") + "/2", false, "It is below 1.65 V, but still above the falling threshold of 1.35 V."],
          ["Undefined, because it is inside the band", false, "Inside the band the output is well defined: it is whatever it was before."],
          ["It depends on the noise", false, "Only noise large enough to push the voltage below 1.35 V could change it. That is the whole point: small noise is ignored."],
        ],
      },
    ],

    "input-hardwired": [
      {
        q: "Two boards run identical firmware. On board A pin 3 is wired to V" + sub("S") + ", on board B to ground. What is this for?",
        options: [
          ["It doubles the current available on pin 3", false, "A hardwired input carries almost no current. It only provides a fixed logic level to read."],
          ["Each board reads pin 3 at start-up and knows which role or identity it has", true, "Same software, different behaviour: the fixed input acts as a configuration or ID bit."],
          ["It turns pin 3 into an output", false, "A hardwired pin must stay an input. Driving it as a push-pull output to the opposite level would short the pin to the rail."],
          ["Nothing: the firmware cannot see it", false, "The firmware reads it like any other GPIO input."],
        ],
      },
      {
        q: "How many distinct board IDs can you encode with 3 hardwired input pins?",
        options: [
          ["3", false, "That would be one pin per board. But pins are bits, and bits combine."],
          ["6", false, "Pins do not add, they multiply: each extra pin doubles the number of combinations."],
          ["8", true, "Each pin is one bit, so 3 pins give 2<sup>3</sup> = 8 combinations (000 to 111)."],
          ["9", false, "That would be 3<sup>2</sup>. Each pin has 2 states and there are 3 pins: 2<sup>3</sup> = 8."],
        ],
      },
    ],

    floating: [
      {
        q: "An input is connected to a line that nobody drives and that has no pull resistor. What will the program read?",
        options: [
          ["Always '0', since no voltage is applied", false, "No driver does not mean 0 V. Without any path to ground, the pin voltage is set by whatever noise couples into it."],
          ["Always '1'", false, "Only a pull-up resistor would guarantee that."],
          ["Unpredictable values: 0, 1, or flipping between them", true, "The pin is floating. Its tiny capacitance picks up electric fields from nearby signals, your finger and mains wiring. It behaves like a small antenna."],
          ["The read fails with an error", false, "The hardware always returns a bit. The problem is that the bit means nothing."],
        ],
      },
      {
        q: "Besides giving random readings, why is a floating CMOS input bad for a battery-powered device?",
        options: [
          ["Its voltage can hover near V" + sub("S") + "/2, where both transistors of the input stage partly conduct and draw current", true, "A CMOS input is cheapest in power when it sits firmly at 0 or V" + sub("S") + ". Near the middle, current flows straight through the input stage, and random toggling adds more. That is why unused pins are pulled, driven or disconnected."],
          ["It turns into an output and drives the line", false, "An input never starts driving on its own."],
          ["It permanently damages the pin", false, "It is not harmful in that way, just unpredictable and slightly wasteful."],
          ["It does not matter, inputs never use power", false, "An ideal input would not, but a real CMOS input stage draws current when its voltage is in the middle region."],
        ],
      },
    ],

    pullup: [
      {
        q: "A GPIO output with a pull-up resistor on the line has EN = 0 (output disabled). What does the other MCU read?",
        options: [
          ["'1'", true, "Nobody drives the line, so the pull-up resistor raises it to V" + sub("S") + ". This is the 'default state' the resistor provides."],
          ["Whatever A is", false, "A only matters when EN = 1. While disabled the output is disconnected."],
          ["Undefined (floating)", false, "It would be floating without the resistor. The pull-up gives the line a defined default."],
          ["'0'", false, "That would be the default with a pull-<em>down</em> resistor."],
        ],
      },
      {
        q: "A 10 kΩ pull-up goes to 3.3 V and a device actively drives the line to '0'. How much current flows through the resistor?",
        options: [
          ["0 mA, because the line is at 0 V", false, "The resistor has 3.3 V at one end and 0 V at the other. A voltage across a resistor always makes current flow."],
          ["33 mA", false, "Check the units: 3.3 V / 10 000 Ω = 0.00033 A."],
          ["0.33 mA", true, "I = V / R = 3.3 V / 10 kΩ = 0.33 mA, for as long as the line is held low. Smaller resistors pull harder (faster rising edges, better noise immunity) but waste more current."],
          ["3.3 mA", false, "That would be the current through a 1 kΩ resistor."],
        ],
      },
    ],

    "open-drain": [
      {
        q: "Open-drain bus with a pull-up. MCU1 writes '1' and MCU2 writes '0'. What is OUT?",
        options: [
          ["A short circuit", false, "An open-drain output can never connect the line to V" + sub("S") + ", so no supply-to-ground path through two transistors exists. That is why it is safe."],
          ["'1'", false, "Any single device pulling low wins. The line is '1' only when every device lets go."],
          ["'0', and nothing is harmed", true, "In open-drain mode '1' means 'let go' (Hi-Z). Only MCU2 drives, pulling the line to ground. The only current is the small one through the pull-up resistor."],
          ["Floating", false, "MCU2 actively pulls the line low, so it is well defined."],
        ],
      },
      {
        q: "What happens on an open-drain line if there is no pull-up resistor at all (not even an internal one)?",
        options: [
          ["The line is always '1'", false, "Nothing is there to lift it to '1'."],
          ["A short circuit occurs", false, "Open-drain cannot short, with or without a resistor."],
          ["It works the same, only slower", false, "Without the resistor, nothing raises the line at all, so '1' never appears reliably."],
          ["Writing '1' leaves the line floating, so '1' is never reliably seen", true, "Open-drain can only pull down or let go. The resistor is what turns 'let go' into a real '1'."],
        ],
      },
    ],

    adc: [
      {
        q: "How many distinct output values can a 10-bit ADC produce?",
        options: [
          ["10", false, "10 is the number of bits, not the number of values. Each bit doubles the number of values."],
          ["1023", false, "1023 is the highest code, but 0 is a code too."],
          ["1024 (codes 0 to 1023)", true, "M bits give 2<sup>M</sup> values: 2<sup>10</sup> = 1024."],
          ["1000", false, "Close, but binary: 2<sup>10</sup> = 1024."],
        ],
      },
      {
        q: "Which two steps turn a continuous voltage into a series of numbers?",
        options: [
          ["Amplifying and filtering", false, "Those may happen before an ADC, but they do not produce numbers."],
          ["Sampling in time and quantising in amplitude", true, "Sampling picks discrete moments in time; quantising rounds each measured voltage to one of 2<sup>M</sup> levels."],
          ["Compressing and encrypting", false, "Those operate on digital data after conversion."],
          ["Converting current to voltage", false, "The ADC input is already a voltage."],
        ],
      },
    ],

    "adc-single": [
      {
        q: "12-bit single-ended ADC, V" + sub("ref") + " = 3.3 V, V" + sub("in") + " = 1.65 V. What is DOUT?",
        options: [
          ["1650", false, "DOUT is not in millivolts. It is the input as a fraction of V" + sub("ref") + ", scaled to 4096 codes."],
          ["2048", true, "DOUT ≈ V" + sub("in") + "/V" + sub("ref") + " · 2<sup>M</sup> = 0.5 · 4096 = 2048."],
          ["4095", false, "4095 is full scale, reached when V" + sub("in") + " ≥ V" + sub("ref") + "."],
          ["1024", false, "That would be for V" + sub("in") + " = V" + sub("ref") + "/4 = 0.825 V."],
        ],
      },
      {
        q: "Same ADC (12-bit, V" + sub("ref") + " = 3.3 V) and V" + sub("in") + " = 4 V. What is DOUT?",
        options: [
          ["4964", false, "The formula gives 4964, but a 12-bit ADC cannot output more than 2<sup>12</sup> - 1 = 4095."],
          ["0, because it overflows and wraps around", false, "An ADC saturates. It does not wrap around like an integer counter."],
          ["4095 (saturated)", true, "Any input at or above V" + sub("ref") + " gives the maximum code. The information about how far above V" + sub("ref") + " the signal went is lost."],
          ["Undefined", false, "It is well defined: the maximum code."],
        ],
      },
      {
        q: "What is the voltage resolution Q of a 10-bit ADC with V" + sub("ref") + " = 2.048 V?",
        options: [
          ["0.2 mV", false, "Recheck the division: 2.048 / 1024 = 0.002 V."],
          ["2 mV", true, "Q = V" + sub("ref") + " / 2<sup>M</sup> = 2.048 V / 1024 = 2 mV per step. (That is why 2.048 V references are popular.)"],
          ["20 mV", false, "That would be a 2.048 V range with only about 100 steps."],
          ["204.8 mV", false, "That divides by M = 10. M is an exponent: divide by 2<sup>10</sup>."],
        ],
      },
    ],

    "adc-range": [
      {
        q: "8-bit ADC, V" + sub("ref") + " = 5 V, but the signal only spans 0 to 1 V. Which codes are actually used?",
        options: [
          ["All 256", false, "Codes above about 51 would need more than 1 V at the input, which never happens."],
          ["Roughly 0 to 51, so about 80% of the codes are wasted", true, "1 V / 5 V · 256 ≈ 51. Codes 52 to 255 correspond to voltages the signal never reaches, and each step is a coarse 19.5 mV."],
          ["Only 0 and 1", false, "The ADC does not output volts. 1 V corresponds to code ≈ 51."],
          ["0 to 128", false, "128 would correspond to 2.5 V."],
        ],
      },
      {
        q: "You lower V" + sub("ref") + " to 1 V for this signal, but it occasionally spikes to 1.2 V. What happens during a spike?",
        options: [
          ["The ADC reads 307", false, "An 8-bit ADC cannot output more than 255."],
          ["The ADC switches V" + sub("ref") + " by itself", false, "The reference is fixed by your circuit or configuration. The hardware does not rescale on its own."],
          ["The reading saturates at 255 and the peak shape above 1 V is lost", true, "That is the trade-off: a smaller range gives finer steps (3.9 mV) but clips anything above V" + sub("ref") + "."],
          ["The reading becomes negative", false, "A single-ended ADC only outputs 0 to 255."],
        ],
      },
      {
        q: "In the slide, V" + sub("ref") + " = 1 V is made from 5 V with an 80 kΩ / 20 kΩ divider. Why does that give 1 V?",
        options: [
          ["5 V · 20 k / (80 k + 20 k) = 1 V", true, "Voltage divider: V" + sub("out") + " = V" + sub("in") + " · R" + sub("bottom") + " / (R" + sub("top") + " + R" + sub("bottom") + ")."],
          ["5 V · 80 k / (80 k + 20 k) = 1 V", false, "That gives 4 V. The output is taken across the bottom (20 k) resistor."],
          ["5 V / 5 resistors = 1 V", false, "There are only two resistors, and the ratio of their values is what matters."],
          ["80 k - 20 k = 60 k, so 5 V / 60 k", false, "That mixes resistance and voltage without a formula. Use the divider rule."],
        ],
      },
    ],

    "adc-diff": [
      {
        q: "12-bit differential ADC, V" + sub("ref") + " = 5 V, V" + sub("A") + " = 1 V, V" + sub("B") + " = 3 V. What is DOUT?",
        options: [
          ["819", false, "Sign matters: V" + sub("A") + " is lower than V" + sub("B") + ", so the difference is negative."],
          ["-1638", false, "That scales by 2<sup>M</sup> = 4096. In differential mode one bit is spent on the sign, so the scale is 2<sup>M-1</sup> = 2048."],
          ["-819", true, "(V" + sub("A") + " - V" + sub("B") + ") / V" + sub("ref") + " · 2<sup>M-1</sup> = (-2 / 5) · 2048 = -819.2, rounded to -819."],
          ["0", false, "0 only when V" + sub("A") + " = V" + sub("B") + "."],
        ],
      },
      {
        q: "Why is a differential ADC's resolution Q = V" + sub("ref") + "/2<sup>M-1</sup> instead of V" + sub("ref") + "/2<sup>M</sup>?",
        options: [
          ["Because the differential amplifier adds noise", false, "Noise is a separate issue. The formula is purely about how codes are spread over the range."],
          ["The 2<sup>M</sup> codes must cover [-V" + sub("ref") + ", +V" + sub("ref") + "], a range twice as wide, so each step is twice as big", true, "Half the codes are used for negative differences. Put differently, one of the M bits is the sign bit."],
          ["Because differential ADCs have one bit less", false, "They have the same M bits. They just use them over a range twice as wide."],
          ["It is a mistake in the slides", false, "It is correct: 2V" + sub("ref") + " / 2<sup>M</sup> = V" + sub("ref") + " / 2<sup>M-1</sup>."],
        ],
      },
      {
        q: "In the DC-offset circuit, V" + sub("B") + " is fixed at 4.5 V and V" + sub("ref") + " = 0.5 V. Why?",
        options: [
          ["To protect the ADC from 5 V", false, "The inputs already tolerate the supply voltage. The trick is about resolution."],
          ["To double the sampling rate", false, "Sampling rate is not affected by the input voltages."],
          ["Subtracting 4.5 V turns the 4 to 5 V signal into -0.5 to +0.5 V, which exactly fills the ±0.5 V range with Q = 0.5 / 128 ≈ 3.9 mV", true, "The big constant part (the DC offset) is removed before conversion, so all 256 codes are spent on the part that actually varies."],
          ["Because V" + sub("B") + " must always be 90% of the supply", false, "There is no such rule. 4.5 V is chosen because it is the middle of the 4 to 5 V signal range."],
        ],
      },
    ],

    "adc-modes": [
      {
        q: "A signal contains frequencies up to 4 kHz. What sampling rate does the Nyquist theorem require?",
        options: [
          ["More than 8 kHz", true, "Sample at more than twice the highest frequency. In practice you add margin (for audio up to 20 kHz, 44.1 kHz is used)."],
          ["4 kHz", false, "Sampling at the signal frequency gives one sample per period, so a sine looks constant (it aliases to 0 Hz)."],
          ["2 kHz", false, "That is below the signal frequency: the samples would describe a completely wrong, lower frequency."],
          ["Any rate works if you oversample", false, "Oversampling is by definition sampling above the Nyquist rate. It reduces noise but cannot rescue a too-low rate."],
        ],
      },
      {
        q: "Temperature, light and battery voltage are on three different AIN pins, and there is one internal ADC. Which mode fits?",
        options: [
          ["Oversampling mode", false, "Oversampling averages many samples of one channel to reduce noise. It does not visit several channels."],
          ["Scan mode", true, "Scan mode cycles through a list of channels, converting one after another. It looks parallel, but only one channel is converted at a time."],
          ["Convert all three at exactly the same instant", false, "A single ADC is connected to one channel at a time through a multiplexer."],
          ["It cannot be done with one ADC", false, "That is exactly what the channel multiplexer and scan mode are for."],
        ],
      },
    ],

    dac: [
      {
        q: "An 8-bit DAC with V" + sub("ref") + " = 3.3 V receives code 128. What voltage comes out?",
        options: [
          ["128 V", false, "The code is a fraction of full scale, not a voltage."],
          ["About 1.65 V", true, "V" + sub("out") + " = code / 2<sup>M</sup> · V" + sub("ref") + " = 128 / 256 · 3.3 V = 1.65 V."],
          ["3.3 V", false, "Full scale is reached near code 255."],
          ["0.128 V", false, "The code is not in millivolts."],
        ],
      },
      {
        q: "Which of these is a typical DAC job?",
        options: [
          ["Measuring the battery voltage", false, "Measuring is the ADC's job (analog in, number out)."],
          ["Reading a push button", false, "A button is a digital input: a GPIO is enough."],
          ["Producing an audio waveform for a speaker", true, "Audio is stored as numbers and must be turned back into a continuous voltage: exactly what a DAC does."],
          ["Sharing a bus between two MCUs", false, "That is a GPIO/open-drain topic."],
        ],
      },
    ],

    "power-control": [
      {
        q: "Load R" + sub("2") + " = 100 Ω with a series resistor R" + sub("1") + " = 100 Ω. What share of the power drawn from the supply ends up in the load?",
        options: [
          ["100%", false, "Only when R" + sub("1") + " = 0. Any series resistance takes its share."],
          ["50%", true, "The same current flows through both resistors and P = I²R, so equal resistances take equal power. Half of the energy just heats R" + sub("1") + "."],
          ["25%", false, "25% is how much power the load gets compared to having no R" + sub("1") + " at all (the current halved, so power dropped to a quarter). As a share of the total drawn, it is 50%."],
          ["0%", false, "Current still flows through the load."],
        ],
      },
      {
        q: "Why does R" + sub("1") + " waste little power when it is much smaller <em>or</em> much larger than R" + sub("2") + "?",
        options: [
          ["Small R" + sub("1") + ": almost no voltage across it. Large R" + sub("1") + ": almost no current through it. P = V · I is small either way", true, "Only in between, with both voltage and current substantial, does R" + sub("1") + " burn a lot (maximum at R" + sub("1") + " = R" + sub("2") + "). Unfortunately 'in between' is exactly the range you need for dimming."],
          ["Resistors only dissipate power when they are equal to the load", false, "Any resistor with current through it dissipates I²R. It is just small at the extremes."],
          ["Large resistors are more efficient", false, "A large R" + sub("1") + " wastes little because it lets hardly any current through, so the load gets almost nothing either."],
          ["It is not true, R" + sub("1") + " always wastes 50%", false, "Efficiency is R" + sub("2") + " / (R" + sub("1") + " + R" + sub("2") + "), which depends on the ratio."],
        ],
      },
    ],

    pwm: [
      {
        q: "A 3.3 V GPIO outputs PWM at 1 kHz with 25% duty cycle. What average voltage does a slow load (motor, or LED plus eye) respond to?",
        options: [
          ["3.3 V", false, "That is the peak, which is only present 25% of the time."],
          ["1.65 V", false, "That would be a 50% duty cycle."],
          ["0.825 V", true, "V" + sub("avg") + " = D · V" + sub("S") + " = 0.25 · 3.3 V = 0.825 V."],
          ["0.25 V", false, "The duty cycle is a fraction of V" + sub("S") + ", not a voltage."],
        ],
      },
      {
        q: "You drive an LED with PWM at 10 Hz. What do you see?",
        options: [
          ["A steady, dimmed light", false, "10 Hz is slow enough for the eye to follow each on/off cycle."],
          ["Visible flicker", true, "The eye's low-pass filter only blends pulses into steady light at much higher frequencies (well above about 100 Hz is safe). Try it in the lab above."],
          ["Nothing, the LED is too slow to switch", false, "LEDs switch in nanoseconds; 10 Hz is trivially slow for them."],
          ["A colour change", false, "PWM changes the average intensity, not the colour of a single LED."],
        ],
      },
    ],

    "pwm-motor": [
      {
        q: "Why is PWM more efficient than dimming with a series resistor?",
        options: [
          ["The switch is either fully on (almost no voltage across it) or fully off (no current), so it dissipates almost nothing", true, "Power in the switch is V · I, and in both states one of them is about zero. With a resistor, both are substantial."],
          ["PWM lowers the supply voltage", false, "The supply stays the same. Only the fraction of time it is connected changes."],
          ["The load draws less current while on", false, "While on, the full current flows. The saving is that no energy is burned in a series resistor."],
          ["Because the load is off part of the time", false, "Being off part of the time is what dims the load. Efficiency is about where the drawn energy ends up."],
        ],
      },
      {
        q: "In the slide, a DRV8835 motor driver sits between the MCU and the motor. What is its job?",
        options: [
          ["It converts the PWM signal into an analog voltage for the ADC", false, "Nothing is being measured here. The driver works in the output direction, towards the motor."],
          ["It takes the weak PWM signal from the GPIO and switches the motor's own, much larger supply current", true, "A GPIO can deliver a few mA; a motor needs hundreds of mA or more (the DRV8835 handles up to 1.5 A per channel). The driver's transistors do the heavy switching from the motor supply V" + sub("M") + ", following the PWM input."],
          ["It limits the motor to the MCU's 3.3 V", false, "The motor runs from its own supply V" + sub("M") + " (0 to 11 V for the DRV8835), independent of the MCU supply."],
          ["It measures motor speed", false, "A plain motor driver only switches power. Speed sensing would need an encoder or similar."],
        ],
      },
      {
        q: "The voltage across the motor is a hard on/off square wave. Why is the motor current fairly smooth?",
        options: [
          ["The GPIO smooths the signal before it leaves the chip", false, "The GPIO outputs a clean square wave; it does no filtering."],
          ["The motor only reacts to the peak voltage", false, "If that were true, duty cycle would have no effect on speed."],
          ["The motor's winding is an inductor, which resists fast changes in current (time constant L/R)", true, "If the PWM period is short compared to L/R, the current barely changes within one period and settles near the average. Switch the lab in the previous topic to 'Motor' and vary the frequency to see it."],
          ["PWM is secretly a sine wave", false, "It really is a square wave. The smoothing happens in the load."],
        ],
      },
    ],
  };

  /* =====================================================================
     SVG helpers for schematics
     ===================================================================== */
  const T = (x, y, txt, cls, extra) => `<text x="${x}" y="${y}" class="${cls || ""}" ${extra || ""}>${txt}</text>`;
  const L = (x1, y1, x2, y2, cls) => `<line class="w ${cls || ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  const vsLabel = (x, y) => `<text x="${x}" y="${y}" class="ital">V<tspan dy="4" font-size="10">S</tspan></text>`;
  function vsBar(x, y) { return L(x - 11, y, x + 11, y) + vsLabel(x + 15, y + 5); }
  function ground(x, y) { return L(x - 12, y, x + 12, y) + L(x - 7, y + 5, x + 7, y + 5) + L(x - 2.5, y + 10, x + 2.5, y + 10); }
  function contact(x, y) { return `<circle class="contact" cx="${x}" cy="${y}" r="4.5"/>`; }
  // vertical switch, pivot at bottom contact
  function swV(x, yTop, yBot, closed, cls) {
    const lever = closed ? L(x, yBot, x, yTop, cls) : L(x, yBot, x + 20, yTop + 7);
    return lever + contact(x, yTop) + contact(x, yBot);
  }
  // horizontal switch, pivot at left contact
  function swH(xL, xR, y, closed, cls) {
    const lever = closed ? L(xL, y, xR, y, cls) : L(xL, y, xR - 6, y - 19);
    return lever + contact(xL, y) + contact(xR, y);
  }
  function resV(x, y1, y2, cls) {
    const n = 6, lead = 8, seg = (y2 - y1 - 2 * lead) / n;
    let d = `M${x} ${y1} V${y1 + lead}`;
    for (let i = 0; i < n; i++) d += ` L${x + (i % 2 ? -8 : 8)} ${y1 + lead + seg * (i + 0.5)}`;
    d += ` L${x} ${y2 - lead} V${y2}`;
    return `<path class="w ${cls || ""}" d="${d}"/>`;
  }
  function resH(x1, x2, y, cls) {
    const n = 6, lead = 8, seg = (x2 - x1 - 2 * lead) / n;
    let d = `M${x1} ${y} H${x1 + lead}`;
    for (let i = 0; i < n; i++) d += ` L${x1 + lead + seg * (i + 0.5)} ${y + (i % 2 ? 8 : -8)}`;
    d += ` L${x2 - lead} ${y} H${x2}`;
    return `<path class="w ${cls || ""}" d="${d}"/>`;
  }
  // log-slider value snapped to 2 significant digits, so the shown and the used value agree
  const nice = (e) => { const v = Math.pow(10, e); const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
  const lvl = (v) => (v === 1 ? "hi" : v === 0 ? "lo" : v === "short" ? "bad" : "z");

  /* =====================================================================
     LAB: noisy digital line
     ===================================================================== */
  function erfc(x) {
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }

  function labNoise(el) {
    const { controls, view } = NES.lab(el, {
      title: "Send 16 bits through a noisy wire",
      hint: "The sender puts 0 V or 3.3 V on the wire. The receiver samples the middle of each bit (dots) and compares it with V" + sub("S") + "/2 = 1.65 V. Raise the noise until bits start to flip.",
    });
    const noise = NES.slider(controls, { label: "Noise level (σ)", min: 0, max: 1.2, step: 0.01, value: 0.3, fmt: (v) => v.toFixed(2) + " V" });
    const reroll = h("button", { class: "btn", type: "button", text: "New random noise" });
    controls.append(reroll);
    controls.append(h("p", { class: "lab-hint", html: "Tip: noise has to push a sample across the 1.65 V line to cause an error, i.e. travel 1.65 V from its ideal level." }));

    const cv = h("canvas", { style: "height:220px", "aria-label": "Noisy waveform plot" });
    view.append(h("div", { class: "stage" }, [cv]));
    const sentRow = h("div", { class: "bits", style: "grid-template-columns:repeat(16,minmax(0,1fr))" });
    const recvRow = h("div", { class: "bits", style: "grid-template-columns:repeat(16,minmax(0,1fr))" });
    view.append(h("div", { class: "bitrow" }, [
      h("div", { class: "bitrow-line" }, [h("span", { class: "bitrow-label", text: "Sent" }), sentRow]),
      h("div", { class: "bitrow-line" }, [h("span", { class: "bitrow-label", text: "Received" }), recvRow]),
    ]));
    const stats = NES.stats(view, [
      { key: "err", label: "Bit errors (this run)" },
      { key: "margin", label: "Distance to threshold / σ" },
      { key: "p", label: "Expected error rate" },
    ]);

    const BITS = [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1];
    const SPB = 24, N = BITS.length * SPB;
    let seed = 7, g = [];
    function regen() { const r = NES.rng(seed); g = Array.from({ length: N }, () => NES.gauss(r)); }
    regen();

    let volts = [], decoded = [];
    function compute() {
      const s = noise.value;
      volts = g.map((n, i) => BITS[Math.floor(i / SPB)] * VS + s * n);
      decoded = BITS.map((_, b) => (volts[b * SPB + SPB / 2] > VS / 2 ? 1 : 0));
    }

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 44, padR = 10, padT = 10, padB = 22;
      const vmin = -1.2, vmax = 4.5;
      const X = (i) => padL + (i / (N - 1)) * (w - padL - padR);
      const Y = (v) => padT + (1 - (v - vmin) / (vmax - vmin)) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font");
      // grid + bit boundaries
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      for (let b = 0; b <= BITS.length; b++) { const x = X(Math.min(N - 1, b * SPB)); ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, hh - padB); ctx.stroke(); }
      // ideal levels
      ctx.fillStyle = NES.css("--muted");
      [[0, "0 V"], [VS, "3.3 V"]].forEach(([v, t]) => {
        ctx.strokeStyle = NES.css("--line-2"); ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke();
        ctx.fillText(t, 4, Y(v) + 4);
      });
      // threshold
      ctx.strokeStyle = NES.css("--accent"); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padL, Y(VS / 2)); ctx.lineTo(w - padR, Y(VS / 2)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--accent"); ctx.fillText("1.65 V", 4, Y(VS / 2) + 4);
      // trace
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 1.4; ctx.beginPath();
      volts.forEach((v, i) => { const y = Y(NES.clamp(v, vmin, vmax)); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); });
      ctx.stroke();
      // sample dots
      BITS.forEach((b, k) => {
        const i = k * SPB + SPB / 2; const ok = decoded[k] === b;
        ctx.fillStyle = ok ? NES.css("--ok") : NES.css("--bad");
        ctx.beginPath(); ctx.arc(X(i), Y(NES.clamp(volts[i], vmin, vmax)), ok ? 3.5 : 5, 0, Math.PI * 2); ctx.fill();
      });
      ctx.fillStyle = NES.css("--muted"); ctx.fillText("time →", w - padR - 44, hh - 6);
    });

    function update() {
      compute();
      sentRow.innerHTML = BITS.map((b) => `<span class="b${b}">${b}</span>`).join("");
      recvRow.innerHTML = decoded.map((b, i) => `<span class="${b !== BITS[i] ? "err" : "b" + b}">${b}</span>`).join("");
      const errs = decoded.filter((b, i) => b !== BITS[i]).length;
      stats.set("err", errs + " / 16", errs ? "bad" : "good");
      const s = noise.value;
      const m = s > 0 ? VS / 2 / s : Infinity;
      stats.set("margin", s > 0 ? m.toFixed(1) + "×" : "∞", m > 4 ? "good" : m > 2 ? "warn" : "bad");
      const p = s > 0 ? 0.5 * erfc(m / Math.SQRT2) : 0;
      stats.set("p", p < 1e-6 ? "< 0.0001%" : (p * 100).toPrecision(2) + "%", p < 1e-3 ? "good" : p < 0.05 ? "warn" : "bad");
      draw();
    }
    noise.onchange = update;
    reroll.addEventListener("click", () => { seed = (seed * 7919 + 13) % 100003; regen(); update(); });
    update();
  }

  /* =====================================================================
     LAB: GPIO output driver (push-pull, optional EN / tri-state)
     ===================================================================== */
  function gpioSVG(A, EN, showEN) {
    const x = 170, ny = 126;
    const drive = showEN ? EN : 1;
    const node = A ? "hi" : "lo";
    const out = drive ? node : "z";
    let s = `<svg class="sch" viewBox="0 0 440 252" role="img" aria-label="GPIO output stage: A=${A}${showEN ? ", EN=" + EN : ""}">`;
    s += `<rect class="box" x="30" y="36" width="260" height="180" rx="4"/>` + T(42, 58, "MCU", "lbl");
    s += vsBar(x, 14) + L(x, 14, x, 61.5, A ? "hi" : "");
    s += swV(x, 66, 104, A === 1, "hi");
    s += L(x, 108.5, x, ny, node) + L(x, ny, x, 143.5, node);
    s += swV(x, 148, 186, A === 0, "lo");
    s += L(x, 190.5, x, 232, A ? "" : "lo") + ground(x, 232);
    if (showEN) {
      s += L(x, ny, 201.5, ny, node);
      s += swH(206, 246, ny, EN === 1, node);
      s += L(250.5, ny, 396, ny, out);
      s += `<path class="ctrl" d="M226 80 V${EN ? 120 : 110}"/>` + `<circle class="dot" cx="226" cy="80" r="3.5"/>` + T(214, 72, "EN = " + EN, "state " + (EN ? "t-ok" : "t-z"));
    } else {
      s += L(x, ny, 396, ny, out);
    }
    s += `<path class="ctrl" d="M76 ${ny} H122 M122 86 V170 M122 86 H164 M122 170 H164"/>`;
    s += `<circle class="dot" cx="72" cy="${ny}" r="4"/>` + T(46, ny - 12, "A = " + A, "state t-" + node);
    s += `<circle class="dot ${out}" cx="${x}" cy="${ny}" r="4.5"/><circle class="dot ${out}" cx="400" cy="${ny}" r="5.5"/>`;
    s += T(372, ny - 14, "V<tspan dy='4' font-size='10'>out</tspan>", "ital");
    s += T(176, 50, "1", "small") + T(176, 210, "2", "small") + T(294, ny - 6, "3", "small");
    const txt = drive ? (A ? "= V<tspan dy='4' font-size='10'>S</tspan><tspan dy='-4'> → '1'</tspan>" : "= 0 V → '0'") : "Hi-Z (not driven)";
    s += T(412, ny + 30, txt, "state t-" + out, 'text-anchor="end"');
    return s + "</svg>";
  }

  function labGpio(el, opt) {
    const showEN = !!opt.showEN;
    const { controls, view } = NES.lab(el, {
      title: showEN ? "Drive a tri-state GPIO output" : "Flip a push-pull output",
      hint: showEN
        ? "A picks which rail the internal node connects to, EN decides whether that node reaches the pin. Coloured wires show which rail each wire is connected to (orange = V" + sub("S") + ", blue = ground, dashed = not driven)."
        : "Set the output value A and watch which switch closes. Orange wires are connected to V" + sub("S") + ", blue wires to ground.",
    });
    const segA = NES.seg(controls, { label: "Output value A", options: [[0, "0"], [1, "1"]], value: 1 });
    const segEN = showEN ? NES.seg(controls, { label: "Enable EN", options: [[0, "0 (off)"], [1, "1 (on)"]], value: 1 }) : null;
    const table = h("div", { class: "table-wrap" });
    controls.append(table);
    const stage = h("div", { class: "stage" });
    const verdict = h("div", { class: "verdict" });
    view.append(stage, verdict);

    function update() {
      const A = segA.value, EN = segEN ? segEN.value : 1;
      stage.innerHTML = gpioSVG(A, EN, showEN);
      const rows = showEN
        ? [[0, 0, "Hi-Z"], [0, 1, "Hi-Z"], [1, 0, "0"], [1, 1, "1"]]
        : [[null, 0, "0"], [null, 1, "1"]];
      const cls = (o) => (o === "1" ? "v-hi" : o === "0" ? "v-lo" : "v-z");
      table.innerHTML =
        `<table class="tt"><thead><tr>${showEN ? "<th>EN</th>" : ""}<th>A</th><th class="out">OUT</th></tr></thead><tbody>` +
        rows.map(([en, a, o]) => `<tr class="${(showEN ? en === EN : true) && a === A ? "on" : ""}">${showEN ? `<td>${en}</td>` : ""}<td>${a}</td><td class="out ${cls(o)}">${o}</td></tr>`).join("") +
        "</tbody></table>";
      if (!EN) verdict.innerHTML = "<b>Disconnected.</b> Both paths to the pin are open, so this output neither sources nor sinks current. Another device may now drive the line.";
      else if (A) verdict.innerHTML = "<b>Pushing high.</b> The upper switch connects the pin to V" + sub("S") + ", the lower one is open. The line is actively held at '1'.";
      else verdict.innerHTML = "<b>Pulling low.</b> The lower switch connects the pin to ground, the upper one is open. The line is actively held at '0'.";
      verdict.className = "verdict";
    }
    segA.onchange = update;
    if (segEN) segEN.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: GPIO as current source / sink with an LED
     ===================================================================== */
  function ledSVG(mode, pin, on, mA) {
    const y = 105;
    const pinCls = pin ? "hi" : "lo";
    const railCls = mode === "source" ? "lo" : "hi";
    let s = `<svg class="sch" viewBox="0 0 440 210" role="img" aria-label="LED ${on ? "on" : "off"}">`;
    s += `<rect class="box" x="20" y="30" width="150" height="150" rx="4"/>` + T(32, 52, "MCU", "lbl");
    s += T(34, 150, "pin writes " + pin, "state t-" + pinCls);
    s += `<circle class="dot ${pinCls}" cx="44" cy="${y}" r="4"/>` + L(44, y, 170, y, pinCls) + T(174, y - 8, "3", "small");
    s += L(170, y, 200, y, pinCls);
    if (mode === "source") {
      s += resH(200, 262, y, on ? "" : pinCls);
      s += L(262, y, 290, y);
      if (on) s += `<circle class="glow" cx="303" cy="${y}" r="${16 + Math.min(18, mA * 1.6)}" opacity="${0.12 + Math.min(0.38, mA / 30)}"/>`;
      s += `<path class="led-body ${on ? "on" : ""}" d="M290 ${y - 13} L316 ${y} L290 ${y + 13} Z"/>` + L(316, y - 13, 316, y + 13);
      s += L(316, y, 372, y, railCls) + L(372, y, 372, 160, railCls) + ground(372, 160);
    } else {
      s += resH(200, 262, y, on ? "" : pinCls);
      s += L(262, y, 290, y);
      if (on) s += `<circle class="glow" cx="303" cy="${y}" r="${16 + Math.min(18, mA * 1.6)}" opacity="${0.12 + Math.min(0.38, mA / 30)}"/>`;
      s += `<path class="led-body ${on ? "on" : ""}" d="M316 ${y - 13} L290 ${y} L316 ${y + 13} Z"/>` + L(290, y - 13, 290, y + 13);
      s += L(316, y, 372, y, railCls) + L(372, y, 372, 44, railCls) + vsBar(372, 44);
    }
    // light rays
    s += `<path class="w ${on ? "hi" : "ghost"}" d="M298 ${y - 20} l8 -14 M308 ${y - 18} l8 -14" stroke-width="1.6"/>`;
    s += T(282, y + 40, "LED", "small") + T(214, y + 28, "R", "small");
    if (on) {
      const dir = mode === "source" ? 1 : -1;
      const ax = 194;
      s += `<path class="arrow" d="M${ax - 7 * dir} ${y - 22} L${ax + 7 * dir} ${y - 16} L${ax - 7 * dir} ${y - 10} Z"/>`;
      s += T(231, y - 30, "I = " + mA.toFixed(1) + " mA", "state t-ok", 'text-anchor="middle"');
      s += T(ax, 196, mode === "source" ? "current flows OUT of the pin" : "current flows INTO the pin", "small", 'text-anchor="middle"');
    } else {
      s += T(186, 196, "no voltage across the LED: no current", "small", 'text-anchor="middle"');
    }
    return s + "</svg>";
  }

  function labLed(el) {
    const { controls, view } = NES.lab(el, {
      title: "Light an LED from a GPIO",
      hint: "Source: LED from the pin to ground. Sink: LED from V" + sub("S") + " to the pin. Compare the two wirings, then shrink the resistor and watch the current approach the GPIO's limit. (LED forward voltage ≈ 2.0 V, V" + sub("S") + " = 3.3 V.)",
    });
    const mode = NES.seg(controls, { label: "Wiring", options: [["source", "Source"], ["sink", "Sink"]], value: "source" });
    const pin = NES.seg(controls, { label: "Pin writes", options: [[0, "0"], [1, "1"]], value: 1 });
    const RS = [22, 33, 47, 68, 100, 150, 220, 330, 470, 680, 1000, 2200];
    const res = NES.slider(controls, { label: "Series resistor", min: 0, max: RS.length - 1, step: 1, value: 7, map: (i) => RS[i], unmap: (v) => RS.indexOf(v), fmt: (v) => (v >= 1000 ? v / 1000 + " kΩ" : v + " Ω") });
    const stage = h("div", { class: "stage" });
    const meter = h("div", { class: "meter" });
    view.append(stage, meter);
    const stats = NES.stats(view, [{ key: "led", label: "LED" }, { key: "i", label: "Pin current" }, { key: "lim", label: "vs. typical GPIO limit" }]);

    function update() {
      const on = mode.value === "source" ? pin.value === 1 : pin.value === 0;
      const mA = on ? ((VS - 2.0) / res.value) * 1000 : 0;
      stage.innerHTML = ledSVG(mode.value, pin.value, on, mA);
      stats.set("led", on ? "ON" : "OFF", on ? "hi" : "");
      stats.set("i", mA.toFixed(1) + " mA");
      const tone = !on ? "" : mA <= 4 ? "good" : mA <= 12 ? "warn" : "bad";
      stats.set("lim", !on ? "-" : mA <= 4 ? "Safe" : mA <= 12 ? "Check datasheet" : "Too much!", tone);
      const pct = Math.min(100, (mA / 60) * 100);
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Current</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:var(--${tone === "bad" ? "bad" : tone === "warn" ? "warn" : "ok"})"></div><span class="meter-mark" style="left:${(2 / 60) * 100}%" title="2 mA"></span><span class="meter-mark" style="left:${(12 / 60) * 100}%" title="12 mA"></span></div><span class="m-val">${mA.toFixed(1)} mA</span></div><div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">marks at 2 mA and 12 mA: the typical range of GPIO drive limits</span><span></span></div>`;
    }
    [mode, pin, res].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: shared line (push-pull vs open-drain)
     ===================================================================== */
  function busSVG(st) {
    const { d1, d2, line, pullup, mode, basic } = st;
    const col = (d) => (d == null ? "z" : lvl(d));
    const desc = (d) => {
      if (d == null) return mode === "od" ? ["lets go (Hi-Z)", "z"] : ["disabled (Hi-Z)", "z"];
      return d ? ["pushes to 1", "hi"] : ["pulls to 0", "lo"];
    };
    const lineCls = line === "short" ? "bad" : line === "float" ? "z" : lvl(line);
    let s = `<svg class="sch" viewBox="0 0 440 262" role="img" aria-label="Two MCUs sharing a line">`;
    [[d1, 20, "MCU 1"], [d2, 150, "MCU 2"]].forEach(([d, y, name]) => {
      const [t, c] = desc(d);
      s += `<rect class="box" x="20" y="${y}" width="160" height="92" rx="4"/>` + T(32, y + 22, name, "lbl");
      s += T(32, y + 58, t, "state t-" + c);
      s += L(180, y + 46, 250, y + 46, line === "short" && d != null ? "bad" : col(d));
      s += `<circle class="dot ${col(d)}" cx="180" cy="${y + 46}" r="4"/>`;
    });
    s += L(250, 66, 250, 196, lineCls) + L(250, 131, 396, 131, lineCls);
    s += `<circle class="dot ${lineCls}" cx="250" cy="131" r="4.5"/><circle class="dot ${lineCls}" cx="400" cy="131" r="5.5"/>`;
    s += T(380, 118, "OUT", "lbl");
    if (!basic) {
      const g = pullup ? "" : "ghost";
      s += `<g class="${g}" ${pullup ? "" : 'opacity="0.25"'}>` + L(330, 131, 330, 112) + resV(330, 112, 58) + L(330, 58, 330, 40) + vsBar(330, 40) + `<circle class="dot" cx="330" cy="131" r="4"/></g>`;
      s += T(344, 90, pullup ? "pull-up" : "no pull-up", "small");
    }
    const outTxt = line === "short" ? "SHORT CIRCUIT" : line === "float" ? "floating ?" : "OUT = " + line;
    s += `<text x="412" y="164" text-anchor="end" class="state t-${lineCls}">${outTxt}${line === "short" ? '<animate attributeName="opacity" values="1;0.25;1" dur="0.9s" repeatCount="indefinite"/>' : ""}</text>`;
    return s + "</svg>";
  }

  function labBus(el, opt) {
    const basic = !!opt.basic;
    const { controls, view } = NES.lab(el, {
      title: basic ? "Let two push-pull MCUs share one wire" : "Shared line simulator: push-pull vs open-drain",
      hint: basic
        ? "Both outputs are always driving. Find the combinations that short V" + sub("S") + " to ground."
        : "Switch between push-pull and open-drain, toggle the pull-up, and try to cause a short circuit. In open-drain mode A = 1 means 'let go'.",
    });
    const mode = basic ? { value: "pp" } : NES.seg(controls, { label: "Output mode", options: [["pp", "Push-pull"], ["od", "Open-drain"]], value: "pp" });
    const pull = basic ? { value: 0 } : NES.seg(controls, { label: "Pull-up resistor", options: [[1, "On"], [0, "Off"]], value: 1 });
    const mk = (name) => {
      const g = basic ? controls : NES.group(controls, name);
      if (basic) g.append(h("div", { class: "ctl-group-title", text: name }));
      const en = basic ? null : NES.seg(g, { label: "EN", options: [[0, "0"], [1, "1"]], value: 1 });
      const a = NES.seg(g, { label: "A", options: [[0, "0"], [1, "1"]], value: name === "MCU 1" ? 1 : 0 });
      return { en, a };
    };
    const m1 = mk("MCU 1"), m2 = mk("MCU 2");
    const stage = h("div", { class: "stage" });
    const verdict = h("div", { class: "verdict" });
    view.append(stage, verdict);

    function drive(m) {
      if (mode.value === "od") return m.a.value === 0 ? 0 : null;
      if (m.en && m.en.value === 0) return null;
      return m.a.value;
    }
    function update() {
      const od = mode.value === "od";
      [m1, m2].forEach((m) => m.en && m.en.disable(od));
      const d1 = drive(m1), d2 = drive(m2);
      const ds = [d1, d2].filter((d) => d != null);
      let line;
      if (ds.indexOf(0) !== -1 && ds.indexOf(1) !== -1) line = "short";
      else if (ds.length) line = ds[0];
      else line = pull.value ? 1 : "float";
      stage.innerHTML = busSVG({ d1, d2, line, pullup: !!pull.value, mode: mode.value, basic });
      if (line === "short") {
        verdict.className = "verdict bad";
        verdict.innerHTML = "<b>Short circuit.</b> One MCU connects the line to V" + sub("S") + ", the other to ground. A large current flows through both output stages and the line voltage is undefined.";
      } else if (line === "float") {
        verdict.className = "verdict warn";
        verdict.innerHTML = "<b>Floating.</b> Nobody drives the line and there is no pull-up, so its value is undefined. Readers may see 0, 1 or noise.";
      } else {
        verdict.className = "verdict good";
        const who = ds.length === 2 ? "both MCUs (they agree)" : ds.length === 1 ? (d1 != null ? "MCU 1" : "MCU 2") : "the pull-up resistor";
        verdict.innerHTML = "<b>OUT = " + line + ".</b> Decided by " + who + "." + (od && line === 0 && ds.length ? " In open-drain, any device pulling low wins: the line is a wired-AND." : "");
      }
    }
    [mode, pull, m1.a, m2.a, m1.en, m2.en].forEach((c) => c && c.onchange !== undefined && (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: input hysteresis (Schmitt trigger)
     ===================================================================== */
  function labHyst(el) {
    const { controls, view } = NES.lab(el, {
      title: "Plain comparator vs hysteresis",
      hint: "A slowly rising and falling signal with noise. The clean signal crosses 1.65 V exactly 3 times. Count how many times each input thinks it changed.",
    });
    const noise = NES.slider(controls, { label: "Noise (σ)", min: 0, max: 0.4, step: 0.01, value: 0.12, fmt: (v) => v.toFixed(2) + " V" });
    const vh = NES.slider(controls, { label: "Hysteresis V<sub>H</sub>", min: 0, max: 0.6, step: 0.01, value: 0.2, fmt: (v) => "±" + v.toFixed(2) + " V" });
    const reroll = h("button", { class: "btn", type: "button", text: "New random noise" });
    controls.append(reroll);
    const cv = h("canvas", { style: "height:290px", "aria-label": "Hysteresis plot" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--ink-2)"></i>input voltage</span><span><i class="dash" style="color:var(--accent)"></i><span>V<sub>S</sub>/2</span></span><span><i style="background:var(--tech);opacity:.5;height:8px"></i>hysteresis band</span>` }));
    const stats = NES.stats(view, [{ key: "a", label: "Toggles: plain (A)" }, { key: "b", label: "Toggles: hysteresis (B)" }, { key: "th", label: "Thresholds (up / down)" }]);

    const N = 700;
    let seed = 3, g = [];
    function regen() {
      const r = NES.rng(seed);
      const w = Array.from({ length: N + 2 }, () => NES.gauss(r));
      g = Array.from({ length: N }, (_, i) => (w[i] + w[i + 1] + w[i + 2]) / Math.sqrt(3));
    }
    regen();
    let v = [], A = [], B = [];
    function compute() {
      const s = noise.value, H = vh.value, th = VS / 2;
      v = g.map((n, i) => th - 1.2 * Math.cos(2 * Math.PI * 1.5 * (i / (N - 1))) + s * n);
      A = v.map((x) => (x > th ? 1 : 0));
      let st = v[0] > th ? 1 : 0;
      B = v.map((x) => { if (st === 0 && x > th + H) st = 1; else if (st === 1 && x < th - H) st = 0; return st; });
    }
    const edges = (arr) => arr.reduce((n, x, i) => n + (i && x !== arr[i - 1] ? 1 : 0), 0);

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 8, top = 8, sigH = hh * 0.56, rowH = (hh - sigH - top - 22) / 2;
      const X = (i) => padL + (i / (N - 1)) * (w - padL - padR);
      const Y = (x) => top + (1 - x / VS) * sigH;
      const H = vh.value, th = VS / 2;
      ctx.font = "11px " + NES.css("--font");
      // band
      if (H > 0) { ctx.fillStyle = NES.css("--tech"); ctx.globalAlpha = 0.14; ctx.fillRect(padL, Y(th + H), w - padL - padR, Y(th - H) - Y(th + H)); ctx.globalAlpha = 1; }
      ctx.strokeStyle = NES.css("--line-2"); ctx.lineWidth = 1; ctx.strokeRect(padL, top, w - padL - padR, sigH);
      if (H > 0) {
        ctx.strokeStyle = NES.css("--tech"); ctx.setLineDash([3, 3]);
        [th + H, th - H].forEach((y) => { ctx.beginPath(); ctx.moveTo(padL, Y(y)); ctx.lineTo(w - padR, Y(y)); ctx.stroke(); });
      }
      ctx.strokeStyle = NES.css("--accent"); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(padL, Y(th)); ctx.lineTo(w - padR, Y(th)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--muted"); ctx.fillText("3.3 V", 4, Y(VS) + 10); ctx.fillText("0 V", 4, Y(0)); ctx.fillStyle = NES.css("--accent"); ctx.fillText("1.65", 4, Y(th) + 4);
      ctx.strokeStyle = NES.css("--ink-2"); ctx.lineWidth = 1.3; ctx.beginPath();
      v.forEach((x, i) => { const y = Y(NES.clamp(x, 0, VS)); i ? ctx.lineTo(X(i), y) : ctx.moveTo(X(i), y); }); ctx.stroke();
      // digital rows
      const rows = [[A, "A", "--hi", "plain"], [B, "B", "--ok", "hyst."]];
      rows.forEach(([arr, name, colVar], r) => {
        const y0 = top + sigH + 10 + r * (rowH + 4);
        const Yr = (b) => y0 + (1 - b) * (rowH - 6) + 3;
        ctx.fillStyle = NES.css(colVar); ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(X(0), Yr(0));
        arr.forEach((b, i) => { ctx.lineTo(X(i), Yr(b)); if (i < N - 1 && arr[i + 1] !== b) ctx.lineTo(X(i + 1), Yr(b)); });
        ctx.lineTo(X(N - 1), Yr(0)); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
        ctx.strokeStyle = NES.css(colVar); ctx.lineWidth = 1.6; ctx.beginPath();
        arr.forEach((b, i) => { if (!i) ctx.moveTo(X(0), Yr(b)); ctx.lineTo(X(i), Yr(b)); if (i < N - 1 && arr[i + 1] !== b) ctx.lineTo(X(i + 1), Yr(b)); });
        ctx.stroke();
        ctx.fillStyle = NES.css(colVar); ctx.font = "bold 12px " + NES.css("--font"); ctx.fillText(name, 12, y0 + rowH / 2 + 4);
        ctx.font = "11px " + NES.css("--font");
      });
    });

    function update() {
      compute();
      const a = edges(A), b = edges(B);
      stats.set("a", String(a), a === 3 ? "good" : "bad");
      stats.set("b", String(b), b === 3 ? "good" : "bad");
      stats.set("th", (VS / 2 + vh.value).toFixed(2) + " / " + (VS / 2 - vh.value).toFixed(2) + " V");
      draw();
    }
    noise.onchange = vh.onchange = update;
    reroll.addEventListener("click", () => { seed = (seed * 48271 + 11) % 2147483; regen(); update(); });
    update();
  }

  /* =====================================================================
     LAB: what does the input read? (floating, pull-up, pull-down)
     ===================================================================== */
  function inputSVG(EN, A, res, line) {
    const y = 100;
    const lineCls = line === "float" ? "z" : lvl(line);
    const node = lvl(A);
    let s = `<svg class="sch" viewBox="0 0 440 200" role="img" aria-label="Input with ${res} resistor">`;
    s += `<rect class="box" x="16" y="40" width="136" height="120" rx="4"/>` + T(26, 60, "MCU 1 (drives)", "lbl");
    s += `<circle class="dot ${node}" cx="44" cy="${y}" r="4"/>` + T(30, y + 24, "A = " + A, "state t-" + node);
    s += L(44, y, 86, y, node) + swH(90, 124, y, EN === 1, node) + T(92, y - 22, "EN = " + EN, "small");
    s += L(128.5, y, 152, y, EN ? node : lineCls);
    s += L(152, y, 290, y, lineCls);
    if (res === "up") s += L(222, y, 222, 88, lineCls) + resV(222, 88, 36) + L(222, 36, 222, 22) + vsBar(222, 22) + `<circle class="dot ${lineCls}" cx="222" cy="${y}" r="4"/>`;
    if (res === "down") s += L(222, y, 222, 112) + resV(222, 112, 164) + L(222, 164, 222, 176) + ground(222, 176) + `<circle class="dot ${lineCls}" cx="222" cy="${y}" r="4"/>`;
    if (line === "float") s += T(222, y - 12, "?", "state t-z", 'text-anchor="middle"');
    s += `<rect class="box" x="290" y="40" width="136" height="120" rx="4"/>` + T(300, 60, "MCU 2 (reads)", "lbl");
    s += `<path class="solid" d="M300 ${y - 9} L318 ${y} L300 ${y + 9} Z" style="fill:var(--card)"/>`;
    s += L(290, y, 300, y, lineCls) + L(318, y, 340, y) + `<circle class="dot" cx="340" cy="${y}" r="3.5"/>`;
    s += T(350, y + 5, line === "float" ? "IN = ?" : "IN = " + line, "state t-" + lineCls);
    return s + "</svg>";
  }

  function labInput(el) {
    const { controls, view } = NES.lab(el, {
      title: "What does the input read?",
      hint: "Disable the driver (EN = 0) and remove the resistor to see a floating input. Then add a pull-up or pull-down. The strip shows the last 40 readings.",
    });
    const g = NES.group(controls, "Driver (MCU 1)");
    const en = NES.seg(g, { label: "EN", options: [[0, "0 (off)"], [1, "1 (on)"]], value: 0 });
    const a = NES.seg(g, { label: "A", options: [[0, "0"], [1, "1"]], value: 1 });
    const res = NES.seg(controls, { label: "Resistor on the line (10 kΩ)", options: [["none", "None"], ["up", "Pull-up"], ["down", "Pull-down"]], value: "none" });
    const stage = h("div", { class: "stage" });
    const strip = h("div", { class: "reading-strip", "aria-label": "Recent readings" });
    for (let i = 0; i < 40; i++) strip.append(h("span"));
    view.append(stage, h("div", { class: "codebar-title", text: "Readings over time (newest on the right)" }), strip);
    const stats = NES.stats(view, [{ key: "in", label: "IN" }, { key: "who", label: "Decided by" }, { key: "i", label: "Current in resistor" }]);

    const hist = [];
    let floatState = 0;
    function lineValue() {
      if (en.value) return a.value;
      if (res.value === "up") return 1;
      if (res.value === "down") return 0;
      return "float";
    }
    function sample() {
      const line = lineValue();
      let r;
      if (line === "float") { if (Math.random() < 0.35) floatState = 1 - floatState; r = floatState; }
      else r = line;
      hist.push(r); while (hist.length > 40) hist.shift();
      const cells = strip.children;
      for (let i = 0; i < 40; i++) {
        const v = hist[hist.length - 40 + i];
        cells[i].className = v == null ? "" : "r" + v;
        cells[i].textContent = v == null ? "" : v;
      }
    }
    function update() {
      const line = lineValue();
      stage.innerHTML = inputSVG(en.value, a.value, res.value, line);
      stats.set("in", line === "float" ? "random" : String(line), line === "float" ? "bad" : line ? "hi" : "lo");
      stats.set("who", en.value ? "MCU 1 output" : res.value === "none" ? "noise!" : res.value === "up" ? "pull-up" : "pull-down", en.value || res.value !== "none" ? "good" : "bad");
      const fight = en.value && ((res.value === "up" && a.value === 0) || (res.value === "down" && a.value === 1));
      stats.set("i", fight ? ((VS / 10000) * 1000).toFixed(2) + " mA" : "0 mA", fight ? "warn" : "");
    }
    [en, a, res].forEach((c) => (c.onchange = update));
    update();
    for (let i = 0; i < 40; i++) sample();
    let timer = null;
    NES.whenVisible(el, () => { if (!timer) timer = setInterval(sample, 160); }, () => { clearInterval(timer); timer = null; });
  }

  /* =====================================================================
     LAB: ADC transfer function (single-ended or differential)
     ===================================================================== */
  function labAdc(el, opt) {
    const diff = opt.mode === "diff";
    const { controls, view } = NES.lab(el, {
      title: diff ? "Differential ADC calculator" : "Single-ended ADC calculator",
      hint: diff
        ? "Output code DOUT ≈ (V" + sub("A") + " - V" + sub("B") + ") / V" + sub("ref") + " · 2<sup>M-1</sup>, clamped to [-2<sup>M-1</sup>, 2<sup>M-1</sup> - 1]. Set M = 12, V" + sub("ref") + " = 5 V to check the slide examples."
        : "Output code DOUT ≈ V" + sub("in") + " / V" + sub("ref") + " · 2<sup>M</sup>, clamped to 2<sup>M</sup> - 1. Start with few bits to see the staircase, then set M = 12, V" + sub("ref") + " = 5 V to check the slide examples.",
    });
    const M = NES.slider(controls, { label: "Resolution M", min: 2, max: 16, step: 1, value: 3, fmt: (v) => v + " bit" });
    const vref = NES.slider(controls, { label: "V<sub>ref</sub>", min: 0.5, max: 5, step: 0.05, value: 5, fmt: (v) => v.toFixed(2) + " V" });
    let vin, va, vb;
    if (diff) {
      va = NES.slider(controls, { label: "V<sub>A</sub>", min: 0, max: 5, step: 0.01, value: 3, fmt: (v) => v.toFixed(2) + " V" });
      vb = NES.slider(controls, { label: "V<sub>B</sub>", min: 0, max: 5, step: 0.01, value: 2, fmt: (v) => v.toFixed(2) + " V" });
    } else {
      vin = NES.slider(controls, { label: "V<sub>in</sub>", min: 0, max: 6, step: 0.01, value: 2.2, fmt: (v) => v.toFixed(2) + " V" });
    }
    const cv = h("canvas", { style: "height:250px", "aria-label": "ADC transfer function" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [
      { key: "dout", label: "DOUT" },
      { key: "bin", label: "Binary" },
      { key: "q", label: "Step size Q" },
      { key: "err", label: "Quantisation error" },
    ]);

    function codeOf(x, m, r) {
      if (diff) { const half = Math.pow(2, m - 1); return NES.clamp(Math.round((x / r) * half), -half, half - 1); }
      const full = Math.pow(2, m); return NES.clamp(Math.round((x / r) * full), 0, full - 1);
    }
    function input() { return diff ? va.value - vb.value : vin.value; }

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const m = M.value, r = vref.value, x = input();
      const padL = 52, padR = 12, padT = 12, padB = 30;
      const xmin = diff ? -5 : 0, xmax = diff ? 5 : 6;
      const cmin = diff ? -Math.pow(2, m - 1) : 0, cmax = diff ? Math.pow(2, m - 1) - 1 : Math.pow(2, m) - 1;
      const X = (v) => padL + ((v - xmin) / (xmax - xmin)) * (w - padL - padR);
      const Y = (c) => padT + (1 - (c - cmin) / (cmax - cmin || 1)) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font");
      // axes grid
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1; ctx.fillStyle = NES.css("--muted");
      for (let v = xmin; v <= xmax; v += 1) { ctx.beginPath(); ctx.moveTo(X(v), padT); ctx.lineTo(X(v), hh - padB); ctx.stroke(); ctx.fillText(v + (v === xmax ? " V" : ""), X(v) - (v === xmax ? 20 : 4), hh - padB + 16); }
      [cmin, diff ? 0 : Math.round(cmax / 2), cmax].forEach((c) => { ctx.beginPath(); ctx.moveTo(padL, Y(c)); ctx.lineTo(w - padR, Y(c)); ctx.stroke(); ctx.fillText(String(c), 4, Y(c) + 4); });
      // valid range shading
      ctx.fillStyle = NES.css("--tech"); ctx.globalAlpha = 0.07;
      ctx.fillRect(X(diff ? -r : 0), padT, X(r) - X(diff ? -r : 0), hh - padT - padB); ctx.globalAlpha = 1;
      // ideal line
      ctx.strokeStyle = NES.css("--muted"); ctx.setLineDash([4, 4]); ctx.beginPath();
      const k = diff ? Math.pow(2, m - 1) / r : Math.pow(2, m) / r;
      ctx.moveTo(X(xmin), Y(k * xmin)); ctx.lineTo(X(xmax), Y(k * xmax));
      ctx.save(); ctx.rect(padL, padT, w - padL - padR, hh - padT - padB); ctx.clip(); ctx.stroke(); ctx.restore(); ctx.setLineDash([]);
      // staircase
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      let prev = null;
      for (let px = padL; px <= w - padR; px++) {
        const v = xmin + ((px - padL) / (w - padL - padR)) * (xmax - xmin);
        const c = codeOf(v, m, r);
        if (prev === null) ctx.moveTo(px, Y(c)); else { if (c !== prev) ctx.lineTo(px, Y(prev)); ctx.lineTo(px, Y(c)); }
        prev = c;
      }
      ctx.stroke();
      // marker
      const c = codeOf(x, m, r);
      const xc = NES.clamp(x, xmin, xmax);
      ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(X(xc), hh - padB); ctx.lineTo(X(xc), Y(c)); ctx.lineTo(padL, Y(c)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(xc), Y(c), 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = NES.css("--muted");
      ctx.fillText(diff ? "V_A - V_B" : "V_in", w - padR - 60, hh - 2);
    });

    function update() {
      const m = M.value, r = vref.value, x = input();
      const c = codeOf(x, m, r);
      const q = diff ? r / Math.pow(2, m - 1) : r / Math.pow(2, m);
      const sat = diff ? (c === Math.pow(2, m - 1) - 1 && x / r * Math.pow(2, m - 1) > c + 0.5) || (c === -Math.pow(2, m - 1) && x / r * Math.pow(2, m - 1) < c - 0.5) : c === Math.pow(2, m) - 1 && (x / r) * Math.pow(2, m) > c + 0.5;
      stats.set("dout", c + (sat ? " (saturated)" : ""), sat ? "bad" : "");
      let bin;
      if (diff) { const u = c < 0 ? c + Math.pow(2, m) : c; bin = u.toString(2).padStart(m, "0"); }
      else bin = c.toString(2).padStart(m, "0");
      stats.set("bin", bin.length > 12 ? bin.replace(/(\d{4})(?=\d)/g, "$1 ") : bin);
      stats.set("q", q * 1000 >= 100 ? (q * 1000).toFixed(0) + " mV" : q * 1000 >= 1 ? (q * 1000).toFixed(2) + " mV" : (q * 1e6).toFixed(1) + " µV");
      stats.set("err", sat ? "clipped" : ((x - c * q) * 1000).toFixed(2) + " mV", sat ? "bad" : "");
      draw();
    }
    [M, vref, vin, va, vb].forEach((c) => c && (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: range vs resolution
     ===================================================================== */
  function labRange(el) {
    const { controls, view } = NES.lab(el, {
      title: "Fit V<sub>ref</sub> to your signal",
      hint: "The signal swings between 0 V and its maximum. Pick V<sub>ref</sub> so that the codes are well used without clipping. Supply is 5 V, so V<sub>ref</sub> ≤ 5 V.",
    });
    const M = NES.seg(controls, { label: "ADC resolution", options: [[8, "8 bit"], [10, "10 bit"], [12, "12 bit"]], value: 8 });
    const vref = NES.slider(controls, { label: "V<sub>ref</sub>", min: 0.1, max: 5, step: 0.05, value: 5, fmt: (v) => v.toFixed(2) + " V" });
    const smax = NES.slider(controls, { label: "Signal maximum", min: 0.1, max: 5, step: 0.05, value: 1, fmt: (v) => v.toFixed(2) + " V" });
    const volt = h("div", { class: "codebar" });
    const code = h("div", { class: "codebar" });
    view.append(volt, code);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "q", label: "Step size Q" }, { key: "top", label: "Highest code reached" }, { key: "use", label: "Codes used" }]);

    function update() {
      const m = M.value, r = vref.value, s = smax.value, full = Math.pow(2, m);
      const q = r / full;
      const top = Math.min(full - 1, Math.round((s / r) * full));
      const clip = s > r + 1e-9;
      const used = (top + 1) / full;
      volt.innerHTML = `<div class="codebar-title">Voltage axis (0 to 5 V)</div><div class="codebar-track"><div class="codebar-fill" style="width:${(Math.min(s, r) / 5) * 100}%"></div>${clip ? `<div class="codebar-over" style="left:${(r / 5) * 100}%;width:${((s - r) / 5) * 100}%"></div>` : ""}<div style="position:absolute;top:-2px;bottom:-2px;left:calc(${(r / 5) * 100}% - 1px);width:3px;background:var(--accent)"></div></div><div class="codebar-scale"><span>0 V</span><span>V<sub>ref</sub> = ${r.toFixed(2)} V (red mark)</span><span>5 V</span></div>`;
      code.innerHTML = `<div class="codebar-title">Code space (0 to ${full - 1})</div><div class="codebar-track"><div class="codebar-fill" style="width:${used * 100}%"></div></div><div class="codebar-scale"><span>0</span><span>used: 0 to ${top}</span><span>${full - 1}</span></div>`;
      stats.set("q", (q * 1000).toFixed(q * 1000 >= 10 ? 1 : 2) + " mV");
      stats.set("top", String(top) + (clip ? " (clipped)" : ""), clip ? "bad" : "");
      stats.set("use", (used * 100).toFixed(0) + "%", clip ? "bad" : used > 0.75 ? "good" : used > 0.4 ? "warn" : "bad");
      if (clip) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Clipping.</b> Everything between " + r.toFixed(2) + " V and " + s.toFixed(2) + " V reads as " + (full - 1) + ". Increase V<sub>ref</sub>."; }
      else if (used < 0.5) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Wasted range.</b> " + ((1 - used) * 100).toFixed(0) + "% of the codes are never used and each step is " + (q * 1000).toFixed(1) + " mV. Lower V<sub>ref</sub> towards the signal maximum."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Good fit.</b> The signal uses most of the code space, giving " + (q * 1000).toFixed(2) + " mV steps without clipping."; }
    }
    [M, vref, smax].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: sampling and aliasing
     ===================================================================== */
  function labAlias(el) {
    const { controls, view } = NES.lab(el, {
      title: "Sampling and aliasing (Nyquist)",
      hint: "The grey curve is the real signal, dots are ADC samples, the dashed curve is the slowest sine that fits the dots: what you would reconstruct. Push the signal frequency past half the sampling rate.",
    });
    const f = NES.slider(controls, { label: "Signal frequency", min: 0.5, max: 20, step: 0.5, value: 3, fmt: (v) => v.toFixed(1) + " Hz" });
    const fs = NES.slider(controls, { label: "Sampling rate", min: 2, max: 40, step: 1, value: 20, fmt: (v) => v + " Hz" });
    const cv = h("canvas", { style: "height:220px", "aria-label": "Sampling plot" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--muted)"></i>real signal</span><span><i style="background:var(--accent);height:8px;width:8px;border-radius:50%"></i>samples</span><span><i class="dash" style="color:var(--tech)"></i>reconstructed</span>` }));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "ny", label: "Nyquist limit f<sub>s</sub>/2" }, { key: "fa", label: "Apparent frequency" }]);
    const PH = 0.4;
    const alias = () => { const k = Math.round(f.value / fs.value); return f.value - k * fs.value; };

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 10, padR = 10, padT = 12, padB = 22;
      const X = (t) => padL + t * (w - padL - padR);
      const Y = (v) => padT + (1 - (v + 1) / 2) * (hh - padT - padB);
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0)); ctx.stroke();
      ctx.strokeStyle = NES.css("--muted"); ctx.lineWidth = 1.4; ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px++) { const t = px / (w - padL - padR); const y = Y(Math.sin(2 * Math.PI * f.value * t + PH)); px ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); }
      ctx.stroke();
      const fa = alias();
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2.2; ctx.setLineDash([7, 5]); ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px++) { const t = px / (w - padL - padR); const y = Y(Math.sin(2 * Math.PI * fa * t + PH)); px ? ctx.lineTo(X(t), y) : ctx.moveTo(X(t), y); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--accent");
      for (let n = 0; n <= fs.value; n++) { const t = n / fs.value; ctx.beginPath(); ctx.arc(X(t), Y(Math.sin(2 * Math.PI * f.value * t + PH)), 4, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = NES.css("--muted"); ctx.font = "11px " + NES.css("--font"); ctx.fillText("0 s", padL, hh - 5); ctx.fillText("1 s", w - padR - 18, hh - 5);
    });
    function update() {
      const fa = Math.abs(alias());
      const ok = fs.value > 2 * f.value;
      stats.set("ny", (fs.value / 2).toFixed(1) + " Hz");
      stats.set("fa", fa.toFixed(1) + " Hz", ok ? "good" : "bad");
      if (ok) { verdict.className = "verdict good"; verdict.innerHTML = "<b>OK:</b> f<sub>s</sub> = " + fs.value + " Hz &gt; 2 · " + f.value.toFixed(1) + " Hz. The samples uniquely describe the signal."; }
      else if (Math.abs(fs.value - 2 * f.value) < 1e-9) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Borderline:</b> exactly 2 samples per period. Depending on the phase you may hit the peaks or only the zero crossings. The theorem needs strictly more than 2×."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Aliasing:</b> f<sub>s</sub> ≤ 2f. The samples look like a " + fa.toFixed(1) + " Hz signal. Once sampled, there is no way to tell the difference."; }
      draw();
    }
    f.onchange = fs.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: DAC staircase + reconstruction filter
     ===================================================================== */
  function labDac(el) {
    const { controls, view } = NES.lab(el, {
      title: "From numbers back to a voltage",
      hint: "A DAC holds each value until the next sample arrives, producing a staircase. A low-pass (reconstruction) filter smooths it into a continuous signal. V" + sub("ref") + " = 3.3 V.",
    });
    const M = NES.slider(controls, { label: "DAC resolution M", min: 1, max: 10, step: 1, value: 3, fmt: (v) => v + " bit" });
    const N = NES.slider(controls, { label: "Samples per period", min: 4, max: 64, step: 1, value: 12, fmt: (v) => String(v) });
    const filt = NES.seg(controls, { label: "Low-pass filter", options: [[1, "On"], [0, "Off"]], value: 1 });
    const cv = h("canvas", { style: "height:220px", "aria-label": "DAC output plot" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i class="dash" style="color:var(--muted)"></i>target sine</span><span><i style="background:var(--tech)"></i>DAC output (staircase)</span><span><i style="background:var(--hi)"></i>after low-pass filter</span>` }));
    const stats = NES.stats(view, [{ key: "lv", label: "Output levels" }, { key: "q", label: "Step size" }]);

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const m = M.value, n = N.value, levels = Math.pow(2, m), q = VS / levels;
      const padL = 40, padR = 8, padT = 10, padB = 12;
      const periods = 2, X = (t) => padL + (t / periods) * (w - padL - padR);
      const Y = (v) => padT + (1 - v / VS) * (hh - padT - padB);
      const target = (t) => (VS / 2) * (1 + 0.92 * Math.sin(2 * Math.PI * t));
      const code = (t) => NES.clamp(Math.round(target(Math.floor(t * n) / n) / q), 0, levels - 1);
      ctx.font = "11px " + NES.css("--font"); ctx.fillStyle = NES.css("--muted");
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      if (levels <= 32) for (let k = 0; k < levels; k++) { ctx.beginPath(); ctx.moveTo(padL, Y(k * q)); ctx.lineTo(w - padR, Y(k * q)); ctx.stroke(); }
      ctx.fillText("3.3 V", 4, Y(VS) + 8); ctx.fillText("0 V", 4, Y(0));
      ctx.strokeStyle = NES.css("--muted"); ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px++) { const t = (px / (w - padL - padR)) * periods; px ? ctx.lineTo(X(t), Y(target(t))) : ctx.moveTo(X(t), Y(target(t))); }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      let prev = null;
      for (let px = 0; px <= w - padL - padR; px++) {
        const t = (px / (w - padL - padR)) * periods; const v = code(t) * q;
        if (prev == null) ctx.moveTo(X(t), Y(v)); else { if (v !== prev) ctx.lineTo(X(t), Y(prev)); ctx.lineTo(X(t), Y(v)); }
        prev = v;
      }
      ctx.stroke();
      if (filt.value) {
        const steps = 4000, dt = (periods + 2) / steps, tau = 0.45 / n;
        const a = dt / (tau + dt);
        let y1 = VS / 2, y2 = VS / 2;
        ctx.strokeStyle = NES.css("--hi"); ctx.lineWidth = 2.2; ctx.beginPath();
        let started = false;
        for (let i = 0; i <= steps; i++) {
          const t = -2 + i * dt;
          const u = code(t) * q;
          y1 += a * (u - y1); y2 += a * (y1 - y2);
          if (t >= 0) { if (!started) { ctx.moveTo(X(t), Y(y2)); started = true; } else ctx.lineTo(X(t), Y(y2)); }
        }
        ctx.stroke();
      }
    });
    function update() {
      const levels = Math.pow(2, M.value);
      stats.set("lv", String(levels));
      stats.set("q", ((VS / levels) * 1000).toFixed(levels > 256 ? 2 : 1) + " mV");
      draw();
    }
    [M, N, filt].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: power control with a series resistor
     ===================================================================== */
  function labPower(el) {
    const { controls, view } = NES.lab(el, {
      title: "Dim a load with a series resistor",
      hint: "V" + sub("in") + " = 5 V and the load R" + sub("2") + " = 100 Ω. Sweep R" + sub("1") + " and watch where the energy goes. The worst case is R" + sub("1") + " = R" + sub("2") + ". The last tile shows the PWM duty cycle that would give the load the same power with (ideally) no loss.",
    });
    const r1 = NES.slider(controls, { label: "R<sub>1</sub> (series)", min: 0, max: 4, step: 0.02, value: 2, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + " kΩ" : v.toFixed(v < 10 ? 1 : 0) + " Ω") });
    const presets = h("div", { class: "seg" });
    [["1 Ω", 0], ["R₁ = R₂", 2], ["10 kΩ", 4]].forEach(([t, e]) => presets.append(h("button", { type: "button", html: t, onclick: () => r1.set(Math.pow(10, e)) || update() })));
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Jump to</span>" }), presets]));
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "pl", label: "Power in load" }, { key: "pr", label: "Wasted in R<sub>1</sub>" }, { key: "eff", label: "Efficiency" }, { key: "pwm", label: "PWM duty for the same load power" }]);
    const V = 5, R2 = 100, PMAX = (V * V) / R2;

    function update() {
      const R1 = r1.value, I = V / (R1 + R2), PL = I * I * R2, PR = I * I * R1, eff = R2 / (R1 + R2);
      const row = (label, val, max, color, txt) => `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${(val / max) * 100}%;background:${color}"></div></div><span class="m-val">${txt}</span></div>`;
      const mw = (p) => (p * 1000 >= 10 ? (p * 1000).toFixed(0) : (p * 1000).toFixed(2)) + " mW";
      meter.innerHTML =
        row("Load R<sub>2</sub>", PL, PMAX, "var(--ok)", mw(PL)) +
        row("Resistor R<sub>1</sub>", PR, PMAX, "var(--bad)", mw(PR)) +
        row("Efficiency", eff, 1, "var(--tech)", (eff * 100).toFixed(0) + "%") +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">power bars scaled to the 250 mW the load gets with R<sub>1</sub> = 0</span><span></span></div>`;
      stats.set("pl", mw(PL));
      stats.set("pr", mw(PR), PR > 0.03 ? "bad" : PR > 0.005 ? "warn" : "");
      stats.set("eff", (eff * 100).toFixed(0) + "%", eff > 0.9 ? "good" : eff > 0.6 ? "warn" : "bad");
      stats.set("pwm", "D = " + ((PL / PMAX) * 100).toFixed(0) + "%", "good");
    }
    r1.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: PWM (LED and motor)
     ===================================================================== */
  function labPwm(el) {
    const { controls, view } = NES.lab(el, {
      title: "PWM playground",
      hint: "The LED is really switched on and off at the chosen frequency (the screen averages anything faster than its refresh rate, much like your eye). A motor's inductance smooths the current, and its inertia smooths the speed.",
    });
    const duty = NES.slider(controls, { label: "Duty cycle D", min: 0, max: 100, step: 1, value: 25, fmt: (v) => v + "%" });
    const freq = NES.slider(controls, { label: "Frequency", min: 0, max: 3, step: 0.01, value: Math.log10(2), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => (v >= 100 ? v.toFixed(0) : v.toFixed(1)) + " Hz" });
    const load = NES.seg(controls, { label: "Load", options: [["led", "LED"], ["motor", "Motor"]], value: "led" });
    const presets = h("div", { class: "seg" });
    [["2 Hz", 2], ["20 Hz", 20], ["200 Hz", 200]].forEach(([t, fq]) => presets.append(h("button", { type: "button", text: t, onclick: () => { freq.set(fq); update(); } })));
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Jump to</span>" }), presets]));

    const dev = h("div", { class: "device" });
    const cv = h("canvas", { style: "height:190px", "aria-label": "PWM waveform" });
    view.append(h("div", { class: "pwm-row" }, [dev, h("div", { class: "stage" }, [cv])]));
    const legend = h("div", { class: "legend" });
    view.append(legend);
    const stats = NES.stats(view, [{ key: "T", label: "Period T" }, { key: "on", label: "On-time" }, { key: "avg", label: "Average voltage" }, { key: "see", label: "An LED would look" }]);

    const TAU = 0.004; // motor electrical time constant L/R (s)
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const D = duty.value / 100, f = freq.value, Tp = 1 / f, periods = 5, span = periods * Tp;
      const padL = 36, padR = 8, padT = 12, padB = 24;
      const X = (t) => padL + (t / span) * (w - padL - padR);
      const Y = (v) => padT + (1 - v / VS) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font"); ctx.fillStyle = NES.css("--muted");
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      [0, VS].forEach((v) => { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); });
      ctx.fillText("3.3 V", 2, Y(VS) + 4); ctx.fillText("0 V", 2, Y(0) + 4);
      // square wave
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      for (let k = 0; k < periods; k++) {
        const t0 = k * Tp, t1 = t0 + D * Tp, t2 = t0 + Tp;
        if (k === 0) ctx.moveTo(X(t0), Y(D > 0 ? VS : 0));
        if (D > 0) { ctx.lineTo(X(t0), Y(VS)); ctx.lineTo(X(t1), Y(VS)); }
        ctx.lineTo(X(t1), Y(0)); ctx.lineTo(X(t2), Y(0));
      }
      ctx.stroke();
      if (load.value === "motor") {
        // steady-state RL current, normalised to V/R
        const steps = 400, dt = Tp / steps;
        let i = D;
        for (let k = 0; k < 40; k++) for (let s = 0; s < steps; s++) { const u = s < D * steps ? 1 : 0; i += (dt / TAU) * (u - i); }
        ctx.strokeStyle = NES.css("--hi"); ctx.lineWidth = 2.2; ctx.beginPath();
        for (let k = 0; k < periods; k++) for (let s = 0; s < steps; s++) {
          const u = s < D * steps ? 1 : 0; i += (dt / TAU) * (u - i);
          const t = k * Tp + s * dt;
          (k || s) ? ctx.lineTo(X(t), Y(i * VS)) : ctx.moveTo(X(t), Y(i * VS));
        }
        ctx.stroke();
      }
      ctx.strokeStyle = NES.css("--accent"); ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padL, Y(D * VS)); ctx.lineTo(w - padR, Y(D * VS)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--muted");
      const ms = span * 1000;
      ctx.fillText("0", padL, hh - 6);
      const lab = ms >= 1000 ? (ms / 1000).toFixed(1) + " s" : ms.toFixed(ms < 10 ? 1 : 0) + " ms";
      ctx.fillText(lab, w - padR - ctx.measureText(lab).width, hh - 6);
    });

    function onIntegral(t, f, D) { const Tp = 1 / f; const n = Math.floor(t / Tp); return n * D * Tp + Math.min(t - n * Tp, D * Tp); }

    let angle = 0, speed = 0, last = null, raf = null;
    function frame(ts) {
      const t = ts / 1000;
      const dt = last == null ? 1 / 60 : Math.min(0.1, t - last);
      const f = freq.value, D = duty.value / 100;
      const frac = dt > 0 ? (onIntegral(t, f, D) - onIntegral(t - dt, f, D)) / dt : D;
      last = t;
      if (load.value === "led") {
        const bulb = dev.querySelector(".led-core"), halo = dev.querySelector(".led-halo");
        if (bulb) { bulb.style.opacity = String(0.08 + 0.92 * frac); halo.style.opacity = String(0.55 * frac); }
      } else {
        speed += (dt / 0.25) * (frac - speed);
        angle = (angle + speed * dt * 900) % 360;
        const rotor = dev.querySelector(".rotor");
        if (rotor) rotor.setAttribute("transform", `rotate(${angle.toFixed(1)} 55 55)`);
      }
      raf = requestAnimationFrame(frame);
    }

    function buildDevice() {
      if (load.value === "led") {
        dev.innerHTML = `<svg viewBox="0 0 110 110" aria-hidden="true"><circle class="led-halo" cx="55" cy="50" r="44" style="fill:var(--hi);opacity:.3"/><circle cx="55" cy="50" r="24" style="fill:var(--card);stroke:var(--line-2);stroke-width:2"/><circle class="led-core" cx="55" cy="50" r="22" style="fill:var(--hi)"/><rect x="45" y="74" width="20" height="8" rx="2" style="fill:var(--line-2)"/><line x1="49" y1="82" x2="49" y2="104" style="stroke:var(--muted);stroke-width:2"/><line x1="61" y1="82" x2="61" y2="100" style="stroke:var(--muted);stroke-width:2"/></svg><div class="device-cap">the actual LED</div>`;
      } else {
        dev.innerHTML = `<svg viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="48" style="fill:var(--lab-bg);stroke:var(--line-2);stroke-width:2"/><g class="rotor">${[0, 120, 240].map((a) => `<path d="M55 55 L55 14 A 14 14 0 0 1 69 28 Z" transform="rotate(${a} 55 55)" style="fill:var(--hi)"/>`).join("")}</g><circle cx="55" cy="55" r="7" style="fill:var(--ink-2)"/></svg><div class="device-cap">motor (speed ∝ average current)</div>`;
      }
      legend.innerHTML = `<span><i style="background:var(--tech)"></i>GPIO voltage</span><span><i class="dash" style="color:var(--accent)"></i><span>average D · V<sub>S</sub></span></span>` + (load.value === "motor" ? `<span><i style="background:var(--hi)"></i>motor current (scaled, L/R = 4 ms)</span>` : "");
    }

    let lastLoad = null;
    function update() {
      if (load.value !== lastLoad) { buildDevice(); lastLoad = load.value; }
      const D = duty.value / 100, f = freq.value, Tp = 1 / f;
      const fmtT = (s) => (s >= 1 ? s.toFixed(2) + " s" : (s * 1000).toFixed(s < 0.01 ? 2 : 1) + " ms");
      stats.set("T", fmtT(Tp));
      stats.set("on", fmtT(D * Tp));
      stats.set("avg", (D * VS).toFixed(2) + " V");
      stats.set("see", f < 50 ? "flicker" : f < 100 ? "maybe flicker" : "steady light", f < 50 ? "bad" : f < 100 ? "warn" : "good");
      draw();
    }
    [duty, freq, load].forEach((c) => (c.onchange = update));
    update();
    NES.whenVisible(el, () => { if (!raf) { last = null; raf = requestAnimationFrame(frame); } }, () => { cancelAnimationFrame(raf); raf = null; });
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    noise: labNoise,
    pushpull: (el) => labGpio(el, { showEN: false }),
    tristate: (el) => labGpio(el, { showEN: true }),
    led: labLed,
    "bus-basic": (el) => labBus(el, { basic: true }),
    bus: (el) => labBus(el, {}),
    hyst: labHyst,
    input: labInput,
    adc: (el) => labAdc(el, { mode: "single" }),
    "adc-diff": (el) => labAdc(el, { mode: "diff" }),
    range: labRange,
    alias: labAlias,
    dac: labDac,
    power: labPower,
    pwm: labPwm,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("mcu-io", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
