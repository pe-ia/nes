/* Week 1, Introduction to Networked Embedded Systems: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "what-is": [
      {
        q: "Which description best defines an embedded system?",
        options: [
          ["Any computer that is physically small", false, "Size is not the criterion. A smartphone is small but is a general-purpose computer; an engine controller can be fairly large and is still embedded."],
          ["A computer in a device whose principal mission is not computation", true, "That is the lecture's definition. The device exists to wash clothes, keep time or pump fuel; the computer inside is only a means to that end."],
          ["A computer without an operating system", false, "Many embedded systems run an operating system (an RTOS, or even Linux). What matters is the dedicated function, not the software stack."],
          ["A computer that is connected to the internet", false, "Connectivity is a trend, not part of the definition. Embedded systems existed and worked in isolation long before they were networked."],
        ],
      },
      {
        q: "Which of these is a general-purpose computer rather than an embedded system?",
        options: [
          ["A pacemaker", false, "A pacemaker has one dedicated job (pacing the heart) inside a larger product. It is a textbook embedded system."],
          ["A traffic light controller", false, "It has a single dedicated function and controls a physical process, so it is embedded."],
          ["A digital watch", false, "A digital watch is on the lecture's list of embedded system examples: a computer whose mission is keeping time, not computing in general."],
          ["A laptop", true, "Laptops, desktops and servers are the lecture's examples of general-purpose computers: their mission is computation itself, and the user decides what they run."],
        ],
      },
    ],

    washing: [
      {
        q: "A washing machine checks that the door is closed before the programme can start. Which group of functions is that?",
        options: [
          ["Input/Output", false, "Input/Output is about the user: selecting a programme and seeing status. The door check protects against a dangerous situation."],
          ["Control", false, "Control functions regulate the process itself (valves, heater, motor speed). The door check does not regulate anything; it blocks an unsafe start."],
          ["Safety", true, "Safety functions detect errors and unsafe conditions and raise warnings or prevent operation: door closed, load weight, enough water before heating."],
          ["Time keeping", false, "Time keeping covers the duration of washing stages and delayed start. The door check is not about time."],
        ],
      },
      {
        q: "Which of these is a <em>control</em> function (sensing and actuation) of the washing machine?",
        options: [
          ["Showing the remaining time on the display", false, "That is output to the user: Input/Output."],
          ["Adjusting the power to the motor to reach the right RPM", true, "The machine measures and steers a physical quantity (rotation speed). Valves, the heater and the motor are all controlled this way."],
          ["Starting the programme two hours later", false, "Delayed start is a time keeping function."],
          ["Reading which programme the user selected", false, "Capturing user preferences through buttons and switches is Input/Output."],
        ],
      },
    ],

    physical: [
      {
        q: "What is the difference between a sensor and an actuator?",
        options: [
          ["A sensor measures the physical world; an actuator changes it", true, "Sensors let the system perceive (temperature, light, motion). Actuators let it act (motors, valves, heaters, lights)."],
          ["A sensor is analogue; an actuator is digital", false, "Both can be analogue or digital. The distinction is the direction: world to computer, or computer to world."],
          ["A sensor needs power; an actuator does not", false, "Actuators usually need far more power than sensors, since they have to move or heat something."],
          ["A sensor sends data over a network; an actuator stores it", false, "Neither networking nor storage is part of the definition."],
        ],
      },
      {
        q: "Which list contains only actuators or other output devices?",
        options: [
          ["Camera, microphone, thermometer", false, "All three measure the physical world, so they are sensors."],
          ["Speaker, valve, electric motor", true, "All three turn an electrical signal into a physical effect: sound, flow control, motion."],
          ["Radar, heater, light sensor", false, "Only the heater is an actuator. Radar and the light sensor measure."],
          ["Screen, lidar, vibration motor", false, "A lidar measures distance, so it is a sensor. Screen and vibration motor are outputs."],
        ],
      },
    ],

    trends: [
      {
        q: "What are the two big trends in embedded systems named in the lecture?",
        options: [
          ["Miniaturisation and lower cost", false, "Both are real, but they are not the two trends the lecture builds on."],
          ["Connectivity and intelligence", true, "Embedded systems are getting connected into ever wider networks, and they are becoming more intelligent: processing data, taking part in AI frameworks, deciding on their own."],
          ["Faster processors and more memory", false, "Hardware gets better, but the lecture's two trends are about what the systems do: communicate and reason."],
          ["Wired networking and cloud storage", false, "Those are single technologies. The trends are the broader directions: connectivity and intelligence."],
        ],
      },
    ],

    networked: [
      {
        q: "What makes a group of embedded systems a <em>networked</em> embedded system?",
        options: [
          ["They are all made by the same manufacturer", false, "The vendor is irrelevant. What matters is that they communicate and work together."],
          ["They each have their own power supply", false, "Power has nothing to do with it."],
          ["They are connected over a network and cooperate towards one goal or application", true, "That is the lecture's definition. Another name for the same thing is distributed embedded systems."],
          ["They are connected to the internet", false, "The network can be entirely local and wired, for example inside a car. Internet connectivity is a later step (the Internet of Things)."],
        ],
      },
      {
        q: "A thermostat inside a boiler measures the temperature and controls the heater, talking to nothing else. How does the lecture classify it?",
        options: [
          ["A networked embedded system", false, "It does not communicate with any other system, so there is no network."],
          ["An embedded system operating in isolation", true, "This is the lecture's example of how embedded systems originally worked: part of a single machine, with no communication."],
          ["An Internet of Things device", false, "IoT implies connectivity beyond the device itself. This thermostat has none."],
          ["A general-purpose computer", false, "It has one dedicated function, so it is embedded."],
        ],
      },
    ],

    can: [
      {
        q: "What is CAN bus?",
        options: [
          ["A wireless protocol for sensor networks", false, "CAN is wired. Wireless embedded networking came later."],
          ["A wired networking solution designed for vehicles", true, "CAN (Controller Area Network) connects the many controllers in a car: engine, transmission, body electronics and so on."],
          ["A cloud platform for IoT data", false, "CAN is a local, in-vehicle network and has nothing to do with the cloud."],
          ["A type of microcontroller", false, "It is a network that microcontrollers use to talk to each other, not a chip."],
        ],
      },
      {
        q: "Put the CAN bus timeline in the right order.",
        options: [
          ["Released 1986, developed from 1983, ISO standard 1991, first production car 1993", false, "Development must come before release, and the last two dates are swapped."],
          ["Development starts at Bosch in 1983, official release 1986, first production vehicles (Mercedes-Benz) 1991, ISO standard 1993", true, "That is the sequence on the slide: about a decade from first development to an international standard."],
          ["ISO standard 1983, Bosch release 1986, Mercedes-Benz 1993", false, "The standard came last (1993), after the technology had already been used in production cars."],
          ["Developed by Mercedes-Benz in 1983 and standardised by Bosch in 1993", false, "Bosch developed it; Mercedes-Benz was the first to put it into production vehicles; ISO standardised it."],
        ],
      },
    ],

    wireless: [
      {
        q: "Which is <em>not</em> one of the lecture's reasons for going from wired to wireless embedded systems?",
        options: [
          ["Wireless needs no pre-existing infrastructure", false, "This is one of the reasons: wires in the walls are only easy when the building is built or renovated."],
          ["Wireless makes it easy to extend the coverage area", false, "This is one of the reasons: going from star networks to multi-hop networks extends the area."],
          ["Wireless enables mobility", false, "This is one of the reasons: wearable and portable embedded systems cannot drag a cable around."],
          ["Wireless links are more reliable than cables", true, "Right, this is not one of the reasons. A cable is generally the more dependable link; wireless wins on flexibility, coverage and mobility."],
        ],
      },
      {
        q: "A sensor node is too far from the gateway to reach it directly. How does a multi-hop (mesh) network solve this?",
        options: [
          ["The node increases its clock speed", false, "Clock speed does not change radio range."],
          ["Other nodes in between forward (relay) its messages towards the gateway", true, "Each node only needs to reach a neighbour. Messages hop from node to node, which extends coverage far beyond a single radio's range."],
          ["The gateway moves closer to the node", false, "Gateways are normally fixed. The network topology solves the problem instead."],
          ["The node switches to a wired connection", false, "That would defeat the point of a wireless deployment, for example in the middle of a field."],
        ],
      },
    ],

    iot: [
      {
        q: "What does the Internet of Things add on top of networked embedded systems?",
        options: [
          ["It replaces embedded systems with cloud servers", false, "The embedded systems remain. IoT connects them; it does not replace them."],
          ["It connects isolated networks of embedded systems into a 'global' network", true, "Separate local networks (a field, a building, a factory) become reachable and combinable through the internet."],
          ["It makes every embedded system wireless", false, "IoT devices can be wired or wireless. The point is global connectivity, not the medium."],
          ["It removes the need for sensors", false, "Sensors are what make IoT data interesting in the first place."],
        ],
      },
      {
        q: "What is the correct order of the connectivity trend?",
        options: [
          ["IoT, wireless, wired networks, networks within one machine, isolated", false, "That is exactly backwards. The trend goes from isolation towards global connectivity."],
          ["Isolated, wireless, wired networks, IoT, networks within one machine", false, "Wired networking came before wireless, and in-machine networks came before both."],
          ["Isolated, networks within the same machine, wired networks, wireless systems covering wider areas, the Internet of Things", true, "Each step widens the circle of collaboration, up to potentially global connectivity and beyond (for example satellites)."],
          ["Wired networks, isolated, IoT, wireless", false, "Isolated systems are the starting point, not an intermediate step."],
        ],
      },
    ],

    intelligent: [
      {
        q: "What is an autonomous system?",
        options: [
          ["A system that imitates the human brain", false, "That is the lecture's description of a cognitive system."],
          ["A system that runs on batteries", false, "Energy autonomy is a different idea. Here autonomy is about decisions, not power."],
          ["A system that operates with little or no human intervention", true, "It perceives, decides and acts on its own. The less a human needs to step in, the more autonomous it is."],
          ["A system that stores all its data in the cloud", false, "Depending on the cloud is, if anything, the opposite of autonomy."],
        ],
      },
      {
        q: "How does the lecture describe Artificial Intelligence?",
        options: [
          ["Finding patterns and extracting knowledge out of raw data, then using it for reasoning, decision making and planning", true, "Two halves: turning data into knowledge, and using that knowledge to act sensibly."],
          ["Any program that contains an if-statement", false, "Rule-based systems are one form of machine intelligence, but the definition is about extracting and using knowledge, not about a language construct."],
          ["A neural network running in a data centre", false, "That is one way to implement AI, not its definition. AI can also be rule-based, and it can run on the embedded device itself."],
          ["A robot with a human-like body", false, "AI is about reasoning over data. It needs no body at all."],
        ],
      },
    ],

    control: [
      {
        q: "Which three ingredients does a control system use to regulate a variable?",
        options: [
          ["Storage, networking and a display", false, "None of these is required to regulate a physical variable."],
          ["Sensing, actuation and a control algorithm", true, "Measure the variable, compare it with the target, and drive an actuator to reduce the difference. Repeat forever."],
          ["A cloud server, a database and a user", false, "Classic control loops run locally, with no cloud and often no user involved."],
          ["Two sensors and a battery", false, "Without an actuator nothing can be changed, and without an algorithm nothing decides."],
        ],
      },
      {
        q: "In the flow-control figure, which part plays the role of the actuator?",
        options: [
          ["The flow transmitter", false, "The flow transmitter measures the flow rate and reports it as the process value. It is the sensor."],
          ["The set point", false, "The set point is the target value, an input to the controller."],
          ["The controller", false, "The controller is the decision maker. It computes an output from the set point and the measured value."],
          ["The flow control valve", true, "The controller output sets the valve position, which changes the flow. The valve is the final control element: the actuator."],
        ],
      },
    ],

    rules: [
      {
        q: "Rule: IF motion is detected AND the time is between 9 am and 5 pm AND the room is colder than 19 degrees THEN turn on the heating. At 8 pm there is motion and the room is at 17 degrees. What happens?",
        options: [
          ["Heating turns on: it is cold and someone is there", false, "Two of three conditions hold, but the rule uses AND. All conditions must be true."],
          ["Heating stays off, because the time condition is false", true, "With AND, a single false condition makes the whole rule false. A rule-based system does exactly what its rules say, no more."],
          ["Heating turns on at half power", false, "An if-then rule is either triggered or not. There is no partial outcome."],
          ["The system learns that evenings are cold and adapts the rule", false, "Learning from observations is data-driven intelligence. A rule-based system does not change its own rules."],
        ],
      },
      {
        q: "'All humans are mortal. Alice is human. Therefore Alice is mortal.' What kind of reasoning is this?",
        options: [
          ["Inductive reasoning", false, "Induction goes from observations to a general model. Here a general rule is applied to a specific case."],
          ["Deductive reasoning", true, "Conclusions are derived from rules and axioms. If the premises are true, the conclusion is guaranteed to be true."],
          ["Machine learning", false, "Nothing is learned from data here; a given rule is simply applied."],
          ["Guessing", false, "The conclusion follows with certainty from the premises."],
        ],
      },
    ],

    "data-driven": [
      {
        q: "'All swans we have seen are white, so all swans are white.' What is the weakness of this inductive reasoning?",
        options: [
          ["It needs too much computing power", false, "The weakness is logical, not computational."],
          ["The model is only as good as the observations: a single unseen black swan makes it wrong", true, "Induction derives a model from observations. It predicts well if the observations are representative, but it offers no guarantee for cases it has never seen."],
          ["It cannot be used to make predictions", false, "Making predictions about unseen cases is exactly what it is used for."],
          ["It is identical to deductive reasoning", false, "Deduction applies given rules with certainty. Induction generalises from examples with uncertainty."],
        ],
      },
      {
        q: "When does the lecture say we turn to machine learning?",
        options: [
          ["For simple problems where we already know the physical laws", false, "There we can hand-craft the model, as with Newton's laws predicting the position of a planet."],
          ["Whenever a system has a network connection", false, "Connectivity is not the criterion."],
          ["For complex problems, where we let the machine find a model that explains the input data and use it to predict future data", true, "When the relationship is too complicated to write down by hand, the model is learned from observations instead."],
          ["Only when no data is available", false, "Machine learning depends on data. Without observations there is nothing to learn from."],
        ],
      },
    ],

    dnn: [
      {
        q: "Which two things do deep neural networks require a lot of?",
        options: [
          ["Rules and axioms", false, "Those belong to rule-based (deductive) intelligence. Neural networks learn from examples."],
          ["Computing power and observations (input data)", true, "That is why they were enabled by advances in cloud computing and big data."],
          ["Sensors and actuators", false, "A neural network is a model. It can be trained without any sensor attached, as long as data exists."],
          ["Wires and connectors", false, "Hardware plumbing is not what limits deep learning."],
        ],
      },
      {
        q: "What role do networked embedded systems play in the classic cloud-based deep learning picture?",
        options: [
          ["They train the models", false, "In this picture, training happens in the cloud, where the computing power is."],
          ["They are the (big) data generators", true, "Thousands of sensor nodes produce the observations that data-hungry models need."],
          ["They replace the cloud", false, "Here they feed the cloud. Moving intelligence onto the devices is the later, embedded AI step."],
          ["They have no role", false, "Without their data there would be little to learn from."],
        ],
      },
    ],

    cloud: [
      {
        q: "Which is a <em>disadvantage</em> of a purely cloud-based IoT system?",
        options: [
          ["Lots of storage", false, "That is an advantage of the cloud."],
          ["Lots of computing power", false, "That is an advantage of the cloud."],
          ["Latency that may be prohibitive for delay-sensitive use cases", true, "Every decision needs a round trip to a data centre. For something like braking or motor control, that is too slow. Cost, dependency on coverage and privacy are the other disadvantages."],
          ["The ability to train very accurate deep learning models", false, "That is an advantage of the cloud."],
        ],
      },
      {
        q: "A wildlife tracker works in a remote valley with no mobile coverage. Which cloud disadvantage hits it hardest?",
        options: [
          ["Privacy", false, "Privacy matters when sensitive personal data goes to third parties. It is not the main problem for a tracker in a valley."],
          ["Dependency on infrastructure (no-coverage zones)", true, "If all the intelligence is in the cloud and there is no connection, the device can do nothing useful until it is back in coverage."],
          ["Too much storage", false, "Plentiful storage is an advantage, not a problem."],
          ["Too much computing power", false, "Plentiful computing power is an advantage, not a problem."],
        ],
      },
    ],

    continuum: [
      {
        q: "What does 'embedded AI' mean in the cloud-fog-edge continuum?",
        options: [
          ["AI comes to the embedded systems themselves (inference, even training), making them more autonomous", true, "The device senses, extracts knowledge, plans and decides locally instead of shipping raw data away."],
          ["AI models are embedded into web pages", false, "The term refers to running AI on embedded devices."],
          ["All AI runs in cloud data centres", false, "That is the purely cloud-based model that the continuum moves away from."],
          ["Embedded systems stop using sensors", false, "Sensing is the first step of what an autonomous embedded system does."],
        ],
      },
      {
        q: "When are local fog servers used?",
        options: [
          ["For the most demanding tasks, such as training large language models", false, "Those go to cloud data centres."],
          ["Never, they are obsolete", false, "Fog is the middle tier of the continuum and very much in use."],
          ["Only when the device has no battery", false, "Power supply is not the criterion."],
          ["When more computing power or data fusion is needed than the end devices can provide", true, "Fog nodes sit close to the devices, either privately owned or offered as a service, and can combine data from several devices."],
        ],
      },
    ],

    anatomy: [
      {
        q: "In the anatomy diagram, which blocks are inside the System-on-Chip?",
        options: [
          ["Sensors, actuators and user interface", false, "Those are external components connected to the SoC over a bus or pins."],
          ["CPU, RAM, flash, I/O interfaces and radio", true, "The SoC bundles the computer and the radio in one chip. Everything else connects to it."],
          ["Battery and energy harvester", false, "Those form the power source, outside the SoC."],
          ["Only the CPU", false, "A bare CPU would be a microprocessor. The SoC also contains memory, I/O and a radio."],
        ],
      },
      {
        q: "How do sensors, actuators and the user interface connect to the SoC in the anatomy diagram?",
        options: [
          ["Over the internet", false, "These are connections on the same circuit board."],
          ["Through GPIO, ADC, UART, SPI and I2C", true, "Simple on/off lines (GPIO), analogue measurements (ADC) and serial buses (UART, SPI, I2C) are the standard ways to attach components to a microcontroller."],
          ["Through the power source", false, "The power source feeds the components but carries no data."],
          ["They are not connected", false, "Without connections the SoC could neither read sensors nor drive actuators."],
        ],
      },
    ],

    soc: [
      {
        q: "What does a microcontroller (MCU) contain?",
        options: [
          ["Only a processor", false, "A processor alone is a microprocessor. It needs external memory and peripherals to do anything."],
          ["A processor, RAM and input/output peripherals in one chip", true, "A small computer in a chip. That integration is what makes it cheap, small and low-power."],
          ["A screen, keyboard and hard disk", false, "Those belong to a general-purpose computer."],
          ["Only memory", false, "A memory chip cannot execute a program."],
        ],
      },
      {
        q: "What does a System-on-Chip add to a plain MCU, according to the lecture?",
        options: [
          ["Nothing, they are the same thing", false, "An SoC contains an MCU and more."],
          ["A bigger battery", false, "Batteries are not part of the chip."],
          ["Things like non-volatile storage (flash), network interfaces (a wireless radio), other processing units and integrated sensors", true, "The CC2650 is an example: CPU, memory, a radio with its own CPU, a sensor controller, crypto, timers and a temperature sensor, all in one package."],
          ["An operating system", false, "Software is not what distinguishes the two. The difference is what hardware is integrated."],
        ],
      },
    ],

    processors: [
      {
        q: "Which ARM Cortex series targets embedded, low-power microcontrollers?",
        options: [
          ["Cortex-A", false, "Cortex-A is for generic applications: phones, tablets and single-board computers that run systems like Linux."],
          ["Cortex-R", false, "Cortex-R is the real-time series."],
          ["Cortex-M", true, "M for microcontroller: small, cheap and low-power. The CC2650 from the previous topic has a Cortex-M3 as its main CPU."],
          ["Cortex-X", false, "That is not one of the three series on the slide (A, R and M)."],
        ],
      },
      {
        q: "What is special about ARM compared with the other vendors on the slide?",
        options: [
          ["ARM only makes 8-bit processors", false, "The Cortex processors are 32-bit and 64-bit designs."],
          ["ARM licenses its CPU designs to chip vendors instead of selling its own chips", true, "Texas Instruments, ST, Nordic and many others buy the design and build their own chips around it. That is why so many different microcontrollers share the same CPU core."],
          ["ARM processors cannot be used in embedded systems", false, "The Cortex-M series exists precisely for embedded use."],
          ["ARM is a programming language", false, "ARM is a processor architecture and the company behind it."],
        ],
      },
    ],

    transducers: [
      {
        q: "What is a transducer?",
        options: [
          ["A device that converts a signal from one form of energy to another", true, "Sensors and actuators are both transducers. They differ only in the direction of the conversion."],
          ["A device that stores energy", false, "That would be a battery or a capacitor."],
          ["A device that amplifies digital signals", false, "Amplification keeps the same form of energy. A transducer changes it."],
          ["A type of network cable", false, "It has nothing to do with networking."],
        ],
      },
      {
        q: "A loudspeaker is which kind of transducer?",
        options: [
          ["An input transducer, electroacoustic", false, "The type is right but the direction is wrong: a microphone would be the input."],
          ["An output transducer, electro-optical", false, "The direction is right, but it produces sound, not light."],
          ["An output transducer, electroacoustic", true, "It converts an electrical signal into a physical quantity (sound), so it is an output transducer of the electroacoustic type."],
          ["An input transducer, thermoelectric", false, "It neither measures anything nor deals with heat."],
        ],
      },
    ],

    sensors: [
      {
        q: "What is needed before a digital system can process the output of an analogue sensor?",
        options: [
          ["A Digital-to-Analogue Converter (DAC)", false, "A DAC goes the other way: from numbers to a voltage. It is used on the output side."],
          ["An Analogue-to-Digital Converter (ADC)", true, "The sensor produces a continuous electrical signal. The ADC turns it into numbers the processor can work with."],
          ["A voltage regulator", false, "A regulator provides stable power. It does not convert a signal into numbers."],
          ["Nothing, a processor reads voltages directly as numbers", false, "A plain digital input only distinguishes high from low. Measuring a value needs an ADC."],
        ],
      },
      {
        q: "What is a digital sensor, such as the ADXL362 accelerometer in the figure?",
        options: [
          ["A sensor that only reports 0 or 1", false, "It reports full measurement values, just in digital form."],
          ["An analogue sensor packed in a chip together with an ADC and a controller", true, "The sensing element is still analogue. The chip adds filtering, a 12-bit ADC and digital logic, and talks to the MCU over a serial interface (SPI)."],
          ["A sensor simulated in software", false, "It is real hardware with a real sensing element."],
          ["A sensor that needs no power", false, "The integrated electronics need power like any other chip."],
        ],
      },
    ],

    actuators: [
      {
        q: "What does a controller chip such as the SSD1306 do?",
        options: [
          ["It measures the brightness of the room", false, "That would be a sensor. The SSD1306 drives an output device."],
          ["It implements a command interface, so the MCU can control the physical output (here a 128 x 64 display) with simple commands", true, "Instead of driving hundreds of display lines itself, the MCU sends commands and data to the controller chip, which does the low-level work."],
          ["It replaces the MCU", false, "It is a helper for one output device. The MCU still runs the application."],
          ["It stores the program code", false, "Program code lives in the MCU's flash memory."],
        ],
      },
      {
        q: "Which of these is <em>not</em> listed as a way for a digital system to control an actuator?",
        options: [
          ["A switch", false, "A switch is on the list: the simplest way to turn an output on or off."],
          ["A Digital-to-Analogue Converter (DAC)", false, "A DAC is on the list: it produces an analogue voltage from a number."],
          ["A signal generator or modulator", false, "These are on the list: PWM is the classic example."],
          ["An Analogue-to-Digital Converter (ADC)", true, "An ADC is for the input side: it converts a sensor's analogue signal into numbers. Outputs need a switch, a DAC, a signal generator or a modulator."],
        ],
      },
    ],

    power: [
      {
        q: "What does a voltage regulator do?",
        options: [
          ["It converts AC into DC", false, "That is rectification, which happens before the regulator when a device is powered from the mains."],
          ["It automatically maintains a constant output voltage", true, "Power sources are noisy and imperfect (a battery's voltage drops as it discharges). The regulator hides that from the rest of the circuit."],
          ["It stores energy for later", false, "Storage is the battery's job."],
          ["It measures the battery level", false, "That would be a battery monitor."],
        ],
      },
      {
        q: "A 3.7 V battery must power a 5 V component. Which converter is needed?",
        options: [
          ["A step-down (buck) converter", false, "A buck converter gives an output voltage lower than its input. Here the output has to be higher."],
          ["A linear regulator", false, "A linear regulator can only reduce the voltage, by burning off the excess."],
          ["A step-up (boost) converter", true, "Boost: the output voltage is higher than the input voltage."],
          ["No converter, just connect it directly", false, "3.7 V is below what the component needs, so it would not work reliably."],
        ],
      },
      {
        q: "Why is a switching regulator more efficient than a linear one?",
        options: [
          ["It uses thicker wires", false, "Wire thickness is not the difference."],
          ["It works only at low currents", false, "Switching regulators are used across a wide range of currents."],
          ["It lowers the voltage by rapid on/off switching instead of dissipating the excess as heat", true, "A linear regulator adjusts the voltage linearly and dissipates the difference. A switching regulator chops the input on and off, so little is lost."],
          ["It does not need an input voltage", false, "Every regulator needs a source to draw from."],
        ],
      },
    ],
  };

  /* =====================================================================
     LAB: generic "which group does this belong to?" classifier
     ===================================================================== */
  function labSort(el, cfg) {
    const { controls, view } = NES.lab(el, { title: cfg.title, hint: cfg.hint });
    const stats = NES.stats(controls, [{ key: "done", label: "Progress" }, { key: "score", label: "Right on first try" }]);
    const restart = h("button", { class: "btn", type: "button", text: "Start over" });
    controls.append(restart);
    const card = h("div", { class: "stage sort-item", "aria-live": "polite" });
    const btns = h("div", { class: "sort-btns" });
    const verdict = h("div", { class: "verdict" });
    const next = h("button", { class: "btn sort-next", type: "button", text: "Next item" });
    view.append(card, btns, verdict, next);

    let idx = 0, score = 0, firstTry = true, solved = false;
    function show() {
      const done = idx >= cfg.items.length;
      stats.set("done", Math.min(idx + (solved ? 1 : 0), cfg.items.length) + " / " + cfg.items.length);
      stats.set("score", String(score), score ? "good" : "");
      btns.innerHTML = "";
      next.hidden = true;
      if (done) {
        card.innerHTML = "All done";
        verdict.className = "verdict good";
        verdict.innerHTML = "<b>Finished.</b> " + score + " of " + cfg.items.length + " right on the first try.";
        return;
      }
      const item = cfg.items[idx];
      card.innerHTML = item[0];
      verdict.className = "verdict";
      verdict.innerHTML = cfg.prompt;
      cfg.groups.forEach(([key, label]) => {
        const b = h("button", { class: "btn", type: "button", html: label });
        b.addEventListener("click", () => {
          if (solved) return;
          if (key === item[1]) {
            solved = true;
            if (firstTry) score++;
            verdict.className = "verdict good";
            verdict.innerHTML = "<b>Correct.</b> " + item[2];
            b.classList.add("sort-right");
            next.hidden = false;
            next.textContent = idx === cfg.items.length - 1 ? "Show result" : "Next item";
            stats.set("done", idx + 1 + " / " + cfg.items.length);
            stats.set("score", String(score), score ? "good" : "");
          } else {
            firstTry = false;
            verdict.className = "verdict bad";
            verdict.innerHTML = "<b>Not quite.</b> " + (item[3] && item[3][key] ? item[3][key] : cfg.wrong[key] || "Try another group.");
            b.classList.add("sort-wrong");
            b.disabled = true;
          }
        });
        btns.append(b);
      });
    }
    next.addEventListener("click", () => { idx++; firstTry = true; solved = false; show(); });
    restart.addEventListener("click", () => { idx = 0; score = 0; firstTry = true; solved = false; show(); });
    show();
  }

  const SORT_EMBEDDED = {
    title: "Embedded or general-purpose?",
    hint: "Ask the lecture's question for each device: is computation its principal mission, or is the computer only a means to do something else?",
    prompt: "Which kind of computer is inside this device?",
    groups: [["emb", "Embedded system"], ["gen", "General-purpose computer"]],
    wrong: {},
    items: [
      ["Washing machine", "emb", "Its mission is washing clothes. The computer inside only serves that one purpose.", { gen: "You cannot install new software to make it do something else. It has one dedicated function." }],
      ["Laptop", "gen", "Its mission is computation itself, and the user decides what it runs.", { emb: "A laptop has no single dedicated function. Laptops, desktops and servers are the lecture's general-purpose examples." }],
      ["Pacemaker", "emb", "A dedicated function inside a larger product, measuring and controlling a physical process: the heartbeat.", { gen: "A pacemaker does exactly one job and you would not want it to do anything else." }],
      ["Web server in a data centre", "gen", "Servers are general-purpose machines: the same hardware can run any service.", { emb: "It does not measure or control a physical process, and it can be repurposed just by installing other software." }],
      ["Engine controller in a car", "emb", "It measures and controls physical operations (fuel injection, ignition) as part of a larger system.", { gen: "It has a fixed function inside the car and is never used for anything else." }],
      ["Credit card reader", "emb", "A special-purpose computing system on the lecture's list of examples.", { gen: "It does one thing: read cards and process payments." }],
      ["Desktop PC", "gen", "A general-purpose computer by definition.", { emb: "Its purpose is to run whatever programs the user chooses." }],
      ["Digital thermostat", "emb", "It senses temperature and controls heating: the classic embedded control application.", { gen: "It has one dedicated function and is part of a larger heating system." }],
    ],
  };

  const SORT_WASHING = {
    title: "Sort the washing machine's functions",
    hint: "Every computer-controlled function of the machine falls into one of the four groups from the slide.",
    prompt: "Which group does this function belong to?",
    groups: [["io", "Input/Output"], ["ctl", "Control"], ["safe", "Safety"], ["time", "Time keeping"]],
    wrong: {
      io: "Input/Output is about the user: capturing choices and showing status.",
      ctl: "Control functions regulate the washing process itself through sensing and actuation.",
      safe: "Safety functions check for errors and unsafe conditions before or during operation.",
      time: "Time keeping is about durations between stages and delayed start.",
    },
    items: [
      ["The user picks the 40 degree cotton programme", "io", "User preferences are captured via buttons, switches or a touch screen."],
      ["Open the valve to let water into the tank", "ctl", "Controlling valves to get water in and out is actuation."],
      ["Refuse to start while the door is open", "safe", "The door check prevents a dangerous start."],
      ["Wait 12 minutes between two washing stages", "time", "Keeping track of the time passed between stages."],
      ["Keep the water at the selected temperature", "ctl", "Sense the temperature, drive the heater: a control loop."],
      ["Show 'E21' on the display", "io", "Status and errors are shown on a screen or with LEDs. Detecting the fault is safety; showing it is output."],
      ["Make sure enough water is in before heating", "safe", "Heating an empty tank would damage the machine, so this is checked first."],
      ["Start the programme at 06:00 tomorrow", "time", "Delayed start is a time keeping function."],
      ["Adjust motor power to hold 1200 RPM", "ctl", "Controlling the power that goes to the motor to get the right RPM."],
      ["Check the weight of the clothes", "safe", "An overloaded drum is an error condition the machine must detect."],
    ],
  };

  const SORT_TRANSDUCERS = {
    title: "Name the transducer type",
    hint: "Each device converts between electricity and one other form of energy. Pick the type from the slide's list.",
    prompt: "Which type of transducer is this?",
    groups: [["mech", "Electromechanical"], ["mag", "Electromagnetic"], ["chem", "Electrochemical"], ["aco", "Electroacoustic"], ["opt", "Electro-optical"], ["therm", "Thermoelectric"]],
    wrong: {
      mech: "Electromechanical devices deal with motion, force or pressure.",
      mag: "Electromagnetic devices deal with magnetic fields or radio waves.",
      chem: "Electrochemical devices deal with chemical substances and reactions.",
      aco: "Electroacoustic devices deal with sound and vibration in air or materials.",
      opt: "Electro-optical devices deal with light.",
      therm: "Thermoelectric devices deal with heat and temperature.",
    },
    items: [
      ["Accelerometer (sensor)", "mech", "It measures acceleration, a mechanical quantity."],
      ["Microphone (sensor)", "aco", "It converts sound into an electrical signal."],
      ["Camera (sensor)", "opt", "It converts light into an electrical signal."],
      ["pH sensor", "chem", "It responds to the chemical properties of a liquid."],
      ["Heater (actuator)", "therm", "It converts electricity into heat."],
      ["Magnetometer (sensor)", "mag", "It measures a magnetic field."],
      ["Electric motor (actuator)", "mech", "It converts electricity into motion."],
      ["LED (output device)", "opt", "It converts electricity into light."],
      ["Loudspeaker (output device)", "aco", "It converts an electrical signal into sound."],
      ["Temperature sensor", "therm", "It converts temperature into an electrical signal."],
      ["Gas sensor", "chem", "It detects chemical substances in the air."],
      ["Heart rate sensor (PPG)", "opt", "It shines light into the skin and measures how much comes back, so it is optical."],
    ],
  };

  /* =====================================================================
     LAB: star vs multi-hop coverage
     ===================================================================== */
  function labCoverage(el) {
    const { controls, view } = NES.lab(el, {
      title: "Star vs multi-hop coverage",
      hint: "Twelve sensor nodes in a field and one gateway (square). In a star network every node must reach the gateway directly. In a multi-hop network, nodes relay for each other. Shrink the radio range and compare.",
    });
    const topo = NES.seg(controls, { label: "Topology", options: [["star", "Star"], ["mesh", "Multi-hop"]], value: "star" });
    const range = NES.slider(controls, { label: "Radio range", min: 40, max: 320, step: 5, value: 150, fmt: (v) => v + " m" });
    const cv = h("canvas", { style: "height:280px", "aria-label": "Sensor field map" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--ok);height:9px;width:9px;border-radius:50%"></i>connected</span><span><i style="background:var(--bad);height:9px;width:9px;border-radius:50%"></i>out of reach</span><span><i style="background:var(--tech)"></i>link in use</span>` }));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "conn", label: "Nodes connected" }, { key: "hops", label: "Longest path" }]);

    // field is 600 m x 300 m, gateway near the left edge
    const GW = [40, 150];
    const NODES = [[130, 70], [150, 215], [235, 140], [290, 50], [315, 245], [380, 150], [430, 60], [455, 250], [510, 160], [560, 70], [575, 250], [210, 270]];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

    function solve() {
      const R = range.value;
      const hops = NODES.map(() => Infinity), parent = NODES.map(() => null);
      if (topo.value === "star") {
        NODES.forEach((n, i) => { if (dist(n, GW) <= R) { hops[i] = 1; parent[i] = -1; } });
      } else {
        const queue = [];
        NODES.forEach((n, i) => { if (dist(n, GW) <= R) { hops[i] = 1; parent[i] = -1; queue.push(i); } });
        while (queue.length) {
          const i = queue.shift();
          NODES.forEach((n, j) => { if (hops[j] === Infinity && dist(n, NODES[i]) <= R) { hops[j] = hops[i] + 1; parent[j] = i; queue.push(j); } });
        }
      }
      return { hops, parent };
    }

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const { hops, parent } = solve();
      const pad = 16, sx = (w - 2 * pad) / 600, sy = (hh - 2 * pad) / 300, s = Math.min(sx, sy);
      const ox = (w - 600 * s) / 2, oy = (hh - 300 * s) / 2;
      const P = (p) => [ox + p[0] * s, oy + p[1] * s];
      ctx.strokeStyle = NES.css("--line-2"); ctx.lineWidth = 1; ctx.strokeRect(ox, oy, 600 * s, 300 * s);
      // gateway range
      const g = P(GW);
      ctx.fillStyle = NES.css("--tech"); ctx.globalAlpha = 0.08; ctx.beginPath(); ctx.arc(g[0], g[1], range.value * s, 0, Math.PI * 2);
      ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, 600 * s, 300 * s); ctx.clip(); ctx.beginPath(); ctx.arc(g[0], g[1], range.value * s, 0, Math.PI * 2); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
      // links
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2;
      NODES.forEach((n, i) => {
        if (hops[i] === Infinity) return;
        const a = P(n), b = parent[i] === -1 ? g : P(NODES[parent[i]]);
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      });
      // nodes
      ctx.font = "bold 11px " + NES.css("--font"); ctx.textAlign = "center"; ctx.textBaseline = "middle";
      NODES.forEach((n, i) => {
        const a = P(n), ok = hops[i] !== Infinity;
        ctx.fillStyle = ok ? NES.css("--ok") : NES.css("--bad");
        ctx.beginPath(); ctx.arc(a[0], a[1], 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = NES.css("--card"); ctx.fillText(ok ? String(hops[i]) : "x", a[0], a[1] + 0.5);
      });
      ctx.fillStyle = NES.css("--ink"); ctx.fillRect(g[0] - 10, g[1] - 10, 20, 20);
      ctx.fillStyle = NES.css("--card"); ctx.fillText("GW", g[0], g[1] + 0.5);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    });

    function update() {
      const { hops } = solve();
      const conn = hops.filter((x) => x !== Infinity);
      const max = conn.length ? Math.max.apply(null, conn) : 0;
      stats.set("conn", conn.length + " / " + NODES.length, conn.length === NODES.length ? "good" : conn.length >= 6 ? "warn" : "bad");
      stats.set("hops", conn.length ? max + (max === 1 ? " hop" : " hops") : "-");
      if (conn.length === NODES.length) {
        verdict.className = "verdict good";
        verdict.innerHTML = topo.value === "star"
          ? "<b>Full coverage.</b> Every node reaches the gateway directly, but only because the radios are strong enough to span the whole field."
          : "<b>Full coverage.</b> Nodes far away reach the gateway by relaying through their neighbours (numbers show the hop count).";
      } else {
        verdict.className = "verdict " + (conn.length ? "warn" : "bad");
        verdict.innerHTML = topo.value === "star"
          ? "<b>" + (NODES.length - conn.length) + " nodes are out of reach.</b> In a star, a node outside the gateway's range is simply lost. Try switching to multi-hop."
          : "<b>" + (NODES.length - conn.length) + " nodes are cut off.</b> The range is now so short that there are gaps no chain of neighbours can bridge.";
      }
      draw();
    }
    topo.onchange = range.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: thermostat control loop (sense, decide, actuate)
     ===================================================================== */
  function labControl(el) {
    const { controls, view } = NES.lab(el, {
      title: "A thermostat control loop",
      hint: "The controller reads the room temperature (sensing), compares it with the set point and switches the heater on or off (actuation). The room keeps losing heat to the outside. Four hours are simulated.",
    });
    const sp = NES.slider(controls, { label: "Set point", min: 16, max: 26, step: 0.5, value: 21, fmt: (v) => v.toFixed(1) + " °C" });
    const out = NES.slider(controls, { label: "Outside temperature", min: -10, max: 18, step: 1, value: 5, fmt: (v) => v + " °C" });
    const band = NES.slider(controls, { label: "Switching band", min: 0.1, max: 3, step: 0.1, value: 1, fmt: (v) => "±" + (v / 2).toFixed(2) + " °C" });
    const loop = NES.seg(controls, { label: "Control loop", options: [[1, "Closed (on)"], [0, "Open (off)"]], value: 1 });
    const cv = h("canvas", { style: "height:250px", "aria-label": "Room temperature over time" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i>room temperature (process value)</span><span><i class="dash" style="color:var(--accent)"></i>set point</span><span><i style="background:var(--hi);opacity:.5;height:8px"></i>heater on (controller output)</span>` }));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "avg", label: "Average (last 2 h)" }, { key: "sw", label: "Heater switchings" }, { key: "duty", label: "Heater on-time" }]);

    const MIN = 240, DT = 0.25, TAU = 90, GAIN = 28; // minutes, step, room time constant, heater lift (deg C)
    let T = [], H = [];
    function simulate() {
      T = []; H = [];
      let t = out.value + 6, on = 0;
      const n = Math.round(MIN / DT);
      for (let i = 0; i < n; i++) {
        if (loop.value) {
          if (t < sp.value - band.value / 2) on = 1;
          else if (t > sp.value + band.value / 2) on = 0;
        } else on = 0;
        t += (DT / TAU) * (out.value - t + on * GAIN);
        T.push(t); H.push(on);
      }
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 8, padT = 10, padB = 22;
      const lo = Math.min(out.value, 10) - 2, hi = 30;
      const X = (i) => padL + (i / (T.length - 1)) * (w - padL - padR);
      const Y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font");
      // heater bands
      ctx.fillStyle = NES.css("--hi"); ctx.globalAlpha = 0.16;
      let start = null;
      H.forEach((on, i) => {
        if (on && start === null) start = i;
        if ((!on || i === H.length - 1) && start !== null) { ctx.fillRect(X(start), padT, X(i) - X(start), hh - padT - padB); start = null; }
      });
      ctx.globalAlpha = 1;
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1; ctx.fillStyle = NES.css("--muted");
      for (let v = Math.ceil(lo / 5) * 5; v <= hi; v += 5) { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); ctx.fillText(v + "°", 8, Y(v) + 4); }
      for (let hr = 0; hr <= 4; hr++) { const x = padL + (hr / 4) * (w - padL - padR); ctx.fillText(hr + " h", Math.min(x - 6, w - padR - 18), hh - 6); }
      ctx.strokeStyle = NES.css("--accent"); ctx.setLineDash([6, 5]); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(padL, Y(sp.value)); ctx.lineTo(w - padR, Y(sp.value)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      T.forEach((v, i) => { i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)); });
      ctx.stroke();
    });
    function update() {
      simulate();
      const half = T.slice(T.length / 2), avg = half.reduce((a, b) => a + b, 0) / half.length;
      const sw = H.reduce((n, x, i) => n + (i && x !== H[i - 1] ? 1 : 0), 0);
      const duty = H.slice(H.length / 2).reduce((a, b) => a + b, 0) / half.length;
      const reach = out.value + GAIN >= sp.value + band.value / 2;
      stats.set("avg", avg.toFixed(1) + " °C", Math.abs(avg - sp.value) < 0.8 ? "good" : "bad");
      stats.set("sw", String(sw), sw > 60 ? "warn" : "");
      stats.set("duty", (duty * 100).toFixed(0) + "%");
      if (!loop.value) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>No control.</b> Without sensing and actuation the room simply drifts to the outside temperature."; }
      else if (!reach && Math.abs(avg - sp.value) >= 0.8) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Actuator too weak.</b> The heater is on all the time and still cannot reach the set point. A control algorithm cannot do more than its actuator allows."; }
      else if (sw > 60) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Regulated, but the heater chatters.</b> A very narrow band holds the temperature tightly at the price of switching constantly, which wears out a real heater or relay."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Regulated.</b> The room stays around the set point whatever the weather does: the loop measures, decides and acts over and over."; }
      draw();
    }
    [sp, out, band, loop].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: if-then rule for building automation
     ===================================================================== */
  function labRules(el) {
    const { controls, view } = NES.lab(el, {
      title: "Evaluate the building automation rule",
      hint: "The slide's rule has three conditions joined by AND. Change the inputs and watch which conditions hold. The heating turns on only when all three are true.",
    });
    const motion = NES.seg(controls, { label: "Motion sensor", options: [[1, "Movement"], [0, "No movement"]], value: 1 });
    const hour = NES.slider(controls, { label: "Time of day", min: 0, max: 23.5, step: 0.5, value: 10, fmt: (v) => String(Math.floor(v)).padStart(2, "0") + ":" + (v % 1 ? "30" : "00") });
    const temp = NES.slider(controls, { label: "Room temperature", min: 12, max: 26, step: 0.5, value: 17.5, fmt: (v) => v.toFixed(1) + " °C" });
    const list = h("div", { class: "stage rule-list" });
    const verdict = h("div", { class: "verdict" });
    view.append(list, verdict);
    const stats = NES.stats(view, [{ key: "n", label: "Conditions true" }, { key: "out", label: "Room heating" }]);

    function update() {
      const c = [
        ["IF", "motion sensor inside room detects movement", motion.value === 1],
        ["AND", "time is between 9 am and 5 pm", hour.value >= 9 && hour.value <= 17],
        ["AND", "room temperature is lower than 19 degrees", temp.value < 19],
      ];
      const n = c.filter((x) => x[2]).length, on = n === 3;
      list.innerHTML =
        c.map(([kw, txt, ok]) => `<div class="rule-row ${ok ? "ok" : "no"}"><span class="rule-kw">${kw}</span><span class="rule-txt">${txt}</span><span class="rule-mark">${ok ? "true" : "false"}</span></div>`).join("") +
        `<div class="rule-row then ${on ? "ok" : "no"}"><span class="rule-kw">THEN</span><span class="rule-txt">turn on room heating</span><span class="rule-mark">${on ? "fires" : "does not fire"}</span></div>`;
      stats.set("n", n + " / 3", on ? "good" : "");
      stats.set("out", on ? "ON" : "OFF", on ? "hi" : "");
      if (on) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Rule fires.</b> All three conditions are true, so the conclusion follows with certainty. That is deductive reasoning."; }
      else { verdict.className = "verdict"; verdict.innerHTML = "<b>Rule does not fire.</b> With AND, one false condition is enough to block the action. The system does exactly what the rule says, even if a human would have decided differently."; }
    }
    [motion, hour, temp].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: where should the computation run? (cloud, fog, edge)
     ===================================================================== */
  function labPlacement(el) {
    const { controls, view } = NES.lab(el, {
      title: "Where should the intelligence run?",
      hint: "Describe what the application needs. The lab weighs the cloud's advantages and disadvantages from the slides and suggests a tier of the cloud-fog-edge continuum.",
    });
    const yn = (label, v) => NES.seg(controls, { label, options: [[1, "Yes"], [0, "No"]], value: v });
    const fast = yn("Must react within milliseconds", 1);
    const offline = yn("Must work without coverage", 0);
    const priv = yn("Data is privacy-sensitive", 0);
    const fusion = yn("Combines data of many nearby devices", 0);
    const heavy = yn("Needs huge compute or storage", 0);
    const meter = h("div", { class: "meter" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), verdict);
    const stats = NES.stats(view, [{ key: "tier", label: "Suggested tier" }]);

    function update() {
      const s = { edge: 1, fog: 1, cloud: 1 };
      const why = [];
      if (fast.value) { s.edge += 3; s.fog += 1; why.push("a round trip to the cloud adds latency that delay-sensitive use cases cannot afford"); }
      if (offline.value) { s.edge += 3; why.push("a device that depends on infrastructure stops working in no-coverage zones"); }
      if (priv.value) { s.edge += 2; s.fog += 1; why.push("keeping data local avoids sending sensitive data to third parties"); }
      if (fusion.value) { s.fog += 3; s.cloud += 1; why.push("a fog server close by can fuse the data of several devices"); }
      if (heavy.value) { s.cloud += 4; s.fog += 1; why.push("really demanding tasks, such as training large models, need a cloud data centre"); }
      if (!why.length) { s.cloud += 2; why.push("with no special constraints, the cloud's plentiful computing power and storage are the easy choice"); }
      const max = Math.max(s.edge, s.fog, s.cloud);
      const names = { edge: "Edge (on the device)", fog: "Fog (local server)", cloud: "Cloud (data centre)" };
      const cols = { edge: "var(--ok)", fog: "var(--warn)", cloud: "var(--tech)" };
      meter.innerHTML = ["cloud", "fog", "edge"].map((k) => `<div class="meter-row"><span class="m-label">${k[0].toUpperCase() + k.slice(1)}</span><div class="meter-track"><div class="meter-fill" style="width:${(s[k] / 9) * 100}%;background:${cols[k]}"></div></div><span class="m-val">${s[k] === max ? "best fit" : ""}</span></div>`).join("");
      const best = ["edge", "fog", "cloud"].filter((k) => s[k] === max);
      const conflict = heavy.value && (fast.value || offline.value);
      stats.set("tier", conflict ? "Split: edge + cloud" : best.map((k) => names[k]).join(" or "), "good");
      verdict.className = "verdict";
      verdict.innerHTML = (conflict
        ? "<b>Split the work.</b> Do the heavy part (for example training) in the cloud and run the time-critical or offline part (inference, decisions) on the device. That is the idea of the continuum: computing is distributed as the application needs. "
        : "<b>Why:</b> ") + why.join("; ") + ".";
    }
    [fast, offline, priv, fusion, heavy].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: linear vs switching regulator
     ===================================================================== */
  function labRegulator(el) {
    const { controls, view } = NES.lab(el, {
      title: "Linear vs switching regulator",
      hint: "Both regulators step the input down to a constant output. The linear one dissipates the excess voltage as heat, so its efficiency is at best V<sub>out</sub> / V<sub>in</sub>. For the switching (buck) regulator this lab assumes a typical 90%.",
    });
    const vin = NES.slider(controls, { label: "Input voltage V<sub>in</sub>", min: 3.6, max: 12, step: 0.1, value: 9, fmt: (v) => v.toFixed(1) + " V" });
    const vout = NES.seg(controls, { label: "Output voltage V<sub>out</sub>", options: [[1.8, "1.8 V"], [3.3, "3.3 V"]], value: 3.3 });
    const load = NES.slider(controls, { label: "Load current", min: 1, max: 200, step: 1, value: 50, fmt: (v) => v + " mA" });
    const meter = h("div", { class: "meter" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), verdict);
    const stats = NES.stats(view, [{ key: "pl", label: "Power used by the load" }, { key: "lin", label: "Heat in linear regulator" }, { key: "sw", label: "Loss in switching regulator" }]);
    const SW = 0.9;
    function update() {
      const I = load.value / 1000, Pl = vout.value * I;
      const effL = vout.value / vin.value, lossL = (vin.value - vout.value) * I, lossS = Pl / SW - Pl;
      const mw = (p) => (p * 1000).toFixed(p * 1000 < 10 ? 1 : 0) + " mW";
      const row = (label, v, col) => `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${v * 100}%;background:${col}"></div></div><span class="m-val">${(v * 100).toFixed(0)}%</span></div>`;
      meter.innerHTML = row("Linear", effL, effL > 0.8 ? "var(--ok)" : effL > 0.5 ? "var(--warn)" : "var(--bad)") + row("Switching", SW, "var(--ok)") +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">efficiency: share of the input power that reaches the load</span><span></span></div>`;
      stats.set("pl", mw(Pl));
      stats.set("lin", mw(lossL), lossL > Pl ? "bad" : lossL > 0.3 * Pl ? "warn" : "good");
      stats.set("sw", mw(lossS), "good");
      if (effL >= SW) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Small voltage difference.</b> When V<sub>in</sub> is only slightly above V<sub>out</sub>, a simple linear regulator wastes very little and is a perfectly good choice."; }
      else if (lossL > Pl) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>More heat than useful power.</b> The linear regulator burns " + mw(lossL) + " to deliver " + mw(Pl) + ". On a battery, most of the energy would be wasted. A switching regulator is the better fit."; }
      else { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Noticeable loss.</b> The linear regulator throws away " + ((1 - effL) * 100).toFixed(0) + "% of the input power as heat; the switching regulator loses about 10%."; }
    }
    [vin, vout, load].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    "sort-embedded": (el) => labSort(el, SORT_EMBEDDED),
    "sort-washing": (el) => labSort(el, SORT_WASHING),
    "sort-transducers": (el) => labSort(el, SORT_TRANSDUCERS),
    coverage: labCoverage,
    control: labControl,
    rules: labRules,
    placement: labPlacement,
    regulator: labRegulator,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("nes-intro", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
