/* Week 5, Serial Communication: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";
  const hx = (v, n) => "0x" + v.toString(16).toUpperCase().padStart(n || 2, "0");
  const bn = (v, n) => v.toString(2).padStart(n, "0");

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "serial-basics": [
      {
        q: "What makes a link <em>serial</em>?",
        options: [
          ["The bits are sent one after the other over the same wire", true, "Serial means in sequence: bit after bit on one line, each bit encoded as a voltage level (e.g. high = '1', low = '0')."],
          ["Each bit has its own wire, so all bits of a byte travel at the same time", false, "That is parallel communication. Serial uses one data wire and sends the bits one after the other."],
          ["The data is sent as radio waves", false, "Serial communication in this lecture is over a wire. Wireless links come later in the course."],
          ["Every byte is sent twice for safety", false, "Nothing is repeated. Error detection, if any, is done with extra bits such as parity."],
        ],
      },
      {
        q: "On the wire, how is each bit represented in the lecture's example?",
        options: [
          ["By the frequency of a tone", false, "That would be a modulation scheme. Here the bit is simply the voltage level of the wire."],
          ["By the voltage level: high voltage is '1', low voltage is '0'", true, "The transmitter drives the line high or low for each bit, exactly like a GPIO output."],
          ["By the current through the wire only", false, "The receiver reads a voltage level, like a GPIO input."],
          ["By how long the wire stays high, nothing else", false, "Bit duration matters for timing, but the value of each bit is its voltage level."],
        ],
      },
    ],

    timing: [
      {
        q: "A receiver sees the line high, then low, then high, each for the same length of time. Without any timing information, what was sent?",
        options: [
          ["Exactly 101", false, "That is only one valid reading. If each level lasted two bit times, it was 110011."],
          ["Exactly 110011", false, "That is only one valid reading. If each level lasted one bit time, it was 101."],
          ["It cannot be known: both 101 and 110011 (and more) fit the same waveform", true, "Runs of equal bits produce no edges, so the receiver cannot count them without knowing the bit duration. Transmitter and receiver must be synchronised."],
          ["Nothing, because the line changed", false, "Changes on the line are exactly how data is sent. The problem is knowing how many bits each level represents."],
        ],
      },
      {
        q: "What is the general fix for the receiver timing problem?",
        options: [
          ["Use a higher supply voltage", false, "Voltage does not tell the receiver when to read."],
          ["Send every bit twice", false, "Repetition does not reveal the bit duration either."],
          ["Make the receiver read as fast as possible", false, "Reading faster gives more samples, but the receiver still does not know how many samples make one bit."],
          ["Synchronise transmitter and receiver: either agree on the bit rate in advance, or share a clock", true, "Asynchronous serial (UART) agrees on a baud rate and marks each byte with a start bit. Synchronous serial (SPI, I2C) sends a clock signal."],
        ],
      },
    ],

    async: [
      {
        q: "In asynchronous serial, how does the receiver know a byte is starting?",
        options: [
          ["The line goes from its idle '1' to '0': the start bit", true, "The idle line sits at '1'. The falling edge of the start bit marks time zero, and the receiver times the following bits from that edge at the agreed baud rate."],
          ["A separate clock wire starts toggling", false, "There is no clock wire in asynchronous serial. That is what synchronous serial does."],
          ["The transmitter sends the byte's length first", false, "The format (number of data bits, parity, stop bits) is agreed in advance, not sent."],
          ["The line goes from '0' to '1'", false, "The idle state is already '1', so the start is a transition to '0'."],
        ],
      },
      {
        q: "ASCII 'a' is 0x61 = 0b01100001. In 8N1 with the usual bit order, which bits appear on the line (start to stop)?",
        options: [
          ["0 01100001 1", false, "That sends the most significant bit first. UART normally sends the least significant bit (b0) first."],
          ["0 10000110 1", true, "Start bit 0, then b0 to b7 = 1,0,0,0,0,1,1,0 (LSB first), then the stop bit 1. This is the waveform on slide 6."],
          ["1 10000110 0", false, "Start and stop are swapped: the start bit is '0' (leaving idle) and the stop bit is '1' (back to idle)."],
          ["10000110", false, "The start and stop bits are missing. Without them the receiver could not find the frame."],
        ],
      },
      {
        q: "What does 8N1 mean?",
        options: [
          ["8 bits per second, no clock, 1 wire", false, "8N1 describes the frame format, not the rate or the wiring."],
          ["8 devices, no controller, 1 bus", false, "UART is point-to-point. 8N1 is the frame format."],
          ["8 data bits, no parity bit, 1 stop bit", true, "Together with the start bit that makes a 10-bit frame for every byte."],
          ["8 data bits, N = negative logic, 1 start bit", false, "N stands for 'no parity'. There is always exactly one start bit; the 1 is the number of stop bits."],
        ],
      },
    ],

    baud: [
      {
        q: "A link runs at 9600 baud with 8N1 frames. How many data bytes per second can it carry at most?",
        options: [
          ["9600", false, "That would be bits, not bytes, and it ignores the framing bits."],
          ["1200", false, "9600 / 8 = 1200 ignores the start and stop bits."],
          ["800", false, "That would be a 12-bit frame such as 8E2 (start + 8 data + parity + 2 stop). 8N1 is 10 bits."],
          ["960", true, "Each byte needs a 10-bit frame (1 start + 8 data + 1 stop), so 9600 / 10 = 960 bytes per second."],
        ],
      },
      {
        q: "What is the duration of one bit at 9600 baud?",
        options: [
          ["About 104 µs", true, "1 / 9600 s ≈ 104.2 µs. A whole 10-bit 8N1 frame takes about 1.04 ms."],
          ["About 9.6 ms", false, "That mixes up the units. The bit time is the inverse of the baud rate."],
          ["About 1.04 µs", false, "That would be roughly 960 kbaud."],
          ["About 833 µs", false, "That is 8 / 9600 s, the time of 8 bits, not one."],
        ],
      },
      {
        q: "The receiver re-synchronises on each start bit and samples the middle of each bit. Roughly how large can the clock mismatch be before the stop bit of a 10-bit frame is sampled in the wrong place?",
        options: [
          ["About 50%", false, "The error accumulates over the whole frame, so even a small mismatch adds up by the last bit."],
          ["About 5%", true, "The last sample is 9.5 bit times after the start edge and may drift at most half a bit: 0.5 / 9.5 ≈ 5.3%. Real receivers also lose some margin to edge detection, so in practice a few percent."],
          ["Exactly 0%, any mismatch breaks it", false, "Sampling in the middle of each bit gives a margin of half a bit, so small mismatches are fine."],
          ["It does not matter because UART has a clock wire", false, "UART has no clock wire. Both sides rely on their own clocks running at the agreed rate."],
        ],
      },
    ],

    parity: [
      {
        q: "Data bits 1011 0010 (four 1s) are sent with <em>even</em> parity. What is the parity bit?",
        options: [
          ["1", false, "With the parity bit set to 1 there would be five 1s, an odd total."],
          ["It depends on the stop bit", false, "Parity is computed over the data bits only (plus itself)."],
          ["0", true, "There are already four 1s, an even number, so the parity bit is 0 to keep the total even."],
          ["2", false, "The parity bit is a single bit: 0 or 1."],
        ],
      },
      {
        q: "During transmission, two data bits flip. With a single parity bit, what does the receiver conclude?",
        options: [
          ["It detects the error and corrects both bits", false, "Parity cannot correct anything; it does not even say which bit is wrong."],
          ["It detects the error but cannot correct it", false, "Two flips change the number of 1s by an even amount, so the parity still matches."],
          ["It always asks for a retransmission", false, "UART itself has no retransmission mechanism, and here it does not even notice the error."],
          ["Nothing is wrong: two flips keep the parity the same, so the error goes undetected", true, "A parity bit detects any odd number of flipped bits. An even number of flips cancels out. The lecture's guarantee is: one bit flip can be detected."],
        ],
      },
      {
        q: "Why is parity optional rather than always used?",
        options: [
          ["It adds a bit to every frame, slowing transfers, and is mainly worth it on noisy links", true, "An 8E1 frame is 11 bits instead of 10, about 10% slower, in exchange for detecting single-bit errors."],
          ["It only works with RS-232", false, "Parity works with any electrical convention."],
          ["It requires a clock line", false, "Parity is just an extra bit in the frame."],
          ["It is forbidden at high baud rates", false, "There is no such rule."],
        ],
      },
    ],

    duplex: [
      {
        q: "Two devices are connected with two wires: TX of A to RX of B, and RX of A to TX of B. Both talk at the same time. What is this mode called?",
        options: [
          ["Simplex", false, "Simplex is one direction only."],
          ["Full-duplex", true, "With one wire per direction, both devices can transmit and receive simultaneously."],
          ["Half-duplex", false, "Half-duplex means taking turns."],
          ["Bus mode", false, "UART is point-to-point, not a bus."],
        ],
      },
      {
        q: "A common wiring mistake is connecting TX to TX and RX to RX. What happens?",
        options: [
          ["It works, just slower", false, "Nothing ever reaches a receiver: each RX listens to the other RX."],
          ["The baud rate doubles", false, "Wiring does not change the baud rate."],
          ["Two outputs drive the same wire and two inputs listen to a wire nobody drives, so no data gets through", true, "TX must cross over to RX. TX to TX can even make two push-pull outputs fight."],
          ["The devices switch to half-duplex automatically", false, "UART hardware has no such automatic detection."],
        ],
      },
    ],

    electrical: [
      {
        q: "In RS-232, how is a logic '1' represented?",
        options: [
          ["About +12 V", false, "That is RS-232's '0'. RS-232 uses inverted levels."],
          ["0 V", false, "0 V is TTL's '0'. RS-232 avoids 0 V for either level."],
          ["3.3 V", false, "That is a TTL-level '1' on a 3.3 V system."],
          ["About -12 V (a negative voltage)", true, "RS-232: '1' is negative (typically -12 V), '0' is positive (typically +12 V). TTL serial uses 3.3 V or 5 V for '1' and 0 V for '0'."],
        ],
      },
      {
        q: "Your MCU has no free UART peripheral. What does the lecture offer as a fallback?",
        options: [
          ["Software UART (bit-banging): the CPU toggles and reads a GPIO with precise timing", true, "It works, but it is inefficient: the processor must time every bit itself instead of letting the UART hardware build and parse frames."],
          ["Connect the device to the ADC", false, "The ADC measures voltages; it cannot frame or time serial bits."],
          ["Use RS-232 levels instead", false, "That changes the voltages, not who generates the frames."],
          ["It is impossible without a UART", false, "Bit-banging is exactly the workaround."],
        ],
      },
    ],

    cozir: [
      {
        q: "The CozIR sensor uses 9600 baud 8N1. How long does the 3-byte command \"Z\\r\\n\" take on the wire?",
        options: [
          ["About 2.5 ms", false, "That counts only the 8 data bits per byte (24 bits). Each byte also has a start and a stop bit."],
          ["About 3.1 ms", true, "3 bytes x 10 bits = 30 bits; 30 / 9600 ≈ 3.125 ms."],
          ["About 0.3 ms", false, "Check the arithmetic: 30 bits at 9600 bit/s is 3.125 ms."],
          ["About 31 ms", false, "That is ten times too long."],
        ],
      },
      {
        q: "What does \"ASCII-based command interface\" mean for the CozIR?",
        options: [
          ["The data is sent as an analog voltage", false, "The sensor has an optional analog output, but the command interface is serial text."],
          ["The sensor only accepts binary register numbers", false, "That describes register-based interfaces like the SPI and I2C examples later."],
          ["Commands and answers are human-readable text characters, like 'Z' and \"Z 01521\"", true, "Each character is sent as one UART byte. You could even type the commands in a terminal program."],
          ["Every command must be 8 characters long", false, "Commands are short strings ending with \\r\\n."],
        ],
      },
    ],

    "uart-shared": [
      {
        q: "Two UART transmitters are wired to the same line. Why is this dangerous?",
        options: [
          ["It only fails with parity enabled", false, "It fails regardless of the frame format."],
          ["The baud rate halves", false, "The problem is electrical, not about rates."],
          ["UART lines are open-drain, so nothing bad happens", false, "UART TX is push-pull. Open-drain is what I2C uses."],
          ["UART outputs are push-pull: if one drives '1' while the other drives '0', there is a short circuit", true, "This is the two-MCU problem from the MCU I/O lecture: push-pull outputs fighting each other can damage hardware, and the data is garbage anyway."],
        ],
      },
      {
        q: "One transmitter is connected to the RX of two receivers. What happens?",
        options: [
          ["It is electrically safe, but both receivers get everything and the transmitter cannot choose one", true, "Inputs do not fight, so nothing breaks. But UART has no addressing, so this is not proper use of the standard, even if it may work for some applications."],
          ["Short circuit", false, "Two inputs on one line do not drive it, so they cannot short anything."],
          ["Only the first receiver gets the data", false, "Both inputs see the same voltage on the wire."],
          ["The transmitter sends an address first to pick a receiver", false, "UART has no addresses. Addressing is an I2C feature."],
        ],
      },
    ],

    sync: [
      {
        q: "In synchronous serial, who generates the clock?",
        options: [
          ["Each device uses its own clock at an agreed rate", false, "That is asynchronous serial (UART)."],
          ["One device, the controller, generates it and all devices use it", true, "The controller drives the clock line; everyone transmits and receives in step with it."],
          ["The receiver", false, "In general the controller generates the clock, whether it is sending or receiving."],
          ["There is no clock", false, "The clock signal is the defining feature of synchronous serial."],
        ],
      },
      {
        q: "Which is <em>not</em> an advantage of synchronous over asynchronous serial according to the lecture?",
        options: [
          ["No need to pre-agree the baud rate", false, "This is listed: the receiver simply follows the clock."],
          ["No overhead of synchronisation (start/stop) bits", false, "This is listed: the clock edges do the synchronising."],
          ["It needs fewer wires", true, "It needs <em>more</em>: an extra clock line. That is the price paid for the advantages."],
          ["Requires cheaper hardware than a UART", false, "This is listed: a shift register clocked by an edge is simple."],
        ],
      },
    ],

    spi: [
      {
        q: "What does the MISO line carry?",
        options: [
          ["The clock from the controller", false, "That is SCLK."],
          ["The chip-select signal", false, "Chip select is a separate CS line."],
          ["Data from the controller to the peripheral", false, "That is MOSI (Master Out, Slave In)."],
          ["Data from the peripheral to the controller", true, "Master In, Slave Out: the peripheral drives it, the controller reads it."],
        ],
      },
      {
        q: "The controller only wants to send a command byte. What happens on MISO during those 8 clocks?",
        options: [
          ["Still one bit per clock is exchanged on MISO; the controller just ignores those bits", true, "The exchange always happens, even when only one direction carries useful data (the peripheral may send zeros or junk)."],
          ["MISO stays silent because SPI is half-duplex", false, "SPI is full-duplex: every clock moves one bit in each direction."],
          ["The peripheral sends the same byte back", false, "It sends whatever is in its shift register, not necessarily an echo."],
          ["The clock stops", false, "The clock runs for all 8 bits."],
        ],
      },
      {
        q: "Who sets the SPI bit rate?",
        options: [
          ["The peripheral", false, "The peripheral only follows the clock; it must support the chosen frequency."],
          ["The controller, by choosing the SCLK frequency (typically MHz), within what the peripheral supports", true, "Because the clock is shared, the rate is whatever the controller clocks, up to the peripheral's limit."],
          ["It is fixed at 9600", false, "That is a typical UART rate. SPI runs at MHz rates."],
          ["Both must agree in advance like UART", false, "No agreement is needed beyond the peripheral's maximum: the clock tells it when to sample."],
        ],
      },
    ],

    "spi-modes": [
      {
        q: "SPI mode 0 (CPOL = 0, CPHA = 0). When is data read?",
        options: [
          ["On both edges", false, "One edge reads, the other changes the data."],
          ["On the falling edge", false, "In mode 0 data changes on the falling edge and is read on the rising edge."],
          ["On the leading edge, which is a rising edge because the clock idles low", true, "CPOL = 0: idle low, leading edge rising. CPHA = 0: read on the leading edge, change on the trailing (falling) edge."],
          ["Whenever CS goes low", false, "CS only starts the transfer; bits are read on clock edges."],
        ],
      },
      {
        q: "Which mode is CPOL = 1, CPHA = 1?",
        options: [
          ["Mode 0", false, "Mode 0 is CPOL = 0, CPHA = 0."],
          ["Mode 1", false, "Mode 1 is CPOL = 0, CPHA = 1."],
          ["Mode 2", false, "Mode 2 is CPOL = 1, CPHA = 0."],
          ["Mode 3", true, "Mode number = 2·CPOL + CPHA = 3. Clock idles high, data changes on the leading (falling) edge and is read on the trailing (rising) edge."],
        ],
      },
      {
        q: "A peripheral's datasheet says CPHA = CPOL = 0, but your controller is configured for mode 3. What happens?",
        options: [
          ["Bits are sampled at the wrong moments, giving shifted or garbage data", true, "Controller and peripheral then disagree about which edge is for reading, so values come out shifted by a bit or random. Always match the datasheet's mode."],
          ["It works anyway, SPI adapts automatically", false, "SPI has no negotiation; both sides must use the same mode."],
          ["The clock frequency halves", false, "The mode does not change the frequency."],
          ["MISO and MOSI swap", false, "The mode only concerns clock polarity and phase."],
        ],
      },
    ],

    "spi-cs": [
      {
        q: "What does an SPI peripheral do when CS goes from low to high?",
        options: [
          ["Starts a transfer", false, "A high-to-low transition activates the peripheral."],
          ["Puts MISO in Hi-Z and ignores SCLK and MOSI", true, "Deselected, the peripheral releases MISO so other peripherals can use it, and ignores the shared clock and data."],
          ["Resets the controller", false, "CS only affects the peripheral it is connected to."],
          ["Sends its stored byte", false, "Data is only sent while selected (CS low) and clocked."],
        ],
      },
      {
        q: "Why is a pull-up resistor on CS recommended?",
        options: [
          ["It makes the clock faster", false, "CS has nothing to do with clock speed."],
          ["CS is open-drain like I2C", false, "CS is normally a push-pull GPIO output; the pull-up only covers the time before it is configured."],
          ["Many MCUs boot with GPIOs in Hi-Z; the pull-up keeps CS high (deselected) until firmware drives it", true, "A floating CS could randomly select the peripheral, which might then drive MISO or react to noise."],
          ["It saves power while selected", false, "While selected (low), a pull-up actually draws a little current."],
        ],
      },
    ],

    "spi-multi": [
      {
        q: "An SPI controller talks to 4 peripherals, each with its own CS. How many GPIOs does it need?",
        options: [
          ["4", false, "That counts only the CS lines."],
          ["2", false, "That is I2C. SPI needs a CS per peripheral."],
          ["12", false, "SCLK, MOSI and MISO are shared by all peripherals, not repeated."],
          ["7", true, "3 shared lines (SCLK, MOSI, MISO) + 1 CS per peripheral = 3 + 4 = 7."],
        ],
      },
      {
        q: "Why must only one CS be low at a time?",
        options: [
          ["Otherwise two selected peripherals would both drive MISO", true, "All MISO outputs share one wire. Two active peripherals would fight over it, garbling the data and possibly shorting."],
          ["Because the clock can only reach one peripheral", false, "The clock reaches all of them; deselected ones ignore it."],
          ["It is just a convention with no electrical reason", false, "There is a clear electrical reason: the shared MISO line."],
          ["To save GPIOs", false, "Selecting one at a time does not change the pin count."],
        ],
      },
    ],

    "spi-daisy": [
      {
        q: "In a daisy chain of 3 peripherals, the controller wants to update only the third one. What must happen?",
        options: [
          ["It selects only the third peripheral's CS", false, "In a daisy chain all peripherals share one CS and are enabled together."],
          ["It shifts data through the whole chain: 3 bytes, so its byte travels past the first two peripherals", true, "Data moves one peripheral per byte, so reaching the end takes as many bytes as there are peripherals. Everyone must be active even if only one is addressed."],
          ["It sends the byte directly on the third peripheral's MOSI", false, "Only the first peripheral is connected to the controller's MOSI."],
          ["It is impossible", false, "It is possible, just less efficient."],
        ],
      },
      {
        q: "What is the main advantage of a daisy chain?",
        options: [
          ["Peripherals can talk to each other directly", false, "Data only moves around the ring as the controller clocks it."],
          ["Faster transfers to a single peripheral", false, "It is slower to reach a single peripheral, since the data passes through the others."],
          ["Fewer controller pins: one CS for all peripherals", true, "The controller needs SCLK, MOSI, MISO and one CS regardless of how many peripherals are chained."],
          ["No clock is needed", false, "The shared SCLK still drives every shift."],
        ],
      },
    ],

    adxl362: [
      {
        q: "To read the ADXL362's PARTID register (address 0x02), what does the controller send on MOSI?",
        options: [
          ["0x0A, then 0x02", false, "0x0A is the write command."],
          ["0x0D, then 0x02", false, "0x0D is 'read FIFO'."],
          ["0x02 only", false, "The ADXL362 first expects an instruction byte."],
          ["0x0B, then 0x02, then 8 more clocks to receive the value on MISO", true, "Instruction (0x0B = read register), then the register address, then a third byte of clocks during which the sensor shifts out the value (0xF2 for PARTID)."],
        ],
      },
      {
        q: "Which SPI mode does the ADXL362 use, according to its datasheet?",
        options: [
          ["Mode 0 (CPOL = 0, CPHA = 0)", true, "The datasheet states: 'The SPI timing scheme follows CPHA = CPOL = 0'."],
          ["Mode 1", false, "That would be CPHA = 1."],
          ["Mode 3", false, "That would be CPOL = 1, CPHA = 1."],
          ["It uses I2C, not SPI", false, "The slide shows a 4-wire SPI connection."],
        ],
      },
    ],

    i2c: [
      {
        q: "An I2C bus runs at V<sub>S</sub> = 5 V with 5 kΩ pull-ups. How much power does one pull-up dissipate while its line is held at '0'?",
        options: [
          ["1 mW", false, "1 mA is the current. Power is V · I = 5 V · 1 mA = 5 mW."],
          ["5 mW", true, "The full 5 V is across the resistor: P = V²/R = 25 / 5000 = 5 mW (1 mA of current)."],
          ["25 mW", false, "That forgets to divide by the resistance correctly: 25 V² / 5000 Ω = 0.005 W."],
          ["0 mW, the line is at 0 V", false, "The line is at 0 V but the resistor still has 5 V across it."],
        ],
      },
      {
        q: "How does an I2C device send a '1'?",
        options: [
          ["It drives the line to V<sub>S</sub> with a push-pull output", false, "I2C outputs are open-drain; they can never drive high."],
          ["It sends a short pulse", false, "The bit is a level held while the clock is high."],
          ["It disables its output and lets the pull-up resistor raise the line", true, "Open-drain: '0' is actively pulled to GND, '1' is 'let go'. That makes sharing the bus safe."],
          ["It pulls the line to GND", false, "That is how it sends a '0'."],
        ],
      },
      {
        q: "Why is I2C slower than SPI?",
        options: [
          ["Because it is asynchronous", false, "I2C is synchronous: SCL is the clock."],
          ["It uses fewer bits per byte", false, "It actually adds an ACK bit per byte."],
          ["Its clock is generated by the target", false, "The controller generates the clock."],
          ["Its open-drain lines rise slowly through the pull-up resistors, limiting the clock to about 100 to 400 kHz", true, "Push-pull outputs (SPI) drive both edges hard; open-drain rising edges are an RC charge through the pull-up."],
        ],
      },
    ],

    "i2c-addressing": [
      {
        q: "With 7-bit addresses, why does the lecture say 'up to 112' targets instead of 128?",
        options: [
          ["Some addresses are reserved for special purposes", true, "2⁷ = 128 addresses, of which 16 are reserved, leaving 112 for targets."],
          ["One bit is used for parity", false, "The eighth bit of the address frame is R/W, not part of the 7-bit address."],
          ["Each target uses two addresses", false, "Each target uses one address; R/W is a separate bit."],
          ["The bus capacitance limits it to 112", false, "Capacitance does limit real buses, but the 112 comes from reserved addresses."],
        ],
      },
      {
        q: "A sensor has address 0b011010x, where x is read from its ADR pin. One chip has ADR tied to V<sub>S</sub>, the other to GND. Their addresses?",
        options: [
          ["Both 0b0110100", false, "Then they would clash. The ADR pin exists precisely to make them differ."],
          ["0b0110101 and 0b0110100", true, "ADR to V<sub>S</sub> gives x = 1, ADR to GND gives x = 0. Two different addresses, so both chips can share the bus."],
          ["0b1110100 and 0b0110100", false, "The configurable bit is the last one (x), not the first."],
          ["They need a chip select instead", false, "I2C replaces chip select with addresses."],
        ],
      },
    ],

    "addr-frame": [
      {
        q: "To <em>read</em> from the target at 7-bit address 0x35 (0b0110101), which address byte does the controller send?",
        options: [
          ["0x35", false, "That is the bare 7-bit address. The byte on the wire is the address shifted left plus the R/W bit."],
          ["0x6A", false, "0x6A is the write version (R/W = 0)."],
          ["0x6B", true, "0b0110101 followed by R/W = 1 gives 0b01101011 = 0x6B. (Write would be 0x6A.)"],
          ["0xB5", false, "That puts the R/W bit at the front. It goes at the end, after a0."],
        ],
      },
      {
        q: "A target sees an address frame that does not match its own address. What does it do?",
        options: [
          ["It answers with NACK", false, "It stays completely silent; a NACK is just the absence of any target pulling SDA low."],
          ["It changes its address", false, "Addresses are fixed or set by pins, not changed at run time by this."],
          ["It reports an error to the controller", false, "There is no error signalling from non-addressed targets."],
          ["It ignores the rest of the transaction", true, "Only the target whose address matches responds. Others wait for the next start condition."],
        ],
      },
    ],

    "start-ack": [
      {
        q: "What is an I2C start condition?",
        options: [
          ["SDA goes low while SCL is high", true, "Normally SDA only changes while SCL is low. A change while SCL is high is special: falling = start, rising = stop."],
          ["SCL goes low while SDA is high", false, "That is just a normal clock edge."],
          ["The controller sends the byte 0x00", false, "Start is a signal pattern, not a byte."],
          ["Both lines go high", false, "That is the idle state (or the end of a stop condition)."],
        ],
      },
      {
        q: "After the address frame, nobody pulls SDA low during the ACK clock. What does the controller learn?",
        options: [
          ["The transfer succeeded", false, "A successful reception is signalled by pulling SDA low (ACK)."],
          ["No target acknowledged: an error, e.g. no device with that address", true, "The pull-up keeps SDA high, which reads as NACK. Slide 27's example 2 shows exactly this."],
          ["The target wants to read", false, "Read/write is the bit before ACK, sent by the controller."],
          ["The bus is in clock stretching", false, "Clock stretching is done on SCL, not SDA."],
        ],
      },
    ],

    "data-stop": [
      {
        q: "The controller reads one byte from a target. Who sends the bit after that data byte, and what is it?",
        options: [
          ["The target sends ACK (0)", false, "When reading, the target sends the data and the controller acknowledges."],
          ["Nobody, the stop comes immediately", false, "Every byte is followed by an acknowledgement bit."],
          ["The controller sends NACK (1) to say it wants to stop", true, "The receiver of each byte acknowledges. For the last byte of a read, the controller sends NACK, then the stop condition."],
          ["The controller sends ACK (0)", false, "ACK would ask the target for another byte."],
        ],
      },
      {
        q: "How many clock pulses does one I2C data frame take?",
        options: [
          ["8", false, "The 8 data bits are followed by an acknowledgement bit."],
          ["16", false, "One byte only takes 9 clocks."],
          ["10", false, "Unlike UART there are no start and stop bits per byte."],
          ["9", true, "8 data bits + 1 ACK/NACK bit."],
        ],
      },
    ],

    "clock-stretch": [
      {
        q: "On an open-drain line, one device lets go ('1') while another pulls low ('0'). What is the line?",
        options: [
          ["'0', and nothing is damaged", true, "'0' always wins on an open-drain bus. There is no short because nobody drives high."],
          ["'1'", false, "The pull-up can only raise the line if nobody pulls it down."],
          ["A short circuit", false, "Open-drain cannot short: no device ever connects the line to V<sub>S</sub>."],
          ["Undefined", false, "The pulling device defines it as '0'."],
        ],
      },
      {
        q: "What is clock stretching?",
        options: [
          ["The controller slows the clock when the bus is long", false, "Stretching is done by the target, not the controller."],
          ["A target holds SCL low to make the controller wait until it is ready", true, "The controller cannot create the next high clock phase while SCL is held at '0'. The target 'stops time' to finish processing."],
          ["Sending two bits per clock", false, "That would speed things up, not pause them."],
          ["Repeating the start condition", false, "That is a repeated start, a different feature."],
        ],
      },
    ],

    arbitration: [
      {
        q: "Two controllers start at the same moment, addressing 0b0110101 and 0b0111000. Which one wins arbitration?",
        options: [
          ["Neither, both back off", false, "Only the controller that detects the mismatch backs off; the other continues undisturbed."],
          ["The one sending 0b0111000", false, "At the first differing bit it sends '1' but reads '0', so it loses."],
          ["The one sending 0b0110101", true, "They agree on 0, 1, 1. At the fourth bit one sends 0 and the other 1; '0' wins, so the controller sending 1 sees a mismatch and backs off."],
          ["The bus shorts", false, "Open-drain cannot short; that is why multi-controller I2C works."],
        ],
      },
      {
        q: "How does a controller detect that it has lost arbitration?",
        options: [
          ["The clock stops", false, "Clock stretching is separate from arbitration."],
          ["It receives a NACK", false, "NACK comes from targets after a full byte; arbitration is decided bit by bit."],
          ["The other controller sends it a message", false, "Controllers do not message each other; they just watch the bus."],
          ["It sends '1' (lets go) but reads the line as '0'", true, "While transmitting a '1' it monitors SDA. If the line is '0', somebody else is active, so it stops."],
        ],
      },
    ],

    "repeated-start": [
      {
        q: "Why use a repeated start instead of a stop followed by a new start?",
        options: [
          ["It keeps the bus: other controllers wait for a stop condition, so nobody can jump in between the two transactions", true, "Back-to-back transactions (such as 'write register address, then read value') stay together."],
          ["It is required after every byte", false, "It is only used between transactions."],
          ["It resets the target", false, "It simply begins a new address frame."],
          ["It doubles the clock frequency", false, "It does not affect the clock rate."],
        ],
      },
      {
        q: "How is a repeated start generated?",
        options: [
          ["By sending the byte 0xFF", false, "Start conditions are line patterns, not bytes."],
          ["SDA and SCL are raised high without a stop condition, then SDA is pulled low while SCL is high", true, "SDA rises first while SCL is low (so it is not a stop), SCL rises, and then SDA falls while SCL is high: a new start condition."],
          ["By holding SCL low for a long time", false, "That is clock stretching."],
          ["By NACKing the last byte", false, "A NACK precedes a stop when reading, but is not itself a start."],
        ],
      },
    ],

    "register-rw": [
      {
        q: "How many bytes does the slide's 'read register from target' transaction contain?",
        options: [
          ["2", false, "Address and value alone would not tell the target which register."],
          ["3", false, "3 bytes is the write transaction."],
          ["4", true, "Target address (W), register address, then after a repeated start target address (R) and the register value."],
          ["5", false, "Start, repeated start and stop are conditions, not bytes."],
        ],
      },
      {
        q: "Why does a register <em>read</em> start with a <em>write</em>?",
        options: [
          ["To wake up the target", false, "The address frame and ACK already confirm the target is listening."],
          ["Because I2C cannot read", false, "It can; the R/W bit selects read."],
          ["To clear the register first", false, "Nothing is written into the register itself, only its address is sent."],
          ["To tell the target which register address should be read next", true, "The controller writes the register address (the pointer), then restarts in read mode and the target returns that register's value."],
        ],
      },
    ],

    tmp1075: [
      {
        q: "The TMP1075 address is 10010xx, with xx configurable. How many TMP1075 sensors can share one bus?",
        options: [
          ["4", true, "xx can be 00, 01, 10 or 11: addresses 0x48 to 0x4B."],
          ["2", false, "Two configurable bits give four combinations."],
          ["1", false, "The configurable bits exist to allow several."],
          ["112", false, "112 is the whole 7-bit address space minus reserved addresses, not this sensor's options."],
        ],
      },
      {
        q: "In the TMP1075 register map, what is register 01h (CFGR)?",
        options: [
          ["The temperature result, read-only", false, "That is 00h, TEMP."],
          ["The configuration register, readable and writable, reset value 00FFh", true, "CFGR is R/W and configures how the sensor behaves."],
          ["The device ID register", false, "That is 0Fh, DIEID."],
          ["The high limit", false, "That is 03h, HLIM."],
        ],
      },
    ],

    summary: [
      {
        q: "Which bus supports several controllers on the same lines?",
        options: [
          ["UART", false, "UART is point-to-point with no controllers at all."],
          ["SPI", false, "Only one device can be the SPI controller."],
          ["I2C", true, "Thanks to open-drain lines and arbitration, multiple controllers can share an I2C bus."],
          ["None of them", false, "I2C does."],
        ],
      },
      {
        q: "You need to stream data fast from one ADC chip and have plenty of GPIOs. Which bus fits best?",
        options: [
          ["I2C, because it needs only 2 pins", false, "Pin count is not the constraint here, and I2C is limited to about 100 to 400 kbps."],
          ["RS-232", false, "RS-232 is an electrical convention for UART, not a faster bus."],
          ["UART at 9600 baud", false, "Far too slow for streaming, and it has 2 to 4 framing bits per byte."],
          ["SPI: 1 to 20 Mbps, full-duplex, no protocol overhead", true, "SPI is the fastest of the three and wastes no bits on framing or ACKs."],
        ],
      },
      {
        q: "Why does I2C rank worst for energy in the summary table?",
        options: [
          ["Every '0' bit draws current through a pull-up resistor", true, "Open-drain lines waste power (V²/R per line) whenever they are held low; push-pull lines do not."],
          ["Its clock is the fastest", false, "It is the slowest of the synchronous buses."],
          ["It uses RS-232 voltages", false, "I2C uses logic levels."],
          ["It has no sleep mode", false, "Sleep modes are a property of the devices, not of the bus."],
        ],
      },
    ],

    i3c: [
      {
        q: "How does I3C reach clock rates up to 12.5 MHz while staying I2C-like?",
        options: [
          ["It adds a chip-select line", false, "That would make it SPI. I3C keeps two wires."],
          ["It switches SDA from open-drain to push-pull whenever possible, after the start condition", true, "Push-pull edges are fast, removing the pull-up bottleneck once arbitration is no longer needed."],
          ["It uses RS-232 voltages", false, "I3C uses logic levels."],
          ["It removes the clock line", false, "The primary controller still drives the clock."],
        ],
      },
      {
        q: "Which I2C feature does I3C <em>not</em> support?",
        options: [
          ["Addressing", false, "I3C still addresses targets."],
          ["A controller that generates the clock", false, "The primary controller controls the clock."],
          ["Clock stretching", true, "Clock stretching and 10-bit addresses are not supported in I3C."],
          ["Pull-up resistors", false, "Pull-ups exist, but they are provided by the I3C controller."],
        ],
      },
    ],
  };

  /* =====================================================================
     Shared helpers
     ===================================================================== */
  const C = (v) => NES.css(v);
  const font = (ctx, px, bold) => (ctx.font = (bold ? "bold " : "") + px + "px " + C("--font"));

  // UART frame: [{label, v, kind}]
  function uartFrame(byte, nData, parity, nStop) {
    const bits = [{ label: "start", v: 0, kind: "start" }];
    let ones = 0;
    for (let i = 0; i < nData; i++) { const v = (byte >> i) & 1; ones += v; bits.push({ label: "b" + i, v, kind: "data" }); }
    if (parity === "even") bits.push({ label: "p", v: ones % 2, kind: "parity" });
    if (parity === "odd") bits.push({ label: "p", v: 1 - (ones % 2), kind: "parity" });
    for (let i = 0; i < nStop; i++) bits.push({ label: "stop", v: 1, kind: "stop" });
    return bits;
  }

  // draw a step trace from segments [[t0, t1, v]], v = 0/1 (or a voltage when Y handles it)
  function trace(ctx, segs, X, Y, color, lw, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2; ctx.setLineDash(dash || []);
    ctx.beginPath();
    segs.forEach(([a, b, v], i) => { const y = Y(v); if (!i) ctx.moveTo(X(a), y); else ctx.lineTo(X(a), y); ctx.lineTo(X(b), y); });
    ctx.stroke(); ctx.setLineDash([]);
  }

  // labelled hexagon cells like the slides' timing diagrams
  function cells(ctx, list, X, yMid, half, opts) {
    font(ctx, (opts && opts.size) || 11, true);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    list.forEach((c) => {
      const a = X(c.a), b = X(c.b), e = Math.min(5, (b - a) / 4);
      ctx.beginPath();
      ctx.moveTo(a, yMid); ctx.lineTo(a + e, yMid - half); ctx.lineTo(b - e, yMid - half); ctx.lineTo(b, yMid); ctx.lineTo(b - e, yMid + half); ctx.lineTo(a + e, yMid + half); ctx.closePath();
      if (c.fill) { ctx.fillStyle = c.fill; ctx.globalAlpha = 0.22; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.strokeStyle = c.stroke || C("--line-2"); ctx.lineWidth = 1.2; ctx.stroke();
      if (b - a > 9) { ctx.fillStyle = c.color || C("--ink"); ctx.fillText(c.label, (a + b) / 2, yMid + 0.5); }
    });
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  function label(ctx, txt, x, y, color, px, bold) { font(ctx, px || 11, bold); ctx.fillStyle = color || C("--muted"); ctx.fillText(txt, x, y); }

  // a row of bit cells (HTML), cells: [{t, cls, title}]
  function bitLine(name, list) {
    return `<div class="bitrow-line"><span class="bitrow-label">${name}</span><div class="bits" style="grid-template-columns:repeat(${list.length},minmax(0,1fr))">${list.map((c) => `<span class="${c.cls || ""}"${c.title ? ` title="${c.title}"` : ""}>${c.t}</span>`).join("")}</div></div>`;
  }

  const canvas = (hgt, aria) => h("canvas", { style: "height:" + hgt + "px", "aria-label": aria });
  const stage = (child) => h("div", { class: "stage" }, [child]);
  const trimNum = (x, d) => { const t = x.toFixed(d); return t.indexOf(".") === -1 ? t : t.replace(/0+$/, "").replace(/\.$/, ""); };
  const fmtTime = (s) => (s >= 1 ? trimNum(s, 2) + " s" : s >= 1e-3 ? trimNum(s * 1e3, s >= 0.1 ? 0 : 3) + " ms" : s >= 1e-6 ? trimNum(s * 1e6, 1) + " µs" : trimNum(s * 1e9, 0) + " ns");
  const charName = (v) => (v === 13 ? "\\r" : v === 10 ? "\\n" : v === 32 ? "space" : v >= 33 && v < 127 ? "'" + String.fromCharCode(v) + "'" : "-");

  /* =====================================================================
     LAB: timing the receiver
     ===================================================================== */
  function labRxSample(el) {
    const { controls, view } = NES.lab(el, {
      title: "Same waveform, different readings",
      hint: "The line goes high, low, high for equal times. The transmitter knows its bit time; the receiver has to guess. Change what the transmitter meant, then change how often the receiver reads.",
    });
    const meant = NES.seg(controls, { label: "Transmitter meant", options: [[1, "110011"], [2, "101"]], value: 1 });
    const rx = NES.slider(controls, { label: "Receiver reads every", min: 0.5, max: 3, step: 0.25, value: 1, fmt: (v) => v + " slot" + (v === 1 ? "" : "s") });
    controls.append(h("p", { class: "lab-hint", html: "One slot is half the length of each level. The waveform never changes: only the interpretation does." }));
    const cv = canvas(170, "Received waveform with sample points");
    view.append(stage(cv));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    // waveform: high [0,2), low [2,4), high [4,6) in slot units
    const level = (t) => (t < 2 || t >= 4 ? 1 : 0);
    let samples = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 40, padR = 10, X = (t) => padL + ((t + 0.5) / 7) * (w - padL - padR), Y = (v) => (v ? 30 : 110);
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1;
      for (let s = 0; s <= 6; s++) { ctx.beginPath(); ctx.moveTo(X(s), 18); ctx.lineTo(X(s), 125); ctx.stroke(); }
      trace(ctx, [[-0.5, 0, 1], [0, 2, 1], [2, 4, 0], [4, 6, 1], [6, 6.5, 1]], X, Y, C("--tech"), 2.4);
      samples.forEach((t, k) => { ctx.fillStyle = C("--accent"); ctx.beginPath(); ctx.arc(X(t), Y(level(t)), 5, 0, 7); ctx.fill(); label(ctx, String(k + 1), X(t) - 3, 145, C("--accent"), 11, true); });
      label(ctx, "V", 10, 34, C("--muted"), 12, true); label(ctx, "high", 8, Y(1) + 16); label(ctx, "low", 8, Y(0) + 4);
      label(ctx, "samples:", 8, 145);
    });
    function update() {
      const step = rx.value;
      samples = [];
      for (let t = step / 2; t < 6; t += step) samples.push(t);
      const got = samples.map(level).join("");
      const sent = meant.value === 1 ? "110011" : "101";
      const tx = sent.split("").map((b) => ({ t: b, cls: "b" + b }));
      const rcv = got.split("").map((b, i) => ({ t: b, cls: got === sent ? "b" + b : sent[i] === b ? "b" + b : "err" }));
      rows.innerHTML = bitLine("Meant", tx) + bitLine("Read", rcv);
      const ok = got === sent;
      verdict.className = "verdict " + (ok ? "good" : "bad");
      verdict.innerHTML = ok
        ? "<b>Correct, by luck of agreement.</b> The receiver's reading interval matches the transmitter's bit time, so it reads " + got + "."
        : "<b>Wrong reading: " + got + ".</b> The waveform is identical in both cases. Without knowing the bit time the receiver cannot tell " + sent + " from " + got + ".";
      draw();
    }
    meant.onchange = rx.onchange = update;
    rx.set(1); update();
  }

  /* =====================================================================
     LAB: UART frame builder
     ===================================================================== */
  function drawUart(ctx, w, hh, bits, opts) {
    const o = opts || {};
    const n = bits.length, padL = 34, padR = 8;
    const X = (t) => padL + ((t + 1) / (n + 2)) * (w - padL - padR);
    const yHi = o.yHi || 26, yLo = o.yLo || 74;
    const Y = (v) => (v ? yHi : yLo);
    ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1;
    for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(X(i), 12); ctx.lineTo(X(i), yLo + 44); ctx.stroke(); }
    const segs = [[-1, 0, 1]].concat(bits.map((b, i) => [i, i + 1, b.v]), [[n, n + 1, 1]]);
    trace(ctx, segs, X, Y, C("--tech"), 2.4);
    const col = { start: C("--lo"), stop: C("--hi"), parity: C("--warn"), data: C("--ink-2") };
    cells(ctx, bits.map((b, i) => ({ a: i, b: i + 1, label: b.label === "start" ? "S" : b.label === "stop" ? "P" : b.label, fill: col[b.kind], color: C("--ink") })), X, yLo + 26, 10, { size: 10 });
    label(ctx, "V", 8, yHi + 4, C("--muted"), 12, true);
    label(ctx, "idle", X(-1) + 2, yHi - 6); label(ctx, "idle", X(n) + 2, yHi - 6);
    if (o.marks) o.marks.forEach((m) => { ctx.fillStyle = m.ok ? C("--ok") : C("--bad"); ctx.beginPath(); ctx.arc(X(m.t - 0), Y(m.v), 4.5, 0, 7); ctx.fill(); });
    return X;
  }

  function labFrame(el) {
    const { controls, view } = NES.lab(el, {
      title: "Build a UART frame",
      hint: "Pick a byte and a format. The line idles high, the start bit pulls it low, the data goes out least significant bit first, then optional parity and the stop bit(s).",
    });
    const byte = NES.slider(controls, { label: "Byte", min: 0, max: 255, step: 1, value: 0x61, fmt: (v) => hx(v) + " " + charName(v) });
    const nd = NES.seg(controls, { label: "Data bits", options: [[7, "7"], [8, "8"]], value: 8 });
    const par = NES.seg(controls, { label: "Parity", options: [["none", "None"], ["even", "Even"], ["odd", "Odd"]], value: "none" });
    const ns = NES.seg(controls, { label: "Stop bits", options: [[1, "1"], [2, "2"]], value: 1 });
    const baud = NES.seg(controls, { label: "Baud rate", options: [[9600, "9600"], [115200, "115200"]], value: 9600 });
    const cv = canvas(140, "UART frame waveform");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--lo);height:8px"></i>start</span><span><i style="background:var(--ink-2);height:8px"></i>data (b0 first)</span><span><i style="background:var(--warn);height:8px"></i>parity</span><span><i style="background:var(--hi);height:8px"></i>stop</span>` }));
    const seq = h("div", { class: "codebar-title" });
    view.append(seq);
    const stats = NES.stats(view, [{ key: "fmt", label: "Format" }, { key: "bits", label: "Bits per frame" }, { key: "eff", label: "Payload share" }, { key: "bps", label: "Max bytes / s" }]);
    let bits = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => drawUart(ctx, w, hh, bits));
    function update() {
      const v = nd.value === 7 ? byte.value & 0x7f : byte.value;
      bits = uartFrame(v, nd.value, par.value, ns.value);
      const n = bits.length;
      seq.innerHTML = "On the wire: <code>" + bits.map((b) => b.v).join(" ") + "</code>" + (nd.value === 7 && byte.value > 127 ? " (bit 7 is dropped with 7 data bits)" : "");
      stats.set("fmt", nd.value + (par.value === "none" ? "N" : par.value === "even" ? "E" : "O") + ns.value);
      stats.set("bits", String(n));
      stats.set("eff", ((nd.value / n) * 100).toFixed(0) + "%");
      stats.set("bps", (baud.value / n).toFixed(0), "good");
      draw();
    }
    [byte, nd, par, ns, baud].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: clock mismatch drift
     ===================================================================== */
  function labDrift(el) {
    const { controls, view } = NES.lab(el, {
      title: "When the clocks disagree",
      hint: "The receiver starts its timer on the falling edge of the start bit and samples the middle of each bit using its <em>own</em> idea of the bit time. Make its clock a few percent off and watch the samples drift.",
    });
    const err = NES.slider(controls, { label: "Receiver bit time error", min: -10, max: 10, step: 0.1, value: 3, fmt: (v) => (v > 0 ? "+" : "") + v.toFixed(1) + "%" });
    const byte = NES.slider(controls, { label: "Byte (8N1)", min: 0, max: 255, step: 1, value: 0x55, fmt: (v) => hx(v) + " " + charName(v) });
    controls.append(h("p", { class: "lab-hint", html: "Dots: green if the sample lands inside the bit it is meant to read, red if it has slipped into a neighbour." }));
    const cv = canvas(140, "Sampling drift plot");
    view.append(stage(cv));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "in", label: "Samples in the right bit" }, { key: "got", label: "Decoded byte" }, { key: "tol", label: "Tolerance (10-bit frame)" }]);
    let bits = [], marks = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => drawUart(ctx, w, hh, bits, { marks }));
    function update() {
      bits = uartFrame(byte.value, 8, "none", 1);
      const d = err.value / 100;
      marks = bits.map((b, k) => {
        const t = (k + 0.5) * (1 + d);
        const idx = Math.floor(t);
        const v = idx >= 0 && idx < bits.length ? bits[idx].v : 1;
        return { t, v, ok: idx === k };
      });
      const okN = marks.filter((m) => m.ok).length;
      let got = 0; for (let i = 0; i < 8; i++) got |= marks[i + 1].v << i;
      const framing = marks[9].v !== 1;
      rows.innerHTML = bitLine("Sent", bits.map((b) => ({ t: b.v, cls: "b" + b.v }))) + bitLine("Sampled", marks.map((m, i) => ({ t: m.v, cls: m.v !== bits[i].v ? "err" : "b" + m.v })));
      stats.set("in", okN + " / 10", okN === 10 ? "good" : "bad");
      stats.set("got", hx(got) + (framing ? " (framing error)" : ""), got === byte.value && !framing ? "good" : "bad");
      stats.set("tol", "±" + ((0.5 / 9.5) * 100).toFixed(1) + "%");
      if (okN === 10) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Received correctly.</b> The last sample is " + (9.5 * Math.abs(d)).toFixed(2) + " bit times away from the middle of the stop bit, less than the 0.5 allowed."; }
      else if (got === byte.value && !framing) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Lucky.</b> Some samples read the wrong bit, but the neighbouring bits happened to have the same value. A different byte would break."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Corrupted.</b> The error accumulates: after k bits the sample is off by k · " + Math.abs(err.value).toFixed(1) + "% of a bit, and by the end it has slipped into the wrong bit." + (framing ? " The stop bit was read as 0: a framing error." : ""); }
      draw();
    }
    err.onchange = byte.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: parity check
     ===================================================================== */
  function labParity(el) {
    const { controls, view } = NES.lab(el, {
      title: "Flip bits in transit",
      hint: "The transmitter adds a parity bit. Click bits in the 'Received' row to simulate noise flipping them, and see whether the receiver notices.",
    });
    const byte = NES.slider(controls, { label: "Data byte", min: 0, max: 255, step: 1, value: 0x61, fmt: (v) => hx(v) + " " + charName(v) });
    const mode = NES.seg(controls, { label: "Parity", options: [["even", "Even"], ["odd", "Odd"]], value: "even" });
    const clear = h("button", { class: "btn", type: "button", text: "Clear flips" });
    controls.append(clear);
    const box = h("div", { class: "bitrow" });
    const flipRow = h("div", { class: "bitrow-line" }, [h("span", { class: "bitrow-label", text: "Received" })]);
    const flipBits = h("div", { class: "bits flip-bits", style: "grid-template-columns:repeat(9,minmax(0,1fr))" });
    flipRow.append(flipBits);
    const txRow = h("div");
    view.append(box);
    box.append(txRow, flipRow);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "tx", label: "1s sent (data + p)" }, { key: "rx", label: "1s received" }, { key: "flips", label: "Bits flipped" }]);
    let flips = new Set();
    const buttons = [];
    for (let i = 0; i < 9; i++) {
      const b = h("button", { type: "button", class: "flip", "aria-label": "Flip bit " + (i < 8 ? "b" + i : "p") });
      b.addEventListener("click", () => { flips.has(i) ? flips.delete(i) : flips.add(i); update(); });
      buttons.push(b); flipBits.append(b);
    }
    clear.addEventListener("click", () => { flips = new Set(); update(); });
    function update() {
      const fr = uartFrame(byte.value, 8, mode.value, 1).slice(1, 10); // b0..b7, p
      const sent = fr.map((b) => b.v);
      const recv = sent.map((v, i) => (flips.has(i) ? 1 - v : v));
      txRow.innerHTML = bitLine("Sent", fr.map((b, i) => ({ t: b.v, cls: i === 8 ? "par" : "b" + b.v, title: b.label })));
      buttons.forEach((b, i) => { b.textContent = recv[i]; b.className = "flip" + (flips.has(i) ? " flipped" : "") + (i === 8 ? " par" : ""); b.title = i < 8 ? "b" + i : "parity"; });
      const onesTx = sent.reduce((a, b) => a + b, 0), onesRx = recv.reduce((a, b) => a + b, 0);
      const want = mode.value === "even" ? 0 : 1;
      const okParity = onesRx % 2 === want;
      stats.set("tx", String(onesTx) + (onesTx % 2 ? " (odd)" : " (even)"));
      stats.set("rx", String(onesRx) + (onesRx % 2 ? " (odd)" : " (even)"), okParity ? "" : "bad");
      stats.set("flips", String(flips.size), flips.size ? "warn" : "");
      if (!flips.size) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Parity OK, data OK.</b> The parity bit is " + sent[8] + ", making the total number of 1s " + (want ? "odd" : "even") + "."; }
      else if (!okParity) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Error detected.</b> " + flips.size + " bit" + (flips.size > 1 ? "s" : "") + " flipped, an odd number, so the count of 1s no longer matches. The receiver knows the frame is bad, but not which bit."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Error NOT detected.</b> " + flips.size + " bits flipped, an even number, so the parity still matches. Parity only guarantees catching a single flip."; }
    }
    byte.onchange = mode.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: TTL vs RS-232 levels
     ===================================================================== */
  function labLevels(el) {
    const { controls, view } = NES.lab(el, {
      title: "One frame, two electrical conventions",
      hint: "The same 8N1 frame drawn as TTL serial and as RS-232. Same bits, very different voltages, and the RS-232 picture is upside down.",
    });
    const byte = NES.slider(controls, { label: "Byte (8N1)", min: 0, max: 255, step: 1, value: 0x61, fmt: (v) => hx(v) + " " + charName(v) });
    const vcc = NES.seg(controls, { label: "TTL supply", options: [[3.3, "3.3 V"], [5, "5 V"]], value: 3.3 });
    const cv = canvas(250, "TTL and RS-232 waveforms");
    view.append(stage(cv));
    const stats = NES.stats(view, [{ key: "t1", label: "TTL '1' / '0'" }, { key: "r1", label: "RS-232 '1' / '0'" }, { key: "swing", label: "RS-232 swing" }]);
    const verdict = h("div", { class: "verdict warn", html: "<b>Never wire RS-232 straight to an MCU pin.</b> ±12 V is far outside a 3.3 V GPIO's range. A level-converter chip translates between the two conventions." });
    view.append(verdict);
    let bits = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const n = bits.length, padL = 54, padR = 8;
      const X = (t) => padL + ((t + 1) / (n + 2)) * (w - padL - padR);
      const segs = [[-1, 0, 1]].concat(bits.map((b, i) => [i, i + 1, b.v]), [[n, n + 1, 1]]);
      // TTL panel
      const v = vcc.value;
      const Yt = (b) => 95 - (b ? v : 0) * (70 / 5);
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1;
      [0, v].forEach((vv) => { const y = 95 - vv * 14; ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke(); label(ctx, vv + " V", 6, y + 4); });
      trace(ctx, segs, X, Yt, C("--tech"), 2.4);
      label(ctx, "TTL", padL + 4, 16, C("--tech"), 12, true);
      // RS-232 panel
      const Yr = (b) => 185 - (b ? -12 : 12) * 4;
      [12, 0, -12].forEach((vv) => { const y = 185 - vv * 4; ctx.strokeStyle = C("--grid"); ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(w - padR, y); ctx.stroke(); label(ctx, (vv > 0 ? "+" : "") + vv + " V", 6, y + 4); });
      trace(ctx, segs, X, Yr, C("--hi"), 2.4);
      label(ctx, "RS-232", padL + 4, 130, C("--hi"), 12, true);
      font(ctx, 10, true); ctx.textAlign = "center";
      bits.forEach((b, i) => { ctx.fillStyle = C("--muted"); ctx.fillText(b.label === "start" ? "S" : b.label === "stop" ? "P" : b.v, (X(i) + X(i + 1)) / 2, 116); });
      ctx.textAlign = "start";
    });
    function update() {
      bits = uartFrame(byte.value, 8, "none", 1);
      stats.set("t1", vcc.value + " V / 0 V");
      stats.set("r1", "-12 V / +12 V", "warn");
      stats.set("swing", "24 V");
      draw();
    }
    byte.onchange = vcc.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: talk to the CozIR
     ===================================================================== */
  function labCozir(el) {
    const { controls, view } = NES.lab(el, {
      title: "Ask the CozIR for the CO" + sub("2") + " level",
      hint: "The MCU sends the text command \"Z\\r\\n\" at 9600 baud, 8N1. The sensor answers with \"Z #####\\r\\n\", the CO" + sub("2") + " concentration in ppm. Every character is one UART frame.",
    });
    const ppm = NES.slider(controls, { label: "Actual CO<sub>2</sub>", min: 300, max: 5000, step: 1, value: 1521, fmt: (v) => v + " ppm" });
    const baud = NES.seg(controls, { label: "Baud rate", options: [[9600, "9600 (sensor's)"], [19200, "19200"]], value: 9600 });
    const req = h("div", { class: "table-wrap" });
    const resp = h("div", { class: "table-wrap" });
    view.append(h("div", { class: "codebar-title", text: "MCU → sensor (TX of MCU to Rx_In of sensor)" }), req, h("div", { class: "codebar-title", text: "Sensor → MCU (Tx_Out of sensor to RX of MCU)" }), resp);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "rq", label: "Request time" }, { key: "rs", label: "Response time" }, { key: "val", label: "Parsed value" }]);
    const table = (str) => {
      const codes = str.split("").map((c) => c.charCodeAt(0));
      return `<table class="tt"><thead><tr><th>char</th>${codes.map((c) => `<td>${charName(c).replace(/'/g, "")}</td>`).join("")}</tr></thead><tbody><tr><th>hex</th>${codes.map((c) => `<td>${c.toString(16).toUpperCase().padStart(2, "0")}</td>`).join("")}</tr><tr><th>wire</th>${codes.map((c) => `<td class="mono-sm">0${uartFrame(c, 8, "none", 1).slice(1, 9).map((b) => b.v).join("")}1</td>`).join("")}</tr></tbody></table>`;
    };
    function update() {
      const rq = "Z\r\n", rs = "Z " + String(ppm.value).padStart(5, "0") + "\r\n";
      req.innerHTML = table(rq); resp.innerHTML = table(rs);
      const t = (n) => (n * 10) / baud.value;
      stats.set("rq", fmtTime(t(rq.length)));
      stats.set("rs", fmtTime(t(rs.length)));
      const parsed = parseInt(rs.slice(2, 7), 10);
      stats.set("val", parsed + " ppm", baud.value === 9600 ? "good" : "bad");
      if (baud.value === 9600) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Works.</b> Both sides use the pre-agreed 9600 baud. The 'wire' row shows each frame: start 0, the 8 data bits LSB first, stop 1."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Gibberish.</b> The sensor only supports 9600 baud. At 19200 the MCU's bits are half as long as the sensor expects, so it decodes garbage and never answers properly. In UART the rate must be agreed in advance."; }
    }
    ppm.onchange = baud.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: synchronous clock
     ===================================================================== */
  function labSync(el) {
    const { controls, view } = NES.lab(el, {
      title: "A shared clock makes timing irrelevant",
      hint: "The transmitter changes the data on each falling clock edge, the receiver reads on each rising edge. Make the clock irregular: the clocked receiver does not care. A receiver that assumes a fixed rate does.",
    });
    const byte = NES.slider(controls, { label: "Byte", min: 0, max: 255, step: 1, value: 0b10010110, fmt: (v) => bn(v, 8) });
    const clk = NES.seg(controls, { label: "Clock", options: [["steady", "Steady"], ["irregular", "Irregular"]], value: "irregular" });
    const rxm = NES.seg(controls, { label: "Receiver", options: [["clock", "Uses the clock"], ["fixed", "Assumes fixed rate"]], value: "clock" });
    const cv = canvas(170, "Clock and data waveform");
    view.append(stage(cv));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    let periods = [], marks = [], bits = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const total = periods.reduce((a, b) => a + b, 0) + 1;
      const padL = 40, padR = 8, X = (t) => padL + (t / total) * (w - padL - padR);
      // clock segments: each period: high first half? data changes on falling edge, read on rising edge
      const cs = [[0, 0.5, 0]]; let t = 0.5; const rise = []; const fall = [];
      periods.forEach((p) => { rise.push(t); cs.push([t, t + p / 2, 1]); fall.push(t + p / 2); cs.push([t + p / 2, t + p, 0]); t += p; });
      cs.push([t, total, 0]);
      trace(ctx, cs, X, (v) => (v ? 22 : 52), C("--ink-2"), 2);
      // data: bit k valid from fall[k-1] (or start) to fall[k]
      const ds = []; let start = 0;
      bits.forEach((b, k) => { const end = k < bits.length - 1 ? fall[k] : total; ds.push([start, end, b]); start = end; });
      trace(ctx, ds, X, (v) => (v ? 78 : 108), C("--tech"), 2.4);
      marks.forEach((m) => { ctx.strokeStyle = m.ok ? C("--ok") : C("--bad"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(m.t), 14); ctx.lineTo(X(m.t), 118); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = m.ok ? C("--ok") : C("--bad"); ctx.beginPath(); ctx.arc(X(m.t), m.v ? 78 : 108, 4.5, 0, 7); ctx.fill(); });
      label(ctx, "clk", 6, 42, C("--muted"), 12, true); label(ctx, "data", 6, 98, C("--muted"), 12, true);
      label(ctx, "dashed lines: moments the receiver reads", padL, 150);
    });
    function update() {
      bits = []; for (let i = 7; i >= 0; i--) bits.push((byte.value >> i) & 1);
      const r = NES.rng(11);
      periods = bits.map(() => (clk.value === "steady" ? 1 : 0.5 + r() * 1.8));
      // rising edges
      const rise = []; const fall = []; let t = 0.5;
      periods.forEach((p) => { rise.push(t); fall.push(t + p / 2); t += p; });
      const valueAt = (tt) => { let k = 0; while (k < bits.length - 1 && tt >= fall[k]) k++; return bits[k]; };
      const avg = periods.reduce((a, b) => a + b, 0) / periods.length;
      const times = rxm.value === "clock" ? rise : bits.map((_, k) => 0.5 + k * avg);
      marks = times.map((tt, k) => { const v = valueAt(tt); return { t: tt, v, ok: v === bits[k] }; });
      const got = marks.map((m) => m.v);
      rows.innerHTML = bitLine("Sent", bits.map((b) => ({ t: b, cls: "b" + b }))) + bitLine("Read", got.map((b, i) => ({ t: b, cls: b === bits[i] ? "b" + b : "err" })));
      const ok = got.every((b, i) => b === bits[i]);
      verdict.className = "verdict " + (ok ? "good" : "bad");
      verdict.innerHTML = ok
        ? "<b>All 8 bits correct.</b> " + (rxm.value === "clock" ? "Each rising edge tells the receiver exactly when to read, however uneven the clock is. No baud rate to agree on, no start or stop bits." : "With a steady clock a fixed-rate guess happens to line up.")
        : "<b>Bits misread.</b> The receiver assumed evenly spaced bits, but the transmitter's timing wandered. This is why asynchronous links need an agreed, stable rate.";
      draw();
    }
    [byte, clk, rxm].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: SPI shift-register exchange
     ===================================================================== */
  function labSpi(el) {
    const { controls, view } = NES.lab(el, {
      title: "SPI is a byte swap",
      hint: "Controller and peripheral each hold an 8-bit shift register, joined in a ring by MOSI and MISO. Each clock moves one bit each way (most significant bit first, as most SPI devices do). After 8 clocks the bytes have swapped.",
    });
    const cb = NES.slider(controls, { label: "Controller sends", min: 0, max: 255, step: 1, value: 0xa5, fmt: (v) => hx(v) });
    const pb = NES.slider(controls, { label: "Peripheral sends", min: 0, max: 255, step: 1, value: 0x3c, fmt: (v) => hx(v) });
    const stepBtn = h("button", { class: "btn", type: "button", text: "Clock one bit" });
    const allBtn = h("button", { class: "btn", type: "button", text: "Clock all 8" });
    const resetBtn = h("button", { class: "btn", type: "button", text: "Reset" });
    controls.append(h("div", { class: "btn-row" }, [stepBtn, allBtn, resetBtn]));
    const regs = h("div", { class: "bitrow" });
    view.append(stage(regs));
    const stats = NES.stats(view, [{ key: "k", label: "Clocks" }, { key: "mosi", label: "Last MOSI bit" }, { key: "miso", label: "Last MISO bit" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    let c, p, k, lastMosi, lastMiso;
    function reset() { c = cb.value; p = pb.value; k = 0; lastMosi = lastMiso = null; render(); }
    function clock() {
      if (k >= 8) return;
      const mosi = (c >> 7) & 1, miso = (p >> 7) & 1;
      c = ((c << 1) & 0xff) | miso; p = ((p << 1) & 0xff) | mosi; k++;
      lastMosi = mosi; lastMiso = miso; render();
    }
    function row(name, v, fromOther) {
      const list = [];
      for (let i = 7; i >= 0; i--) { const b = (v >> i) & 1; list.push({ t: b, cls: (i < k ? "moved " : "") + "b" + b, title: i < k ? "arrived from the " + fromOther : "own bit" }); }
      return bitLine(name, list);
    }
    function render() {
      regs.innerHTML = row("Controller", c, "peripheral") + `<div class="spi-arrows">MOSI: controller's MSB → peripheral's LSB &nbsp;·&nbsp; MISO: peripheral's MSB → controller's LSB</div>` + row("Peripheral", p, "controller");
      stats.set("k", k + " / 8");
      stats.set("mosi", lastMosi == null ? "-" : String(lastMosi));
      stats.set("miso", lastMiso == null ? "-" : String(lastMiso));
      if (k === 8) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Swapped.</b> The controller now holds " + hx(c) + " (the peripheral's byte) and the peripheral holds " + hx(p) + ". Highlighted bits arrived from the other side."; }
      else { verdict.className = "verdict"; verdict.innerHTML = "Highlighted bits have arrived from the other side. " + (8 - k) + " clock" + (8 - k === 1 ? "" : "s") + " to go."; }
    }
    stepBtn.addEventListener("click", clock);
    allBtn.addEventListener("click", () => { while (k < 8) clock(); });
    resetBtn.addEventListener("click", reset);
    cb.onchange = pb.onchange = reset;
    reset();
  }

  /* =====================================================================
     LAB: SPI modes
     ===================================================================== */
  function labSpiModes(el) {
    const { controls, view } = NES.lab(el, {
      title: "CPOL and CPHA",
      hint: "CPOL picks the clock's idle level. CPHA picks whether data is read on the leading edge (CPHA = 0) or the trailing edge (CPHA = 1). Dashed lines mark the read moments; the data changes on the other edge.",
    });
    const mode = NES.seg(controls, { label: "SPI mode", options: [[0, "0"], [1, "1"], [2, "2"], [3, "3"]], value: 0 });
    const tt = h("div", { class: "table-wrap" });
    controls.append(tt);
    const cv = canvas(210, "SPI mode timing diagram");
    view.append(stage(cv));
    const stats = NES.stats(view, [{ key: "idle", label: "Clock idles" }, { key: "lead", label: "Leading edge" }, { key: "read", label: "Data read on" }, { key: "chg", label: "Data changes on" }]);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const m = mode.value, cpol = m >> 1, cpha = m & 1;
      const padL = 44, padR = 8, T = 10.5, X = (t) => padL + (t / T) * (w - padL - padR);
      // CS
      trace(ctx, [[0, 0.5, 1], [0.5, 9.5, 0], [9.5, T, 1]], X, (v) => (v ? 22 : 44), C("--ink-2"), 2);
      // SCLK: cycle k from 1+k; first half = active (not idle) level
      const idle = cpol, act = 1 - cpol;
      const s = [[0, 1, idle]];
      for (let k = 0; k < 8; k++) { s.push([1 + k, 1.5 + k, act]); s.push([1.5 + k, 2 + k, idle]); }
      s.push([9, T, idle]);
      trace(ctx, s, X, (v) => (v ? 64 : 92), C("--ink-2"), 2);
      // data cells (MOSI and MISO)
      const list = [];
      for (let k = 0; k < 8; k++) {
        const a = cpha ? 1 + k : k === 0 ? 0.5 : 0.5 + k, b = cpha ? 2 + k : 1.5 + k;
        list.push({ a, b, label: String(7 - k), fill: C("--tech") });
      }
      cells(ctx, list, X, 124, 11);
      cells(ctx, list.map((c) => ({ ...c, fill: C("--ok") })), X, 160, 11);
      // read moments
      for (let k = 0; k < 8; k++) {
        const t = cpha ? 1.5 + k : 1 + k;
        ctx.strokeStyle = C("--accent"); ctx.setLineDash([3, 3]); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(X(t), 56); ctx.lineTo(X(t), 175); ctx.stroke(); ctx.setLineDash([]);
      }
      label(ctx, "CS", 6, 38, C("--muted"), 12, true); label(ctx, "SCLK", 6, 82, C("--muted"), 12, true);
      label(ctx, "MOSI", 6, 128, C("--muted"), 12, true); label(ctx, "MISO", 6, 164, C("--muted"), 12, true);
      label(ctx, "bit numbers: 7 = most significant; dashed = read moments", padL, 200);
    });
    function update() {
      const m = mode.value, cpol = m >> 1, cpha = m & 1;
      tt.innerHTML = `<table class="tt"><thead><tr><th>Mode</th><th>CPOL</th><th class="out">CPHA</th></tr></thead><tbody>${[0, 1, 2, 3].map((i) => `<tr class="${i === m ? "on" : ""}"><td>${i}</td><td>${i >> 1}</td><td class="out">${i & 1}</td></tr>`).join("")}</tbody></table>`;
      const lead = cpol ? "falling" : "rising", trail = cpol ? "rising" : "falling";
      stats.set("idle", cpol ? "high (1)" : "low (0)");
      stats.set("lead", lead);
      stats.set("read", (cpha ? "trailing (" + trail : "leading (" + lead) + ")", "good");
      stats.set("chg", cpha ? "leading (" + lead + ")" : "trailing (" + trail + ")");
      draw();
    }
    mode.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: daisy chain
     ===================================================================== */
  function labDaisy(el) {
    const { controls, view } = NES.lab(el, {
      title: "Pass the bytes around the ring",
      hint: "Three peripherals form a chain: controller MOSI → P1 → P2 → P3 → controller MISO. All are selected together. Each transferred byte pushes every byte one step further along the ring.",
    });
    const shiftBtn = h("button", { class: "btn", type: "button", text: "Transfer one byte" });
    const resetBtn = h("button", { class: "btn", type: "button", text: "Reset" });
    controls.append(h("div", { class: "btn-row" }, [shiftBtn, resetBtn]));
    controls.append(h("p", { class: "lab-hint", html: "The controller wants to send A1 to P3, B2 to P2 and C3 to P1. Which order must it send them in?" }));
    const ring = h("div", { class: "chain" });
    view.append(stage(ring));
    const stats = NES.stats(view, [{ key: "n", label: "Bytes transferred" }, { key: "rx", label: "Controller received" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const toSend = ["A1", "B2", "C3"];
    let regs, sent, recv;
    function reset() { regs = ["11", "22", "33"]; sent = 0; recv = []; render(); }
    function shift() {
      if (sent >= 3) return;
      const out = regs[2];
      regs = [toSend[sent], regs[0], regs[1]];
      recv.push(out); sent++; render();
    }
    function render() {
      const node = (name, val, cls) => `<div class="chain-node ${cls || ""}"><div class="chain-name">${name}</div><div class="chain-val">0x${val}</div></div>`;
      ring.innerHTML = `<div class="chain-row">${node("Controller out", sent < 3 ? toSend[sent] : "--", "ctrl")}<span class="chain-arrow">→</span>${node("P1", regs[0])}<span class="chain-arrow">→</span>${node("P2", regs[1])}<span class="chain-arrow">→</span>${node("P3", regs[2])}<span class="chain-arrow">→</span>${node("Controller in", recv.length ? recv[recv.length - 1] : "--", "ctrl")}</div>`;
      stats.set("n", sent + " / 3");
      stats.set("rx", recv.length ? recv.map((r) => "0x" + r).join(", ") : "-");
      if (sent === 3) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Done after 3 bytes.</b> The first byte sent (A1) travelled furthest and ended in P3. In return the controller received the peripherals' old contents, last peripheral first. Every peripheral had to take part."; }
      else { verdict.className = "verdict"; verdict.innerHTML = "Next byte out of the controller: 0x" + toSend[sent] + ". The byte leaving P3 goes back into the controller."; }
    }
    shiftBtn.addEventListener("click", shift);
    resetBtn.addEventListener("click", reset);
    reset();
  }

  /* =====================================================================
     LAB: ADXL362 register access
     ===================================================================== */
  function labAdxl(el) {
    const { controls, view } = NES.lab(el, {
      title: "Read an ADXL362 register",
      hint: "Every access is one CS-low period: an instruction byte, an 8-bit register address, then the data byte. Values are the reset values from the slide's register table (mode 0, MSB first).",
    });
    const op = NES.seg(controls, { label: "Instruction", options: [[0x0b, "Read (0x0B)"], [0x0a, "Write (0x0A)"]], value: 0x0b });
    const REG = [[0x00, "DEVID_AD", 0xad], [0x01, "DEVID_MST", 0x1d], [0x02, "PARTID", 0xf2], [0x03, "REVID", 0x01]];
    const reg = NES.seg(controls, { label: "Register", options: REG.map(([a, n]) => [a, n]), value: 0x02 });
    const val = NES.slider(controls, { label: "Value to write", min: 0, max: 255, step: 1, value: 0x42, fmt: (v) => hx(v) });
    const sclk = NES.slider(controls, { label: "SCLK", min: 1, max: 8, step: 1, value: 4, fmt: (v) => v + " MHz" });
    const cv = canvas(130, "ADXL362 SPI transaction");
    view.append(stage(cv));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "mosi", label: "MOSI bytes" }, { key: "miso", label: "MISO bytes" }, { key: "t", label: "Transfer time" }]);
    let bytes = [];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 44, padR = 8, X = (t) => padL + (t / 3) * (w - padL - padR);
      const names = ["instruction", "address", "data"];
      cells(ctx, bytes.map((b, i) => ({ a: i, b: i + 1, label: b.mosi == null ? "don't care" : hx(b.mosi), fill: C("--tech") })), X, 40, 14, { size: 12 });
      cells(ctx, bytes.map((b, i) => ({ a: i, b: i + 1, label: b.miso == null ? "Hi-Z / ignored" : hx(b.miso), fill: b.miso == null ? null : C("--ok"), color: b.miso == null ? C("--muted") : C("--ink") })), X, 86, 14, { size: 12 });
      label(ctx, "MOSI", 6, 44, C("--muted"), 12, true); label(ctx, "MISO", 6, 90, C("--muted"), 12, true);
      font(ctx, 11); ctx.fillStyle = C("--muted"); ctx.textAlign = "center";
      names.forEach((n, i) => ctx.fillText(n + " (8 clocks)", (X(i) + X(i + 1)) / 2, 122));
      ctx.textAlign = "start";
    });
    function update() {
      const r = REG.find((x) => x[0] === reg.value);
      const read = op.value === 0x0b;
      val.wrap.style.display = read ? "none" : "";
      bytes = [{ mosi: op.value, miso: null }, { mosi: r[0], miso: null }, read ? { mosi: null, miso: r[2] } : { mosi: val.value, miso: null }];
      stats.set("mosi", bytes.filter((b) => b.mosi != null).map((b) => hx(b.mosi)).join(" "));
      stats.set("miso", read ? hx(r[2]) + " in byte 3" : "nothing useful");
      stats.set("t", fmtTime(24 / (sclk.value * 1e6)) + " (24 clocks)");
      if (read) { verdict.className = "verdict good"; verdict.innerHTML = "<b>" + r[1] + " = " + hx(r[2]) + ".</b> During the third byte the controller's MOSI bits are ignored and the sensor shifts the register value out on MISO."; }
      else { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Sent, but ignored.</b> The instruction, address and value go out on MOSI, yet " + r[1] + " is marked R (read-only) in the register table, so the sensor keeps its value. Writes only change R/W registers."; }
      draw();
    }
    [op, reg, val, sclk].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: open-drain rise time and pull-up power
     ===================================================================== */
  function labRise(el) {
    const { controls, view } = NES.lab(el, {
      title: "Pull-up resistors: speed vs energy",
      hint: "When a device lets go, the line is charged through the pull-up, an RC curve. A push-pull output (SPI, UART) would snap up instantly. Smaller resistors rise faster but burn more power whenever the line is '0'.",
    });
    const vs = NES.seg(controls, { label: "V<sub>S</sub>", options: [[3.3, "3.3 V"], [5, "5 V"]], value: 5 });
    const RS = [1000, 1500, 2200, 3300, 4700, 5000, 6800, 10000, 22000, 47000];
    const r = NES.slider(controls, { label: "Pull-up R", min: 0, max: RS.length - 1, step: 1, value: 5, map: (i) => RS[i], unmap: (v) => RS.indexOf(v), fmt: (v) => (v / 1000).toFixed(v % 1000 ? 1 : 0) + " kΩ" });
    const cap = NES.slider(controls, { label: "Bus capacitance", min: 20, max: 400, step: 10, value: 200, fmt: (v) => v + " pF" });
    const f = NES.seg(controls, { label: "SCL clock", options: [[100000, "100 kHz"], [400000, "400 kHz"]], value: 400000 });
    const cv = canvas(190, "Rising edge plot");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi)"></i>open-drain + pull-up</span><span><i class="dash" style="color:var(--muted)"></i>push-pull</span><span><i class="dash" style="color:var(--accent)"></i>0.7 · V<sub>S</sub> ('1' threshold)</span>` }));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "p", label: "Power while '0'" }, { key: "i", label: "Current while '0'" }, { key: "tau", label: "RC time constant" }, { key: "tr", label: "Time to reach 0.7·V<sub>S</sub>" }]);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const V = vs.value, tau = r.value * cap.value * 1e-12, half = 0.5 / f.value;
      const padL = 40, padR = 10, top = 14, bot = hh - 30;
      const X = (t) => padL + (t / half) * (w - padL - padR), Y = (v) => bot - (v / 5.2) * (bot - top);
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1;
      [0, V].forEach((vv) => { ctx.beginPath(); ctx.moveTo(padL, Y(vv)); ctx.lineTo(w - padR, Y(vv)); ctx.stroke(); label(ctx, vv + " V", 4, Y(vv) + 4); });
      ctx.strokeStyle = C("--accent"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(padL, Y(0.7 * V)); ctx.lineTo(w - padR, Y(0.7 * V)); ctx.stroke(); ctx.setLineDash([]);
      trace(ctx, [[0, 0.04 * half, 0], [0.04 * half, half, V]], X, Y, C("--muted"), 1.6, [4, 4]);
      ctx.strokeStyle = C("--hi"); ctx.lineWidth = 2.4; ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px++) {
        const t = (px / (w - padL - padR)) * half;
        const v = t < 0.04 * half ? 0 : V * (1 - Math.exp(-(t - 0.04 * half) / tau));
        px ? ctx.lineTo(X(t), Y(v)) : ctx.moveTo(X(t), Y(v));
      }
      ctx.stroke();
      label(ctx, "0", padL, hh - 10); const lab = fmtTime(half) + " = half an SCL period"; font(ctx, 11); label(ctx, lab, w - padR - ctx.measureText(lab).width, hh - 10);
    });
    function update() {
      const V = vs.value, R = r.value, tau = R * cap.value * 1e-12, half = 0.5 / f.value;
      const tr = tau * Math.log(1 / 0.3);
      stats.set("p", ((V * V) / R * 1000).toFixed(2) + " mW", (V * V) / R > 0.004 ? "warn" : "");
      stats.set("i", ((V / R) * 1000).toFixed(2) + " mA");
      stats.set("tau", fmtTime(tau));
      const ok = tr < 0.5 * half;
      stats.set("tr", fmtTime(tr), ok ? "good" : tr < half ? "warn" : "bad");
      if (ok) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Fast enough.</b> The line reaches a valid '1' early in the high half of the clock."; }
      else if (tr < half) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Marginal.</b> The '1' only becomes valid late in the clock phase. Lower R or lower the clock."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Too slow.</b> The line never reaches a valid '1' before the clock moves on. This is why open-drain buses run slower than push-pull ones."; }
      draw();
    }
    [vs, r, cap, f].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: I2C address frame
     ===================================================================== */
  function labAddrFrame(el) {
    const { controls, view } = NES.lab(el, {
      title: "Build the address byte",
      hint: "The first byte after the start condition is the 7-bit address (most significant bit first) followed by the R/W bit. Use the sensor presets from the slides or set any address.",
    });
    const pre = h("div", { class: "seg" });
    [["ADR = V<sub>S</sub>", 0b0110101], ["ADR = GND", 0b0110100], ["TMP1075", 0b1001000]].forEach(([t, a]) => pre.append(h("button", { type: "button", html: t, onclick: () => { addr.set(a); update(); } })));
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Presets</span>" }), pre]));
    const addr = NES.slider(controls, { label: "7-bit address", min: 0, max: 127, step: 1, value: 0b0110101, fmt: (v) => "0b" + bn(v, 7) });
    const rw = NES.seg(controls, { label: "Operation", options: [[0, "Write (0)"], [1, "Read (1)"]], value: 0 });
    const rows = h("div", { class: "bitrow" });
    view.append(stage(rows));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "a", label: "7-bit address" }, { key: "byte", label: "Byte on the wire" }, { key: "bin", label: "Binary" }]);
    function update() {
      const a = addr.value, byte = (a << 1) | rw.value;
      const list = [];
      for (let i = 6; i >= 0; i--) list.push({ t: (a >> i) & 1, cls: "b" + ((a >> i) & 1), title: "a" + i });
      list.push({ t: rw.value, cls: "rw", title: "R/W" });
      rows.innerHTML = bitLine("", ["a6", "a5", "a4", "a3", "a2", "a1", "a0", "R/W"].map((t) => ({ t, cls: "hdr" }))) + bitLine("SDA", list);
      stats.set("a", hx(a));
      stats.set("byte", hx(byte), "good");
      stats.set("bin", "0b" + bn(byte, 8));
      const reserved = a <= 0x07 || a >= 0x78;
      verdict.className = "verdict " + (reserved ? "warn" : "good");
      verdict.innerHTML = reserved
        ? "<b>Reserved address.</b> " + hx(a) + " is in one of the two reserved blocks (0x00 to 0x07 and 0x78 to 0x7F). That is why only 112 of the 128 addresses are available for targets."
        : "<b>Address byte " + hx(byte) + ".</b> The address shifted left by one, plus R/W = " + rw.value + " (" + (rw.value ? "read" : "write") + "). Only the target with address " + hx(a) + " will respond.";
    }
    addr.onchange = rw.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: I2C transaction (start, address, ack, data, ack/nack, stop)
     ===================================================================== */
  function i2cSlots(addr, rw, data, present) {
    const s = [];
    for (let i = 6; i >= 0; i--) s.push({ label: "a" + i, v: (addr >> i) & 1, drv: "c" });
    s.push({ label: "r/w", v: rw, drv: "c" });
    if (!present) { s.push({ label: "nack", v: 1, drv: "p" }); return s; }
    s.push({ label: "ack", v: 0, drv: "t" });
    for (let i = 7; i >= 0; i--) s.push({ label: "d" + i, v: (data >> i) & 1, drv: rw ? "t" : "c" });
    s.push(rw ? { label: "nack", v: 1, drv: "c" } : { label: "ack", v: 0, drv: "t" });
    return s;
  }
  function drawI2c(ctx, w, slots, opts) {
    const o = opts || {};
    const n = slots.length, tEnd = 1.5 + n, T = tEnd + 1;
    const padL = 40, padR = 8, X = (t) => padL + (t / T) * (w - padL - padR);
    const scl = [[0, 1.5, 1]];
    for (let i = 0; i < n; i++) { scl.push([1.5 + i, 2 + i, 0]); scl.push([2 + i, 2.5 + i, 1]); }
    scl.push([tEnd, tEnd + 0.25, 0]); scl.push([tEnd + 0.25, T, 1]);
    const sda = [[0, 1, 1], [1, 1.5, 0]].concat(slots.map((s, i) => [1.5 + i, 2.5 + i, s.v]), [[tEnd, tEnd + 0.5, 0], [tEnd + 0.5, T, 1]]);
    trace(ctx, scl, X, (v) => (v ? 18 : 42), C("--ink-2"), 2);
    trace(ctx, sda, X, (v) => (v ? 60 : 84), C("--ink-2"), 2);
    const col = { c: C("--tech"), t: C("--ok"), p: C("--muted") };
    cells(ctx, slots.map((s, i) => ({ a: 1.5 + i, b: 2.5 + i, label: o.values ? String(s.v) : s.label, fill: col[s.drv] })), X, 110, 11, { size: 10 });
    if (o.values !== false) cells(ctx, slots.map((s, i) => ({ a: 1.5 + i, b: 2.5 + i, label: s.label, fill: null, color: C("--muted") })), X, 136, 9, { size: 9 });
    ctx.strokeStyle = C("--accent"); ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    [1, tEnd + 0.5].forEach((t) => { ctx.beginPath(); ctx.moveTo(X(t), 10); ctx.lineTo(X(t), 92); ctx.stroke(); });
    ctx.setLineDash([]);
    label(ctx, "start", X(1) - 12, 160, C("--accent"), 10, true); label(ctx, "stop", X(tEnd + 0.5) - 10, 160, C("--accent"), 10, true);
    label(ctx, "SCL", 6, 34, C("--muted"), 12, true); label(ctx, "SDA", 6, 76, C("--muted"), 12, true);
  }
  function labI2cTx(el) {
    const { controls, view } = NES.lab(el, {
      title: "Run an I2C transaction",
      hint: "Start condition, address frame, ACK, one data frame, ACK or NACK, stop condition. Blue bits are driven by the controller, green by the target, grey by nobody (the pull-up). The defaults reproduce the slide's examples.",
    });
    const addr = NES.slider(controls, { label: "Target address", min: 0x08, max: 0x77, step: 1, value: 0x35, fmt: (v) => hx(v) });
    const rw = NES.seg(controls, { label: "Operation", options: [[0, "Write"], [1, "Read"]], value: 0 });
    const data = NES.slider(controls, { label: "Data byte", min: 0, max: 255, step: 1, value: 0xa7, fmt: (v) => hx(v) + " = " + bn(v, 8) });
    const present = NES.seg(controls, { label: "Target with that address", options: [[1, "Present"], [0, "Absent"]], value: 1 });
    const cv = canvas(170, "I2C transaction waveform");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech);height:8px"></i>controller drives SDA</span><span><i style="background:var(--ok);height:8px"></i>target drives SDA</span><span><i style="background:var(--muted);height:8px"></i>nobody (pull-up)</span>` }));
    const seq = h("div", { class: "codebar-title" });
    view.append(seq);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    let slots = [];
    const draw = NES.canvas(cv, (ctx, w) => drawI2c(ctx, w, slots, { values: true }));
    function update() {
      slots = i2cSlots(addr.value, rw.value, data.value, present.value === 1);
      seq.innerHTML = "SDA bits after start: <code>" + slots.map((s) => s.v).join(" ") + "</code>";
      if (!present.value) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>NACK on the address.</b> No target matches " + hx(addr.value) + ", so nobody pulls SDA low and the pull-up leaves it at 1. The controller gives up and sends a stop."; }
      else if (rw.value) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Read " + hx(data.value) + ".</b> After the target's ACK, the target drives the 8 data bits (green). The controller answers with NACK (1) to say 'that was the last byte', then sends the stop condition."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Wrote " + hx(data.value) + ".</b> The controller drives the address and data (blue); the target pulls SDA low for both ACKs (green)."; }
      draw();
    }
    [addr, rw, data, present].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: clock stretching (wired-AND on SCL)
     ===================================================================== */
  function labStretch(el) {
    const { controls, view } = NES.lab(el, {
      title: "A target holds the clock",
      hint: "SCL is open-drain, so the line is the AND of everyone's output. The controller tries to release SCL for the next bit, but the target keeps pulling it low until it is ready.",
    });
    const hold = NES.slider(controls, { label: "Target holds SCL low for", min: 0, max: 4, step: 0.5, value: 2, fmt: (v) => v + " bit times" });
    const cv = canvas(190, "Clock stretching waveform");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i class="dash" style="color:var(--tech)"></i>controller's SCL output</span><span><i style="background:var(--ok);height:8px"></i>target pulls SCL low</span><span><i style="background:var(--ink-2)"></i>actual SCL line</span>` }));
    const stats = NES.stats(view, [{ key: "d", label: "Delay added" }, { key: "t", label: "Frame length" }]);
    const labels = ["a6", "a5", "a4", "a3", "a2", "a1", "a0", "r/w", "ack"];
    const draw = NES.canvas(cv, (ctx, w) => {
      const H = hold.value, n = labels.length, T = 1 + n + H + 0.5;
      const padL = 70, padR = 8, X = (t) => padL + (t / T) * (w - padL - padR);
      // slots: slot i low half then high half; slot 6 (a0) low half extended by H
      const ctrl = [[0, 0.5, 1]], line = [[0, 0.5, 1]], targ = [];
      let t = 0.5;
      const cell = [];
      for (let i = 0; i < n; i++) {
        const lowEnd = t + 0.5 + (i === 6 ? H : 0);
        ctrl.push([t, t + 0.5, 0], [t + 0.5, t + 1 + (i === 6 ? H : 0), 1]);
        if (i === 6 && H > 0) targ.push([t + 0.5, lowEnd]);
        line.push([t, lowEnd, 0], [lowEnd, lowEnd + 0.5, 1]);
        cell.push({ a: t, b: lowEnd + 0.5, label: labels[i], fill: i === 8 ? C("--ok") : C("--tech") });
        t = lowEnd + 0.5;
      }
      ctrl.push([t, T, 1]); line.push([t, T, 1]);
      trace(ctx, ctrl, X, (v) => (v ? 18 : 40), C("--tech"), 1.6, [4, 3]);
      targ.forEach(([a, b]) => { ctx.fillStyle = C("--ok"); ctx.globalAlpha = 0.25; ctx.fillRect(X(a), 54, X(b) - X(a), 34); ctx.globalAlpha = 1; label(ctx, "target holds SCL", X(a) + 4, 100, C("--ok"), 10, true); });
      trace(ctx, line, X, (v) => (v ? 58 : 84), C("--ink-2"), 2.4);
      cells(ctx, cell, X, 140, 11, { size: 10 });
      label(ctx, "ctrl tries", 4, 32, C("--tech"), 11, true); label(ctx, "SCL line", 4, 76, C("--ink-2"), 11, true); label(ctx, "SDA", 4, 144, C("--muted"), 11, true);
    });
    function update() {
      stats.set("d", hold.value + " bit times", hold.value ? "warn" : "");
      stats.set("t", (9 + hold.value) + " bit times");
      draw();
    }
    hold.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: multi-controller arbitration
     ===================================================================== */
  function labArb(el) {
    const { controls, view } = NES.lab(el, {
      title: "Two controllers, one bus",
      hint: "Both controllers send their address frame at the same moment. Each reads SDA back while sending. The line is the wired-AND of both: '0' always wins.",
    });
    const a = NES.slider(controls, { label: "Controller A addresses", min: 0x08, max: 0x77, step: 1, value: 0b0110101, fmt: (v) => hx(v) + " = " + bn(v, 7) });
    const b = NES.slider(controls, { label: "Controller B addresses", min: 0x08, max: 0x77, step: 1, value: 0b0111000, fmt: (v) => hx(v) + " = " + bn(v, 7) });
    const rows = h("div", { class: "bitrow" });
    view.append(stage(rows));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    function update() {
      const A = [], B = [], L = [], hdr = [];
      let lost = null, at = -1;
      for (let i = 6; i >= 0; i--) {
        const x = (a.value >> i) & 1, y = (b.value >> i) & 1, line = x & y;
        const k = 6 - i;
        hdr.push({ t: "a" + i, cls: "hdr" });
        const aOut = lost === "A" ? "-" : x, bOut = lost === "B" ? "-" : y;
        const lineNow = lost === "A" ? y : lost === "B" ? x : line;
        A.push({ t: aOut, cls: lost === "A" ? "gone" : "b" + x });
        B.push({ t: bOut, cls: lost === "B" ? "gone" : "b" + y });
        L.push({ t: lineNow, cls: "b" + lineNow });
        if (!lost && x !== y) { lost = x ? "A" : "B"; at = k; (lost === "A" ? A : B)[k].cls = "err"; }
      }
      rows.innerHTML = bitLine("", hdr) + bitLine("A sends", A) + bitLine("B sends", B) + bitLine("SDA line", L);
      if (!lost) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Same address.</b> Both controllers see exactly what they send, so neither notices the other yet. Arbitration continues bit by bit into the following data."; }
      else {
        const win = lost === "A" ? "B" : "A";
        verdict.className = "verdict good";
        verdict.innerHTML = "<b>Controller " + win + " wins.</b> At bit a" + (6 - at) + " controller " + lost + " let go ('1') but read '0' on the line, so it knows someone else is active and backs off. Controller " + win + " never noticed anything and finishes its transaction. The lower address wins.";
      }
    }
    a.onchange = b.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: register write/read transaction builder
     ===================================================================== */
  function labRegRw(el) {
    const { controls, view } = NES.lab(el, {
      title: "Write or read a target register",
      hint: "A register write is 3 bytes in one transaction. A register read is 4 bytes: write the register address, then a repeated start and a read. Every byte is followed by an ACK or NACK, so each costs 9 clocks.",
    });
    const op = NES.seg(controls, { label: "Operation", options: [["w", "Write register"], ["r", "Read register"]], value: "r" });
    const ta = NES.slider(controls, { label: "Target address", min: 0x08, max: 0x77, step: 1, value: 0x35, fmt: (v) => hx(v) });
    const ra = NES.slider(controls, { label: "Register address", min: 0, max: 255, step: 1, value: 0x0f, fmt: (v) => hx(v) });
    const vv = NES.slider(controls, { label: "Register value", min: 0, max: 255, step: 1, value: 0x42, fmt: (v) => hx(v) });
    const f = NES.seg(controls, { label: "SCL clock", options: [[100000, "100 kHz"], [400000, "400 kHz"]], value: 100000 });
    const seq = h("div", { class: "i2c-seq" });
    view.append(stage(seq));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech);height:8px"></i>controller drives SDA</span><span><i style="background:var(--ok);height:8px"></i>target drives SDA</span><span><i style="background:var(--accent);height:8px"></i>bus condition</span>` }));
    const stats = NES.stats(view, [{ key: "bytes", label: "Bytes" }, { key: "clk", label: "SCL clocks (9 per byte)" }, { key: "t", label: "Time on the bus" }]);
    function update() {
      const w = op.value === "w";
      vv.wrap.querySelector(".ctl-label span").innerHTML = w ? "Register value to write" : "Value the target returns";
      const chip = (t, cls) => `<span class="i2c-chip ${cls}">${t}</span>`;
      const parts = [chip("Start", "cond"), chip(hx(ta.value << 1) + " addr+W", "c"), chip("ACK", "t"), chip(hx(ra.value) + " reg", "c"), chip("ACK", "t")];
      if (w) parts.push(chip(hx(vv.value) + " value", "c"), chip("ACK", "t"), chip("Stop", "cond"));
      else parts.push(chip("Re-Start", "cond"), chip(hx((ta.value << 1) | 1) + " addr+R", "c"), chip("ACK", "t"), chip(hx(vv.value) + " value", "t"), chip("NACK", "c"), chip("Stop", "cond"));
      seq.innerHTML = parts.join("");
      const nb = w ? 3 : 4;
      stats.set("bytes", String(nb), "good");
      stats.set("clk", String(nb * 9));
      stats.set("t", "≈ " + fmtTime((nb * 9) / f.value));
    }
    [op, ta, ra, vv, f].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: TMP1075 address and temperature register
     ===================================================================== */
  function labTmp(el) {
    const { controls, view } = NES.lab(el, {
      title: "Find the TMP1075 and decode its temperature",
      hint: "The address is 10010xx: the two configurable bits give four possible addresses. The 16-bit TEMP register (00h) holds a 12-bit two's-complement reading in its upper bits, 0.0625 °C per step (from the TMP1075 datasheet).",
    });
    const xx = NES.seg(controls, { label: "Configurable bits xx", options: [[0, "00"], [1, "01"], [2, "10"], [3, "11"]], value: 0 });
    const temp = NES.slider(controls, { label: "Actual temperature", min: -40, max: 125, step: 0.0625, value: 25, fmt: (v) => v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") + " °C" });
    const map = h("div", { class: "table-wrap" });
    view.append(map);
    const seq = h("div", { class: "i2c-seq" });
    view.append(stage(seq));
    const stats = NES.stats(view, [{ key: "addr", label: "7-bit address" }, { key: "raw", label: "TEMP register" }, { key: "bytes", label: "Bytes read (MSB, LSB)" }]);
    const REGS = [["00h", "R", "0000h", "TEMP", "Temperature result register"], ["01h", "R/W", "00FFh", "CFGR", "Configuration register"], ["02h", "R/W", "4B00h", "LLIM", "Low limit register"], ["03h", "R/W", "5000h", "HLIM", "High limit register"], ["0Fh", "R", "7500h", "DIEID", "Device ID register"]];
    function update() {
      const a = 0b1001000 | xx.value;
      const raw12 = Math.round(temp.value / 0.0625) & 0xfff;
      const reg = raw12 << 4, msb = reg >> 8, lsb = reg & 0xff;
      map.innerHTML = `<table class="tt"><thead><tr><th>Address</th><th>Type</th><th>Reset</th><th>Acronym</th><th class="out">Register</th></tr></thead><tbody>${REGS.map((r, i) => `<tr class="${i === 0 ? "on" : ""}"><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td class="out">${r[4]}</td></tr>`).join("")}</tbody></table>`;
      const chip = (t, cls) => `<span class="i2c-chip ${cls}">${t}</span>`;
      seq.innerHTML = [chip("Start", "cond"), chip(hx(a << 1) + " addr+W", "c"), chip("ACK", "t"), chip("0x00 pointer = TEMP", "c"), chip("ACK", "t"), chip("Re-Start", "cond"), chip(hx((a << 1) | 1) + " addr+R", "c"), chip("ACK", "t"), chip(hx(msb) + " MSB", "t"), chip("ACK", "c"), chip(hx(lsb) + " LSB", "t"), chip("NACK", "c"), chip("Stop", "cond")].join("");
      stats.set("addr", hx(a) + " = 0b" + bn(a, 7), "good");
      stats.set("raw", "0x" + reg.toString(16).toUpperCase().padStart(4, "0"));
      stats.set("bytes", hx(msb) + ", " + hx(lsb));
    }
    xx.onchange = temp.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: choose a bus (pins and transfer time)
     ===================================================================== */
  function labPins(el) {
    const { controls, view } = NES.lab(el, {
      title: "UART vs SPI vs I2C",
      hint: "GPIO count from the summary table, and the time to move a block of bytes using its overhead row. Rates are typical values you can change.",
    });
    const n = NES.slider(controls, { label: "Peripherals", min: 1, max: 10, step: 1, value: 4, fmt: (v) => String(v) });
    const k = NES.slider(controls, { label: "Bytes to transfer", min: 1, max: 64, step: 1, value: 16, fmt: (v) => String(v) });
    const ub = NES.seg(controls, { label: "UART rate", options: [[9600, "9.6k"], [115200, "115.2k"]], value: 115200 });
    const sb = NES.seg(controls, { label: "SPI clock", options: [[1e6, "1 MHz"], [8e6, "8 MHz"]], value: 8e6 });
    const ib = NES.seg(controls, { label: "I2C clock", options: [[1e5, "100 kHz"], [4e5, "400 kHz"]], value: 4e5 });
    const pins = h("div", { class: "meter" });
    const times = h("div", { class: "meter" });
    view.append(h("div", { class: "codebar-title", text: "Controller GPIOs needed" }), stage(pins), h("div", { class: "codebar-title", text: "Time to transfer the bytes to one peripheral (one transaction)" }), stage(times));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const row = (lab, val, max, color, txt) => `<div class="meter-row"><span class="m-label">${lab}</span><div class="meter-track"><div class="meter-fill" style="width:${Math.max(1.5, (val / max) * 100)}%;background:${color}"></div></div><span class="m-val">${txt}</span></div>`;
    function update() {
      const N = n.value, K = k.value;
      const P = [["UART", 2 * N, "var(--hi)", "2 per peripheral (point-to-point)"], ["SPI", 3 + N, "var(--tech)", "3 + 1 CS each"], ["SPI daisy", 4, "var(--lo)", "4, any count"], ["I2C", 2, "var(--ok)", "2, shared bus"]];
      const pmax = Math.max(...P.map((p) => p[1]));
      pins.innerHTML = P.map((p) => row(p[0], p[1], pmax, p[2], p[1] + " pins")).join("");
      const tU = (K * 10) / ub.value, tS = (K * 8) / sb.value, tI = (11 + 9 * K) / ib.value;
      const T = [["UART 8N1", tU, "var(--hi)"], ["SPI", tS, "var(--tech)"], ["I2C", tI, "var(--ok)"]];
      const tmax = Math.max(tU, tS, tI);
      times.innerHTML = T.map((t) => row(t[0], t[1], tmax, t[2], fmtTime(t[1]))).join("");
      verdict.className = "verdict";
      verdict.innerHTML = "<b>Bits on the wire for " + K + " bytes:</b> UART " + K * 10 + " (2 framing bits per byte), SPI " + K * 8 + " (no overhead), I2C " + (11 + 9 * K) + " (11 for start, address frame and stop, plus 1 ACK per byte). " + (N > 1 ? "UART would also need " + N + " separate UART ports for " + N + " peripherals." : "");
    }
    [n, k, ub, sb, ib].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    rxsample: labRxSample,
    frame: labFrame,
    drift: labDrift,
    parity: labParity,
    levels: labLevels,
    cozir: labCozir,
    sync: labSync,
    spi: labSpi,
    spimodes: labSpiModes,
    daisy: labDaisy,
    adxl: labAdxl,
    rise: labRise,
    addrframe: labAddrFrame,
    i2ctx: labI2cTx,
    stretch: labStretch,
    arb: labArb,
    regrw: labRegRw,
    tmp: labTmp,
    pins: labPins,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("serial-communication", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
