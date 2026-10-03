/* Practical Electronics for Embedded Systems: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    schematic: [
      {
        q: "What is a schematic?",
        options: [
          ["A photo of the finished circuit board", false, "A photo shows what the hardware looks like. A schematic deliberately ignores looks and shows only what is connected to what."],
          ["The list of components to buy", false, "That is the bill of materials (BOM). It says what to buy, not how things are connected."],
          ["A model of an electronic circuit that reduces components to symbols and connections", true, "A schematic abstracts each component to a basic concept (a resistor, an LED, a source) and shows how they are interconnected. That makes it far easier to read than the physical circuit."],
          ["The drawing of copper tracks on the board", false, "That is the board layout. It is made later, from the schematic."],
        ],
      },
      {
        q: "The slide defines an electronic circuit as components interconnected in a closed loop. Why does the loop matter?",
        options: [
          ["Current only flows if there is a complete path from the source, through the components, and back to the source", true, "Charge has to return to the source. Break the loop anywhere (an open switch, a loose wire) and the current stops everywhere in that loop."],
          ["A loop makes the circuit look tidy", false, "It is not about appearance. Without a closed path, no current flows at all."],
          ["Loops are needed only for AC circuits", false, "DC circuits need a closed path just as much: a battery with one terminal unconnected does nothing."],
          ["A loop stores energy", false, "Storing energy is what capacitors, inductors and batteries do. The loop is simply the path the current needs."],
        ],
      },
    ],

    ohm: [
      {
        q: "A 3.3 V source is connected across a 330 Ω resistor. What current flows?",
        options: [
          ["1 mA", false, "That would need 3.3 kΩ. Here R is ten times smaller, so the current is ten times larger."],
          ["100 mA", false, "That would need 33 Ω. Check the division: 3.3 / 330 = 0.01 A."],
          ["1089 mA", false, "That multiplies V by R. Ohm's law divides: I = V / R."],
          ["10 mA", true, "I = V / R = 3.3 V / 330 Ω = 0.01 A = 10 mA."],
        ],
      },
      {
        q: "You keep the voltage fixed and double the resistance. What happens to the current?",
        options: [
          ["It doubles", false, "More opposition means less flow, not more."],
          ["It halves", true, "I = V / R. With V fixed, the current is inversely proportional to R: twice the resistance, half the current."],
          ["It stays the same", false, "With I = V / R, changing R must change I when V is fixed."],
          ["It drops to zero", false, "Only an infinite resistance (an open circuit) would stop the current completely."],
        ],
      },
      {
        q: "Which statement describes voltage correctly?",
        options: [
          ["The flow of charged particles through a wire", false, "That is current (measured in amperes)."],
          ["The opposition to the flow of current", false, "That is resistance (measured in ohms)."],
          ["The energy consumed per second", false, "That is power (measured in watts)."],
          ["The electric potential difference between two points", true, "Voltage is always between two points. Saying 'this wire is at 3.3 V' silently means 'relative to ground'."],
        ],
      },
    ],

    "power-source": [
      {
        q: "Your embedded device is plugged into a wall socket. What has to happen before the microcontroller can use that power?",
        options: [
          ["The AC must be converted to DC by a rectifier (inside the power adapter)", true, "A rectifier converts AC to DC. A real adapter also lowers the voltage and smooths it, but the AC to DC step is the rectifier's job."],
          ["Nothing, microcontrollers run on AC", false, "Embedded systems typically require DC. Mains AC reverses direction 50 or 60 times a second."],
          ["The DC must be converted to AC", false, "It is the other way round: the mains is AC and the electronics need DC."],
          ["A battery must be added to store the AC", false, "Batteries store and deliver DC. They cannot store AC directly."],
        ],
      },
      {
        q: "Which of these is a DC source?",
        options: [
          ["The mains socket", false, "The mains is the classic AC source: its current periodically reverses direction."],
          ["A battery", true, "A battery pushes charge in one direction only: direct current."],
          ["The output of a power-station generator", false, "Generators in the grid produce AC."],
          ["None: DC does not exist in practice", false, "Every battery-powered device runs on DC."],
        ],
      },
    ],

    "voltage-sources": [
      {
        q: "On a schematic, three different places carry the label V" + sub("source") + ". What does that mean?",
        options: [
          ["Three separate batteries are needed", false, "A label is a naming shortcut, not a component."],
          ["The three points have similar but independent voltages", false, "Same label means the same node: one voltage, one connection."],
          ["All three points are electrically connected to each other, even though no wire is drawn", true, "A label implies that all points with the same label are connected. It keeps large schematics readable by avoiding long wires across the page."],
          ["They are test points for a multimeter", false, "Labels define connectivity. They have nothing to do with measuring."],
        ],
      },
      {
        q: "What is 'ground' in a circuit?",
        options: [
          ["The common reference point from which voltages are measured", true, "Voltage is a difference between two points. It is convenient to pick one common point, call it 0 V, and measure everything else relative to it."],
          ["Always a wire to the soil outside the building", false, "Ground is sometimes physically connected to the earth, but it does not have to be. A battery-powered wearable has a ground and no earth connection."],
          ["The point with the highest voltage", false, "Ground is the 0 V reference. The supply rail is normally the highest."],
          ["A special component that absorbs current", false, "Ground is a node (a reference), not a component."],
        ],
      },
    ],

    load: [
      {
        q: "A sensor draws 20 mA from a 3 V supply. How much power does it consume?",
        options: [
          ["150 mW", false, "That divides instead of multiplying. P = V · I."],
          ["6 mW", false, "Check the units: 3 V · 20 mA = 60 mW."],
          ["23 mW", false, "That adds the two numbers. Power is the product of voltage and current."],
          ["60 mW", true, "P = V · I = 3 V · 0.020 A = 0.06 W = 60 mW."],
        ],
      },
      {
        q: "The same sensor (60 mW) runs for 10 seconds. How much energy does it use?",
        options: [
          ["6 mJ", false, "That divides power by time. Energy grows with time: E = P · t."],
          ["60 mJ", false, "That is the energy for 1 second."],
          ["0.6 J", true, "E = P · t = 0.06 W · 10 s = 0.6 J. Energy is proportional to the time of operation."],
          ["600 J", false, "That forgets that 60 mW is 0.06 W."],
        ],
      },
      {
        q: "What is an electric load?",
        options: [
          ["The part of the circuit that supplies energy", false, "That is the source."],
          ["The part of the circuit that consumes electrical energy and turns it into light, motion or heat", true, "In the slide, the resistor and LED together are the load: they take energy from the battery and turn it into light and heat."],
          ["The weight of the components on the board", false, "In electronics, 'load' is about consuming electrical energy."],
          ["The wires between components", false, "Ideal wires consume nothing. The load is what uses the energy."],
        ],
      },
    ],

    resistance: [
      {
        q: "The slide gives an open switch (an air gap) a resistance of 10<sup>14</sup> Ω. What does that tell you?",
        options: [
          ["Air is a conductor", false, "With 10<sup>14</sup> Ω, the current at a few volts is far too small to matter. Air is an insulator."],
          ["Open switches waste a lot of power", false, "P = V² / R. With such a huge R, the power is essentially zero."],
          ["Insulators do not have infinite resistance, just an extremely high one", true, "We assume insulators have infinite resistance because the real value is so large that the current is negligible. But strictly, everything has some resistance."],
          ["The switch is broken", false, "It is the normal behaviour of an open switch."],
        ],
      },
      {
        q: "We usually assume a copper wire has zero resistance. Why is that a reasonable assumption?",
        options: [
          ["Because its real resistance (milliohms) is tiny compared to the other resistances in the circuit", true, "A few milliohms in series with hundreds or thousands of ohms changes nothing you can measure. The assumption only breaks for very high currents or very long, thin wires."],
          ["Because copper truly has no resistance", false, "Only superconductors have zero resistance. The slide gives a real wire about 0.002 Ω."],
          ["Because wires are not part of the circuit", false, "They are part of the circuit. Their resistance is just negligible most of the time."],
          ["Because current does not flow through wires", false, "Current flows through wires more easily than through anything else in the circuit."],
        ],
      },
    ],

    parallel: [
      {
        q: "A 1 kΩ resistor alone, versus 1 kΩ in parallel with 1 MΩ, with the same voltage applied. How much more current does the parallel pair draw?",
        options: [
          ["About 1% more", false, "The extra path is 1000 times more resistive, so it adds only 1/1000 of the current: 0.1%."],
          ["About 10% more", false, "That would need the second resistor to be about 10 kΩ, not 1 MΩ."],
          ["It draws less current", false, "Adding a parallel path can only make it easier for current to flow, never harder."],
          ["About 0.1% more", true, "The pair has R = (1k · 1M) / (1k + 1M) ≈ 999 Ω. At 1 V that gives 1.001 mA instead of 1 mA: 0.1% more. Practically the two are equivalent."],
        ],
      },
      {
        q: "What does 'current takes the path of least resistance' really mean?",
        options: [
          ["All of the current flows through the smallest resistor and none through the others", false, "Every path with a voltage across it carries some current. The 1 MΩ path still carries 1 µA."],
          ["Current splits between parallel paths in inverse proportion to their resistance, so most of it takes the easiest path", true, "With 1 kΩ and 1 MΩ in parallel, the 1 kΩ path carries 1000 times more current. Most, but not all."],
          ["Current chooses one path at random", false, "The split is fully determined by Ohm's law applied to each branch."],
          ["Current avoids resistors altogether", false, "If the only paths contain resistors, current flows through them."],
        ],
      },
      {
        q: "Two 1 kΩ resistors are connected in parallel. What is the combined resistance?",
        options: [
          ["2 kΩ", false, "That is the series combination (resistances add)."],
          ["1 kΩ", false, "A second path always lowers the total resistance."],
          ["0 Ω", false, "Only a wire in parallel (a short) would bring it close to zero."],
          ["500 Ω", true, "R = (R1 · R2) / (R1 + R2) = (1k · 1k) / 2k = 500 Ω. Two equal paths carry twice the current."],
        ],
      },
    ],

    short: [
      {
        q: "A battery with 0.5 Ω internal resistance and 3 V is shorted with a thick wire (about 0 Ω). Roughly what current flows?",
        options: [
          ["About 6 A", true, "I = V / R = 3 V / 0.5 Ω = 6 A. The current is limited by what the supply can provide: here by its internal resistance."],
          ["Infinite", false, "Mathematically V / 0 is infinite, but in practice the battery's own internal resistance limits the current."],
          ["About 1.5 A", false, "That multiplies V by R. Ohm's law: I = V / R."],
          ["0 A, because there is no load", false, "No load resistance means maximum current, not zero."],
        ],
      },
      {
        q: "Why is a short circuit a problem even in low-power electronics?",
        options: [
          ["It makes the circuit run too slowly", false, "Speed is not the issue. The very high current is."],
          ["The very high current can damage components or chips", true, "The slide's point: in high-power electronics a short can be dangerous or lethal, and in low-power electronics it can still destroy components, tracks or the battery."],
          ["It wastes a little energy but is otherwise harmless", false, "The current is limited only by tiny resistances, so the heat produced can destroy parts."],
          ["It only matters for AC circuits", false, "A battery (DC) can deliver a large short-circuit current too."],
        ],
      },
    ],

    variable: [
      {
        q: "Which component is a temperature-dependent resistor?",
        options: [
          ["Potentiometer", false, "A potentiometer's resistance is set mechanically, by turning or sliding."],
          ["Photoresistor", false, "A photoresistor reacts to light (luminosity)."],
          ["Thermistor", true, "Thermistor = thermal resistor. Its resistance changes with temperature, which is how simple temperature sensors work."],
          ["Transistor", false, "A transistor's resistance is controlled electrically, by a voltage or current."],
        ],
      },
      {
        q: "Capacitors and inductors behave like frequency-dependent resistors for AC. What is that 'resistance' called?",
        options: [
          ["Reactance", true, "Reactance is the opposition a capacitor or inductor presents to AC. Unlike resistance, it depends on the frequency of the signal."],
          ["Conductance", false, "Conductance is simply 1/R of an ordinary resistor."],
          ["Inductance", false, "Inductance (in henries) is the property of the inductor itself, not the opposition it presents at a given frequency."],
          ["Attenuation", false, "Attenuation is how much a signal is reduced, e.g. by a voltage divider."],
        ],
      },
    ],

    divider: [
      {
        q: "A voltage divider has V" + sub("in") + " = 5 V, R" + sub("1") + " = 1 kΩ (top) and R" + sub("2") + " = 4 kΩ (bottom). What is V" + sub("out") + "?",
        options: [
          ["1 V", false, "That uses R1 on top of the fraction. The output is taken across R2: V" + sub("out") + " = V" + sub("in") + " · R2 / (R1 + R2)."],
          ["1.25 V", false, "That divides 5 V by R2 in kΩ. Use the ratio R2 / (R1 + R2)."],
          ["5 V", false, "That would need R1 = 0."],
          ["4 V", true, "V" + sub("out") + " = 5 V · 4k / (1k + 4k) = 4 V."],
        ],
      },
      {
        q: "R" + sub("1") + " is made much larger than R" + sub("2") + ". What happens to the output?",
        options: [
          ["Most of the input signal goes through (small attenuation)", false, "That is the case when R1 is much smaller than R2."],
          ["The output becomes larger than the input", false, "A resistive divider can only attenuate. The ratio is always between 0 and 1."],
          ["Most of the input signal does not go through (large attenuation)", true, "The ratio R2 / (R1 + R2) becomes very small, so V" + sub("out") + " is a small fraction of V" + sub("in") + "."],
          ["Nothing changes", false, "The output depends directly on the ratio of the two resistors."],
        ],
      },
    ],

    "level-shifter": [
      {
        q: "The level shifter uses 1 kΩ in series and 2 kΩ to ground. A 5 V '1' comes in. What does the 3.3 V device see?",
        options: [
          ["1.67 V", false, "That is the voltage across the 1 kΩ resistor. The input sees the voltage across the 2 kΩ one."],
          ["3.33 V", true, "V = 5 V · 2k / (1k + 2k) = 3.33 V. High enough to read as '1', low enough not to damage a 3.3 V input."],
          ["2.5 V", false, "That would be two equal resistors."],
          ["5 V", false, "That is what the divider is there to prevent."],
        ],
      },
      {
        q: "Why is the level shifter needed at all?",
        options: [
          ["The 3.3 V device cannot understand a '1' otherwise", false, "It would understand 5 V as '1'. The problem is that 5 V is above what its input is allowed to take."],
          ["To make the signal faster", false, "A resistive divider does not speed anything up (if anything it slows edges slightly)."],
          ["Applying 5 V to an input that expects at most 3.3 V can damage it", true, "The slide's purpose: interface a device that encodes '1' as 5 V to one that expects 3.3 V maximum, without damaging the latter."],
          ["To amplify the signal", false, "A divider attenuates. It reduces 5 V to 3.3 V."],
        ],
      },
    ],

    potentiometer: [
      {
        q: "How does a potentiometer act as a volume control?",
        options: [
          ["The wiper cuts one resistor into two parts, forming a voltage divider with a mechanically adjustable ratio", true, "Two terminals are at the ends of the resistor and the third is the wiper. Moving the wiper changes R1 and R2 together, so the output is an adjustable fraction of the input."],
          ["It changes the supply voltage of the amplifier", false, "It works on the signal, not the supply."],
          ["It stores the signal and releases it slowly", false, "That would describe a capacitor."],
          ["It switches the signal on and off quickly", false, "That is PWM, a different technique."],
        ],
      },
      {
        q: "A potentiometer is wired between 3.3 V and ground and its wiper goes to an ADC. What does the microcontroller get?",
        options: [
          ["Only '0' or '1'", false, "That would be a digital input. The ADC gives a whole range of numbers."],
          ["The resistance of the potentiometer in ohms", false, "Embedded systems measure voltage, not resistance. The divider turns the position into a voltage."],
          ["Nothing, ADCs cannot read potentiometers", false, "This is one of the most common uses of an ADC."],
          ["A number that tells it the knob position", true, "The wiper voltage is a fraction of 3.3 V set by the knob. The ADC measures that voltage and maps it to a number: a simple user input."],
        ],
      },
    ],

    thermistor: [
      {
        q: "Why is the thermistor put in a voltage divider instead of being connected straight to the microcontroller?",
        options: [
          ["To protect the thermistor from heat", false, "The divider does not protect anything. It converts a quantity."],
          ["Because an embedded system can measure voltage, not resistance", true, "The divider turns the resistance change into a voltage change, which an ADC can measure."],
          ["Because thermistors only work in pairs", false, "One thermistor and one ordinary resistor are enough."],
          ["To make the thermistor more accurate", false, "The divider does not change the thermistor's accuracy. It makes its resistance readable."],
        ],
      },
      {
        q: "In the slide's circuit the NTC thermistor is R" + sub("2") + " (to ground). The temperature rises. What happens to V" + sub("out") + "?",
        options: [
          ["It rises", false, "The Murata curve shows resistance falling as temperature rises. A smaller R2 gives a smaller share of the voltage."],
          ["It stays the same", false, "The output depends on the ratio of the two resistors, and one of them just changed."],
          ["It becomes negative", false, "The output of a divider between V" + sub("S") + " and ground always stays between 0 and V" + sub("S") + "."],
          ["It falls", true, "An NTC's resistance drops with temperature (see the curve). V" + sub("out") + " = V" + sub("S") + " · R2 / (R1 + R2), so a smaller R2 means a lower output voltage."],
        ],
      },
    ],

    capacitor: [
      {
        q: "How does a capacitor treat DC and AC?",
        options: [
          ["It blocks DC and lets AC through", true, "Once charged, no steady current flows through a capacitor. Changing signals do pass, and the faster they change the more easily they pass."],
          ["It lets DC through and blocks AC", false, "That is closer to how an inductor behaves."],
          ["It blocks both", false, "AC passes. High frequencies see a low 'resistance'."],
          ["It passes both equally", false, "Its opposition depends strongly on frequency."],
        ],
      },
      {
        q: "In the RC circuit of the slide (R in series, C to ground), which signals reach the output almost unchanged?",
        options: [
          ["High frequencies", false, "For high frequencies the capacitor looks like a low resistance to ground, so they are attenuated a lot."],
          ["Low frequencies", true, "It is a low-pass filter. At low frequencies the capacitor looks like a very high resistance, so almost the whole input appears at the output."],
          ["All frequencies equally", false, "The capacitor's 'resistance' depends on frequency, so the division ratio does too."],
          ["None", false, "Slow signals and DC pass nearly untouched."],
        ],
      },
      {
        q: "An RC low-pass filter has R = 1 kΩ and C = 1 µF. Roughly where is its cutoff frequency?",
        options: [
          ["About 16 Hz", false, "That would be R · C = 10 ms. Here R · C = 1 ms."],
          ["About 1 kHz", false, "1 / (RC) = 1000 is in radians per second. Divide by 2π to get hertz."],
          ["About 160 Hz", true, "f" + sub("c") + " = 1 / (2πRC) = 1 / (2π · 1000 · 0.000001) ≈ 159 Hz. Signals well below pass, signals well above are attenuated."],
          ["About 1 MHz", false, "That is off by several orders of magnitude. RC = 1 ms."],
        ],
      },
    ],

    battery: [
      {
        q: "A 3.0 V battery has an internal resistance of 5 Ω. The system draws 100 mA during a radio transmission. What supply voltage does the system see?",
        options: [
          ["2.5 V", true, "Drop = I · R" + sub("I") + " = 0.1 A · 5 Ω = 0.5 V, so V" + sub("S") + " = 3.0 - 0.5 = 2.5 V."],
          ["3.0 V", false, "Only if no current flows. The internal resistance drops voltage in proportion to the current."],
          ["2.95 V", false, "That would be the drop for 10 mA."],
          ["0.5 V", false, "0.5 V is the drop, not what is left."],
        ],
      },
      {
        q: "Why can a device that works fine most of the time suddenly reset when its radio switches on?",
        options: [
          ["Radio waves interfere with the battery chemistry", false, "The cause is ordinary Ohm's law on the battery's internal resistance."],
          ["The battery voltage increases under load", false, "It is the opposite: the terminal voltage drops under load."],
          ["The radio disconnects the battery", false, "Nothing is disconnected. The supply voltage just sags."],
          ["The radio's high current causes a large drop across the battery's internal resistance, pulling the supply below the minimum operating voltage", true, "Low current, small drop, no problem. High current, large drop: the supply can dip below what the chips need, and the system browns out."],
        ],
      },
      {
        q: "How does a battery's internal resistance change as the battery is used up?",
        options: [
          ["It decreases", false, "If it decreased, old batteries would cope better with peaks. They cope worse."],
          ["It stays constant", false, "The slide states that it increases with use."],
          ["It increases", true, "That is why a nearly empty battery may still show a fine voltage with no load but collapse as soon as the system draws a current peak."],
          ["It becomes negative", false, "A negative resistance would mean the voltage rises with load, which does not happen."],
        ],
      },
    ],

    decoupling: [
      {
        q: "Where are decoupling capacitors placed?",
        options: [
          ["In series with the power line, far from the chips", false, "In series they would block the DC supply entirely."],
          ["In parallel with the supply, physically very close to each IC", true, "In parallel and close by, the capacitor acts as a local energy reservoir right where the current peaks are needed."],
          ["Only next to the battery", false, "The point is to be close to the consumers, since every bit of track adds resistance and inductance."],
          ["Between two signal pins", false, "They sit between the supply pin and ground."],
        ],
      },
      {
        q: "An IC suddenly needs a short, high peak of current. What does its decoupling capacitor do?",
        options: [
          ["It blocks the current so the IC is protected", false, "It does the opposite: it helps deliver the current."],
          ["It raises the battery voltage", false, "It cannot change the battery. It buffers the supply locally."],
          ["It supplies part of the current locally, so the supply voltage at the IC dips less", true, "Capacitors oppose changes of the supply voltage: if it drops they provide energy, if it rises they absorb the excess. They support the battery for short peaks."],
          ["It converts the peak into heat", false, "A capacitor stores and returns energy. It does not burn it like a resistor."],
        ],
      },
    ],

    button: [
      {
        q: "In the slide's button circuit (R from V" + sub("S") + " to the output, button from the output to ground), what is V" + sub("out") + " when the button is NOT pressed?",
        options: [
          ["V" + sub("S"), true, "The circuit is open, so no current flows through R, so there is no voltage drop across it. The output sits at V" + sub("S") + "."],
          ["0 V", false, "That is the pressed state, when the output is connected straight to ground."],
          ["V" + sub("S") + " / 2", false, "There is no second resistor to divide with. No current means no drop at all."],
          ["Undefined", false, "It would be undefined without the resistor. The resistor ties the output to V" + sub("S") + "."],
        ],
      },
      {
        q: "What is the difference between a switch and a button?",
        options: [
          ["A button holds its state, a switch springs back", false, "It is the other way round."],
          ["Switches are for AC, buttons for DC", false, "Both exist for either. The difference is mechanical."],
          ["There is no difference", false, "Their symbols and behaviour differ: one latches, one is momentary."],
          ["A switch holds its open or closed state, a button is closed only while it is pressed", true, "Both mechanically open and close a circuit. The switch stays where you put it; the button springs back open when released."],
        ],
      },
      {
        q: "Why is the resistor needed in the button circuit?",
        options: [
          ["To make the button easier to press", false, "It has no mechanical effect."],
          ["Without it, pressing the button would connect V" + sub("S") + " directly to ground: a short circuit", true, "The resistor limits the current when the button is pressed, and it defines the output as V" + sub("S") + " when the button is released."],
          ["To make the LED brighter", false, "There is no LED in this circuit."],
          ["It is optional decoration", false, "Leave it out and you either get a short (wire instead) or an undefined output (nothing instead)."],
        ],
      },
    ],

    mosfet: [
      {
        q: "In the MOSFET switch circuit, V" + sub("in") + " = V" + sub("S") + ". What happens?",
        options: [
          ["R" + sub("DS") + " becomes very large, no current flows, the load is off", false, "That is the V" + sub("in") + " = 0 case."],
          ["The MOSFET amplifies V" + sub("in") + " to a higher voltage", false, "Here it is used as a switch, not as an amplifier."],
          ["Current flows from V" + sub("in") + " into the load", false, "The load current comes from V" + sub("S") + ". The gate only controls it."],
          ["R" + sub("DS") + " becomes very small, the switch is closed, current flows through R" + sub("L") + " and the load gets power", true, "The voltage at the gate controls the resistance between drain and source. A high gate voltage makes it tiny, so the MOSFET acts as a closed switch."],
        ],
      },
      {
        q: "Why use a MOSFET instead of connecting the load directly to a microcontroller pin?",
        options: [
          ["It lets a weak electrical signal switch a load that needs far more current than the pin can supply", true, "The pin only has to set the gate voltage. The load current flows from the supply through the MOSFET, not through the pin."],
          ["MOSFETs make the load use less energy", false, "The load uses what it uses. The MOSFET only switches it."],
          ["Pins cannot output a voltage", false, "They can. They just cannot deliver much current."],
          ["It converts DC to AC", false, "A single MOSFET switch does no such conversion."],
        ],
      },
    ],

    diode: [
      {
        q: "An LED with a forward voltage of 2 V is powered from 5 V and should carry 10 mA. Which series resistor fits?",
        options: [
          ["200 Ω", false, "That uses only the LED voltage (2 V / 10 mA). The resistor has to drop the rest: 5 V - 2 V."],
          ["300 Ω", true, "The resistor drops V" + sub("source") + " - V" + sub("F") + " = 3 V. R = 3 V / 0.010 A = 300 Ω."],
          ["500 Ω", false, "That ignores the LED's own 2 V drop (5 V / 10 mA)."],
          ["No resistor is needed", false, "Without it, only tiny parasitic resistances limit the current, and the LED is damaged."],
        ],
      },
      {
        q: "What does an ideal diode do?",
        options: [
          ["Conducts equally in both directions", false, "That is a wire or a resistor."],
          ["Stores charge", false, "That is a capacitor."],
          ["Conducts in one direction (zero resistance) and blocks in the other (infinite resistance)", true, "A diode is a one-way conductor. A real one also has a voltage drop when conducting, and therefore consumes some power."],
          ["Amplifies the current", false, "Diodes do not amplify."],
        ],
      },
    ],

    reverse: [
      {
        q: "A diode is placed in series between the battery's positive terminal and VIN. The user inserts the battery backwards. What happens?",
        options: [
          ["The diode blocks the current, so the system simply stays unpowered and undamaged", true, "In the wrong direction the diode does not conduct, so no reverse current can flow into the circuit."],
          ["The IC is destroyed", false, "That is what would happen without the diode."],
          ["The diode turns the battery around electrically and the system works", false, "A single series diode only blocks. (A bridge of four diodes could do that, but that is not this circuit.)"],
          ["The battery is short-circuited", false, "The diode blocks the current. No current flows at all."],
        ],
      },
      {
        q: "What is the price of this protection when the battery is inserted correctly?",
        options: [
          ["None at all", false, "A real diode is not ideal when conducting."],
          ["The battery drains twice as fast", false, "The loss is the diode's drop times the current, typically a few percent to around ten percent, not a doubling."],
          ["The circuit only works with AC", false, "It works with the DC battery as intended."],
          ["The diode's forward voltage drop lowers the supply slightly and wastes some power", true, "When current goes through a diode there is a voltage drop and it consumes power (P = V" + sub("F") + " · I). Low-drop (Schottky) diodes are often chosen for this reason."],
        ],
      },
    ],

    prototyping: [
      {
        q: "What is a breakout board for?",
        options: [
          ["Breaking a PCB into smaller pieces", false, "The name refers to 'breaking out' the pins, not breaking the board."],
          ["Permanently replacing a PCB in a product", false, "It is a prototyping aid."],
          ["Giving easy access to the pins of a small component, so it can be used in a prototype", true, "Modern chips are tiny and impossible to wire by hand. A breakout board mounts the chip and routes its pins to large, conveniently spaced pads or headers."],
          ["Measuring the current of a circuit", false, "That is a job for a multimeter or an SMU."],
        ],
      },
      {
        q: "Why prototype a circuit on a breadboard before designing the PCB?",
        options: [
          ["Breadboards are what final products use", false, "Products use PCBs. Breadboards are for experiments."],
          ["It is cheap and fast to change, so mistakes are found before paying for a manufactured board", true, "A PCB revision costs time and money. Testing the circuit, or the risky parts of it, on a breadboard or veroboard first catches errors early."],
          ["A PCB cannot be designed without one", false, "It is good practice, not a requirement."],
          ["Breadboards are more reliable than PCBs", false, "Their loose contacts make them less reliable. Their strength is flexibility."],
        ],
      },
    ],

    "pcb-flow": [
      {
        q: "In the PCB design flow of the slide, what happens when testing finds errors?",
        options: [
          ["The board is shipped anyway", false, "The flow has an explicit ERRORS path leading back."],
          ["You always start from scratch with a new idea", false, "Only the faulty stage and what follows it need to be redone."],
          ["You go back to whichever earlier stage caused the error (schematic, layout, BOM, manufacturing or assembly) and redo from there", true, "The flow is a loop: schematic design, layout design, BOM, manufacturing, assembly, testing. Errors feed back to any earlier stage."],
          ["Testing is repeated until it passes", false, "Retesting the same faulty board does not fix it."],
        ],
      },
      {
        q: "What is a PCB, physically?",
        options: [
          ["Copper tracks printed on a substrate, with exposed copper pads to mount components", true, "The tracks are the wires, the pads are where components are soldered."],
          ["A plastic box around the electronics", false, "That is the enclosure."],
          ["A bundle of wires soldered by hand", false, "A PCB replaces hand wiring with printed copper tracks."],
          ["A software tool", false, "The tools are called EDA or ECAD software. The PCB is the physical board."],
        ],
      },
    ],

    "pcb-schematic": [
      {
        q: "A chip's datasheet says 'place a 100 nF decoupling capacitor at VS'. How should you treat that?",
        options: [
          ["Ignore it, datasheets are only suggestions", false, "The reference circuit is how the manufacturer guarantees the chip works."],
          ["Calculate a different value to be original", false, "There is no benefit in deviating without a reason."],
          ["Use the largest capacitor you can find", false, "Bigger is not better here. Use the value the reference circuit gives."],
          ["Follow it: reference circuits tell you the passive values, so you often do not have to calculate them yourself", true, "Components provide reference circuits, and open hardware designs can also be used as reference. That is why you often do not have to choose the passives' values."],
        ],
      },
      {
        q: "What is the very first step of the schematic stage?",
        options: [
          ["Routing the copper tracks", false, "Routing belongs to board layout, which comes later."],
          ["Identifying the key components and the power source, and checking they are compatible", true, "Ensure compatibility, identify the voltage level or levels, and keep it simple. Everything else is built around those choices."],
          ["Ordering the PCB from a fab", false, "Nothing can be manufactured before the design exists."],
          ["Writing the firmware", false, "Firmware comes once there is hardware to run it on."],
        ],
      },
    ],

    footprint: [
      {
        q: "When creating a footprint from a datasheet drawing, what is the classic trap?",
        options: [
          ["Datasheets give dimensions in volts", false, "Dimensions are lengths, in mm or inches."],
          ["Footprints are the same for all chips", false, "Each package needs its own footprint with exact dimensions."],
          ["Pads must be made of aluminium", false, "Pads are exposed copper."],
          ["The datasheet's bottom view is the mirror image of the top view", true, "Footprints are drawn as seen from above the board. If you copy the bottom view of the package as it is, every pin ends up mirrored and the board is useless."],
        ],
      },
      {
        q: "Why do you have to be careful when someone says a resistor is size '0603'?",
        options: [
          ["Because both imperial (inch) and metric (mm) size codes are in use, and the same digits can mean different sizes", true, "Passive components come in standard sizes, named in either system. An imperial 0603 is about 1.6 mm by 0.8 mm, while a metric 0603 is a much smaller 0.6 mm by 0.3 mm."],
          ["Because 0603 is the resistance value", false, "It is the package size, not the value."],
          ["Because such parts do not exist", false, "0603 is one of the most common sizes."],
          ["Because only capacitors have size codes", false, "Resistors, capacitors and other passives share the same standard sizes."],
        ],
      },
    ],

    "board-layout": [
      {
        q: "Which via connects an outer layer to an internal layer without going all the way through the board?",
        options: [
          ["Through-hole via", false, "A through-hole via goes from the top to the bottom of the board."],
          ["Blind via", true, "A blind via starts at the top or bottom and ends at an internal layer. You can see it from one side only."],
          ["Buried via", false, "A buried via connects internal layers only and is invisible from outside."],
          ["Ground via", false, "That is not one of the three via types. Any via type can be used for ground."],
        ],
      },
      {
        q: "What is a ground plane good for?",
        options: [
          ["It makes the board lighter", false, "More copper makes it slightly heavier."],
          ["It stores the firmware", false, "Copper does not store data."],
          ["It reduces noise and electromagnetic interference, and helps dissipate heat", true, "A large copper area connected to ground gives every signal a short return path and spreads heat."],
          ["It replaces the battery", false, "It is a reference and return path, not a source."],
        ],
      },
    ],

    "bom-fab": [
      {
        q: "What is the bill of materials (BOM)?",
        options: [
          ["A shopping list of all components, typically a spreadsheet with manufacturer, supplier, price and so on", true, "Each line links a designator on the board (C1, R3, U2) to an exact part that can be ordered."],
          ["The invoice from the PCB factory", false, "It is a document you produce, not a bill you receive."],
          ["The list of tests the board must pass", false, "That would be a test plan."],
          ["The drawing of the copper layers", false, "That is the layout."],
        ],
      },
      {
        q: "What is the difference between PCB manufacturing and assembly?",
        options: [
          ["They are two names for the same step", false, "A bare board with no parts has been manufactured but not assembled."],
          ["Assembly creates the board, manufacturing adds the parts", false, "It is the other way round."],
          ["Manufacturing is done in software, assembly in hardware", false, "Both are physical production steps."],
          ["Manufacturing creates the bare board, assembly places and solders the components on it", true, "Both need machinery (for example pick-and-place machines) and are often outsourced to a fab."],
        ],
      },
      {
        q: "How do precision requirements affect the cost of a PCB?",
        options: [
          ["Smaller boards are always cheaper", false, "Less material, yes, but tighter tolerances quickly outweigh that."],
          ["Precision has no effect on cost", false, "It is one of the main cost drivers."],
          ["Smaller features cost more", true, "Cost increases with precision: finer tracks, smaller vias and tinier components need better machines. The smaller, the costlier."],
          ["Larger features cost more", false, "Coarse features are the easiest and cheapest to make."],
        ],
      },
    ],

    testing: [
      {
        q: "The fab tested your boards and reports no problems, yet the product does not work. How is that possible?",
        options: [
          ["It is not possible", false, "A perfectly manufactured board can still implement a wrong design."],
          ["The error can be in the design itself, which the fab's manufacturing tests do not check", true, "PCBs, like software, may have bugs. The fab checks that the board matches your files, not that your files are right. A hardware revision may be required."],
          ["Fabs never test their boards", false, "They typically do."],
          ["Boards only fail because of software", false, "Hardware has bugs too."],
        ],
      },
      {
        q: "Measuring how much power the board consumes is an example of which type of testing?",
        options: [
          ["Mechanical testing", false, "That is about physical strength, fit and vibration."],
          ["Thermal testing", false, "That is about temperatures, although power and heat are related."],
          ["Performance testing", true, "The slide lists power measurement as the example of performance testing."],
          ["Safety certification", false, "That is about meeting regulatory requirements."],
        ],
      },
    ],

    multimeter: [
      {
        q: "A multimeter in continuity mode beeps when you touch two points. What does that tell you?",
        options: [
          ["The resistance between them is very low: they are connected", true, "The ohmmeter function beeps when the resistance is very low. It is a fast way to check connections, or to find an unwanted short."],
          ["There is a high voltage between them", false, "Continuity mode measures resistance, not voltage."],
          ["The points are insulated from each other", false, "Insulated points have a very high resistance and give no beep."],
          ["The battery of the multimeter is empty", false, "The beep is the measurement result."],
        ],
      },
      {
        q: "What is a multimeter ideal for?",
        options: [
          ["Watching how a fast signal changes over time", false, "That is the oscilloscope's job. A multimeter shows one number."],
          ["Generating test signals", false, "That is a signal or function generator."],
          ["Decoding digital buses", false, "That is a logic analyser."],
          ["Measuring constant values such as a supply voltage, a steady current or a resistance", true, "It combines a voltmeter, an ammeter and an ohmmeter, and is best at values that stay put."],
        ],
      },
    ],

    psu: [
      {
        q: "Why set a current limit on a bench power supply before powering a new board?",
        options: [
          ["To make the board run faster", false, "The limit has nothing to do with speed."],
          ["So that a mistake such as a short circuit cannot draw enough current to damage anything", true, "The output current can be limited to avoid accidental damage. If something is wrong, the supply caps the current instead of feeding the fault."],
          ["Because power supplies cannot deliver more than 1 mA", false, "Bench supplies typically deliver amperes."],
          ["To convert the output to AC", false, "A DC power supply provides DC."],
        ],
      },
      {
        q: "What does a bench DC power supply provide that a battery does not?",
        options: [
          ["Alternating current", false, "It provides DC, as the name says."],
          ["Unlimited voltage and current", false, "It operates within specific ranges."],
          ["A display of the signal over time", false, "That is an oscilloscope."],
          ["A configurable output voltage, often on several independent outputs", true, "You can dial in the voltage (at a specified resolution) and many supplies have multiple individually configurable outputs."],
        ],
      },
    ],

    scope: [
      {
        q: "A signal glitches for a few microseconds once per second. Which oscilloscope feature lets you catch it?",
        options: [
          ["The trigger", true, "A trigger tells the scope when to capture, e.g. when the voltage crosses a level. It turns a rare event into a stable picture."],
          ["The brightness knob", false, "That changes how the trace looks, not when it is captured."],
          ["The ohmmeter function", false, "That belongs to a multimeter."],
          ["The current limit", false, "That belongs to a power supply."],
        ],
      },
      {
        q: "What does an oscilloscope display?",
        options: [
          ["Resistance versus temperature", false, "A scope measures voltage, and its horizontal axis is time."],
          ["Voltage signals over time, usually several of them in parallel", true, "It can also calculate statistics (min, max), frequency and durations, and export the data to a file."],
          ["Signal strength versus frequency", false, "That is a spectrum analyser."],
          ["Only digital '0' and '1'", false, "That is a logic analyser. A scope shows the actual analog voltage."],
        ],
      },
    ],

    instruments: [
      {
        q: "You want to see the traffic on eight digital lines of a bus at once. Which instrument?",
        options: [
          ["Spectrum analyser", false, "That shows magnitude over frequency, not digital signals over time."],
          ["Signal generator", false, "That produces signals. It does not capture them."],
          ["Logic analyser", true, "It captures and displays multiple digital voltage signals."],
          ["Source measurement unit", false, "That supplies power and measures it."],
        ],
      },
      {
        q: "Which instrument is the natural choice to measure how much current your board draws while powering it?",
        options: [
          ["Source measurement unit (SMU)", true, "An SMU supplies power and measures its voltage and current at the same time, which makes it ideal for profiling power consumption."],
          ["Function generator", false, "It generates sine or square waves as test signals."],
          ["Spectrum analyser", false, "It analyses the frequency content of a signal."],
          ["Logic analyser", false, "It records digital signals."],
        ],
      },
      {
        q: "What does a spectrum analyser show?",
        options: [
          ["Voltage over time", false, "That is an oscilloscope."],
          ["The colours of an LED", false, "It deals with electrical signals, not visible light."],
          ["The resistance of a component", false, "That is an ohmmeter."],
          ["The magnitude of a signal over a range of frequencies", true, "Instead of voltage over time, it shows how strong the signal is at each frequency. It is the key instrument for radio work."],
        ],
      },
    ],
  };

  /* =====================================================================
     Helpers
     ===================================================================== */
  // log-slider value snapped to 2 significant digits, so the shown and the used value agree
  const nice = (e) => { const v = Math.pow(10, e); const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
  const log10 = (v) => Math.log10(v);
  function fmtR(v) {
    if (v >= 1e6) return +(v / 1e6).toPrecision(3) + " MΩ";
    if (v >= 1e3) return +(v / 1e3).toPrecision(3) + " kΩ";
    if (v >= 1) return +v.toPrecision(3) + " Ω";
    return +(v * 1000).toPrecision(3) + " mΩ";
  }
  function fmtI(a) {
    const x = Math.abs(a);
    if (x >= 1) return +a.toPrecision(3) + " A";
    if (x >= 1e-3) return +(a * 1e3).toPrecision(3) + " mA";
    if (x >= 1e-6) return +(a * 1e6).toPrecision(3) + " µA";
    if (x === 0) return "0 A";
    return +(a * 1e9).toPrecision(3) + " nA";
  }
  function fmtP(w) {
    const x = Math.abs(w);
    if (x >= 1) return +w.toPrecision(3) + " W";
    if (x >= 1e-3) return +(w * 1e3).toPrecision(3) + " mW";
    if (x === 0) return "0 W";
    if (x >= 1e-6) return +(w * 1e6).toPrecision(3) + " µW";
    if (x >= 1e-9) return +(w * 1e9).toPrecision(3) + " nW";
    return +(w * 1e12).toPrecision(3) + " pW";
  }
  const fmtV = (v) => v.toFixed(2) + " V";
  function rSlider(parent, label, value, minE, maxE) {
    return NES.slider(parent, { label, min: minE, max: maxE, step: 0.02, value: log10(value), map: nice, unmap: log10, fmt: fmtR });
  }
  function meterRow(label, frac, color, txt) {
    return `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${NES.clamp(frac, 0, 1) * 100}%;background:${color}"></div></div><span class="m-val">${txt}</span></div>`;
  }
  function setVerdict(el, tone, html) { el.className = "verdict" + (tone ? " " + tone : ""); el.innerHTML = html; }

  // schematic SVG helpers
  const T = (x, y, txt, cls, extra) => `<text x="${x}" y="${y}" class="${cls || ""}" ${extra || ""}>${txt}</text>`;
  const L = (x1, y1, x2, y2, cls) => `<line class="w ${cls || ""}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  function vsBar(x, y, label) { return L(x - 11, y, x + 11, y) + T(x + 15, y + 5, label || "V<tspan dy='4' font-size='10'>S</tspan>", "ital"); }
  function ground(x, y) { return L(x - 12, y, x + 12, y) + L(x - 7, y + 5, x + 7, y + 5) + L(x - 2.5, y + 10, x + 2.5, y + 10); }
  function contact(x, y) { return `<circle class="contact" cx="${x}" cy="${y}" r="4.5"/>`; }
  function resV(x, y1, y2, cls) {
    const n = 6, lead = 8, seg = (y2 - y1 - 2 * lead) / n;
    let d = `M${x} ${y1} V${y1 + lead}`;
    for (let i = 0; i < n; i++) d += ` L${x + (i % 2 ? -8 : 8)} ${y1 + lead + seg * (i + 0.5)}`;
    d += ` L${x} ${y2 - lead} V${y2}`;
    return `<path class="w ${cls || ""}" d="${d}"/>`;
  }

  /* =====================================================================
     LAB: Ohm's law
     ===================================================================== */
  function labOhm(el) {
    const { controls, view } = NES.lab(el, {
      title: "Ohm's law: I = V / R",
      hint: "Set the voltage and the resistance and watch the current. Notice that doubling V doubles I, and doubling R halves it.",
    });
    const V = NES.slider(controls, { label: "Voltage V", min: 0, max: 12, step: 0.1, value: 3.3, fmt: (v) => v.toFixed(1) + " V" });
    const R = rSlider(controls, "Resistance R", 330, 0, 6);
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "i", label: "Current I = V / R" }, { key: "p", label: "Power P = V · I" }, { key: "chk", label: "Check: I · R" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const I = V.value / R.value, P = V.value * I;
      // log scale from 1 uA to 10 A for the bar
      const frac = I > 0 ? (Math.log10(I) + 6) / 7 : 0;
      meter.innerHTML = meterRow("Current", frac, "var(--tech)", fmtI(I)) +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">bar on a logarithmic scale, 1 µA to 10 A</span><span></span></div>`;
      stats.set("i", fmtI(I));
      stats.set("p", fmtP(P), P > 0.25 ? "warn" : "");
      stats.set("chk", (I * R.value).toFixed(1) + " V");
      if (P > 0.25) setVerdict(verdict, "warn", "<b>" + fmtP(P) + " of heat.</b> A small standard resistor is rated for about 0.25 W, so this one would get hot. Current and power are two sides of the same coin.");
      else setVerdict(verdict, "", "<b>" + fmtI(I) + "</b> flows because " + V.value.toFixed(1) + " V pushes against " + fmtR(R.value) + " of opposition.");
    }
    V.onchange = R.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: power, energy and battery life
     ===================================================================== */
  function labEnergy(el) {
    const { controls, view } = NES.lab(el, {
      title: "Power, energy and battery life",
      hint: "P = V · I tells you how fast energy is used. E = P · t tells you how much is used in total. A battery's capacity in mAh divided by the current gives the running time.",
    });
    const V = NES.slider(controls, { label: "Supply voltage V", min: 1.8, max: 5, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + " V" });
    const I = NES.slider(controls, { label: "Average current I", min: -3, max: 2.5, step: 0.02, value: log10(20), map: nice, unmap: log10, fmt: (v) => fmtI(v / 1000) });
    const t = NES.slider(controls, { label: "Time of operation t", min: 1, max: 3600, step: 1, value: 10, fmt: (v) => (v >= 60 ? (v / 60).toFixed(1) + " min" : v + " s") });
    const cap = NES.slider(controls, { label: "Battery capacity", min: 50, max: 3000, step: 10, value: 220, fmt: (v) => v + " mAh" });
    const stats = NES.stats(view, [{ key: "p", label: "Power P = V · I" }, { key: "e", label: "Energy E = P · t" }, { key: "life", label: "Battery life" }, { key: "etot", label: "Energy in the battery" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function fmtT(hours) {
      if (hours >= 24 * 365) return (hours / 24 / 365).toFixed(1) + " years";
      if (hours >= 48) return (hours / 24).toFixed(1) + " days";
      if (hours >= 1) return hours.toFixed(1) + " h";
      return (hours * 60).toFixed(0) + " min";
    }
    function update() {
      const i = I.value / 1000, P = V.value * i, E = P * t.value;
      const hours = cap.value / I.value;
      stats.set("p", fmtP(P));
      stats.set("e", E >= 1 ? +E.toPrecision(3) + " J" : E >= 1e-3 ? +(E * 1e3).toPrecision(3) + " mJ" : +(E * 1e6).toPrecision(3) + " µJ");
      stats.set("life", fmtT(hours), hours > 24 * 30 ? "good" : hours < 24 ? "warn" : "");
      stats.set("etot", +(cap.value / 1000 * 3600 * V.value).toPrecision(3) + " J");
      setVerdict(verdict, "", "At <b>" + fmtI(i) + "</b> a " + cap.value + " mAh battery lasts about <b>" + fmtT(hours) + "</b>. Halve the average current and the battery life doubles: this is why embedded systems spend most of their time asleep.");
    }
    [V, I, t, cap].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: series and parallel resistors
     ===================================================================== */
  function labParallel(el) {
    const { controls, view } = NES.lab(el, {
      title: "Path of least resistance",
      hint: "1 V is applied. Compare R<sub>1</sub> alone with R<sub>1</sub> combined with R<sub>2</sub>. Start with the slide's values (1 kΩ and 1 MΩ in parallel), then make R<sub>2</sub> smaller.",
    });
    const mode = NES.seg(controls, { label: "Connection", options: [["par", "Parallel"], ["ser", "Series"]], value: "par" });
    const R1 = rSlider(controls, "R<sub>1</sub>", 1000, 0, 6);
    const R2 = rSlider(controls, "R<sub>2</sub>", 1e6, 0, 6);
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "req", label: "Combined resistance" }, { key: "i", label: "Total current at 1 V" }, { key: "d", label: "Change vs R<sub>1</sub> alone" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const a = R1.value, b = R2.value, par = mode.value === "par";
      const req = par ? (a * b) / (a + b) : a + b;
      const i = 1 / req, i0 = 1 / a, d = (i / i0 - 1) * 100;
      if (par) {
        const i1 = 1 / a, i2 = 1 / b;
        meter.innerHTML = meterRow("Through R<sub>1</sub>", i1 / i, "var(--tech)", fmtI(i1)) + meterRow("Through R<sub>2</sub>", i2 / i, "var(--hi)", fmtI(i2)) +
          `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">share of the total current in each branch</span><span></span></div>`;
      } else {
        meter.innerHTML = meterRow("Across R<sub>1</sub>", a / req, "var(--tech)", (a / req).toFixed(3) + " V") + meterRow("Across R<sub>2</sub>", b / req, "var(--hi)", (b / req).toFixed(3) + " V") +
          `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">share of the 1 V across each resistor (same current through both)</span><span></span></div>`;
      }
      stats.set("req", fmtR(req));
      stats.set("i", fmtI(i));
      stats.set("d", (d >= 0 ? "+" : "") + (Math.abs(d) < 10 ? d.toFixed(2) : d.toFixed(0)) + "%");
      if (par && b / a >= 100) setVerdict(verdict, "good", "<b>Practically equivalent.</b> R<sub>2</sub> is " + Math.round(b / a) + " times larger, so it adds only " + d.toFixed(2) + "% more current. Almost everything takes the easy path through R<sub>1</sub>.");
      else if (par) setVerdict(verdict, "", "<b>Parallel:</b> R = (R<sub>1</sub> · R<sub>2</sub>) / (R<sub>1</sub> + R<sub>2</sub>) = " + fmtR(req) + ". The total is always smaller than the smallest of the two.");
      else setVerdict(verdict, "", "<b>Series:</b> R = R<sub>1</sub> + R<sub>2</sub> = " + fmtR(req) + ". There is only one path, so the same current goes through both and the larger resistor dominates.");
    }
    [mode, R1, R2].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: short circuit
     ===================================================================== */
  function labShort(el) {
    const { controls, view } = NES.lab(el, {
      title: "How bad is a short?",
      hint: "An ideal short would give infinite current. In reality the wire and the source's internal resistance limit it. Shrink the total resistance and watch current and heat explode.",
    });
    const V = NES.slider(controls, { label: "Source voltage", min: 1.5, max: 12, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + " V" });
    const R = NES.slider(controls, { label: "Wire + internal resistance", min: -3, max: 2, step: 0.02, value: log10(0.5), map: nice, unmap: log10, fmt: fmtR });
    const stats = NES.stats(view, [{ key: "i", label: "Short-circuit current" }, { key: "p", label: "Heat produced" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const I = V.value / R.value, P = V.value * I;
      stats.set("i", fmtI(I), I > 1 ? "bad" : I > 0.1 ? "warn" : "");
      stats.set("p", fmtP(P), P > 1 ? "bad" : P > 0.25 ? "warn" : "");
      if (I > 1) setVerdict(verdict, "bad", "<b>Dangerous.</b> Amperes through thin tracks and a small battery: parts heat up quickly, and the supply voltage for everything else collapses.");
      else if (I > 0.1) setVerdict(verdict, "warn", "<b>Still too much</b> for most small components and chips, which are built for milliamps.");
      else setVerdict(verdict, "", "With this much resistance in the path it is no longer really a short: the resistance limits the current to a harmless level.");
    }
    V.onchange = R.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: voltage divider
     ===================================================================== */
  function dividerSVG(vin, vout, r1, r2, labels) {
    const x = 210;
    let s = `<svg class="sch" viewBox="0 0 440 250" role="img" aria-label="Voltage divider">`;
    s += `<circle class="dot hi" cx="60" cy="60" r="5"/>` + T(30, 44, labels.vin + " = " + vin.toFixed(2) + " V", "state t-hi");
    s += L(60, 60, x, 60, "hi") + resV(x, 60, 130) + T(x + 18, 100, labels.r1 + " = " + fmtR(r1), "");
    s += resV(x, 130, 200) + T(x + 18, 170, labels.r2 + " = " + fmtR(r2), "") + L(x, 200, x, 222) + ground(x, 222);
    s += L(x, 130, 130, 130, "lo") + `<circle class="dot lo" cx="${x}" cy="130" r="4.5"/><circle class="dot lo" cx="126" cy="130" r="5"/>`;
    s += T(22, 156, labels.vout + " = " + vout.toFixed(2) + " V", "state t-lo");
    return s + "</svg>";
  }

  function labDivider(el) {
    const { controls, view } = NES.lab(el, {
      title: "Voltage divider",
      hint: "V<sub>out</sub> = V<sub>in</sub> · R<sub>2</sub> / (R<sub>1</sub> + R<sub>2</sub>). Only the ratio of the two resistors sets the output; their absolute size sets how much current the divider itself wastes.",
    });
    const vin = NES.slider(controls, { label: "V<sub>in</sub>", min: 0, max: 12, step: 0.1, value: 5, fmt: (v) => v.toFixed(1) + " V" });
    const R1 = rSlider(controls, "R<sub>1</sub> (top)", 1000, 1, 6);
    const R2 = rSlider(controls, "R<sub>2</sub> (bottom)", 1000, 1, 6);
    const stage = h("div", { class: "stage" });
    const meter = h("div", { class: "meter" });
    view.append(stage, meter);
    const stats = NES.stats(view, [{ key: "vo", label: "V<sub>out</sub>" }, { key: "ratio", label: "Fraction that gets through" }, { key: "i", label: "Current through the divider" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const k = R2.value / (R1.value + R2.value), vo = vin.value * k;
      stage.innerHTML = dividerSVG(vin.value, vo, R1.value, R2.value, { vin: "Vin", vout: "Vout", r1: "R1", r2: "R2" });
      meter.innerHTML = meterRow("Across R<sub>1</sub>", 1 - k, "var(--hi)", fmtV(vin.value - vo)) + meterRow("Across R<sub>2</sub>", k, "var(--lo)", fmtV(vo));
      stats.set("vo", fmtV(vo));
      stats.set("ratio", (k * 100).toFixed(1) + "%");
      stats.set("i", fmtI(vin.value / (R1.value + R2.value)));
      const q = R1.value / R2.value;
      if (q <= 0.1) setVerdict(verdict, "", "<b>Small attenuation.</b> R<sub>1</sub> is much smaller than R<sub>2</sub>, so most of the input goes through.");
      else if (q >= 10) setVerdict(verdict, "", "<b>Large attenuation.</b> R<sub>1</sub> is much larger than R<sub>2</sub>, so most of the input does not go through.");
      else setVerdict(verdict, "", "The input is split in the ratio R<sub>1</sub> : R<sub>2</sub>. Equal resistors give exactly half.");
    }
    [vin, R1, R2].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: level shifter
     ===================================================================== */
  function labLevel(el) {
    const { controls, view } = NES.lab(el, {
      title: "Design a 5 V to 3.3 V level shifter",
      hint: "The 5 V device outputs '1' as 5 V. The 3.3 V device must not see more than 3.3 V (plus a little tolerance), but still needs a clear '1' (we assume at least 0.7 · 3.3 V = 2.31 V). Find resistor pairs that work.",
    });
    const vals = [[470, "470 Ω"], [1000, "1 kΩ"], [2000, "2 kΩ"], [3300, "3.3 kΩ"], [10000, "10 kΩ"]];
    const R1 = NES.seg(controls, { label: "Series resistor R<sub>1</sub>", options: vals, value: 1000 });
    const R2 = NES.seg(controls, { label: "Resistor to ground R<sub>2</sub>", options: vals, value: 1000 });
    const stage = h("div", { class: "stage" });
    view.append(stage);
    const stats = NES.stats(view, [{ key: "v1", label: "Input sees for a 5 V '1'" }, { key: "v0", label: "Input sees for a '0'" }, { key: "i", label: "Current drawn from the 5 V output" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const vo = (5 * R2.value) / (R1.value + R2.value);
      stage.innerHTML = dividerSVG(5, vo, R1.value, R2.value, { vin: "5 V device OUT", vout: "3.3 V device IN", r1: "R1", r2: "R2" });
      stats.set("v1", fmtV(vo), vo > 3.6 ? "bad" : vo < 2.31 ? "warn" : "good");
      stats.set("v0", "0.00 V");
      stats.set("i", fmtI(5 / (R1.value + R2.value)));
      if (vo > 3.6) setVerdict(verdict, "bad", "<b>Too high.</b> " + fmtV(vo) + " exceeds what a 3.3 V input tolerates and can damage it. Make R<sub>2</sub> smaller relative to R<sub>1</sub>.");
      else if (vo < 2.31) setVerdict(verdict, "warn", "<b>Safe, but too low.</b> " + fmtV(vo) + " may not be recognised as a '1'. Make R<sub>2</sub> larger relative to R<sub>1</sub>.");
      else setVerdict(verdict, "good", "<b>Works.</b> " + fmtV(vo) + " is a clear '1' for the 3.3 V device and within its limits. The slide's choice is 1 kΩ and 2 kΩ: 5 V · 2/3 = 3.33 V.");
    }
    R1.onchange = R2.onchange = update;
    R2.set(2000, true);
    update();
  }

  /* =====================================================================
     LAB: potentiometer
     ===================================================================== */
  function labPot(el) {
    const { controls, view } = NES.lab(el, {
      title: "Turn the knob",
      hint: "A 10 kΩ potentiometer between 3.3 V and ground. The wiper splits it into an upper and a lower part. A 10-bit ADC (V<sub>ref</sub> = 3.3 V) turns the wiper voltage into a number.",
    });
    const pos = NES.slider(controls, { label: "Wiper position", min: 0, max: 100, step: 1, value: 30, fmt: (v) => v + "%" });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "r1", label: "Upper part R<sub>1</sub>" }, { key: "r2", label: "Lower part R<sub>2</sub>" }, { key: "vo", label: "V<sub>out</sub>" }, { key: "adc", label: "ADC reading (10 bit)" }]);
    function update() {
      const k = pos.value / 100, r2 = 10000 * k, r1 = 10000 - r2, vo = 3.3 * k;
      meter.innerHTML = meterRow("Wiper", k, "var(--tech)", (k * 100).toFixed(0) + "%") + meterRow("V<sub>out</sub>", k, "var(--lo)", fmtV(vo));
      stats.set("r1", fmtR(r1) === "0 mΩ" ? "0 Ω" : fmtR(r1));
      stats.set("r2", fmtR(r2) === "0 mΩ" ? "0 Ω" : fmtR(r2));
      stats.set("vo", fmtV(vo));
      stats.set("adc", String(Math.min(1023, Math.round(k * 1024))));
    }
    pos.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: thermistor temperature sensor
     ===================================================================== */
  function labThermistor(el) {
    const { controls, view } = NES.lab(el, {
      title: "Thermistor as a temperature sensor",
      hint: "An NTC thermistor (10 kΩ at 25 °C) is R<sub>2</sub> of a divider with R<sub>1</sub> = 10 kΩ and V<sub>S</sub> = 3.3 V. The B value describes how steeply the resistance falls with temperature (the three curves of the datasheet plot).",
    });
    const T_ = NES.slider(controls, { label: "Temperature", min: -20, max: 120, step: 1, value: 25, fmt: (v) => v + " °C" });
    const B = NES.seg(controls, { label: "B constant", options: [[3450, "3450"], [3900, "3900"], [4100, "4100"]], value: 3900 });
    const cv = h("canvas", { style: "height:230px", "aria-label": "Output voltage versus temperature" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i><span>V<sub>out</sub> versus temperature</span></span><span><i style="background:var(--accent);height:8px;width:8px;border-radius:50%"></i>current temperature</span>` }));
    const stats = NES.stats(view, [{ key: "r", label: "Thermistor R<sub>2</sub>" }, { key: "rr", label: "R / R<sub>25</sub>" }, { key: "vo", label: "V<sub>out</sub>" }]);
    const rOf = (t, b) => 10000 * Math.exp(b * (1 / (t + 273.15) - 1 / 298.15));
    const vOf = (t, b) => { const r = rOf(t, b); return (3.3 * r) / (10000 + r); };
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 12, padT = 10, padB = 26;
      const X = (t) => padL + ((t + 20) / 140) * (w - padL - padR);
      const Y = (v) => padT + (1 - v / 3.3) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font"); ctx.lineWidth = 1;
      ctx.strokeStyle = NES.css("--grid"); ctx.fillStyle = NES.css("--muted");
      for (let t = -20; t <= 120; t += 20) { ctx.beginPath(); ctx.moveTo(X(t), padT); ctx.lineTo(X(t), hh - padB); ctx.stroke(); ctx.fillText(String(t), X(t) - 8, hh - padB + 14); }
      [0, 1.65, 3.3].forEach((v) => { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); ctx.fillText(v + " V", 2, Y(v) + 4); });
      ctx.fillText("°C", w - padR - 14, hh - 2);
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      for (let t = -20; t <= 120; t += 1) { const y = Y(vOf(t, B.value)); t === -20 ? ctx.moveTo(X(t), y) : ctx.lineTo(X(t), y); }
      ctx.stroke();
      const v = vOf(T_.value, B.value);
      ctx.strokeStyle = NES.css("--accent"); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(X(T_.value), hh - padB); ctx.lineTo(X(T_.value), Y(v)); ctx.lineTo(padL, Y(v)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = NES.css("--accent"); ctx.beginPath(); ctx.arc(X(T_.value), Y(v), 5, 0, Math.PI * 2); ctx.fill();
    });
    function update() {
      const r = rOf(T_.value, B.value);
      stats.set("r", fmtR(r));
      stats.set("rr", (r / 10000).toPrecision(3));
      stats.set("vo", fmtV(vOf(T_.value, B.value)));
      draw();
    }
    T_.onchange = B.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: RC low-pass filter
     ===================================================================== */
  function labRC(el) {
    const { controls, view } = NES.lab(el, {
      title: "RC low-pass filter",
      hint: "A sine wave goes in. The capacitor is a frequency-dependent 'resistor' to ground, so the divider ratio depends on the frequency. Sweep the frequency across the cutoff f<sub>c</sub> = 1 / (2πRC).",
    });
    const R = rSlider(controls, "R", 1000, 1, 6);
    const C = NES.slider(controls, { label: "C", min: -9, max: -4, step: 0.02, value: -6, map: nice, unmap: log10, fmt: (v) => (v >= 1e-6 ? +(v * 1e6).toPrecision(3) + " µF" : +(v * 1e9).toPrecision(3) + " nF") });
    const f = NES.slider(controls, { label: "Signal frequency", min: 0, max: 6, step: 0.02, value: 2, map: nice, unmap: log10, fmt: (v) => (v >= 1e6 ? +(v / 1e6).toPrecision(3) + " MHz" : v >= 1e3 ? +(v / 1e3).toPrecision(3) + " kHz" : +v.toPrecision(3) + " Hz") });
    const cv = h("canvas", { style: "height:200px", "aria-label": "Input and output waveform" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--muted)"></i><span>V<sub>in</sub></span></span><span><i style="background:var(--tech)"></i><span>V<sub>out</sub></span></span>` }));
    const stats = NES.stats(view, [{ key: "fc", label: "Cutoff f<sub>c</sub>" }, { key: "xc", label: "Capacitor 'resistance' X<sub>C</sub>" }, { key: "g", label: "V<sub>out</sub> / V<sub>in</sub>" }, { key: "tau", label: "Time constant RC" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const calc = () => { const fc = 1 / (2 * Math.PI * R.value * C.value); const ratio = f.value / fc; return { fc, g: 1 / Math.sqrt(1 + ratio * ratio), ph: -Math.atan(ratio), xc: 1 / (2 * Math.PI * f.value * C.value) }; };
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const { g, ph } = calc();
      const padL = 10, padR = 10, padT = 10, padB = 10, periods = 3;
      const X = (p) => padL + (p / periods) * (w - padL - padR);
      const Y = (v) => padT + (1 - (v + 1) / 2) * (hh - padT - padB);
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(padL, Y(0)); ctx.lineTo(w - padR, Y(0)); ctx.stroke();
      [[1, 0, "--muted", 1.4], [g, ph, "--tech", 2.2]].forEach(([a, p0, col, lw]) => {
        ctx.strokeStyle = NES.css(col); ctx.lineWidth = lw; ctx.beginPath();
        for (let px = 0; px <= w - padL - padR; px++) { const p = (px / (w - padL - padR)) * periods; const y = Y(a * Math.sin(2 * Math.PI * p + p0)); px ? ctx.lineTo(X(p), y) : ctx.moveTo(X(p), y); }
        ctx.stroke();
      });
    });
    function update() {
      const { fc, g, xc } = calc();
      const fmtF = (v) => (v >= 1e6 ? +(v / 1e6).toPrecision(3) + " MHz" : v >= 1e3 ? +(v / 1e3).toPrecision(3) + " kHz" : +v.toPrecision(3) + " Hz");
      const tau = R.value * C.value;
      stats.set("fc", fmtF(fc));
      stats.set("xc", fmtR(xc));
      stats.set("g", (g * 100).toFixed(g < 0.1 ? 1 : 0) + "%", g > 0.9 ? "good" : g < 0.3 ? "bad" : "warn");
      stats.set("tau", tau >= 1 ? +tau.toPrecision(3) + " s" : tau >= 1e-3 ? +(tau * 1e3).toPrecision(3) + " ms" : +(tau * 1e6).toPrecision(3) + " µs");
      if (f.value < fc / 3) setVerdict(verdict, "good", "<b>Passes.</b> Well below the cutoff the capacitor looks like a large resistance (" + fmtR(xc) + " versus R = " + fmtR(R.value) + "), so the signal is attenuated only a bit.");
      else if (f.value > fc * 3) setVerdict(verdict, "bad", "<b>Attenuated a lot.</b> Well above the cutoff the capacitor looks like a small resistance to ground (" + fmtR(xc) + "), so little of the signal is left.");
      else setVerdict(verdict, "warn", "<b>Around the cutoff.</b> At f<sub>c</sub> the capacitor's 'resistance' equals R and the output is about 71% of the input.");
      draw();
    }
    [R, C, f].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: battery internal resistance
     ===================================================================== */
  function labBattery(el) {
    const { controls, view } = NES.lab(el, {
      title: "Battery under load",
      hint: "A 3.0 V battery with internal resistance R<sub>I</sub> powers a system that needs at least 1.8 V. Increase the load current (e.g. the radio switches on) or age the battery (R<sub>I</sub> grows) and watch the supply voltage.",
    });
    const Ri = NES.slider(controls, { label: "Internal resistance R<sub>I</sub>", min: -1, max: 1.7, step: 0.02, value: log10(2), map: nice, unmap: log10, fmt: fmtR });
    const I = NES.slider(controls, { label: "Load current", min: 0, max: 2.5, step: 0.02, value: log10(10), map: nice, unmap: log10, fmt: (v) => fmtI(v / 1000) });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "drop", label: "Drop across R<sub>I</sub>" }, { key: "vs", label: "Supply voltage V<sub>S</sub>" }, { key: "loss", label: "Power lost in the battery" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const i = I.value / 1000, drop = i * Ri.value, vs = Math.max(0, 3 - drop);
      const ok = vs >= 1.8;
      meter.innerHTML = `<div class="meter-row"><span class="m-label">V<sub>S</sub></span><div class="meter-track"><div class="meter-fill" style="width:${(vs / 3) * 100}%;background:var(--${ok ? "ok" : "bad"})"></div><span class="meter-mark" style="left:${(1.8 / 3) * 100}%" title="1.8 V minimum"></span></div><span class="m-val">${fmtV(vs)}</span></div><div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">mark: 1.8 V minimum operating voltage. Full bar: 3.0 V battery voltage</span><span></span></div>`;
      stats.set("drop", fmtV(drop), drop > 0.5 ? "warn" : "");
      stats.set("vs", fmtV(vs), ok ? "good" : "bad");
      stats.set("loss", fmtP(i * i * Ri.value));
      if (!ok) setVerdict(verdict, "bad", "<b>Brown-out.</b> The drop of " + fmtV(drop) + " pulls the supply below 1.8 V. The system resets or misbehaves even though the battery itself still has 3.0 V.");
      else if (drop > 0.3) setVerdict(verdict, "warn", "<b>Getting close.</b> " + fmtV(drop) + " is lost inside the battery. A short current peak or a slightly older battery could tip it over.");
      else setVerdict(verdict, "good", "<b>No problem.</b> Low current, small voltage drop: V<sub>S</sub> = V - I · R<sub>I</sub> stays close to the battery voltage.");
    }
    Ri.onchange = I.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: decoupling capacitor during a current pulse
     ===================================================================== */
  function labDecoupling(el) {
    const { controls, view } = NES.lab(el, {
      title: "Decoupling capacitor versus a current peak",
      hint: "A 3.0 V battery (R<sub>I</sub> = 10 Ω) feeds an IC that idles at 2 mA and pulls a peak for 2 ms. Without a capacitor the supply follows the peak instantly. Add capacitance and the dip gets shallower.",
    });
    const C = NES.seg(controls, { label: "Decoupling capacitor", options: [[0, "None"], [10e-6, "10 µF"], [100e-6, "100 µF"], [1000e-6, "1 mF"]], value: 0 });
    const Ip = NES.slider(controls, { label: "Peak current", min: 10, max: 200, step: 5, value: 150, fmt: (v) => v + " mA" });
    const cv = h("canvas", { style: "height:230px", "aria-label": "Supply voltage over time" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i><span>supply voltage V<sub>S</sub> at the IC</span></span><span><i style="background:var(--hi);opacity:.5;height:8px"></i>current peak</span><span><i class="dash" style="color:var(--bad)"></i>1.8 V minimum</span>` }));
    const stats = NES.stats(view, [{ key: "min", label: "Lowest V<sub>S</sub>" }, { key: "nocap", label: "Without a capacitor" }, { key: "tau", label: "Time constant R<sub>I</sub> · C" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const V0 = 3, RI = 10, IDLE = 0.002, T0 = 0.002, T1 = 0.004, TEND = 0.012;
    function sim() {
      const N = 2400, dt = TEND / N, out = [];
      let vs = V0 - IDLE * RI, min = vs;
      for (let k = 0; k <= N; k++) {
        const t = k * dt, il = t >= T0 && t < T1 ? Ip.value / 1000 : IDLE;
        if (C.value === 0) vs = V0 - il * RI;
        else vs += (dt / C.value) * ((V0 - vs) / RI - il);
        vs = Math.max(0, vs); min = Math.min(min, vs); out.push(vs);
      }
      return { out, min };
    }
    let res = sim();
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 10, padT = 10, padB = 24;
      const X = (t) => padL + (t / TEND) * (w - padL - padR);
      const Y = (v) => padT + (1 - v / 3.2) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font");
      ctx.fillStyle = NES.css("--hi"); ctx.globalAlpha = 0.14; ctx.fillRect(X(T0), padT, X(T1) - X(T0), hh - padT - padB); ctx.globalAlpha = 1;
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1; ctx.fillStyle = NES.css("--muted");
      [0, 1, 2, 3].forEach((v) => { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); ctx.fillText(v + " V", 4, Y(v) + 4); });
      for (let ms = 0; ms <= 12; ms += 2) ctx.fillText(ms + (ms === 12 ? " ms" : ""), X(ms / 1000) - (ms === 12 ? 28 : 3), hh - 6);
      ctx.strokeStyle = NES.css("--bad"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(padL, Y(1.8)); ctx.lineTo(w - padR, Y(1.8)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2.2; ctx.beginPath();
      res.out.forEach((v, k) => { const x = X((k / (res.out.length - 1)) * TEND); k ? ctx.lineTo(x, Y(v)) : ctx.moveTo(x, Y(v)); });
      ctx.stroke();
    });
    function update() {
      res = sim();
      const bare = Math.max(0, V0 - (Ip.value / 1000) * RI);
      stats.set("min", fmtV(res.min), res.min >= 1.8 ? "good" : "bad");
      stats.set("nocap", fmtV(bare), bare >= 1.8 ? "" : "bad");
      const tau = RI * C.value;
      stats.set("tau", C.value ? +(tau * 1000).toPrecision(3) + " ms" : "-");
      if (res.min >= 1.8 && bare < 1.8) setVerdict(verdict, "good", "<b>Saved by the capacitor.</b> It delivers most of the peak locally, so the supply only sags to " + fmtV(res.min) + " instead of " + fmtV(bare) + ". Afterwards the battery slowly recharges it.");
      else if (res.min < 1.8) setVerdict(verdict, "bad", "<b>Brown-out.</b> The supply dips to " + fmtV(res.min) + ", below the 1.8 V minimum. " + (C.value ? "This capacitor is too small to carry a 2 ms peak of this size." : "With no local reservoir, the full peak current flows through the battery's internal resistance."));
      else setVerdict(verdict, "good", "<b>Fine.</b> This peak is small enough that the supply stays above 1.8 V.");
      draw();
    }
    C.onchange = Ip.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: reading a button
     ===================================================================== */
  function buttonSVG(pressed) {
    const x = 200, out = pressed ? "lo" : "hi";
    let s = `<svg class="sch" viewBox="0 0 440 270" role="img" aria-label="Button ${pressed ? "pressed" : "released"}">`;
    s += vsBar(x, 20) + L(x, 20, x, 40, "hi") + resV(x, 40, 110, pressed ? "" : "hi") + T(x - 18, 80, "R = 10 kΩ", "", 'text-anchor="end"');
    s += L(x, 110, x, 140, out) + L(x, 125, 330, 125, out) + `<circle class="dot ${out}" cx="${x}" cy="125" r="4.5"/><circle class="dot ${out}" cx="334" cy="125" r="5.5"/>`;
    s += T(300, 108, "V<tspan dy='4' font-size='10'>out</tspan>", "ital") + T(346, 148, pressed ? "= 0 V" : "= 3.3 V", "state t-" + out, 'text-anchor="end"');
    // button: two contacts with a bar
    s += contact(x, 145) + contact(x, 195);
    s += pressed ? L(x, 145, x, 195, "lo") + L(x + 14, 150, x + 14, 190) + L(x + 14, 170, x + 2, 170) : L(x + 22, 150, x + 22, 190) + L(x + 22, 170, x + 36, 170);
    s += L(x, 199.5, x, 232, pressed ? "lo" : "") + ground(x, 232);
    s += T(x + 50, 176, pressed ? "pressed: closed" : "released: open", "small");
    if (pressed) s += T(x - 110, 176, "I = 0.33 mA", "state t-ok");
    return s + "</svg>";
  }
  function labButton(el) {
    const { controls, view } = NES.lab(el, {
      title: "Turn a button press into a voltage",
      hint: "V<sub>S</sub> = 3.3 V. Press and release the button and watch the output and the current through the resistor.",
    });
    const b = NES.seg(controls, { label: "Button", options: [[0, "Released"], [1, "Pressed"]], value: 0 });
    const stage = h("div", { class: "stage" });
    view.append(stage);
    const stats = NES.stats(view, [{ key: "vo", label: "V<sub>out</sub>" }, { key: "i", label: "Current through R" }, { key: "bit", label: "MCU reads" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const p = b.value === 1;
      stage.innerHTML = buttonSVG(p);
      stats.set("vo", p ? "0.00 V" : "3.30 V", p ? "lo" : "hi");
      stats.set("i", p ? "0.33 mA" : "0 mA");
      stats.set("bit", p ? "0" : "1", p ? "lo" : "hi");
      setVerdict(verdict, "", p
        ? "<b>Closed circuit.</b> There is a path to ground, current flows through R, and the output is connected directly to ground: 0 V. The whole 3.3 V drops across R."
        : "<b>Open circuit.</b> No path to ground, so no current through R and no voltage drop across it. The output equals V<sub>S</sub>.");
    }
    b.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: MOSFET as a switch
     ===================================================================== */
  function labMosfet(el) {
    const { controls, view } = NES.lab(el, {
      title: "MOSFET as an electrically controlled switch",
      hint: "V<sub>S</sub> = 5 V and the load R<sub>L</sub> = 10 Ω. The gate voltage sets the drain-source resistance R<sub>DS</sub>, which forms a divider with the load. (Typical illustrative values: 0.05 Ω when on, 100 MΩ when off.)",
    });
    const vin = NES.seg(controls, { label: "Gate input V<sub>in</sub>", options: [[0, "0 V"], [1, "V<sub>S</sub>"]], value: 0 });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "rds", label: "R<sub>DS</sub>" }, { key: "i", label: "Load current" }, { key: "pl", label: "Power in the load" }, { key: "pm", label: "Power lost in the MOSFET" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const on = vin.value === 1, rds = on ? 0.05 : 1e8, RL = 10, I = 5 / (RL + rds);
      const vl = I * RL, vm = I * rds;
      meter.innerHTML = meterRow("Across R<sub>L</sub>", vl / 5, "var(--ok)", fmtV(vl)) + meterRow("Across R<sub>DS</sub>", vm / 5, "var(--hi)", fmtV(vm));
      stats.set("rds", fmtR(rds));
      stats.set("i", fmtI(I), on ? "good" : "");
      stats.set("pl", fmtP(I * I * RL), on ? "good" : "");
      stats.set("pm", fmtP(I * I * rds));
      setVerdict(verdict, on ? "good" : "", on
        ? "<b>Switch closed.</b> R<sub>DS</sub> is very, very small, so almost all of V<sub>S</sub> appears across the load and the load gets power. The gate itself draws practically no current."
        : "<b>Switch open.</b> R<sub>DS</sub> is very, very big, so essentially no current flows through R<sub>L</sub> and the load gets no power.");
    }
    vin.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: LED series resistor
     ===================================================================== */
  function labLed(el) {
    const { controls, view } = NES.lab(el, {
      title: "Choose the LED's series resistor",
      hint: "The LED drops its forward voltage V<sub>F</sub>; the resistor takes the rest and sets the current: I = (V<sub>source</sub> - V<sub>F</sub>) / R. We assume a small indicator LED rated for 20 mA.",
    });
    const vs = NES.slider(controls, { label: "V<sub>source</sub>", min: 1.5, max: 12, step: 0.1, value: 5, fmt: (v) => v.toFixed(1) + " V" });
    const vf = NES.seg(controls, { label: "LED colour (V<sub>F</sub>)", options: [[2.0, "Red 2.0 V"], [3.0, "Blue 3.0 V"]], value: 2.0 });
    const R = rSlider(controls, "Series resistor R", 300, 0, 4);
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "i", label: "LED current" }, { key: "pr", label: "Power in the resistor" }, { key: "pl", label: "Power in the LED" }, { key: "r10", label: "R for 10 mA" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const head = vs.value - vf.value, I = head > 0 ? head / R.value : 0, mA = I * 1000;
      const tone = mA > 20 ? "bad" : mA >= 1 ? "good" : "warn";
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Current</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, (mA / 60) * 100)}%;background:var(--${tone === "bad" ? "bad" : "ok"})"></div><span class="meter-mark" style="left:${(20 / 60) * 100}%" title="20 mA"></span></div><span class="m-val">${fmtI(I)}</span></div><div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">mark: 20 mA, the assumed maximum for this LED</span><span></span></div>`;
      stats.set("i", fmtI(I), tone);
      stats.set("pr", fmtP(I * I * R.value));
      stats.set("pl", fmtP(I * vf.value));
      stats.set("r10", head > 0 ? fmtR(head / 0.01) : "-");
      if (head <= 0) setVerdict(verdict, "warn", "<b>Dark.</b> The source voltage is below the LED's forward voltage, so (almost) no current flows.");
      else if (mA > 20) setVerdict(verdict, "bad", "<b>Too much current.</b> " + fmtI(I) + " exceeds the LED's rating. Without enough series resistance the LED is damaged.");
      else if (mA < 1) setVerdict(verdict, "warn", "<b>Very dim.</b> Less than 1 mA. Safe, but barely visible on most LEDs.");
      else setVerdict(verdict, "good", "<b>Good.</b> The resistor drops " + fmtV(head) + " and limits the current to " + fmtI(I) + ".");
    }
    [vs, vf, R].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: reverse voltage protection
     ===================================================================== */
  function labReverse(el) {
    const { controls, view } = NES.lab(el, {
      title: "Insert the battery the wrong way round",
      hint: "A 3.0 V battery, an IC that draws 20 mA, and an optional series diode. We assume a Schottky diode with a forward drop of about 0.3 V.",
    });
    const bat = NES.seg(controls, { label: "Battery", options: [[1, "Correct"], [0, "Reversed"]], value: 1 });
    const dio = NES.seg(controls, { label: "Protection diode", options: [[1, "Fitted"], [0, "None"]], value: 1 });
    const stats = NES.stats(view, [{ key: "vin", label: "Voltage at VIN" }, { key: "i", label: "Current" }, { key: "loss", label: "Power lost in the diode" }, { key: "st", label: "System" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const ok = bat.value === 1, d = dio.value === 1;
      if (ok && d) { stats.set("vin", "2.70 V", "good"); stats.set("i", "20 mA"); stats.set("loss", "6 mW", "warn"); stats.set("st", "Running", "good"); setVerdict(verdict, "good", "<b>Powered properly.</b> Current flows through the diode in its forward direction. The price is the forward drop: 0.3 V less at VIN and 0.3 V · 20 mA = 6 mW wasted."); }
      else if (ok && !d) { stats.set("vin", "3.00 V", "good"); stats.set("i", "20 mA"); stats.set("loss", "0 mW"); stats.set("st", "Running", "good"); setVerdict(verdict, "warn", "<b>Works, but unprotected.</b> No diode, no loss. It is fine until somebody inserts the battery backwards."); }
      else if (!ok && d) { stats.set("vin", "0 V"); stats.set("i", "0 mA"); stats.set("loss", "0 mW"); stats.set("st", "Off, undamaged", "good"); setVerdict(verdict, "good", "<b>Blocked.</b> The diode does not conduct in this direction, so no reverse current reaches the IC. The system is simply off until the battery is turned around."); }
      else { stats.set("vin", "-3.00 V", "bad"); stats.set("i", "reverse current", "bad"); stats.set("loss", "-"); stats.set("st", "Damaged", "bad"); setVerdict(verdict, "bad", "<b>Reverse voltage on the IC.</b> Current flows in the wrong direction through the chip, which can destroy it."); }
    }
    bat.onchange = dio.onchange = update;
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    ohm: labOhm,
    energy: labEnergy,
    parallel: labParallel,
    short: labShort,
    divider: labDivider,
    level: labLevel,
    pot: labPot,
    thermistor: labThermistor,
    rc: labRC,
    battery: labBattery,
    decoupling: labDecoupling,
    button: labButton,
    mosfet: labMosfet,
    led: labLed,
    reverse: labReverse,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("electronics-basics", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
