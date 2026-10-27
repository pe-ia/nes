/* Week 7, Wired Networked Embedded Systems: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    osi: [
      {
        q: "Which OSI layer transmits <em>frames</em> between physically-connected nodes?",
        options: [
          ["Layer 1, Physical", false, "The Physical layer works with individual bits, not frames: it only gets raw bits across the medium."],
          ["Layer 3, Network", false, "The Network layer moves packets across multiple networks; frames belong one layer lower."],
          ["Layer 4, Transport", false, "The Transport layer delivers segments to processes, far above the wire."],
          ["Layer 2, Data Link", true, "The Data Link layer's data unit is the frame, and its job is moving frames between nodes on the same physical network."],
        ],
      },
      {
        q: "What is the data unit of the Network layer (layer 3)?",
        options: [
          ["Bit", false, "Bits are the data unit of the Physical layer (layer 1)."],
          ["Packet", true, "Layer 3 transmits packets to nodes over multiple networks."],
          ["Frame", false, "Frames are the Data Link layer's unit (layer 2)."],
          ["Segment", false, "Segments are the Transport layer's unit (layer 4)."],
        ],
      },
    ],

    phy: [
      {
        q: "What does the physical layer offer to the layers above it?",
        options: [
          ["Routing of packets across several networks", false, "Routing is the Network layer's job (layer 3)."],
          ["Encryption and compression of the data", false, "That is the Presentation layer (layer 6)."],
          ["Bits transmitted on one end and received on the other", true, "All the physical details (modulation, synchronisation, line coding, filtering...) are hidden behind this simple service."],
          ["Retransmission of lost frames", false, "Error control with retransmissions belongs to the Data Link layer's logical link part."],
        ],
      },
      {
        q: "How is the physical layer typically implemented?",
        options: [
          ["As an application on the main processor", false, "The physical layer deals with voltages and nanosecond timing; it is usually dedicated hardware."],
          ["Only as a cable standard, with no electronics", false, "The cable is part of the medium, but the coding, synchronisation and signalling are done by electronics."],
          ["In the operating system kernel", false, "The kernel drives the network interface, but the bit-level work happens in hardware."],
          ["In hardware, e.g. a PHY chip such as the RTL8201", true, "The slide's example is a dedicated Ethernet PHY chip that handles everything between the cable and the bits."],
        ],
      },
    ],

    "line-coding": [
      {
        q: "In NRZ-M, how is a '1' represented?",
        options: [
          ["As a transition", true, "NRZ-M (mark): '1' is a transition, '0' keeps the same voltage."],
          ["As a positive voltage for the whole bit", false, "That is NRZ-L, where the level itself is the bit."],
          ["As a positive pulse that returns to zero mid-bit", false, "That is RZ (Return-to-Zero), which uses the level, not a transition."],
          ["As no change in voltage", false, "That is how NRZ-S represents a '1'. NRZ-M is the opposite."],
        ],
      },
      {
        q: "A transmitter sends a long run of '0's. Which code still produces transitions on the line?",
        options: [
          ["NRZ-L", false, "NRZ-L just stays at zero volts for every '0': completely flat."],
          ["NRZ-S", true, "In NRZ-S every '0' is a transition, so a run of '0's toggles the line every bit. (It goes flat on runs of '1's instead.)"],
          ["NRZ-M", false, "In NRZ-M a '0' keeps the same voltage, so a run of '0's is flat."],
          ["RZ", false, "In RZ a '0' is zero voltage, so a run of '0's is flat."],
        ],
      },
    ],

    manchester: [
      {
        q: "With IEEE 802.3 (Ethernet) Manchester coding, what is a '1'?",
        options: [
          ["A high-to-low transition in the middle of the bit", false, "That is a '1' in the original G. E. Thomas convention, the inverse of 802.3."],
          ["A low-to-high transition in the middle of the bit", true, "IEEE 802.3: '1' is low-to-high, '0' is high-to-low."],
          ["A high level for the whole bit", false, "Manchester always has a transition in the middle of the bit; a flat level would be NRZ."],
          ["No transition at all", false, "Every Manchester bit has a mid-bit transition; that is what makes it self-clocking."],
        ],
      },
      {
        q: "What is the price of Manchester's self-clocking property?",
        options: [
          ["It needs a separate clock wire", false, "Self-clocking means exactly the opposite: no clock wire is needed."],
          ["It cannot send two identical bits in a row", false, "It can; it just inserts an extra transition at the bit boundary between them."],
          ["It requires double the bandwidth", true, "The line may change twice per bit (boundary plus mid-bit), so it needs twice the bandwidth of NRZ."],
          ["The receiver must count the 1s", false, "The receiver reads the direction of each mid-bit transition; no counting is needed."],
        ],
      },
    ],

    "long-wires": [
      {
        q: "Which of these is <em>not</em> one of the side-effects of long wires listed in the lecture?",
        options: [
          ["Wires pick up electromagnetic interference", false, "This is listed: long wires act like antennas."],
          ["The ground level at both sides is not the same", false, "This is listed: the two ends' grounds can differ."],
          ["High frequencies get attenuated", false, "This is listed: the wire's resistance and capacitance round the edges."],
          ["The bits arrive in a different order", true, "A single wire keeps the bits in order. The problems are interference, ground offsets and attenuation, which together cause bit errors."],
        ],
      },
      {
        q: "Why does a higher bit rate make a long wire more likely to produce errors?",
        options: [
          ["Shorter bits are attenuated more, so their edges are too rounded to reach the threshold in time", true, "The wire acts like a low-pass filter. Short bits are high-frequency content, so they suffer most from the attenuation."],
          ["Higher bit rates use higher voltages", false, "The voltage levels do not depend on the bit rate."],
          ["The receiver's threshold changes with the bit rate", false, "The threshold stays the same; it is the received signal that degrades."],
          ["Interference only exists at high bit rates", false, "Interference is picked up at any bit rate; the attenuation is what gets worse with speed."],
        ],
      },
    ],

    differential: [
      {
        q: "On balanced lines, interference adds +2 V to both P and N. What happens to the differential signal P - N?",
        options: [
          ["It rises by 2 V", false, "Both wires rise by 2 V, so their difference is unchanged."],
          ["It rises by 4 V", false, "The noise is subtracted, not added."],
          ["It flips sign", false, "Adding the same voltage to both wires cannot change which one is higher."],
          ["It is unchanged: the common noise cancels", true, "P - N = (P + n) - (N + n) = P - N: the noise n that both wires picked up cancels. That is the noise cancellation of balanced lines."],
        ],
      },
      {
        q: "With V" + sub("S") + " = 3.3 V on each line, what swing does the receiver see in P - N?",
        options: [
          ["0 to 3.3 V", false, "That is the single-ended swing of one wire."],
          ["From -3.3 V to +3.3 V", true, "For '1', P - N = V" + sub("S") + " - 0; for '0', 0 - V" + sub("S") + ". The difference is double the signal voltage, which adds noise resilience."],
          ["0 to 1.65 V", false, "Halving would make things worse; the differential signal is larger, not smaller."],
          ["Always 0 V", false, "Only the noise cancels; the signal (P and N are opposites) adds up."],
        ],
      },
    ],

    sync: [
      {
        q: "Why can long periods without a change on the line cause de-synchronisation?",
        options: [
          ["The voltage slowly drops to zero", false, "The level is held; the problem is timing, not voltage."],
          ["The receiver's own clock drifts and has no transition to re-align on", true, "Each device has its own clock. Transitions are the receiver's chance to re-align; without them the timing error keeps growing until a bit is missed or doubled."],
          ["The transmitter stops sending", false, "The transmitter is still sending identical bits; they just produce no transitions."],
          ["The receiver's threshold changes", false, "The threshold is fixed; the issue is when the receiver samples."],
        ],
      },
      {
        q: "What is bit stuffing?",
        options: [
          ["Adding bits to force a transition, which the receiver removes again", true, "After a run of identical bits the transmitter inserts an opposite bit. The receiver knows the rule and drops it."],
          ["Padding a frame to a minimum length", false, "That is padding (e.g. Ethernet pads payloads to 46 bytes), not stuffing."],
          ["Sending each bit twice for reliability", false, "Repetition would be an error-correction technique; stuffing is about synchronisation."],
          ["Compressing the data before sending", false, "Stuffing adds bits; it never compresses."],
        ],
      },
    ],

    usb: [
      {
        q: "In USB 2.0's NRZ-I (NRZ-S) coding, how is a logic '0' sent?",
        options: [
          ["As D+ low for the whole bit", false, "USB does not use levels for the bits. A '0' is a change, wherever the line currently is."],
          ["As no change in voltage level", false, "That is a logic '1'."],
          ["As a change in voltage level", true, "Logic '0' toggles D+ and D-; logic '1' leaves them unchanged."],
          ["As a short pulse", false, "That would be RZ; USB uses NRZ-I."],
        ],
      },
      {
        q: "A USB transmitter is about to send 8 consecutive '1's. How many bits go on the wire?",
        options: [
          ["8", false, "After the 6th '1' a '0' must be stuffed, so there is one extra bit."],
          ["10", false, "Only one stuffed bit is needed: after six '1's. The remaining two '1's do not reach six again."],
          ["7", false, "Stuffing never removes data bits; it only adds."],
          ["9", true, "Six '1's, a stuffed '0', then the remaining two '1's: 9 bits."],
        ],
      },
    ],

    "data-link": [
      {
        q: "Which of these is a task of the Medium Access Control (MAC) part of the data link layer?",
        options: [
          ["Coordinating access to a shared medium", true, "The MAC sublayer handles frame format and synchronisation, physical addressing, error detection and coordinating access to the medium."],
          ["Routing packets between networks", false, "Routing across networks is the Network layer (3)."],
          ["Line coding of the bits", false, "Line coding is a Physical layer procedure."],
          ["Encrypting the payload", false, "Encryption belongs to the Presentation layer (6)."],
        ],
      },
      {
        q: "Retransmissions and acknowledgements belong to which part of the data link layer?",
        options: [
          ["The Physical layer", false, "That is a different layer altogether, and it does not know about frames."],
          ["The Logical Link part", true, "Logical link: common interface to the protocols above, error control (retransmissions, acks) and flow control."],
          ["The MAC part", false, "MAC detects errors, but error <em>control</em> (retransmitting) is the logical link's job."],
          ["Neither; only the application can retransmit", false, "Error control is explicitly part of the data link layer's logical link sublayer."],
        ],
      },
    ],

    frames: [
      {
        q: "Which frame field does the receiver use to synchronise?",
        options: [
          ["The payload", false, "The payload is the higher-level data; it can be anything."],
          ["The error detection code", false, "That code checks for bit flips at the end."],
          ["The start field", true, "The start designates the beginning of the frame and gives the receiver a known pattern to synchronise on."],
          ["The end field", false, "The end comes too late to help receive the frame."],
        ],
      },
      {
        q: "Where would you expect to find the addresses in a typical frame?",
        options: [
          ["In the end field", false, "The end only marks where the frame stops."],
          ["In the error detection field", false, "That field holds the check code."],
          ["In the payload", false, "The payload carries the higher-level data; the link-level addresses come before it."],
          ["In the header", true, "The header carries protocol-specific information such as configuration and addresses."],
        ],
      },
    ],

    "error-detection": [
      {
        q: "A frame protected by a single parity bit has two of its bits flipped. What happens?",
        options: [
          ["The parity check detects it", false, "Two flips keep the number of '1's even (or odd), so parity sees nothing wrong."],
          ["The error goes undetected", true, "Parity only detects an odd number of flipped bits. A CRC would very likely catch this."],
          ["The parity bit corrects both bits", false, "Parity can only detect (some) errors, never correct them."],
          ["The frame is automatically retransmitted by the physical layer", false, "Nothing triggers a retransmission if no error is detected."],
        ],
      },
      {
        q: "What does a receiver do when the CRC it computes does not match the received one?",
        options: [
          ["Discards the frame", true, "The frame is known to be corrupted, so it is dropped. Getting a new copy is up to error control (e.g. retransmission)."],
          ["Corrects the wrong bits using the CRC", false, "A CRC is used here for detection only."],
          ["Accepts the frame but marks it", false, "A corrupted frame is never passed up as if it were good."],
          ["Asks the physical layer to resend the bits", false, "The physical layer only moves bits; it has no notion of frames to resend."],
        ],
      },
    ],

    sharing: [
      {
        q: "Two devices transmit on a shared bus at the same time. What is this called, and what happens?",
        options: [
          ["Arbitration: the faster device wins", false, "Speed has nothing to do with it; on a plain shared bus both signals simply overlap."],
          ["Polling: the coordinator sorts it out", false, "Polling exists to prevent this situation, not to fix it."],
          ["A collision: the signals overlap and both frames are destroyed", true, "That is why a medium access control scheme is needed."],
          ["Nothing: the bus is full-duplex", false, "A single shared bus carries one transmission at a time."],
        ],
      },
      {
        q: "Which two questions must a medium access control scheme answer, according to the lecture?",
        options: [
          ["Which cable to use and how long it may be", false, "Those are physical layer questions."],
          ["How to encrypt frames and who holds the key", false, "Encryption is not a MAC concern."],
          ["How to route and how to address", false, "Routing is the network layer; addressing is only part of the MAC's job."],
          ["How to avoid collisions, and who gets priority", true, "These are the two questions on the 'Sharing the medium' slide."],
        ],
      },
    ],

    polling: [
      {
        q: "What is a key advantage of polling?",
        options: [
          ["Bounded latency", true, "Every device is polled within one cycle, so the worst-case wait is known in advance."],
          ["Devices can talk to each other directly", false, "The opposite: all communication goes through the coordinator."],
          ["No single point of failure", false, "The coordinator is a single point of failure."],
          ["No overhead", false, "Polling has overhead: every poll costs time, even for devices with nothing to send."],
        ],
      },
      {
        q: "Device 2 wants to send data to device 4 on a polled bus. What happens?",
        options: [
          ["Device 2 sends directly to device 4 whenever the bus is free", false, "Devices only transmit when polled, and only to the coordinator."],
          ["It goes through the coordinator: device 2 sends when polled, the coordinator forwards it to device 4", true, "Device-to-device communication is not possible directly; the coordinator relays, which adds overhead and delay."],
          ["Device 4 polls device 2", false, "Only the coordinator polls."],
          ["It is impossible on a polled bus", false, "It is possible, just indirect, via the coordinator."],
        ],
      },
    ],

    csma: [
      {
        q: "In CSMA, a device senses the medium and finds it busy. What does it do?",
        options: [
          ["Transmits anyway", false, "That would guarantee a collision; CSMA is listen-before-talk."],
          ["Gives up the frame", false, "It does not give up; it waits."],
          ["Waits and transmits when the medium becomes idle", true, "Busy: wait; idle: transmit. That is carrier sense."],
          ["Asks the coordinator for permission", false, "CSMA has no coordinator; that would be polling."],
        ],
      },
      {
        q: "Two CSMA devices sense an idle medium at the same moment and transmit. What do they know afterwards?",
        options: [
          ["They both know the frames collided", false, "Plain CSMA transmitters do not monitor while sending, so they are not aware of the collision."],
          ["The device with the lower address knows it won", false, "There is no address-based arbitration in plain CSMA; both frames are corrupted."],
          ["They know because the receiver sends a NACK on the bus immediately", false, "Nothing like that is part of CSMA itself."],
          ["Nothing: transmitters are not aware that a collision happened", true, "Both send their whole frame and the receiver gets corrupted data. Collision detection (CSMA/CD) fixes this."],
        ],
      },
    ],

    "csma-cd": [
      {
        q: "What does a CSMA/CD transmitter do when it detects a collision?",
        options: [
          ["Stops, waits a random time, and tries again", true, "Collisions are stopped early without wasting much bandwidth, and the frame is retransmitted after a random backoff."],
          ["Finishes the frame and hopes for the best", false, "That is plain CSMA. Collision detection lets it stop early."],
          ["Immediately retransmits the same frame", false, "Both devices would collide again; the random wait is essential."],
          ["Waits for the receiver to poll it", false, "There is no polling in CSMA/CD."],
        ],
      },
      {
        q: "Why is the backoff after a collision <em>random</em>?",
        options: [
          ["To save energy", false, "Energy is not the reason; a fixed wait would cost the same energy."],
          ["So that the colliding devices are unlikely to pick the same wait and collide again", true, "If both waited the same fixed time, they would retry together and collide forever."],
          ["Because the clocks are not synchronised", false, "Clock drift is a physical layer topic; the randomness is a MAC design choice."],
          ["To give priority to the device with the smallest ID", false, "That is CAN arbitration, not random backoff."],
        ],
      },
    ],

    beb: [
      {
        q: "With binary exponential backoff and CW = 3, which backoff values are possible?",
        options: [
          ["0 to 3", false, "That is the range for CW = 2."],
          ["0 to 8", false, "The range is [0, 2" + "<sup>CW</sup>" + " - 1] = [0, 7]."],
          ["0 to 7", true, "bo is in [0, 2<sup>3</sup> - 1] = [0, 7]."],
          ["1 to 3", false, "0 is always allowed, and the window grows exponentially with CW."],
        ],
      },
      {
        q: "What happens to CW after each collision, and after a successful transmission?",
        options: [
          ["It halves after a collision and doubles after success", false, "That is backwards: collisions mean heavy traffic, so the window must grow."],
          ["It stays fixed at 1", false, "Then devices would keep colliding in heavy traffic: the window would be too small."],
          ["It grows by 1 after a collision and resets to 1 after a success", true, "Since the range is 2<sup>CW</sup>, +1 doubles the window. The reset avoids long idle times once traffic is light again."],
          ["It resets after a collision and grows after success", false, "That would make repeated collisions more likely, not less."],
        ],
      },
    ],

    prioritisation: [
      {
        q: "How does probabilistic prioritisation give a device higher priority?",
        options: [
          ["By giving it a lower ID", false, "Lower IDs mean higher priority on the CAN bus, not in CSMA backoff."],
          ["By letting it skip carrier sense", false, "Every device still listens before talking."],
          ["By letting it transmit for longer", false, "Frame length is not how priority works here."],
          ["By starting it with a smaller contention window", true, "A smaller window means smaller backoffs on average, so it usually transmits first."],
        ],
      },
      {
        q: "A high-priority device uses CW = 1 (bo 0 or 1) and a low-priority device CW = 8 (bo 0 to 255). Can the low-priority device go first?",
        options: [
          ["Yes, rarely: only if it draws 0 while the other draws 1", true, "Probability (1/256) x (1/2) = 1/512. 'Low priority devices can transmit before high priority devices if lucky!'"],
          ["No, never", false, "The prioritisation is probabilistic, not strict; a lucky draw of 0 can win."],
          ["Yes, about half of the time", false, "Its window is 128 times larger; it almost always draws a larger value."],
          ["Only if the high-priority device is switched off", false, "Even when both contend, a lucky draw can let the low-priority device win."],
        ],
      },
    ],

    "csma-ca": [
      {
        q: "When is CSMA/CA used instead of CSMA/CD?",
        options: [
          ["When the bus has a coordinator", false, "A coordinator would mean polling."],
          ["When devices cannot sense the medium while they are transmitting", true, "Then collisions cannot be detected and stopped early, so they are expensive and worth avoiding up front."],
          ["When the traffic is very light", false, "Light traffic is where all CSMA variants do well; that is not what decides CD vs CA."],
          ["When frames are very short", false, "Frame length is not the deciding factor in the lecture."],
        ],
      },
      {
        q: "In CSMA/CA, what does a device do if the channel is busy when it wants to send?",
        options: [
          ["Transmits the moment the channel becomes idle", false, "That is what plain CSMA does, and it makes waiting devices collide."],
          ["Gives up", false, "It waits, it does not give up."],
          ["Asks the receiver for a time slot", false, "Not part of the lecture's CSMA/CA description."],
          ["Waits a random time before attempting its first transmission", true, "The random wait (with binary exponential backoff) spreads out devices that were waiting, at a cost in bandwidth."],
        ],
      },
    ],

    "csma-tradeoffs": [
      {
        q: "Which is a <em>disadvantage</em> of CSMA?",
        options: [
          ["Unbounded latency for individual frames", true, "A device can, in theory, wait forever for an idle medium. Polling, by contrast, has bounded latency."],
          ["High latency when traffic is low", false, "The opposite: in low traffic CSMA is fast because nobody waits for a turn."],
          ["Devices cannot be added easily", false, "CSMA is flexible: devices can be added or removed freely."],
          ["It needs a coordinator", false, "CSMA is decentralised; it has no coordinator."],
        ],
      },
      {
        q: "Why does CSMA perform poorly under heavy traffic?",
        options: [
          ["The coordinator becomes a bottleneck", false, "There is no coordinator in CSMA."],
          ["Frames get longer", false, "Frame lengths do not change with traffic."],
          ["Collisions become very likely, wasting the medium", true, "With many devices waiting, several often start together; collisions and backoffs eat the capacity."],
          ["The wire gets warmer", false, "This is a protocol effect, not a physical one."],
        ],
      },
    ],

    "can-bus": [
      {
        q: "On a high-speed CAN bus, what are CANH and CANL for a dominant '0'?",
        options: [
          ["CANH 2.5 V, CANL 2.5 V", false, "That is the recessive '1' state, set by the resistors."],
          ["CANH 3.5 V, CANL 1.5 V", true, "A dominant '0' is actively driven: CANH up to 3.5 V and CANL down to 1.5 V, a 2 V difference."],
          ["CANH 5 V, CANL 0 V", false, "Those are the low-speed CAN levels for a dominant '0'."],
          ["CANH 0 V, CANL 5 V", false, "Those are the low-speed CAN levels for a recessive '1'."],
        ],
      },
      {
        q: "On CAN, which bit value is actively driven?",
        options: [
          ["'1', called dominant", false, "'1' is the passive (recessive) state, set by resistors."],
          ["Both, alternately", false, "Only one value is driven; that asymmetry is what makes arbitration work."],
          ["Neither, both are set by resistors", false, "The dominant state is actively driven."],
          ["'0', called dominant", true, "'0' is actively driven (dominant); '1' is transmitted passively (recessive)."],
        ],
      },
    ],

    dominant: [
      {
        q: "Three CAN nodes send the bits 1, 0 and 1 at the same moment. What is the bus state?",
        options: [
          ["'1', the majority", false, "There is no majority vote: one dominant '0' is enough."],
          ["Undefined, a short circuit", false, "No short: a '1' is never driven, so the driven '0' simply wins."],
          ["'0'", true, "'0' is actively driven while '1' is passive, so any single '0' pulls the bus to '0'."],
          ["It depends on which node is closest", false, "Position on the bus does not matter for the logical state."],
        ],
      },
      {
        q: "When is the CAN bus in the recessive '1' state?",
        options: [
          ["Only when all nodes transmit '1' (or nobody transmits)", true, "The bus is the AND of all transmitted bits: a single '0' makes it '0'."],
          ["When at least one node transmits '1'", false, "A '1' from one node is overruled by any '0' from another."],
          ["When most nodes transmit '1'", false, "The bus does not count votes; '0' always wins."],
          ["Never; the bus is always driven", false, "The recessive state is exactly when nothing drives the bus."],
        ],
      },
    ],

    arbitration: [
      {
        q: "Three CAN nodes start arbitration with IDs 0x65B, 0x3C2 and 0x35C. Which one wins?",
        options: [
          ["0x65B", false, "It is the largest ID. Its first ID bit is '1' while the others send '0', so it loses straight away."],
          ["0x3C2", false, "It loses to 0x35C at the first ID bit where they differ (0x3C2 sends '1', 0x35C sends '0')."],
          ["0x35C", true, "The lowest ID wins: at every bit where the IDs differ, the lower ID sends the dominant '0'."],
          ["None, they collide and all retry", false, "CAN arbitration is non-destructive: exactly one (the lowest unique ID) continues."],
        ],
      },
      {
        q: "A node sends a '1' during arbitration but reads '0' on the bus. What does it do?",
        options: [
          ["Sends an error frame", false, "This is normal arbitration, not an error."],
          ["Stops transmitting and tries again later", true, "It has lost arbitration to a higher-priority (lower ID) frame, which continues undamaged."],
          ["Keeps sending; the receiver sorts it out", false, "It must stop, or it would corrupt the winning frame."],
          ["Switches to sending '0'", false, "That would corrupt its own ID; it simply stops."],
        ],
      },
    ],

    "can-frame-types": [
      {
        q: "A CAN transmitter is about to send the bits 0000011. What goes on the bus (stuffing rule: opposite bit after 5 equal bits)?",
        options: [
          ["0000011", false, "Five consecutive '0's require a stuffed '1'."],
          ["00000011", false, "The stuffed bit has the opposite polarity: a '1', not a '0'."],
          ["0000101", false, "Stuffing inserts an extra bit; it never replaces a data bit."],
          ["00000111", true, "After the five '0's a '1' is stuffed, then the data continues with 1 1. The receiver removes the stuffed bit."],
        ],
      },
      {
        q: "How many unique identifiers do extended CAN frames offer?",
        options: [
          ["2048", false, "That is 2<sup>11</sup>, the standard format."],
          ["About 537 million", true, "Extended frames have 29-bit IDs: 2<sup>29</sup> = 536,870,912."],
          ["About 4 billion", false, "That would be 32 bits."],
          ["65,536", false, "That would be 16 bits."],
        ],
      },
    ],

    "can-frames": [
      {
        q: "In a standard CAN data frame, what does the DLC field contain?",
        options: [
          ["The number of data bytes that follow (0 to 8)", true, "DLC (data length code, 4 bits): the number of bytes in the DATA field."],
          ["The sender's ID", false, "The ID is in the 11-bit ID field."],
          ["The CRC", false, "The CRC has its own 16-bit field (15-bit code plus delimiter)."],
          ["The number of nodes on the bus", false, "CAN frames do not count nodes."],
        ],
      },
      {
        q: "How does a CAN receiver acknowledge a frame?",
        options: [
          ["It sends its own ACK frame afterwards", false, "No separate frame is needed: the acknowledgement happens inside the transmitter's frame."],
          ["It waits for the EOF and then pulls the bus high", false, "Pulling high is not possible: '1' is recessive. The ACK is a dominant '0'."],
          ["It overwrites the ACK slot with a dominant '0' while the frame is being sent", true, "The transmitter sends a recessive '1' in the ACK slot; any receiver that got the frame without errors drives it to '0'."],
          ["It repeats the CRC back to the sender", false, "The CRC is only checked locally by each receiver."],
        ],
      },
    ],

    "can-pros-cons": [
      {
        q: "Which is a disadvantage of the CAN bus?",
        options: [
          ["High latency for vital, high-priority traffic", false, "The opposite: CAN gives strong prioritisation to vital traffic."],
          ["Weak error checking", false, "CAN has abundant error checking (CRC, ACK, delimiters, bit monitoring, stuffing rule)."],
          ["Collisions destroy both frames", false, "Arbitration is non-destructive: the highest-priority frame goes through intact."],
          ["Low-priority nodes can starve in high traffic", true, "If high-priority frames keep coming, they keep winning arbitration, and low-priority nodes may wait indefinitely."],
        ],
      },
      {
        q: "Which of these is <em>not</em> one of CAN's error-checking procedures from the lecture?",
        options: [
          ["CRC and ACK", false, "Listed: CRC and ACK at message level."],
          ["Encrypting every frame", true, "Encryption is not an error check, and plain CAN does not encrypt frames."],
          ["Reading back transmitted bits for inconsistencies", false, "Listed: transmitters monitor the bus while sending."],
          ["No more than 5 consecutive bits of the same level", false, "Listed: the bit stuffing rule, which receivers can also check."],
        ],
      },
    ],

    ethernet: [
      {
        q: "What was the bit rate of 10BASE5, the first Ethernet standard?",
        options: [
          ["2.94 Mbps", false, "That was Xerox's original 1976 Ethernet, before standardisation."],
          ["100 Mbps", false, "That came much later (e.g. 100BASE-TX)."],
          ["10 Mbps", true, "10BASE5 is 10 Mbps; the number in the name is the rate in Mbps."],
          ["400 Gbps", false, "That is today's top end in data centres."],
        ],
      },
      {
        q: "How much data can one Ethernet frame carry at most?",
        options: [
          ["1500 bytes", true, "Up to 1500 bytes of data per frame (the payload)."],
          ["8 bytes", false, "That is the maximum for a CAN frame."],
          ["64 bytes", false, "64 bytes is close to the minimum Ethernet frame size, not the maximum payload."],
          ["Unlimited", false, "The payload field has a maximum of 1500 bytes."],
        ],
      },
    ],

    "mac-address": [
      {
        q: "What do the first 24 bits of a MAC address identify?",
        options: [
          ["The specific device", false, "That is the last 24 bits, the hardware identifier."],
          ["The network the device is on", false, "MAC addresses do not encode the network; they are fixed per interface."],
          ["The manufacturer (OUI, assigned by IEEE)", true, "The Organizationally Unique Identifier is assigned to the manufacturer by IEEE; the rest is assigned by the manufacturer."],
          ["The port on the switch", false, "Switches learn ports separately; the address does not contain them."],
        ],
      },
      {
        q: "A frame is sent to FF:FF:FF:FF:FF:FF. Who receives it?",
        options: [
          ["Nobody, it is an invalid address", false, "It is a valid, special address."],
          ["Only the switch", false, "Switches forward it; they are not the destination."],
          ["The device with the highest address", false, "There is no such rule."],
          ["Every interface on the network: it is the broadcast address", true, "All-ones is the broadcast address; switches flood it to all ports."],
        ],
      },
    ],

    "eth-frame": [
      {
        q: "Why is the destination MAC address the first field after the preamble and SFD?",
        options: [
          ["So receivers can quickly decide whether the frame is for them", true, "A device can stop processing after six bytes if the frame is not addressed to it (or broadcast)."],
          ["Because it is the longest field", false, "The payload is far longer; length is not the reason."],
          ["So the CRC can be computed faster", false, "The CRC covers the frame regardless of field order."],
          ["Because the source address is optional", false, "The source address is always present; it is just second."],
        ],
      },
      {
        q: "An application sends 20 bytes of data in one Ethernet frame. How large is the payload field?",
        options: [
          ["20 bytes", false, "The payload has a minimum of 46 bytes; shorter data is padded."],
          ["46 bytes: 20 of data plus 26 of padding", true, "Padding is added to reach the minimum 46 bytes. The Length field still says 20."],
          ["64 bytes", false, "64 bytes is the minimum size of the frame from destination address to FCS (6 + 6 + 2 + 46 + 4), not of the payload."],
          ["1500 bytes", false, "1500 is the maximum; frames are not padded up to it."],
        ],
      },
    ],

    "original-ethernet": [
      {
        q: "What medium and topology did 10BASE2 and 10BASE5 use?",
        options: [
          ["Twisted pairs in a star around a switch", false, "That is 10BASE-T and later."],
          ["A single coaxial cable in a bus topology", true, "One shared coax cable (half-duplex), with repeater hubs, and CSMA/CD for access."],
          ["Optical fibre in a ring", false, "The original Ethernet used copper coaxial cable, and a bus rather than a ring."],
          ["Radio links", false, "Ethernet is a wired standard; the original used a coaxial cable."],
        ],
      },
      {
        q: "Why did the original Ethernet need CSMA/CD?",
        options: [
          ["Because all devices shared one cable, so their transmissions could collide", true, "On a shared bus only one device can send at a time; CSMA/CD detects collisions and backs off."],
          ["Because it used Manchester coding", false, "Manchester coding solves synchronisation, not medium sharing."],
          ["Because the cables were short", false, "Cable length is not why medium access control is needed."],
          ["To encrypt the frames", false, "CSMA/CD has nothing to do with encryption."],
        ],
      },
    ],

    switch: [
      {
        q: "How does a switch learn which port a device is on?",
        options: [
          ["From the destination address of the frames it forwards", false, "Destination addresses tell it where frames want to go, not where devices are."],
          ["The administrator types in every address", false, "No manual table is needed; the switch learns by itself."],
          ["From the source address of each frame it receives, and the port it arrived on", true, "It maps the source MAC to the incoming port, with an expiry time on each entry."],
          ["It pings every port at start-up", false, "Learning is passive, from normal traffic."],
        ],
      },
      {
        q: "A switch receives a frame for a MAC address that is not in its table. What does it do?",
        options: [
          ["Drops it", false, "Dropping would break communication with devices that have not sent anything yet."],
          ["Repeats it to all ports (except the one it came in on)", true, "Like a hub, but only until it learns where that address lives."],
          ["Sends it back to the sender", false, "There is no such rule."],
          ["Waits until the address appears in the table", false, "It does not hold frames; it floods them."],
        ],
      },
    ],

    "common-ethernet": [
      {
        q: "Why are there no collisions in 10BASE-T/100BASE-TX with full-duplex links?",
        options: [
          ["Because they use Manchester coding", false, "100BASE-TX does not even use Manchester; the coding is not the reason."],
          ["Because frames are shorter", false, "Frame sizes are the same as in older Ethernet."],
          ["Because a switch slows everyone down", false, "Switches make things faster, not slower."],
          ["Each direction has its own twisted pair, and each link connects only two devices", true, "TX and RX pairs are separate (full-duplex), and point-to-point or switched links share no medium, so nobody can talk over anyone."],
        ],
      },
      {
        q: "Which line coding does 10BASE-T use?",
        options: [
          ["Manchester", true, "10BASE-T keeps Manchester encoding; 100BASE-TX switched to 4B/5B with MLT-3."],
          ["MLT-3", false, "MLT-3 is used by 100BASE-TX."],
          ["PAM-5", false, "PAM-5 belongs to 1000BASE-T."],
          ["NRZ-L", false, "Not used by 10BASE-T."],
        ],
      },
    ],

    mlt3: [
      {
        q: "MLT-3 starts at level 0, and the next step in its order is -1. It encodes the bits 1 1 0. What are the levels?",
        options: [
          ["-1, 0, 0", true, "The first '1' moves to -1, the second '1' to 0, and the '0' stays at 0."],
          ["-1, 0, +1", false, "A '0' is no transition, so the third bit stays at 0."],
          ["+1, +1, 0", false, "Each '1' moves one step in the order 0, -1, 0, +1, so from 0 the first step goes to -1."],
          ["0, -1, -1", false, "The first '1' must already be a transition."],
        ],
      },
      {
        q: "What is MLT-3's main weakness?",
        options: [
          ["It needs four voltage levels", false, "It uses three: -1, 0, +1."],
          ["It cannot send '1's", false, "A '1' is simply a transition."],
          ["Long runs of '0's produce no transitions, which leads to loss of synchronisation", true, "That is why 100BASE-TX combines it with 4B/5B."],
          ["Its transitions are too large", false, "Its transitions are small, which is its advantage."],
        ],
      },
    ],

    "enc-4b5b": [
      {
        q: "100BASE-TX carries 100 Mbps of data with 4B/5B. What rate is actually transmitted?",
        options: [
          ["80 Mbps", false, "Encoding adds bits; the line rate must go up, not down."],
          ["100 Mbps", false, "Every 4 data bits become 5 line bits, so the line must run faster."],
          ["200 Mbps", false, "That would be a 1:2 code (like Manchester)."],
          ["125 Mbps", true, "100 x 5/4 = 125 Mbps (125 Mbaud with MLT-3 carrying one bit per symbol)."],
        ],
      },
      {
        q: "Why does 4B/5B avoid 5-bit codes with fewer than two '1's?",
        options: [
          ["To guarantee frequent transitions once the bits are sent with MLT-3", true, "In MLT-3 every '1' is a transition, so enough '1's in each code word keeps the receiver synchronised."],
          ["To save bandwidth", false, "4B/5B costs bandwidth (25% more bits)."],
          ["Because '0's are harder to transmit", false, "Zeros are easy to transmit; they just produce no transitions in MLT-3."],
          ["To encrypt the data", false, "4B/5B is a fixed public table, not encryption."],
        ],
      },
    ],

    automotive: [
      {
        q: "How many twisted pairs does 100BASE-T1 use?",
        options: [
          ["4", false, "Four pairs is 1000BASE-T (Gigabit Ethernet), not automotive Ethernet."],
          ["2", false, "That is classic 100BASE-TX (one pair each way)."],
          ["1, used in both directions at once with echo cancellation", true, "A single bi-directional full-duplex pair saves weight and cost in the car."],
          ["None, it is wireless", false, "It is wired Ethernet over a twisted pair."],
        ],
      },
      {
        q: "Which statement about automotive Ethernet (100BASE-T1) is correct?",
        options: [
          ["It needs a new MAC layer", false, "It is transparent to the MAC layer: same frames, different physical layer."],
          ["It runs at 125 MBd with 4B5B MLT-3", false, "That is classic 100BASE-TX. 100BASE-T1 uses 4B3B with PAM-3 at 66.66 MBd."],
          ["It replaces CAN because CAN is too expensive", false, "The motivation is data rate (cameras, infotainment) plus weight and cost of cabling."],
          ["It supports at most 15 m, which is enough in a car", true, "Dropping the 100 m requirement made the single-pair design practical."],
        ],
      },
    ],

    gigabit: [
      {
        q: "How does 1000BASE-T reach 1000 Mbps at only 125 MBd per pair?",
        options: [
          ["4 pairs in parallel, 2 bits per symbol on each: 4 x 2 x 125 = 1000", true, "8 bits are transmitted per symbol period, over four full-duplex pairs with echo cancellation."],
          ["By using 4B/5B on one pair", false, "One pair at 125 MBd with 4B/5B gives 100 Mbps (100BASE-TX)."],
          ["By using Manchester at 2 GBd", false, "It uses 4D-PAM-5, not Manchester, and stays at 125 MBd."],
          ["By compressing the data", false, "The physical layer does not compress."],
        ],
      },
      {
        q: "In 1000BASE-T's PAM-5, what are the five levels used for?",
        options: [
          ["Five data bits per symbol", false, "Five levels cannot carry five bits; they carry 2 bits plus redundancy."],
          ["Four levels (-2, -1, 1, 2) encode 2 bits; the level 0 is used for error correction", true, "Two bits need four levels; the fifth gives the coding redundancy used for error correction."],
          ["One level per pair, plus a clock", false, "There is no separate clock level."],
          ["They mark the start and end of frames", false, "Frame delimiting is not what the extra level is for."],
        ],
      },
    ],
  };

  /* =====================================================================
     Shared helpers
     ===================================================================== */
  const C = (v) => NES.css(v);
  const font = (ctx, px, bold) => (ctx.font = (bold ? "bold " : "") + px + "px " + (C("--font") || "sans-serif"));
  const canvas = (hgt, aria) => h("canvas", { style: "height:" + hgt + "px", role: "img", "aria-label": aria });
  const stage = (child) => h("div", { class: "stage" }, [child]);
  const S2B = (s) => s.replace(/[^01]/g, "").split("").map(Number);
  const pct = (x, d) => (x * 100).toFixed(d == null ? 1 : d) + "%";
  const trimNum = (x, d) => { const t = x.toFixed(d); return t.indexOf(".") === -1 ? t : t.replace(/0+$/, "").replace(/\.$/, ""); };
  const fmtTime = (s) => (s >= 1e-3 ? trimNum(s * 1e3, 3) + " ms" : s >= 1e-6 ? trimNum(s * 1e6, 2) + " µs" : trimNum(s * 1e9, 1) + " ns");

  function label(ctx, txt, x, y, color, px, bold, align) {
    font(ctx, px || 11, bold);
    ctx.fillStyle = color || C("--muted");
    ctx.textAlign = align || "start";
    ctx.fillText(txt, x, y);
    ctx.textAlign = "start";
  }

  // step trace from segments [[t0, t1, v]]
  function trace(ctx, segs, X, Y, color, lw, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 2; ctx.setLineDash(dash || []);
    ctx.beginPath();
    segs.forEach(([a, b, v], i) => { const y = Y(v); if (!i) ctx.moveTo(X(a), y); else ctx.lineTo(X(a), y); ctx.lineTo(X(b), y); });
    ctx.stroke(); ctx.setLineDash([]);
  }

  // labelled hexagon cells like the slides' timing diagrams
  function cells(ctx, list, X, yMid, half, opts) {
    const o = opts || {};
    font(ctx, o.size || 11, true);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    list.forEach((c) => {
      const a = X(c.a), b = X(c.b), e = Math.min(5, (b - a) / 4);
      ctx.beginPath();
      ctx.moveTo(a, yMid); ctx.lineTo(a + e, yMid - half); ctx.lineTo(b - e, yMid - half); ctx.lineTo(b, yMid); ctx.lineTo(b - e, yMid + half); ctx.lineTo(a + e, yMid + half); ctx.closePath();
      if (c.fill) { ctx.fillStyle = c.fill; ctx.globalAlpha = c.alpha || 0.25; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.strokeStyle = c.stroke || C("--line-2"); ctx.lineWidth = c.lw || 1.2; ctx.stroke();
      if (c.hatch) {
        ctx.save(); ctx.clip(); ctx.strokeStyle = C("--line-2"); ctx.lineWidth = 1;
        for (let x = a - 2 * half; x < b; x += 6) { ctx.beginPath(); ctx.moveTo(x, yMid + half); ctx.lineTo(x + 2 * half, yMid - half); ctx.stroke(); }
        ctx.restore();
      }
      if (c.label && ctx.measureText(c.label).width + 4 < b - a) { ctx.fillStyle = c.color || C("--ink"); ctx.fillText(c.label, (a + b) / 2, yMid + 0.5); }
    });
    ctx.textAlign = "start"; ctx.textBaseline = "alphabetic";
  }

  // a row of bit cells (HTML), list: [{t, cls, title}]
  function bitLine(name, list) {
    return `<div class="bitrow-line"><span class="bitrow-label">${name}</span><div class="bits" style="grid-template-columns:repeat(${list.length},minmax(0,1fr))">${list.map((c) => `<span class="${c.cls || ""}"${c.title ? ` title="${c.title}"` : ""}>${c.t}</span>`).join("")}</div></div>`;
  }

  function verdictBox(view) {
    const v = h("div", { class: "verdict" });
    view.append(v);
    return { set(tone, html) { v.className = "verdict" + (tone ? " " + tone : ""); v.innerHTML = html; } };
  }

  // clickable bit editor with optional presets
  function bitEditor(parent, o) {
    const wrap = h("div", { class: "ctl" });
    wrap.append(h("div", { class: "ctl-label" }, [h("span", { html: o.label || "Bits (click a bit to flip it)" })]));
    const grid = h("div", { class: "bit-editor" });
    wrap.append(grid);
    let bits = o.bits.slice();
    const api = {
      onchange: null,
      get bits() { return bits.slice(); },
      set(b) { bits = b.slice(); render(); },
    };
    function render() {
      grid.style.gridTemplateColumns = "repeat(" + bits.length + ",minmax(0,1fr))";
      grid.innerHTML = "";
      bits.forEach((b, i) => {
        const btn = h("button", { type: "button", class: "b" + b, "aria-label": "Bit " + (i + 1) + " is " + b + ", click to flip", text: String(b) });
        btn.addEventListener("click", () => { bits[i] = 1 - bits[i]; render(); if (api.onchange) api.onchange(); });
        grid.append(btn);
      });
    }
    render();
    if (o.presets) {
      const row = h("div", { class: "preset-row" });
      o.presets.forEach(([name, b]) => row.append(h("button", {
        type: "button", class: "btn btn-sm", text: name,
        onclick: () => { api.set(typeof b === "function" ? b(bits.length) : b); if (api.onchange) api.onchange(); },
      })));
      wrap.append(row);
    }
    parent.append(wrap);
    return api;
  }
  const randomBits = (n) => Array.from({ length: n }, () => (Math.random() < 0.5 ? 0 : 1));
  const alternating = (n) => Array.from({ length: n }, (_, i) => (i + 1) % 2);
  const allOf = (v) => (n) => Array.from({ length: n }, () => v);

  // slow random-walk noise with unit standard deviation (like the slide's noise plots)
  function slowNoise(seed, N) {
    const r = NES.rng(seed);
    let x = 0;
    const out = [];
    for (let i = 0; i < N; i++) { x = 0.985 * x + 0.17 * NES.gauss(r); out.push(x + 0.08 * NES.gauss(r)); }
    const m = out.reduce((a, b) => a + b, 0) / N;
    const sd = Math.sqrt(out.reduce((a, b) => a + (b - m) * (b - m), 0) / N) || 1;
    return out.map((v) => (v - m) / sd);
  }

  // draw an analog trace with value axis; returns mapping helpers
  function panel(ctx, w, y0, hgt, vmin, vmax, opts) {
    const o = opts || {};
    const padL = 40, padR = 8;
    const X = (t) => padL + (t / o.tmax) * (w - padL - padR);
    const Y = (v) => y0 + (1 - (NES.clamp(v, vmin, vmax) - vmin) / (vmax - vmin)) * hgt;
    ctx.strokeStyle = C("--line-2"); ctx.lineWidth = 1; ctx.strokeRect(padL, y0, w - padL - padR, hgt);
    ctx.strokeStyle = C("--grid");
    for (let b = 1; b < o.nbits; b++) { const x = X(b); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + hgt); ctx.stroke(); }
    if (o.title) label(ctx, o.title, padL + 4, y0 + 12, C("--muted"), 11, true);
    (o.ticks || []).forEach((v) => label(ctx, String(v), padL - 4, Y(v) + 4, C("--muted"), 10, false, "end"));
    return { X, Y, padL, padR };
  }
  function series(ctx, arr, X, Y, color, lw, dt) {
    ctx.strokeStyle = color; ctx.lineWidth = lw || 1.4; ctx.beginPath();
    arr.forEach((v, i) => { const x = X(i * dt), y = Y(v); if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y); });
    ctx.stroke();
  }
  function hline(ctx, X0, X1, y, color, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = 1.4; ctx.setLineDash(dash || [6, 4]);
    ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(X1, y); ctx.stroke(); ctx.setLineDash([]);
  }
  function dot(ctx, x, y, color, r) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r || 4, 0, Math.PI * 2); ctx.fill(); }

  /* =====================================================================
     LAB: which OSI layer?
     ===================================================================== */
  const LAYERS = [
    [1, "Physical", "Bit"], [2, "Data Link", "Frame"], [3, "Network", "Packet"], [4, "Transport", "Segment"],
    [5, "Session", "Data"], [6, "Presentation", "Data"], [7, "Application", "Data"],
  ];
  const LAYER_ITEMS = [
    ["Encode the bits with Manchester coding before they go on the wire", 1, "Line coding is part of how raw bits are physically represented: Physical layer."],
    ["Check the CRC at the end of a received frame and discard it if it does not match", 2, "Error detection on frames between directly connected nodes is a MAC (Data Link) job."],
    ["Decide which device on a shared bus may transmit next", 2, "Coordinating access to a shared medium is the Medium Access Control part of the Data Link layer."],
    ["Deliver a packet to a node on a different network, through several networks", 3, "Moving packets across multiple networks is the Network layer."],
    ["Hand incoming segments to the right process on the device", 4, "Delivering segments to processes is the Transport layer."],
    ["Encrypt and compress the data", 6, "Translation of data (encryption, compression) is the Presentation layer."],
    ["Open, keep and close a communication session", 5, "Managing sessions is the Session layer."],
    ["Send the voltage difference P - N over a twisted pair", 1, "Differential signalling is a physical means of carrying bits: Physical layer."],
    ["Put the destination MAC address at the start of a frame", 2, "Physical (MAC) addressing and frame format belong to the Data Link layer."],
    ["A distributed application protocol, e.g. asking a remote sensor for its reading", 7, "Distributed application protocols live at the Application layer."],
  ];
  function labLayers(el) {
    const { controls, view } = NES.lab(el, {
      title: "Which layer does that?",
      hint: "Each task belongs to one OSI layer. Pick the layer; the feedback also shows that layer's data unit.",
    });
    const stats = NES.stats(controls, [{ key: "pos", label: "Task" }, { key: "score", label: "Right on first try" }]);
    const restart = h("button", { class: "btn", type: "button", text: "Start over" });
    controls.append(restart);
    const card = h("div", { class: "sorter-card" });
    const item = h("p", { class: "sorter-item" });
    const btns = h("div", { class: "layer-btns" });
    const next = h("button", { class: "btn", type: "button", text: "Next task" });
    card.append(item, btns);
    view.append(card);
    const verdict = verdictBox(view);
    view.append(h("div", { class: "btn-row" }, [next]));
    let order = [], pos = 0, score = 0, tried = false;
    function shuffle() { order = LAYER_ITEMS.map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; } }
    function show() {
      const [text] = LAYER_ITEMS[order[pos]];
      item.textContent = text;
      tried = false;
      btns.innerHTML = "";
      LAYERS.slice().reverse().forEach(([n, name]) => {
        const b = h("button", { type: "button", class: "layer-btn", html: `<b>${n}</b> ${name}` });
        b.addEventListener("click", () => answer(n, b));
        btns.append(b);
      });
      verdict.set("", "Pick the layer that does this.");
      stats.set("pos", (pos + 1) + " / " + LAYER_ITEMS.length);
      stats.set("score", String(score));
    }
    function answer(n, b) {
      const [, right, why] = LAYER_ITEMS[order[pos]];
      const L = LAYERS[right - 1];
      if (n === right) {
        if (!tried) score++;
        b.classList.add("right");
        verdict.set("good", `<b>Layer ${right}, ${L[1]}.</b> ${why} Data unit: <b>${L[2]}</b>.`);
      } else {
        b.classList.add("wrong");
        const W = LAYERS[n - 1];
        verdict.set("bad", `<b>Not layer ${n} (${W[1]}).</b> That layer handles: ${LAYER_FN[n]} Try again.`);
      }
      tried = true;
      stats.set("score", String(score));
    }
    next.addEventListener("click", () => { pos = (pos + 1) % LAYER_ITEMS.length; if (pos === 0) { shuffle(); score = 0; } show(); });
    restart.addEventListener("click", () => { shuffle(); pos = 0; score = 0; show(); });
    shuffle(); show();
  }
  const LAYER_FN = {
    1: "transmission and reception of bits over a physical medium.",
    2: "transmission of frames between physically connected nodes.",
    3: "transmission of packets to nodes over multiple networks.",
    4: "transmission of segments to processes.",
    5: "managing communication sessions.",
    6: "translation of data (encryption, compression).",
    7: "distributed application protocols.",
  };

  /* =====================================================================
     Line codes
     ===================================================================== */
  // returns half-bit levels (2 per bit); NRZ-M and NRZ-S start from a high line, as in the slide figure
  function encode(bits, code) {
    const out = [];
    let lvl = 1;
    bits.forEach((b) => {
      let a, c;
      if (code === "nrzl") { a = c = b; }
      else if (code === "nrzm") { if (b === 1) lvl = 1 - lvl; a = c = lvl; }
      else if (code === "nrzs") { if (b === 0) lvl = 1 - lvl; a = c = lvl; }
      else if (code === "rz") { a = b; c = 0; }
      else if (code === "thomas") { a = b; c = 1 - b; }       // '1' high-to-low, '0' low-to-high
      else if (code === "ieee") { a = 1 - b; c = b; }         // '1' low-to-high, '0' high-to-low
      else if (code === "clock") { a = 1; c = 0; }
      out.push(a, c);
    });
    return out;
  }
  const PREV = { nrzl: null, nrzm: 1, nrzs: 1, rz: 0, thomas: null, ieee: null, clock: null };
  function edgeList(levels, prev) {
    const e = [];
    let last = prev == null ? levels[0] : prev;
    levels.forEach((v, k) => { if (v !== last) e.push(k); last = v; });
    return e; // indices in half-bit units
  }
  function longestFlat(levels, prev) {
    let best = 0, run = 0, last = prev == null ? levels[0] : prev;
    levels.forEach((v) => { run = v !== last ? 1 : run + 1; best = Math.max(best, run); last = v; });
    return best / 2;
  }

  // draw stacked digital rows; rows: [{name, levels, prev, color}]
  function drawCodeRows(ctx, w, hh, bits, rows) {
    const n = bits.length, padL = 54, padR = 8, top = 22;
    const X = (t) => padL + (t / n) * (w - padL - padR);
    const rowH = (hh - top - 4) / rows.length;
    ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
    for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(X(i), 14); ctx.lineTo(X(i), hh - 2); ctx.stroke(); }
    ctx.setLineDash([]);
    bits.forEach((b, i) => label(ctx, String(b), X(i + 0.5), 13, b ? C("--hi") : C("--lo"), 11, true, "center"));
    rows.forEach((r, k) => {
      const yHi = top + k * rowH + 7, yLo = top + (k + 1) * rowH - 9;
      const Y = (v) => (v ? yHi : yLo);
      label(ctx, r.name, 4, (yHi + yLo) / 2 + 4, C("--ink-2"), 11, true);
      const start = r.prev == null ? r.levels[0] : r.prev;
      const segs = [[0, 0, start]].concat(r.levels.map((v, j) => [j / 2, (j + 1) / 2, v]));
      trace(ctx, segs, X, Y, r.color || C("--tech"), 2);
      if (r.showEdges !== false) {
        edgeList(r.levels, r.prev).forEach((j) => dot(ctx, X(j / 2), (yHi + yLo) / 2, j % 2 ? C("--accent") : C("--muted"), 2.6));
      }
    });
  }

  function labLineCode(el) {
    const { controls, view } = NES.lab(el, {
      title: "Line-code your own bits",
      hint: "Click bits to flip them. Dots mark every transition (red dots fall in the middle of a bit). NRZ-M and NRZ-S start from a high line, exactly like the slide figure, so the default pattern reproduces it.",
    });
    const ed = bitEditor(view, {
      bits: S2B("10110001101"),
      presets: [["Slide example", S2B("10110001101")], ["All 0", allOf(0)], ["All 1", allOf(1)], ["Alternating", alternating], ["Random", randomBits]],
    });
    const show = NES.seg(controls, { label: "Highlight", options: [["all", "All codes"], ["nrz", "NRZ only"], ["rz", "RZ only"]], value: "all" });
    controls.append(h("p", { class: "lab-hint", html: "Try <b>All 0</b> and <b>All 1</b>: which codes leave the line flat for the whole sequence?" }));
    const cv = canvas(214, "Line code waveforms");
    view.append(stage(cv));
    const table = h("div", { class: "table-wrap" });
    view.append(table);
    const CODES = [["nrzl", "NRZ-L"], ["nrzm", "NRZ-M"], ["nrzs", "NRZ-S"], ["rz", "RZ"]];
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const sel = show.value;
      const rows = CODES.filter(([c]) => sel === "all" || (sel === "nrz" ? c !== "rz" : c === "rz"))
        .map(([c, name]) => ({ name, levels: encode(ed.bits, c), prev: PREV[c] }));
      drawCodeRows(ctx, w, hh, ed.bits, rows);
    });
    function update() {
      const bits = ed.bits;
      table.innerHTML = `<table class="tt"><thead><tr><th>Code</th><th>Transitions</th><th class="out">Longest flat stretch</th></tr></thead><tbody>` +
        CODES.map(([c, name]) => {
          const lv = encode(bits, c), e = edgeList(lv, PREV[c]).length, f = longestFlat(lv, PREV[c]);
          return `<tr><td>${name}</td><td>${e}</td><td class="out ${f >= bits.length ? "v-bad" : ""}">${trimNum(f, 1)} bit${f === 1 ? "" : "s"}</td></tr>`;
        }).join("") + "</tbody></table>";
      draw();
    }
    ed.onchange = show.onchange = update;
    update();
  }

  function labManchester(el) {
    const { controls, view } = NES.lab(el, {
      title: "Manchester: a transition in every bit",
      hint: "Both Manchester versions put a transition in the middle of every bit (red dots). Compare the longest flat stretch with plain NRZ data, then decode with the wrong convention.",
    });
    const ed = bitEditor(view, {
      bits: S2B("10100111001"),
      presets: [["Slide example", S2B("10100111001")], ["All 0", allOf(0)], ["All 1", allOf(1)], ["Alternating", alternating], ["Random", randomBits]],
    });
    const rx = NES.seg(controls, { label: "Receiver decodes the 802.3 line as", options: [["ieee", "IEEE 802.3"], ["thomas", "G. E. Thomas"]], value: "ieee" });
    const cv = canvas(214, "Clock, data and Manchester waveforms");
    view.append(stage(cv));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "flatD", label: "Longest flat: data (NRZ)" }, { key: "flatM", label: "Longest flat: Manchester" }, { key: "edges", label: "Edges: data / Manchester" }, { key: "bw", label: "Fastest change" }]);
    const verdict = verdictBox(view);
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const b = ed.bits;
      drawCodeRows(ctx, w, hh, b, [
        { name: "Clock", levels: encode(b, "clock"), prev: 0, showEdges: false, color: C("--muted") },
        { name: "Data", levels: encode(b, "nrzl"), prev: 0 },
        { name: "Thomas", levels: encode(b, "thomas"), prev: null, color: C("--hi") },
        { name: "802.3", levels: encode(b, "ieee"), prev: null, color: C("--hi") },
      ]);
    });
    function update() {
      const b = ed.bits, line = encode(b, "ieee");
      // decode: look at each mid-bit transition and interpret it with the chosen convention
      const dec = b.map((_, i) => { const up = line[2 * i] === 0 && line[2 * i + 1] === 1; return rx.value === "ieee" ? (up ? 1 : 0) : (up ? 0 : 1); });
      rows.innerHTML = bitLine("Sent", b.map((v) => ({ t: v, cls: "b" + v }))) + bitLine("Decoded", dec.map((v, i) => ({ t: v, cls: v !== b[i] ? "err" : "b" + v })));
      const d = encode(b, "nrzl");
      stats.set("flatD", trimNum(longestFlat(d, 0), 1) + " bits", longestFlat(d, 0) > 2 ? "warn" : "");
      stats.set("flatM", trimNum(longestFlat(line, null), 1) + " bit", "good");
      stats.set("edges", edgeList(d, 0).length + " / " + edgeList(line, null).length);
      stats.set("bw", "1 vs 2 per bit");
      const errs = dec.filter((v, i) => v !== b[i]).length;
      if (!errs) verdict.set("good", "<b>Decoded correctly.</b> The receiver only needs the direction of each mid-bit transition; it never needs a separate clock line.");
      else verdict.set("bad", "<b>Every bit is inverted.</b> The two conventions are exact opposites, so both ends must agree on which one is in use.");
      draw();
    }
    ed.onchange = rx.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: transmission over long wires
     ===================================================================== */
  function labWire(el) {
    const { controls, view } = NES.lab(el, {
      title: "Send bits over a long wire",
      hint: "An illustrative model: a longer wire picks up more interference (EMI) and rounds the edges more (high frequencies are attenuated). The receiver samples the middle of each bit and compares with 2.5 V.",
    });
    const len = NES.slider(controls, { label: "Wire length", min: 1, max: 100, step: 1, value: 40, fmt: (v) => v + " m" });
    const gnd = NES.slider(controls, { label: "Receiver ground higher by", min: -2.5, max: 2.5, step: 0.1, value: 0, fmt: (v) => v.toFixed(1) + " V" });
    const rate = NES.seg(controls, { label: "Bit rate", options: [[1, "Slow"], [4, "4x faster"]], value: 1 });
    const pat = NES.seg(controls, { label: "Bits", options: [["alt", "0101 (slide)"], ["runs", "Long runs"]], value: "alt" });
    const reroll = h("button", { class: "btn", type: "button", text: "New random noise" });
    controls.append(reroll);
    const cv = canvas(300, "Transmitted signal, noise and received signal");
    view.append(stage(cv));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "err", label: "Bit errors" }, { key: "sd", label: "Noise (σ)" }, { key: "tau", label: "Edge time constant" }]);
    const verdict = verdictBox(view);
    const SPB = 40, VS = 5;
    let seed = 11, noise = [];
    let tx = [], rxv = [], bits = [], dec = [];
    function compute() {
      bits = pat.value === "alt" ? S2B("010101010") : S2B("001111000");
      const N = bits.length * SPB;
      if (noise.length !== N) noise = slowNoise(seed, N);
      const sd = 0.035 * len.value, tau = 0.004 * len.value * rate.value;
      tx = []; for (let i = 0; i < N; i++) tx.push(bits[Math.floor(i / SPB)] * VS);
      const a = 1 - Math.exp(-(1 / SPB) / Math.max(tau, 1e-6));
      let y = tx[0];
      rxv = tx.map((v, i) => { y += (v - y) * a; return y + sd * noise[i] - gnd.value; });
      dec = bits.map((_, k) => (rxv[k * SPB + SPB / 2] > VS / 2 ? 1 : 0));
      return { sd, tau };
    }
    const draw = NES.canvas(cv, (ctx, w) => {
      const n = bits.length, dt = 1 / SPB;
      const p1 = panel(ctx, w, 6, 70, -0.5, 5.5, { tmax: n, nbits: n, title: "Transmitted", ticks: [0, 5] });
      series(ctx, tx, p1.X, p1.Y, C("--tech"), 1.8, dt);
      const sd = 0.035 * len.value;
      const p2 = panel(ctx, w, 92, 70, -5, 5, { tmax: n, nbits: n, title: "Noise picked up", ticks: [-5, 0, 5] });
      series(ctx, noise.map((v) => v * sd), p2.X, p2.Y, C("--muted"), 1.2, dt);
      const p3 = panel(ctx, w, 178, 110, -4, 9, { tmax: n, nbits: n, title: "Received (red: 2.5 V threshold)", ticks: [0, 5] });
      series(ctx, rxv, p3.X, p3.Y, C("--tech"), 1.4, dt);
      hline(ctx, p3.X(0), p3.X(n), p3.Y(2.5), C("--accent"), []);
      dec.forEach((b, k) => { const i = k * SPB + SPB / 2; dot(ctx, p3.X(i * dt), p3.Y(rxv[i]), b === bits[k] ? C("--ok") : C("--bad"), 4); });
    });
    function update() {
      const { sd, tau } = compute();
      const errs = dec.filter((b, k) => b !== bits[k]).length;
      rows.innerHTML = bitLine("Sent", bits.map((v) => ({ t: v, cls: "b" + v }))) + bitLine("Read", dec.map((v, k) => ({ t: v, cls: v !== bits[k] ? "err" : "b" + v })));
      stats.set("err", errs + " / " + bits.length, errs ? "bad" : "good");
      stats.set("sd", sd.toFixed(2) + " V");
      stats.set("tau", trimNum(tau, 2) + " bit times", tau > 1 ? "bad" : tau > 0.4 ? "warn" : "");
      if (!errs && len.value < 10 && Math.abs(gnd.value) < 0.5) verdict.set("good", "<b>Short wire: no trouble.</b> Resistance, capacitance and interference are negligible over a short distance.");
      else if (!errs) verdict.set("warn", "<b>Still readable</b>, but the margin shrinks: the received samples wander towards the 2.5 V threshold. Try another noise draw or a longer wire.");
      else if (tau > 1) verdict.set("bad", "<b>Bit errors.</b> At this length and speed the edges are so rounded that a short bit never reaches its level before the next one starts: high frequencies are attenuated.");
      else if (Math.abs(gnd.value) >= 1) verdict.set("bad", "<b>Bit errors.</b> The two grounds differ, so the receiver sees every level shifted by " + gnd.value.toFixed(1) + " V before comparing with 2.5 V.");
      else verdict.set("bad", "<b>Bit errors.</b> The interference picked up along the wire pushes samples across the threshold.");
      draw();
    }
    [len, gnd, rate, pat].forEach((c) => (c.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 7919 + 17) % 100003; noise = []; update(); });
    update();
  }

  /* =====================================================================
     LAB: differential signalling
     ===================================================================== */
  function labDiff(el) {
    const { controls, view } = NES.lab(el, {
      title: "Single-ended vs differential",
      hint: "P carries the data and N its inverse. Interference hits both wires; with balanced lines it hits them almost equally, so P - N cancels it. The imbalance slider makes the two wires pick up different noise.",
    });
    const sdS = NES.slider(controls, { label: "Interference (σ)", min: 0, max: 5, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + " V" });
    const imb = NES.slider(controls, { label: "Imbalance between P and N", min: 0, max: 100, step: 1, value: 10, fmt: (v) => v + "%" });
    const vs = NES.seg(controls, { label: "Signal voltage V<sub>S</sub>", options: [[5, "5 V"], [1, "1 V"]], value: 5 });
    const reroll = h("button", { class: "btn", type: "button", text: "New random noise" });
    controls.append(reroll);
    const cv = canvas(320, "Received single-ended and differential signals");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech)"></i>P (non-inverted)</span><span><i style="background:var(--hi)"></i>N (inverted)</span><span><i class="dash" style="color:var(--accent)"></i>threshold</span>` }));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "se", label: "Errors: single-ended (P only)" }, { key: "df", label: "Errors: differential (P - N)" }, { key: "sw", label: "Swing at the receiver" }, { key: "res", label: "Noise left after P - N" }]);
    const SPB = 40;
    let seed = 5, c = [], uP = [], uN = [];
    let bits = S2B("010101010"), P = [], N = [], D = [], decS = [], decD = [];
    function compute() {
      const n = bits.length * SPB;
      if (c.length !== n) { c = slowNoise(seed, n); uP = slowNoise(seed + 101, n); uN = slowNoise(seed + 202, n); }
      const s = sdS.value, m = imb.value / 100, V = vs.value, k = Math.sqrt(1 - m * m);
      P = []; N = []; D = [];
      for (let i = 0; i < n; i++) {
        const b = bits[Math.floor(i / SPB)];
        const p = b * V + s * (k * c[i] + m * uP[i]);
        const q = (1 - b) * V + s * (k * c[i] + m * uN[i]);
        P.push(p); N.push(q); D.push(p - q);
      }
      decS = bits.map((_, j) => (P[j * SPB + SPB / 2] > V / 2 ? 1 : 0));
      decD = bits.map((_, j) => (D[j * SPB + SPB / 2] > 0 ? 1 : 0));
    }
    const draw = NES.canvas(cv, (ctx, w) => {
      const n = bits.length, dt = 1 / SPB, V = vs.value;
      const lim = Math.max(V * 2.2, V + 3 * sdS.value);
      const p1 = panel(ctx, w, 6, 130, -lim + V / 2, lim + V / 2, { tmax: n, nbits: n, title: "Received P and N", ticks: [0, V] });
      series(ctx, P, p1.X, p1.Y, C("--tech"), 1.3, dt);
      series(ctx, N, p1.X, p1.Y, C("--hi"), 1.3, dt);
      hline(ctx, p1.X(0), p1.X(n), p1.Y(V / 2), C("--accent"), []);
      decS.forEach((b, j) => { const i = j * SPB + SPB / 2; dot(ctx, p1.X(i * dt), p1.Y(P[i]), b === bits[j] ? C("--ok") : C("--bad"), 3.6); });
      const dl = Math.max(V * 1.6, 2 * V + 0.1);
      const p2 = panel(ctx, w, 152, 150, -dl, dl, { tmax: n, nbits: n, title: "Differential P - N", ticks: [-2 * V, 0, 2 * V] });
      series(ctx, D, p2.X, p2.Y, C("--tech"), 1.5, dt);
      hline(ctx, p2.X(0), p2.X(n), p2.Y(0), C("--accent"), []);
      decD.forEach((b, j) => { const i = j * SPB + SPB / 2; dot(ctx, p2.X(i * dt), p2.Y(D[i]), b === bits[j] ? C("--ok") : C("--bad"), 3.6); });
    });
    function update() {
      compute();
      const eS = decS.filter((b, j) => b !== bits[j]).length, eD = decD.filter((b, j) => b !== bits[j]).length;
      rows.innerHTML = bitLine("Sent", bits.map((v) => ({ t: v, cls: "b" + v }))) +
        bitLine("Single-ended", decS.map((v, j) => ({ t: v, cls: v !== bits[j] ? "err" : "b" + v }))) +
        bitLine("Differential", decD.map((v, j) => ({ t: v, cls: v !== bits[j] ? "err" : "b" + v })));
      stats.set("se", eS + " / " + bits.length, eS ? "bad" : "good");
      stats.set("df", eD + " / " + bits.length, eD ? "bad" : "good");
      stats.set("sw", vs.value + " V vs " + 2 * vs.value + " V");
      stats.set("res", "σ ≈ " + (sdS.value * (imb.value / 100) * Math.SQRT2).toFixed(2) + " V");
      draw();
    }
    [sdS, imb, vs].forEach((x) => (x.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 48271 + 7) % 2147483; c = []; update(); });
    update();
  }

  /* =====================================================================
     LAB: synchronisation, drifting clocks and bit stuffing
     ===================================================================== */
  // generic bit stuffing: after n equal bits insert the complement (the stuffed bit starts a new run)
  function stuffBits(bits, n) {
    const out = [];
    let run = 0, last = -1;
    bits.forEach((b) => {
      out.push({ v: b, stuffed: false });
      run = b === last ? run + 1 : 1; last = b;
      if (run === n) { out.push({ v: 1 - b, stuffed: true }); last = 1 - b; run = 1; }
    });
    return out;
  }
  function destuff(vals, n) {
    const out = [];
    let run = 0, last = -1, skip = false;
    vals.forEach((b) => {
      if (skip) { skip = false; last = b; run = 1; return; }
      out.push(b);
      run = b === last ? run + 1 : 1; last = b;
      if (run === n) skip = true;
    });
    return out;
  }
  // receiver: starts on the first edge (t = 0), samples every Tr, optionally re-aligns on every edge
  function sampleLine(line, Tr, resyncAll) {
    const M = line.length, edges = [];
    for (let j = 1; j < M; j++) if (line[j] !== line[j - 1]) edges.push(j);
    const samples = [], resyncs = [0];
    let ts = Tr / 2;
    while (ts < M && samples.length < 2 * M) {
      samples.push({ t: ts, idx: Math.floor(ts), v: line[Math.floor(ts)] });
      let next = ts + Tr;
      if (resyncAll) { const te = edges.find((e) => e > ts); if (te != null && te < next) { next = te + Tr / 2; resyncs.push(te); } }
      ts = next;
    }
    return { samples, resyncs };
  }
  function labResync(el) {
    const { controls, view } = NES.lab(el, {
      title: "Drifting clocks and bit stuffing",
      hint: "The receiver's clock runs slightly off. It starts timing on the first edge and samples each bit in the middle. If it also re-aligns on every edge, only long runs without a change can make it slip. Bit stuffing forces those changes.",
    });
    const ed = bitEditor(view, {
      bits: S2B("1000000000000000"),
      presets: [["Long run of 0s", S2B("1000000000000000")], ["Alternating", alternating], ["Random", randomBits]],
    });
    const err = NES.slider(controls, { label: "Receiver clock error", min: -10, max: 10, step: 0.5, value: 4, fmt: (v) => (v > 0 ? "+" : "") + v.toFixed(1) + "%" });
    const sync = NES.seg(controls, { label: "Receiver re-aligns", options: [["start", "At the start only"], ["edges", "On every edge"]], value: "edges" });
    const stuff = NES.seg(controls, { label: "Bit stuffing", options: [[0, "Off"], [1, "On"]], value: 0 });
    const nS = NES.slider(controls, { label: "Stuff after this many equal bits", min: 3, max: 8, step: 1, value: 5, fmt: (v) => String(v) });
    const cv = canvas(150, "Line waveform with sample points");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--ok);height:8px;width:8px;border-radius:50%"></i>sample in the right bit</span><span><i style="background:var(--bad);height:8px;width:8px;border-radius:50%"></i>slipped</span><span><i style="background:var(--warn);height:8px"></i>stuffed bit</span><span><i class="dash" style="color:var(--accent)"></i>re-alignment</span>` }));
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "ok", label: "Samples in the right bit" }, { key: "gap", label: "Longest stretch without an edge" }, { key: "off", label: "Worst offset from bit centre" }, { key: "data", label: "Data recovered" }]);
    const verdict = verdictBox(view);
    let wire = [], res = { samples: [], resyncs: [] };
    const draw = NES.canvas(cv, (ctx, w) => {
      const M = wire.length, padL = 36, padR = 8;
      const X = (t) => padL + (t / M) * (w - padL - padR), Y = (v) => (v ? 22 : 82);
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1;
      for (let i = 0; i <= M; i++) { ctx.beginPath(); ctx.moveTo(X(i), 12); ctx.lineTo(X(i), 96); ctx.stroke(); }
      wire.forEach((b, i) => { if (b.stuffed) { ctx.fillStyle = C("--warn"); ctx.globalAlpha = 0.18; ctx.fillRect(X(i), 12, X(i + 1) - X(i), 84); ctx.globalAlpha = 1; } });
      const first = wire.length ? 1 - wire[0].v : 0;
      trace(ctx, [[-0.0, 0, first]].concat(wire.map((b, i) => [i, i + 1, b.v])), X, Y, C("--tech"), 2.2);
      res.resyncs.forEach((t) => { ctx.strokeStyle = C("--accent"); ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(t), 8); ctx.lineTo(X(t), 100); ctx.stroke(); ctx.setLineDash([]); });
      res.samples.forEach((s, k) => dot(ctx, X(s.t), Y(s.v), s.idx === k ? C("--ok") : C("--bad"), 3.8));
      label(ctx, "1", 14, 26, C("--muted")); label(ctx, "0", 14, 86, C("--muted"));
      const step = Math.max(1, Math.ceil(16 / ((w - padL - padR) / Math.max(1, M))));
      wire.forEach((b, i) => { if (i % step === 0) label(ctx, String(i), X(i + 0.5), 122, C("--muted"), 10, false, "center"); });
      label(ctx, "bit time on the wire →", padL, 142, C("--muted"), 10);
    });
    function update() {
      nS.input.disabled = !stuff.value;
      const data = ed.bits;
      wire = stuff.value ? stuffBits(data, nS.value) : data.map((v) => ({ v, stuffed: false }));
      const line = wire.map((b) => b.v);
      res = sampleLine(line, 1 + err.value / 100, sync.value === "edges");
      const ok = res.samples.filter((s, k) => s.idx === k).length;
      const inSync = ok === line.length && res.samples.length === line.length;
      const got = res.samples.map((s) => s.v);
      const recovered = stuff.value ? destuff(got, nS.value) : got;
      const same = recovered.length === data.length && recovered.every((v, i) => v === data[i]);
      // longest stretch without an edge, counting the edge at t = 0
      let gap = 0, last = 0;
      for (let j = 1; j <= line.length; j++) if (j === line.length || line[j] !== line[j - 1]) { gap = Math.max(gap, j - last); last = j; }
      const worst = res.samples.reduce((m, s, k) => Math.max(m, Math.abs(s.t - (k + 0.5))), 0);
      rows.innerHTML = bitLine("Data", data.map((v) => ({ t: v, cls: "b" + v }))) +
        bitLine("On the wire", wire.map((b) => ({ t: b.v, cls: b.stuffed ? "stuffed" : "b" + b.v, title: b.stuffed ? "stuffed bit" : "" }))) +
        bitLine("Recovered", recovered.map((v, i) => ({ t: v, cls: v !== data[i] ? "err" : "b" + v })));
      stats.set("ok", ok + " / " + line.length, inSync ? "good" : "bad");
      stats.set("gap", gap + " bits", gap * Math.abs(err.value) / 100 > 0.5 ? "bad" : "");
      stats.set("off", worst.toFixed(2) + " bit", worst >= 0.5 ? "bad" : worst > 0.3 ? "warn" : "good");
      stats.set("data", same ? "correct" : "corrupted", same ? "good" : "bad");
      if (inSync && same) verdict.set("good", "<b>In sync.</b> The receiver's error grows by " + Math.abs(err.value).toFixed(1) + "% of a bit per bit, but " + (sync.value === "edges" ? "every edge resets it before it reaches half a bit." : "the frame is short enough that it never reaches half a bit."));
      else if (sync.value === "start") verdict.set("bad", "<b>Out of sync.</b> Without re-aligning, the timing error keeps growing until a sample lands in the neighbouring bit. Let the receiver re-align on every edge.");
      else verdict.set("bad", "<b>Out of sync.</b> A " + gap + "-bit stretch without any edge lets the error grow past half a bit. Turn on bit stuffing to force a transition.");
      draw();
    }
    [err, sync, stuff, nS].forEach((x) => (x.onchange = update));
    ed.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: USB 2.0, NRZ-I (NRZ-S) with bit stuffing
     ===================================================================== */
  function usbEncode(data, stuffing) {
    const wire = [];
    let ones = 0;
    data.forEach((b) => {
      wire.push({ v: b, stuffed: false });
      ones = b ? ones + 1 : 0;
      if (stuffing && ones === 6) { wire.push({ v: 0, stuffed: true }); ones = 0; }
    });
    let lvl = 1; // idle: D+ high, as in the slide figure
    wire.forEach((w) => { if (w.v === 0) lvl = 1 - lvl; w.dp = lvl; });
    return wire;
  }
  function labUsb(el) {
    const { controls, view } = NES.lab(el, {
      title: "Encode bits like USB 2.0",
      hint: "USB sends logic '1' as no change and logic '0' as a change (NRZ-S). After six consecutive 1s it stuffs a '0' to force a transition. The default bits are the slide's example.",
    });
    const ed = bitEditor(view, {
      bits: S2B("000111111110011"),
      presets: [["Slide example", S2B("000111111110011")], ["All 1", allOf(1)], ["All 0", allOf(0)], ["Random", randomBits]],
    });
    const st = NES.seg(controls, { label: "Bit stuffing", options: [[1, "On"], [0, "Off"]], value: 1 });
    controls.append(h("p", { class: "lab-hint", html: "Turn stuffing off and try <b>All 1</b>: the lines never change, so the receiver has nothing to synchronise on." }));
    const cv = canvas(130, "USB D+ and D- waveforms with the logic bits");
    view.append(stage(cv));
    const stats = NES.stats(view, [{ key: "n", label: "Bits on the wire" }, { key: "s", label: "Stuffed bits" }, { key: "flat", label: "Longest time without a change" }, { key: "ov", label: "Overhead" }]);
    let wire = [];
    const draw = NES.canvas(cv, (ctx, w) => {
      const n = wire.length, padL = 50, padR = 8;
      const X = (t) => padL + ((t + 1) / (n + 2)) * (w - padL - padR);
      const rowsY = [[16, 38], [52, 74]];
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(X(i), 10); ctx.lineTo(X(i), 122); ctx.stroke(); }
      ctx.setLineDash([]);
      const segP = [[-1, 0, 1]].concat(wire.map((b, i) => [i, i + 1, b.dp]), [[n, n + 1, wire.length ? wire[n - 1].dp : 1]]);
      trace(ctx, segP, X, (v) => (v ? rowsY[0][0] : rowsY[0][1]), C("--tech"), 2);
      trace(ctx, segP, X, (v) => (v ? rowsY[1][1] : rowsY[1][0]), C("--tech"), 2);
      label(ctx, "data+", 4, 31, C("--lo"), 11, true); label(ctx, "data-", 4, 67, C("--lo"), 11, true); label(ctx, "logic", 4, 104, C("--lo"), 11, true);
      cells(ctx, [{ a: -1, b: 0, hatch: true }].concat(wire.map((b, i) => ({ a: i, b: i + 1, label: String(b.v), fill: b.stuffed ? C("--bad") : null, alpha: 0.35 })), [{ a: n, b: n + 1, hatch: true }]), X, 100, 10, { size: 11 });
    });
    function update() {
      wire = usbEncode(ed.bits, !!st.value);
      const s = wire.filter((b) => b.stuffed).length;
      let flat = 0, run = 0, last = 1;
      wire.forEach((b) => { run = b.dp === last ? run + 1 : 1; last = b.dp; flat = Math.max(flat, run); });
      stats.set("n", String(wire.length));
      stats.set("s", String(s), s ? "warn" : "");
      stats.set("flat", flat + " bit times", flat > 7 ? "bad" : "good");
      stats.set("ov", pct(s / ed.bits.length, 1));
      draw();
    }
    st.onchange = update; ed.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: parity vs CRC
     ===================================================================== */
  const GENS = {
    crc3: { name: "CRC-3 (x³ + x + 1)", g: "1011" },
    crc8: { name: "CRC-8 (x⁸ + x² + x + 1)", g: "100000111" },
    crc15: { name: "CRC-15 (CAN)", g: "1100010110011001" },
  };
  // polynomial long division over GF(2); returns remainder bits and the steps
  function crcDivide(bits, g) {
    const G = g.split("").map(Number), r = G.length - 1;
    const work = bits.concat(new Array(r).fill(0));
    const steps = [];
    for (let i = 0; i < bits.length; i++) {
      if (work[i] === 1) {
        for (let j = 0; j < G.length; j++) work[i + j] ^= G[j];
        steps.push({ at: i, after: work.slice() });
      }
    }
    return { rem: work.slice(bits.length), steps };
  }
  function crcCheck(bitsWithCrc, g) {
    const G = g.split("").map(Number), w = bitsWithCrc.slice();
    for (let i = 0; i <= w.length - G.length; i++) if (w[i]) for (let j = 0; j < G.length; j++) w[i + j] ^= G[j];
    return w.slice(w.length - (G.length - 1)).every((v) => v === 0);
  }
  function labCrc(el) {
    const { controls, view } = NES.lab(el, {
      title: "Parity bit vs CRC",
      hint: "The sender adds an even-parity bit and a CRC to the same 8 data bits. Click bits in the received row to flip them (noise), then see which check notices.",
    });
    const ed = bitEditor(view, { label: "Data sent (click to change the data)", bits: S2B("11010011"), presets: [["Random data", randomBits]] });
    const gen = NES.seg(controls, { label: "CRC generator", options: [["crc3", "CRC-3"], ["crc8", "CRC-8"], ["crc15", "CRC-15"]], value: "crc3" });
    const genInfo = h("p", { class: "lab-hint" });
    controls.append(genInfo);
    const b1 = h("button", { class: "btn", type: "button", text: "Flip 1 random bit" });
    const b2 = h("button", { class: "btn", type: "button", text: "Flip 2 random bits" });
    const b0 = h("button", { class: "btn", type: "button", text: "Clear flips" });
    controls.append(h("div", { class: "btn-row" }, [b1, b2, b0]));
    const rxWrap = h("div", { class: "ctl" }, [h("div", { class: "ctl-label" }, [h("span", { text: "Received: data | parity | CRC (click to flip)" })])]);
    const rxGrid = h("div", { class: "bit-editor flip" });
    rxWrap.append(rxGrid);
    view.append(rxWrap);
    const stats = NES.stats(view, [{ key: "par", label: "Parity check" }, { key: "crc", label: "CRC check" }, { key: "flips", label: "Bits flipped" }]);
    const verdict = verdictBox(view);
    const steps = h("pre", { class: "steps", "aria-label": "Long division steps" });
    view.append(h("details", { class: "steps-wrap" }, [h("summary", { text: "Show how the sender computed the CRC (long division)" }), steps]));
    let flips = new Set();
    function frame() {
      const d = ed.bits, p = d.reduce((a, b) => a + b, 0) % 2;
      const { rem, steps: st } = crcDivide(d, GENS[gen.value].g);
      return { d, p, rem, st, all: d.concat([p], rem) };
    }
    function flipRandom(k) {
      const n = frame().all.length;
      flips = new Set();
      while (flips.size < k) flips.add(Math.floor(Math.random() * n));
      update();
    }
    b1.addEventListener("click", () => flipRandom(1));
    b2.addEventListener("click", () => flipRandom(2));
    b0.addEventListener("click", () => { flips = new Set(); update(); });
    function update() {
      const f = frame(), g = GENS[gen.value].g, r = g.length - 1;
      genInfo.innerHTML = GENS[gen.value].name + ": generator <code>" + g + "</code> adds " + r + " bits.";
      [...flips].forEach((i) => { if (i >= f.all.length) flips.delete(i); });
      const recv = f.all.map((v, i) => (flips.has(i) ? 1 - v : v));
      rxGrid.style.gridTemplateColumns = "repeat(" + recv.length + ",minmax(0,1fr))";
      rxGrid.innerHTML = "";
      recv.forEach((v, i) => {
        const part = i < 8 ? "data" : i === 8 ? "par" : "crc";
        const btn = h("button", { type: "button", class: part + (flips.has(i) ? " flipped" : ""), text: String(v), "aria-label": part + " bit " + (i + 1) + " is " + v });
        btn.addEventListener("click", () => { flips.has(i) ? flips.delete(i) : flips.add(i); update(); });
        rxGrid.append(btn);
      });
      const rd = recv.slice(0, 8), rp = recv[8], rc = recv.slice(9);
      const parOk = (rd.reduce((a, b) => a + b, 0) + rp) % 2 === 0;
      const crcOk = crcCheck(rd.concat(rc), g);
      const nf = flips.size;
      stats.set("par", parOk ? "passes" : "error!", parOk ? (nf ? "bad" : "good") : "good");
      stats.set("crc", crcOk ? "passes" : "error!", crcOk ? (nf ? "bad" : "good") : "good");
      stats.set("flips", String(nf));
      if (!nf) verdict.set("", "<b>No errors.</b> Both checks pass. Flip some bits.");
      else if (!parOk && !crcOk) verdict.set("good", "<b>Both checks catch it.</b> The receiver discards the frame.");
      else if (parOk && !crcOk) verdict.set("warn", "<b>Parity misses it, the CRC catches it.</b> An even number of flips keeps the number of 1s even, so parity cannot see it.");
      else if (!parOk && crcOk) verdict.set("warn", "<b>Parity catches it, the CRC misses it.</b> Rare: the flip pattern happens to be a multiple of the generator. Longer CRCs make this far less likely.");
      else verdict.set("bad", "<b>Both checks miss it.</b> The corrupted frame would be accepted. With more check bits this becomes very unlikely.");
      const L = 14, pad = (s, n) => " ".repeat(n) + s;
      const lines = ["data + zeros".padEnd(L) + f.d.join("") + "0".repeat(r)];
      f.st.forEach((s) => {
        lines.push(("xor at bit " + s.at).padEnd(L + s.at) + g);
        lines.push(pad(s.after.join(""), L));
      });
      lines.push("", "remainder = CRC: " + f.rem.join(""), "sent: data " + f.d.join("") + " + CRC " + f.rem.join(""));
      steps.textContent = lines.join("\n");
    }
    gen.onchange = () => { flips = new Set(); update(); };
    ed.onchange = () => { flips = new Set(); update(); };
    update();
  }

  /* =====================================================================
     LAB: polling
     ===================================================================== */
  function labPolling(el) {
    const { controls, view } = NES.lab(el, {
      title: "Plan a polling cycle",
      hint: "The coordinator polls devices in a fixed order; a device only transmits when polled. Give a device more polls per cycle to give it more opportunities. Times are in slots.",
    });
    const g = NES.group(controls, "Polls per cycle");
    const wts = [1, 1, 2, 1].map((v, i) => NES.slider(g, { label: "Device " + (i + 1), min: 0, max: 3, step: 1, value: v, fmt: (x) => String(x) }));
    const poll = NES.slider(controls, { label: "Poll message length", min: 1, max: 4, step: 1, value: 1, fmt: (v) => v + " slot" + (v > 1 ? "s" : "") });
    const busy = NES.seg(controls, { label: "Devices with data", options: [["all", "All"], ["one", "Only device 1"]], value: "all" });
    const cv = canvas(80, "Polling cycle timeline");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--accent);height:8px"></i>poll (coordinator)</span><span><i style="background:var(--tech);height:8px"></i>frame (device)</span><span><i style="background:var(--muted);height:8px"></i>empty reply</span>` }));
    const stats = NES.stats(view, [{ key: "cyc", label: "Cycle length" }, { key: "ov", label: "Polling overhead" }, { key: "w1", label: "Worst wait, device 1" }, { key: "w2", label: "Worst wait, device 2" }, { key: "w3", label: "Worst wait, device 3" }, { key: "w4", label: "Worst wait, device 4" }]);
    const verdict = verdictBox(view);
    const F = 4;
    let sched = [];
    const draw = NES.canvas(cv, (ctx, w) => {
      const T = sched.length ? sched[sched.length - 1].b : 1;
      const X = (t) => 8 + (t / T) * (w - 16);
      const list = sched.map((s) => ({ a: s.a, b: s.b, label: s.label, fill: s.kind === "poll" ? C("--accent") : s.kind === "frame" ? C("--tech") : C("--muted"), color: C("--ink") }));
      if (!list.length) { label(ctx, "Nobody is polled.", 10, 40); return; }
      cells(ctx, list, X, 30, 13, { size: 10 });
      label(ctx, "0", X(0), 62, C("--muted"), 10); label(ctx, T + " slots", X(T), 62, C("--muted"), 10, false, "end");
    });
    function update() {
      sched = [];
      let t = 0;
      wts.forEach((s, i) => { for (let k = 0; k < s.value; k++) {
        sched.push({ kind: "poll", dev: i, a: t, b: t + poll.value, label: "addr " + (i + 1) }); t += poll.value;
        const has = busy.value === "all" || i === 0;
        const d = has ? F : 1;
        sched.push({ kind: has ? "frame" : "empty", dev: i, a: t, b: t + d, label: has ? "frame" : "-" }); t += d;
      } });
      const T = t;
      const overhead = sched.filter((s) => s.kind !== "frame").reduce((a, s) => a + s.b - s.a, 0);
      stats.set("cyc", T ? T + " slots" : "-");
      stats.set("ov", T ? pct(overhead / T, 0) : "-", overhead / T > 0.4 ? "bad" : overhead / T > 0.2 ? "warn" : "good");
      wts.forEach((_, i) => {
        const starts = sched.filter((s) => s.kind === "poll" && s.dev === i).map((s) => s.a);
        let worst;
        if (!starts.length) worst = "never polled";
        else { let m = 0; starts.forEach((a, k) => { const nx = k + 1 < starts.length ? starts[k + 1] : starts[0] + T; m = Math.max(m, nx - a); }); worst = m + " slots"; }
        stats.set("w" + (i + 1), worst, !starts.length ? "bad" : "");
      });
      const starved = wts.findIndex((s) => s.value === 0);
      if (!T) verdict.set("bad", "<b>Nothing happens.</b> With no polls, nobody may talk.");
      else if (starved >= 0) verdict.set("bad", "<b>Device " + (starved + 1) + " can never transmit.</b> A device does not transmit unless polled.");
      else if (busy.value === "one") verdict.set("warn", "<b>Lots of wasted polls.</b> Devices with nothing to send still cost a poll and a reply every cycle: that is the polling overhead.");
      else verdict.set("good", "<b>Bounded latency.</b> Every device knows it will be polled again within its worst-case wait, no matter how busy the others are.");
      draw();
    }
    wts.concat([poll, busy]).forEach((x) => (x.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: CSMA family simulator (CSMA, CSMA/CD, CSMA/CA)
     ===================================================================== */
  function simulateMac(cfg) {
    const rnd = NES.rng(cfg.seed);
    const devs = cfg.arrivals.map((a, i) => (a == null ? null : { id: i + 1, a, phase: "wait", cw: 1, k: 0, txStart: -1, left: 0, bo: 0, row: [], attempts: [] })).filter(Boolean);
    const TMAX = 90, F = cfg.F, d = cfg.d;
    const unit = d + 1; // a backoff time unit covers sensing plus the signal travel time
    const log = [];
    let tEnd = 0;
    const finishAbort = (x, t) => {
      log.push({ dev: x.id, s: x.txStart, e: t + 1, aborted: true });
      x.k++; x.bo = unit * Math.floor(rnd() * Math.pow(2, x.k)); x.phase = "backoff";
    };
    for (let t = 0; t < TMAX; t++) {
      // devices that sensed an idle medium in the previous slot start now
      devs.forEach((x) => { if (x.phase === "start") { x.phase = "tx"; x.txStart = t; x.left = F; x.jam = -1; } });
      const txNow = devs.filter((x) => x.phase === "tx");
      // a transmission that started at slot s can be heard by the others from slot s + d
      const busyFor = (me) => txNow.some((o) => o !== me && o.txStart <= t - d);
      const starting = [];
      devs.forEach((x) => {
        const cell = (kind, lab) => { x.row[t] = { kind, lab }; };
        if (x.phase === "done" || t < x.a) { cell("idle"); return; }
        if (x.phase === "wait") x.phase = "sense";
        for (let guard = 0; guard < 4; guard++) {
          if (x.phase === "sense") {
            cell("cs", "cs");
            if (busyFor(x)) {
              if (cfg.mode === "ca") { x.bo = unit * Math.floor(rnd() * Math.pow(2, x.cw)); x.cw++; x.phase = "caWait"; }
              else x.phase = "defer";
            } else x.phase = "start";
            return;
          }
          if (x.phase === "defer") { if (busyFor(x)) { cell("busy", "busy"); return; } starting.push(x); return; }
          if (x.phase === "caWait") {
            if (busyFor(x)) { cell("busy", "busy"); return; }
            if (x.bo > 0) { cell("bo", "bo"); x.bo--; return; }
            x.phase = "sense"; continue;
          }
          if (x.phase === "backoff") {
            if (x.bo > 0) { cell("bo", "bo"); x.bo--; return; }
            x.phase = "sense"; continue;
          }
          return; // transmitting: handled below
        }
      });
      starting.forEach((x) => { x.phase = "tx"; x.txStart = t; x.left = F; x.jam = -1; });
      const txAll = devs.filter((x) => x.phase === "tx");
      txAll.forEach((x) => {
        if (x.jam >= 0) {
          // keeps transmitting after detecting the collision, so the others hear it too
          x.row[t] = { kind: "frag", lab: "fr.." };
          if (x.jam === 0) finishAbort(x, t); else x.jam--;
          return;
        }
        x.row[t] = { kind: "tx", lab: "frame" };
        x.left--;
        const detect = cfg.mode === "cd" && txAll.some((o) => o !== x && o.txStart <= t - d);
        if (detect) {
          for (let u = x.txStart; u <= t; u++) x.row[u] = { kind: "frag", lab: "fr.." };
          if (d === 0) finishAbort(x, t); else x.jam = d - 1;
        } else if (x.left === 0) {
          log.push({ dev: x.id, s: x.txStart, e: t + 1, aborted: false });
          x.phase = "done";
        }
      });
      tEnd = t + 1;
      if (devs.every((x) => x.phase === "done")) break;
    }
    // outcome of every transmission: corrupted if it overlapped with another one
    log.forEach((L) => { L.bad = log.some((o) => o !== L && o.s < L.e && L.s < o.e); });
    const rx = [];
    for (let t = 0; t < tEnd; t++) {
      const on = log.filter((L) => L.s <= t && t < L.e);
      if (!on.length) rx[t] = { kind: "idle" };
      else if (on.length === 1 && !on[0].bad) rx[t] = { kind: "ok", lab: "frame " + on[0].dev, dev: on[0].dev, s: on[0].s };
      else rx[t] = { kind: "bad", lab: on.length > 1 ? "collision" : "corrupted" };
    }
    // bo labels: number of slots in each backoff run
    devs.forEach((x) => { let run = 0; for (let t = tEnd - 1; t >= -1; t--) { const c = x.row[t]; if (c && c.kind === "bo") { run++; } else if (run) { for (let u = t + 1; u < t + 1 + run; u++) x.row[u].lab = "bo:" + Math.round(run / unit); run = 0; } } });
    const okFrames = log.filter((L) => !L.aborted && !L.bad).length;
    return { devs, rx, log, tEnd, okFrames, unfinished: devs.filter((x) => x.phase !== "done").length, collisions: log.filter((L) => L.bad).length, wasted: rx.filter((r) => r.kind === "bad").length };
  }
  function labCsma(el, opt) {
    const titles = { csma: "CSMA: listen before talk", cd: "CSMA/CD: stop as soon as it collides", ca: "CSMA/CA: wait randomly before the first try" };
    const { controls, view } = NES.lab(el, {
      title: titles[opt.mode],
      hint: "A slot-by-slot model of up to three devices that each get one frame to send. Carrier sense (cs) takes one slot; a transmission is heard by the others after the signal travel time. A backoff time unit lasts one slot, or two when the signal needs a slot to travel. Change when each device gets its frame and compare the three modes.",
    });
    const mode = NES.seg(controls, { label: "Medium access", options: [["csma", "CSMA"], ["cd", "CSMA/CD"], ["ca", "CSMA/CA"]], value: opt.mode });
    const a2 = NES.slider(controls, { label: "tx 2 gets its frame at slot", min: 0, max: 12, step: 1, value: 2, fmt: (v) => String(v) });
    const a3 = NES.slider(controls, { label: "tx 3 gets its frame at slot", min: 0, max: 12, step: 1, value: 3, fmt: (v) => String(v) });
    const n3 = NES.seg(controls, { label: "Devices", options: [[2, "2"], [3, "3"]], value: 3 });
    const fl = NES.slider(controls, { label: "Frame length", min: 3, max: 8, step: 1, value: 5, fmt: (v) => v + " slots" });
    const dl = NES.seg(controls, { label: "Signal travel time", options: [[0, "Instant"], [1, "1 slot"]], value: 0 });
    const reroll = h("button", { class: "btn", type: "button", text: "New random backoffs" });
    controls.append(reroll);
    const cv = canvas(150, "Medium access timeline");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech);height:8px"></i>transmit</span><span><i style="background:var(--ok);height:8px"></i>sense / receive</span><span><i style="background:var(--bad);height:8px"></i>receive with errors</span><span><i style="background:var(--muted);height:8px"></i>backoff</span>` }));
    const stats = NES.stats(view, [{ key: "ok", label: "Frames delivered" }, { key: "col", label: "Transmissions destroyed" }, { key: "waste", label: "Slots wasted on collisions" }, { key: "end", label: "All done after" }]);
    const verdict = verdictBox(view);
    let seed = opt.seed || 3, sim = null;
    const draw = NES.canvas(cv, (ctx, w) => {
      const T = Math.max(sim.tEnd, 16), padL = 34, padR = 6;
      const X = (t) => padL + (t / T) * (w - padL - padR);
      const rowsN = sim.devs.length + 1, rowH = (150 - 8) / rowsN, half = Math.min(11, rowH / 2 - 3);
      const fillOf = { cs: C("--ok"), busy: C("--ok"), tx: C("--tech"), frag: C("--tech"), bo: C("--muted") };
      sim.devs.forEach((x, r) => {
        const y = 6 + r * rowH + rowH / 2;
        label(ctx, "tx " + x.id, 2, y + 4, C("--lo"), 11, true);
        const list = [];
        for (let t = 0; t < T; t++) {
          const c = x.row[t] || { kind: "idle" };
          const prev = list[list.length - 1];
          const key = c.kind + "|" + (c.lab || "");
          if (prev && prev.key === key && c.kind !== "cs") prev.b = t + 1;
          else list.push({ key, a: t, b: t + 1, label: c.kind === "idle" ? "" : c.lab, fill: fillOf[c.kind], hatch: c.kind === "idle" });
        }
        cells(ctx, list, X, y, half, { size: 10 });
      });
      const y = 6 + sim.devs.length * rowH + rowH / 2;
      label(ctx, "rx", 2, y + 4, C("--lo"), 11, true);
      const list = [];
      for (let t = 0; t < T; t++) {
        const c = sim.rx[t] || { kind: "idle" };
        const prev = list[list.length - 1];
        const key = c.kind + "|" + (c.lab || "") + "|" + (c.s == null ? "" : c.s);
        if (prev && prev.key === key) prev.b = t + 1;
        else list.push({ key, a: t, b: t + 1, label: c.kind === "idle" ? "" : c.lab, fill: c.kind === "ok" ? C("--ok") : c.kind === "bad" ? C("--bad") : null, hatch: c.kind === "idle" });
      }
      cells(ctx, list, X, y, half, { size: 10 });
    });
    function update() {
      a3.input.disabled = n3.value === 2;
      sim = simulateMac({ mode: mode.value, F: fl.value, d: dl.value, arrivals: [0, a2.value, n3.value === 3 ? a3.value : null], seed });
      const n = sim.devs.length;
      stats.set("ok", sim.okFrames + " / " + n, sim.okFrames === n ? "good" : "bad");
      stats.set("col", String(sim.collisions), sim.collisions ? "bad" : "good");
      stats.set("waste", String(sim.wasted), sim.wasted ? "warn" : "good");
      stats.set("end", sim.unfinished ? "not within " + sim.tEnd + " slots" : sim.tEnd + " slots", sim.unfinished ? "warn" : "");
      const m = mode.value;
      if (sim.unfinished) verdict.set("warn", "<b>Still contending after " + sim.tEnd + " slots.</b> Repeated collisions keep growing the contention window, so the waits get longer and longer. Draw new backoffs.");
      else if (sim.okFrames === n && !sim.collisions) verdict.set("good", "<b>No collisions.</b> " + (m === "ca" ? "The random wait before the first attempt spread the devices out." : "Carrier sense was enough: nobody started while someone else was audible."));
      else if (m === "csma") verdict.set("bad", "<b>Collision, and nobody knows.</b> Devices that sensed the medium idle at the same moment (or within the travel time) all transmitted. Their whole frames are corrupted and the transmitters are not aware of it.");
      else if (m === "cd" && sim.okFrames === n) verdict.set("warn", "<b>Collision detected and recovered.</b> The transmitters noticed the collision while sending, stopped early and retried after a random backoff.");
      else if (m === "cd") verdict.set("bad", "<b>Collision not caught in time.</b> With a long travel time and short frames, a frame can end before the collision becomes audible.");
      else verdict.set("bad", "<b>Collision.</b> Two devices drew the same random wait. Without collision detection the whole frames are lost; draw new backoffs to see it usually work out.");
      draw();
    }
    [mode, a2, a3, n3, fl, dl].forEach((x) => (x.onchange = update));
    reroll.addEventListener("click", () => { seed = (seed * 16807 + 13) % 2147483647; update(); });
    update();
  }

  /* =====================================================================
     LAB: contention windows (binary exponential backoff, prioritisation)
     ===================================================================== */
  // probability that exactly one of n devices picks the smallest value from [0, W-1]
  function pUnique(n, W) { let p = 0; for (let v = 0; v < W; v++) p += n * (1 / W) * Math.pow((W - 1 - v) / W, n - 1); return p; }
  function eMin(n, W) { let e = 0; for (let v = 0; v < W; v++) e += Math.pow((W - 1 - v) / W, n); return e; }
  function prioOdds(Wh, Wl) {
    let lowFirst = 0;
    for (let v = 0; v < Wl; v++) lowFirst += (1 / Wl) * Math.max(0, (Wh - 1 - v) / Wh);
    const tie = Math.min(Wh, Wl) / (Wh * Wl);
    return { lowFirst, tie, highFirst: 1 - lowFirst - tie };
  }
  function labBackoff(el) {
    const { controls, view } = NES.lab(el, {
      title: "How big should the contention window be?",
      hint: "After a collision, every device picks a random backoff bo in [0, 2<sup>CW</sup> - 1]. The next attempt succeeds only if exactly one device picked the smallest value. Exact probabilities, no simulation.",
    });
    const n = NES.slider(controls, { label: "Devices that just collided", min: 2, max: 10, step: 1, value: 3, fmt: (v) => String(v) });
    const cw = NES.slider(controls, { label: "Contention window CW", min: 1, max: 8, step: 1, value: 1, fmt: (v) => String(v) });
    const draw1 = h("button", { class: "btn", type: "button", text: "Draw backoffs once" });
    controls.append(draw1);
    const table = h("div", { class: "table-wrap" });
    view.append(table);
    const chips = h("div", { class: "draw-chips" });
    view.append(chips);
    const stats = NES.stats(view, [{ key: "win", label: "Window" }, { key: "col", label: "P(collide again)" }, { key: "idle", label: "Expected idle slots first" }]);
    const verdict = verdictBox(view);
    function update() {
      const N = n.value;
      table.innerHTML = `<table class="tt"><thead><tr><th>CW</th><th>bo range</th><th>P(collide again)</th><th class="out">Idle slots before first try</th></tr></thead><tbody>` +
        [1, 2, 3, 4, 5, 6, 7, 8].map((c) => { const W = Math.pow(2, c), pc = 1 - pUnique(N, W); return `<tr class="${c === cw.value ? "on" : ""}"><td>${c}</td><td>0 to ${W - 1}</td><td class="${pc > 0.3 ? "v-bad" : ""}">${pct(pc, 1)}</td><td class="out">${eMin(N, W).toFixed(2)}</td></tr>`; }).join("") + "</tbody></table>";
      const W = Math.pow(2, cw.value), pc = 1 - pUnique(N, W);
      stats.set("win", "bo in [0, " + (W - 1) + "]");
      stats.set("col", pct(pc, 1), pc > 0.3 ? "bad" : pc > 0.1 ? "warn" : "good");
      stats.set("idle", eMin(N, W).toFixed(2) + " slots");
      if (pc > 0.3) verdict.set("bad", "<b>Too small for " + N + " devices.</b> They are likely to pick the same backoff and collide again. That is why CW grows by one after each collision.");
      else if (eMin(N, W) > 8) verdict.set("warn", "<b>Too big.</b> Collisions are rare, but the medium sits idle for many slots before anyone tries. That is why CW resets to 1 after a success.");
      else verdict.set("good", "<b>A reasonable window</b> for " + N + " devices: few repeated collisions and little idle time.");
      chips.innerHTML = "";
    }
    draw1.addEventListener("click", () => {
      const W = Math.pow(2, cw.value), v = Array.from({ length: n.value }, () => Math.floor(Math.random() * W));
      const m = Math.min(...v), winners = v.filter((x) => x === m).length;
      chips.innerHTML = v.map((x, i) => `<span class="draw-chip ${x === m ? (winners === 1 ? "win" : "tie") : ""}">dev ${i + 1}: bo ${x}</span>`).join("") +
        `<span class="draw-note">${winners === 1 ? "Device " + (v.indexOf(m) + 1) + " goes first after " + m + " idle slot" + (m === 1 ? "" : "s") + "." : winners + " devices picked " + m + ": another collision."}</span>`;
    });
    n.onchange = cw.onchange = update;
    update();
  }
  function labPrio(el) {
    const { controls, view } = NES.lab(el, {
      title: "Priority through the contention window",
      hint: "A high-priority and a low-priority device collide and both back off, each with its own starting contention window. The smaller bo transmits first; equal values collide again.",
    });
    const ch = NES.slider(controls, { label: "High priority: CW", min: 1, max: 8, step: 1, value: 1, fmt: (v) => v + " (bo 0 to " + (Math.pow(2, v) - 1) + ")" });
    const cl = NES.slider(controls, { label: "Low priority: CW", min: 1, max: 8, step: 1, value: 8, fmt: (v) => v + " (bo 0 to " + (Math.pow(2, v) - 1) + ")" });
    const go = h("button", { class: "btn", type: "button", text: "Simulate 1000 rounds" });
    controls.append(go);
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "hi", label: "High priority first" }, { key: "lo", label: "Low priority first (lucky!)" }, { key: "tie", label: "Same bo: collide again" }]);
    const sim = h("p", { class: "lab-hint" });
    view.append(sim);
    function update() {
      const o = prioOdds(Math.pow(2, ch.value), Math.pow(2, cl.value));
      const row = (name, p, col) => `<div class="meter-row"><span class="m-label">${name}</span><div class="meter-track"><div class="meter-fill" style="width:${p * 100}%;background:${col}"></div></div><span class="m-val">${pct(p, 2)}</span></div>`;
      meter.innerHTML = row("High first", o.highFirst, "var(--ok)") + row("Low first", o.lowFirst, "var(--warn)") + row("Collide", o.tie, "var(--bad)");
      stats.set("hi", pct(o.highFirst, 2), "good");
      stats.set("lo", pct(o.lowFirst, 2), o.lowFirst > 0.3 ? "warn" : "");
      stats.set("tie", pct(o.tie, 2), o.tie > 0.2 ? "bad" : "");
      sim.textContent = "";
    }
    go.addEventListener("click", () => {
      const Wh = Math.pow(2, ch.value), Wl = Math.pow(2, cl.value);
      let hi = 0, lo = 0, tie = 0;
      for (let i = 0; i < 1000; i++) { const a = Math.floor(Math.random() * Wh), b = Math.floor(Math.random() * Wl); if (a < b) hi++; else if (b < a) lo++; else tie++; }
      sim.textContent = "1000 random rounds: high first " + hi + ", low first " + lo + ", collided again " + tie + ".";
    });
    ch.onchange = cl.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: CAN bus signal levels
     ===================================================================== */
  function labCanLevels(el) {
    const { controls, view } = NES.lab(el, {
      title: "CANH and CANL",
      hint: "'0' is dominant (D, actively driven), '1' is recessive (R, left to the resistors). The receiver looks at the difference CANH - CANL. The default bits are the slide's example.",
    });
    const ed = bitEditor(view, { bits: S2B("01001101"), presets: [["Slide example", S2B("01001101")], ["Random", randomBits]] });
    const sp = NES.seg(controls, { label: "Variant", options: [["hs", "High-speed CAN"], ["ls", "Low-speed CAN"]], value: "hs" });
    const cv = canvas(230, "CANH, CANL and differential voltage");
    view.append(stage(cv));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi)"></i>CANH</span><span><i style="background:var(--lo)"></i>CANL</span><span><i style="background:var(--tech)"></i>CANH - CANL</span>` }));
    const stats = NES.stats(view, [{ key: "rec", label: "Recessive '1'" }, { key: "dom", label: "Dominant '0'" }, { key: "diff", label: "Difference '1' / '0'" }, { key: "rate", label: "Up to" }]);
    const LV = { hs: { r: [2.5, 2.5], d: [3.5, 1.5], rate: "1 Mbps" }, ls: { r: [0, 5], d: [5, 0], rate: "125 Kbps" } };
    const draw = NES.canvas(cv, (ctx, w) => {
      const b = ed.bits, n = b.length, L = LV[sp.value];
      const p1 = panel(ctx, w, 18, 100, -0.3, 5.3, { tmax: n, nbits: n, ticks: [0, 2.5, 5] });
      const roomy = (w - 48) / n >= 46;
      b.forEach((v, i) => label(ctx, roomy ? String(v) + (v ? " rec." : " dom.") : String(v) + (v ? " R" : " D"), p1.X(i + 0.5), 13, v ? C("--muted") : C("--ink"), 10, !v, "center"));
      const segH = b.map((v, i) => [i, i + 1, v ? L.r[0] : L.d[0]]), segL = b.map((v, i) => [i, i + 1, v ? L.r[1] : L.d[1]]);
      trace(ctx, segL, p1.X, p1.Y, C("--lo"), 2.2);
      trace(ctx, segH, p1.X, p1.Y, C("--hi"), 2.2, [6, 3]);
      const p2 = panel(ctx, w, 136, 86, -5.5, 5.5, { tmax: n, nbits: n, ticks: [-5, 0, 5], title: "CANH - CANL" });
      trace(ctx, b.map((v, i) => [i, i + 1, v ? L.r[0] - L.r[1] : L.d[0] - L.d[1]]), p2.X, p2.Y, C("--tech"), 2.2);
      hline(ctx, p2.X(0), p2.X(n), p2.Y(0), C("--grid"), [2, 3]);
    });
    function update() {
      const L = LV[sp.value];
      stats.set("rec", "H " + L.r[0] + " V, L " + L.r[1] + " V");
      stats.set("dom", "H " + L.d[0] + " V, L " + L.d[1] + " V");
      stats.set("diff", (L.r[0] - L.r[1]) + " V / +" + (L.d[0] - L.d[1]) + " V");
      stats.set("rate", L.rate);
      draw();
    }
    sp.onchange = update; ed.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: dominant wins (wired-AND)
     ===================================================================== */
  function labDominant(el) {
    const { controls, view } = NES.lab(el, {
      title: "Three nodes, one bus",
      hint: "Each node drives its own bits at the same time. Click bits to flip them. A '0' from anyone pulls the bus to '0'; the bus is '1' only if every node sends '1'. Defaults: the slide's example.",
    });
    const SL = ["01110111", "11110101", "10111111"];
    const eds = SL.map((s, i) => bitEditor(view, { label: "tx " + (i + 1), bits: S2B(s) }));
    const reset = h("button", { class: "btn", type: "button", text: "Slide example" });
    controls.append(reset);
    const rows = h("div", { class: "bitrow" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "bus", label: "Bus" }, { key: "dom", label: "Dominant bits on the bus" }, { key: "over", label: "Recessive bits overruled" }]);
    function update() {
      const B = eds.map((e) => e.bits), bus = B[0].map((_, j) => B.reduce((a, r) => a & r[j], 1));
      rows.innerHTML = bitLine("CAN bus", bus.map((v) => ({ t: v, cls: "b" + v }))) +
        B.map((r, i) => bitLine("tx " + (i + 1), r.map((v, j) => ({ t: v, cls: v === 1 && bus[j] === 0 ? "over" : "b" + v, title: v === 1 && bus[j] === 0 ? "sent 1, bus is 0" : "" })))).join("");
      const over = B.reduce((a, r) => a + r.filter((v, j) => v === 1 && bus[j] === 0).length, 0);
      stats.set("bus", bus.join(""));
      stats.set("dom", String(bus.filter((v) => v === 0).length));
      stats.set("over", String(over), over ? "warn" : "");
    }
    eds.forEach((e) => (e.onchange = update));
    reset.addEventListener("click", () => { eds.forEach((e, i) => e.set(S2B(SL[i]))); update(); });
    update();
  }

  /* =====================================================================
     LAB: CAN arbitration
     ===================================================================== */
  const b11 = (v) => v.toString(2).padStart(11, "0");
  function arbitrate(ids) {
    const n = ids.length, active = ids.map(() => true), lostAt = ids.map(() => null);
    const bits = ids.map((id) => [0].concat(b11(id).split("").map(Number))); // SOF + 11 ID bits
    const bus = [];
    for (let j = 0; j < 12; j++) {
      const v = bits.reduce((a, b, i) => (active[i] ? a & b[j] : a), 1);
      bus.push(v);
      for (let i = 0; i < n; i++) if (active[i] && bits[i][j] === 1 && v === 0) { active[i] = false; lostAt[i] = j; }
    }
    return { bits, bus, lostAt, active };
  }
  function labCanArb(el) {
    const { controls, view } = NES.lab(el, {
      title: "Bitwise arbitration on the CAN bus",
      hint: "All nodes start together with the SOF bit and send their 11-bit ID, most significant bit first, while reading the bus. A node that sends '1' but reads '0' has lost and stops. Defaults: the slide's three IDs.",
    });
    const def = [0b01101011011, 0b01111000010, 0b01101011100];
    const sl = def.map((v, i) => NES.slider(controls, { label: "tx " + (i + 1) + " ID", min: 0, max: 2047, step: 1, value: v, fmt: (x) => "0x" + x.toString(16).toUpperCase().padStart(3, "0") }));
    const n3 = NES.seg(controls, { label: "Nodes", options: [[2, "2"], [3, "3"]], value: 3 });
    const reset = h("button", { class: "btn", type: "button", text: "Slide example" });
    controls.append(reset);
    const rows = h("div", { class: "bitrow arb" });
    view.append(rows);
    const stats = NES.stats(view, [{ key: "win", label: "Wins the bus" }, { key: "l1", label: "tx 1" }, { key: "l2", label: "tx 2" }, { key: "l3", label: "tx 3" }]);
    const verdict = verdictBox(view);
    function update() {
      sl[2].input.disabled = n3.value === 2;
      const ids = sl.slice(0, n3.value).map((s) => s.value);
      const r = arbitrate(ids);
      const hdr = [{ t: "S", cls: "hdr", title: "start of frame" }].concat(Array.from({ length: 11 }, (_, j) => ({ t: String(10 - j), cls: "hdr", title: "ID bit " + (10 - j) })));
      rows.innerHTML = bitLine("", hdr) + bitLine("CAN bus", r.bus.map((v) => ({ t: v, cls: "b" + v }))) +
        r.bits.map((b, i) => bitLine("tx " + (i + 1), b.map((v, j) => {
          const L = r.lostAt[i];
          if (L != null && j > L) return { t: "·", cls: "gone" };
          if (L === j) return { t: v, cls: "err", title: "sent 1, read 0: lost arbitration" };
          return { t: v, cls: "b" + v };
        }))).join("");
      const winners = ids.map((id, i) => i).filter((i) => r.active[i]);
      [0, 1, 2].forEach((i) => {
        if (i >= ids.length) { stats.set("l" + (i + 1), "-"); return; }
        stats.set("l" + (i + 1), r.active[i] ? "still sending" : "lost at ID bit " + (11 - r.lostAt[i]), r.active[i] ? "good" : "bad");
      });
      if (winners.length === 1) {
        stats.set("win", "tx " + (winners[0] + 1), "good");
        verdict.set("good", "<b>tx " + (winners[0] + 1) + " wins with ID 0x" + ids[winners[0]].toString(16).toUpperCase().padStart(3, "0") + ", the lowest ID.</b> Its frame continues untouched: the collision was non-destructive. The losers retry after this frame.");
      } else {
        stats.set("win", "no single winner", "bad");
        verdict.set("bad", "<b>Two nodes have the same ID.</b> Arbitration cannot separate them, so their frames collide later. That is why every CAN ID must be unique.");
      }
    }
    sl.concat([n3]).forEach((x) => (x.onchange = update));
    reset.addEventListener("click", () => { sl.forEach((s, i) => s.set(def[i])); n3.set(3, true); update(); });
    update();
  }

  /* =====================================================================
     LAB: CAN frame builder with CRC-15 and bit stuffing
     ===================================================================== */
  function can15(bits) { let crc = 0; bits.forEach((b) => { const nxt = b ^ ((crc >> 14) & 1); crc = (crc << 1) & 0x7fff; if (nxt) crc ^= 0x4599; }); return crc; }
  const toBits = (v, n) => v.toString(2).padStart(n, "0").split("").map(Number);
  function canFrame(o) {
    const F = [];
    const add = (name, bits, stuffable) => F.push({ name, bits, stuffable });
    add("SOF", [0], true);
    if (o.type === "ext") {
      add("ID A", toBits(o.idA, 11), true); add("SRR", [1], true); add("IDE", [1], true); add("ID B", toBits(o.idB, 18), true);
      add("RTR", [0], true); add("RB", [0, 0], true);
    } else {
      add("ID", toBits(o.idA, 11), true); add("RTR", [o.type === "remote" ? 1 : 0], true); add("IDE", [0], true); add("R0", [0], true);
    }
    add("DLC", toBits(o.dlc, 4), true);
    if (o.type !== "remote" && o.dlc) add("DATA", [].concat(...o.data.slice(0, o.dlc).map((b) => toBits(b, 8))), true);
    const crcIn = [].concat(...F.map((f) => f.bits));
    const crc = can15(crcIn);
    add("CRC", toBits(crc, 15), true);
    add("CRC del.", [1], false); add("ACK", [0], false); add("ACK del.", [1], false); add("EOF", [1, 1, 1, 1, 1, 1, 1], false); add("IFS", [1, 1, 1], false);
    // stuffing over SOF..CRC sequence: after 5 equal bits insert the complement, which starts a new run
    let run = 0, last = -1, stuffed = 0;
    F.forEach((f) => {
      f.wire = [];
      f.bits.forEach((b) => {
        f.wire.push({ v: b, s: false });
        if (!f.stuffable) return;
        run = b === last ? run + 1 : 1; last = b;
        if (run === 5) { f.wire.push({ v: 1 - b, s: true }); stuffed++; last = 1 - b; run = 1; }
      });
    });
    const raw = F.reduce((a, f) => a + f.bits.length, 0);
    return { F, crc, raw, stuffed, total: raw + stuffed };
  }
  function labCanFrame(el) {
    const { controls, view } = NES.lab(el, {
      title: "Build a CAN frame",
      hint: "Field by field, with the real CRC-15 and bit stuffing (after five equal bits a bit of opposite polarity is inserted, from SOF to the end of the CRC). Stuffed bits are highlighted. The ACK slot is shown as the receiver's dominant '0'.",
    });
    const type = NES.seg(controls, { label: "Frame", options: [["data", "Standard data"], ["remote", "Standard remote"], ["ext", "Extended data"]], value: "data" });
    const idA = NES.slider(controls, { label: "ID (11 bits; ID A if extended)", min: 0, max: 2047, step: 1, value: 0x35b, fmt: (v) => "0x" + v.toString(16).toUpperCase().padStart(3, "0") });
    const idB = NES.slider(controls, { label: "ID B (18 bits, extended only)", min: 0, max: 262143, step: 1, value: 0, fmt: (v) => "0x" + v.toString(16).toUpperCase().padStart(5, "0") });
    const dlc = NES.slider(controls, { label: "DLC (data bytes)", min: 0, max: 8, step: 1, value: 2, fmt: (v) => String(v) });
    const pat = NES.seg(controls, { label: "Data bytes", options: [["00", "0x00"], ["ff", "0xFF"], ["55", "0x55"], ["cnt", "01 02 03..."]], value: "cnt" });
    const rate = NES.seg(controls, { label: "Bit rate", options: [[125000, "125 Kbps"], [1000000, "1 Mbps"]], value: 125000 });
    const fields = h("div", { class: "can-fields" });
    view.append(fields);
    const stats = NES.stats(view, [{ key: "raw", label: "Bits before stuffing" }, { key: "st", label: "Stuffed bits" }, { key: "tot", label: "Bits on the bus" }, { key: "eff", label: "Data share" }, { key: "time", label: "Frame time" }, { key: "crc", label: "CRC-15" }]);
    function update() {
      idB.input.disabled = type.value !== "ext";
      const data = Array.from({ length: 8 }, (_, i) => (pat.value === "00" ? 0 : pat.value === "ff" ? 0xff : pat.value === "55" ? 0x55 : i + 1));
      const fr = canFrame({ type: type.value, idA: idA.value, idB: idB.value, dlc: dlc.value, data });
      fields.innerHTML = fr.F.map((f) => `<div class="can-field${f.stuffable ? "" : " fixed"}"><span class="fname">${f.name}</span><span class="fbits">${f.wire.map((b) => `<span class="${b.s ? "stuff" : ""}"${b.s ? ' title="stuffed bit"' : ""}>${b.v}</span>`).join("")}</span></div>`).join("");
      const payload = type.value === "remote" ? 0 : dlc.value * 8;
      stats.set("raw", String(fr.raw));
      stats.set("st", String(fr.stuffed), fr.stuffed ? "warn" : "");
      stats.set("tot", String(fr.total));
      stats.set("eff", pct(payload / fr.total, 1), payload / fr.total > 0.4 ? "good" : "");
      stats.set("time", fmtTime(fr.total / rate.value));
      stats.set("crc", "0x" + fr.crc.toString(16).toUpperCase().padStart(4, "0"));
    }
    [type, idA, idB, dlc, pat, rate].forEach((x) => (x.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: MAC addresses
     ===================================================================== */
  function parseMac(s) {
    const hexs = s.trim().replace(/[:\-.\s]/g, "");
    if (!/^[0-9a-fA-F]{12}$/.test(hexs)) return null;
    return Array.from({ length: 6 }, (_, i) => parseInt(hexs.slice(2 * i, 2 * i + 2), 16));
  }
  const macStr = (b) => b.map((x) => x.toString(16).toUpperCase().padStart(2, "0")).join(":");
  function labMac(el) {
    const { controls, view } = NES.lab(el, {
      title: "Read a MAC address",
      hint: "Type a MAC address (with or without separators) or pick one. The first 24 bits are the OUI, the last 24 the hardware identifier. Two low bits of the first byte carry extra meaning.",
    });
    const input = h("input", { type: "text", class: "text-in", value: "AA:BB:CC:DD:EE:FF", "aria-label": "MAC address", spellcheck: "false" });
    controls.append(h("div", { class: "ctl" }, [h("label", { class: "ctl-label", html: "<span>MAC address</span>" }), input]));
    const presets = [["Slide example", "AA:BB:CC:DD:EE:FF"], ["Broadcast", "FF:FF:FF:FF:FF:FF"], ["Random NIC", null]];
    const row = h("div", { class: "preset-row" });
    presets.forEach(([n, v]) => row.append(h("button", { type: "button", class: "btn btn-sm", text: n, onclick: () => {
      if (v) input.value = v;
      else { const b = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256)); b[0] &= 0xfc; input.value = macStr(b); }
      update();
    } })));
    controls.append(row);
    const box = h("div", { class: "mac-box" });
    view.append(box);
    const stats = NES.stats(view, [{ key: "oui", label: "OUI (manufacturer)" }, { key: "nic", label: "Hardware identifier" }, { key: "kind", label: "Delivered to" }, { key: "adm", label: "Assigned" }]);
    const verdict = verdictBox(view);
    function update() {
      const b = parseMac(input.value);
      if (!b) {
        box.innerHTML = "";
        ["oui", "nic", "kind", "adm"].forEach((k) => stats.set(k, "-"));
        verdict.set("bad", "<b>Not a MAC address.</b> It needs exactly 12 hex digits (6 bytes = 48 bits).");
        return;
      }
      const ig = b[0] & 1, ul = (b[0] >> 1) & 1, bcast = b.every((x) => x === 0xff);
      box.innerHTML = `<div class="mac-bytes">${b.map((x, i) => `<span class="${i < 3 ? "oui" : "nic"}">${x.toString(16).toUpperCase().padStart(2, "0")}</span>`).join("")}</div>` +
        `<div class="mac-legend"><span class="oui">OUI: 24 bits</span><span class="nic">hardware: 24 bits</span></div>` +
        `<div class="mac-first">first byte in binary: ${b[0].toString(2).padStart(8, "0").split("").map((c, i) => `<span class="${i === 7 ? "ig" : i === 6 ? "ul" : ""}">${c}</span>`).join("")} <small>(U/L bit, I/G bit)</small></div>`;
      stats.set("oui", macStr(b.slice(0, 3)));
      stats.set("nic", macStr(b.slice(3)));
      stats.set("kind", bcast ? "everyone (broadcast)" : ig ? "a group (multicast)" : "one interface", bcast ? "warn" : "");
      stats.set("adm", ul ? "locally" : "by IEEE OUI");
      if (bcast) verdict.set("warn", "<b>Broadcast.</b> FF:FF:FF:FF:FF:FF addresses every interface on the network.");
      else if (ig) verdict.set("", "<b>Group address.</b> The lowest bit of the first byte (I/G) is 1, so this is a multicast group, not a single interface.");
      else verdict.set("good", "<b>Unicast.</b> One specific interface. " + (ul ? "The U/L bit is 1, so this address was assigned locally rather than taken from an IEEE-registered OUI." : "The OUI tells you the manufacturer."));
    }
    input.addEventListener("input", update);
    update();
  }

  /* =====================================================================
     LAB: Ethernet frame size and efficiency
     ===================================================================== */
  function labEthFrame(el) {
    const { controls, view } = NES.lab(el, {
      title: "How much of a frame is data?",
      hint: "Field sizes as listed on the slide. Payloads shorter than 46 bytes are padded up to 46.",
    });
    const pl = NES.slider(controls, { label: "Data to send", min: 0, max: 1500, step: 1, value: 100, fmt: (v) => v + " bytes" });
    const rate = NES.seg(controls, { label: "Link speed", options: [[10e6, "10 Mbps"], [100e6, "100 Mbps"], [1e9, "1 Gbps"]], value: 100e6 });
    const quick = h("div", { class: "preset-row" });
    [[0, "0 B"], [46, "46 B"], [1500, "1500 B"]].forEach(([v, t]) => quick.append(h("button", { type: "button", class: "btn btn-sm", text: t, onclick: () => { pl.set(v); update(); } })));
    controls.append(quick);
    const bar = h("div", { class: "eth-bar" });
    view.append(h("div", { class: "stage" }, [bar]));
    const stats = NES.stats(view, [{ key: "tot", label: "Frame on the wire" }, { key: "pad", label: "Padding" }, { key: "lt", label: "Length/Type field" }, { key: "eff", label: "Data share" }, { key: "time", label: "Time on the wire" }]);
    const FIELDS = [["preamble", 7, "--muted"], ["sfd", 1, "--muted"], ["dest", 6, "--accent"], ["src", 6, "--accent"], ["len", 2, "--warn"], ["payload", 0, "--tech"], ["pad", 0, "--line-2"], ["fcs", 4, "--ok"], ["esd", 4, "--muted"]];
    function update() {
      const p = pl.value, pad = Math.max(0, 46 - p), tot = 30 + p + pad;
      const parts = FIELDS.map(([n, s, c]) => [n, n === "payload" ? p : n === "pad" ? pad : s, c]).filter((x) => x[1] > 0);
      bar.innerHTML = parts.map(([n, s, c]) => `<span style="flex:${s} 0 0;background:var(${c})" title="${n}: ${s} bytes">${s / tot > 0.07 ? n : ""}</span>`).join("");
      stats.set("tot", tot + " bytes");
      stats.set("pad", pad + " bytes", pad ? "warn" : "");
      stats.set("lt", "0x" + p.toString(16).toUpperCase().padStart(4, "0") + " (" + p + ")");
      stats.set("eff", pct(p / tot, 1), p / tot > 0.9 ? "good" : p / tot < 0.5 ? "bad" : "warn");
      stats.set("time", fmtTime((tot * 8) / rate.value));
    }
    pl.onchange = rate.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: hub vs learning switch
     ===================================================================== */
  function labSwitch(el) {
    const { controls, view } = NES.lab(el, {
      title: "Hub or switch?",
      hint: "Five devices on one box (port numbers as in the slide). A switch learns which MAC address sits behind which port from the source address of every frame; entries expire after 5 minutes in this model.",
    });
    const HOSTS = [["A", 4], ["B", 7], ["C", 3], ["D", 5], ["E", 6]];
    const mode = NES.seg(controls, { label: "Box", options: [["switch", "Switch"], ["hub", "Repeater hub"]], value: "switch" });
    const from = NES.seg(controls, { label: "From", options: HOSTS.map(([n]) => [n, n]), value: "A" });
    const to = NES.seg(controls, { label: "To", options: HOSTS.map(([n]) => [n, n]).concat([["*", "All"]]), value: "C" });
    const send = h("button", { class: "btn", type: "button", text: "Send frame" });
    const wait = h("button", { class: "btn", type: "button", text: "Wait 3 minutes" });
    const reset = h("button", { class: "btn", type: "button", text: "Reset" });
    controls.append(h("div", { class: "btn-row" }, [send, wait, reset]));
    const st = h("div", { class: "stage" });
    view.append(st);
    const tbl = h("div", { class: "table-wrap" });
    view.append(tbl);
    const stats = NES.stats(view, [{ key: "sent", label: "Frames sent" }, { key: "links", label: "Copies on the cables" }, { key: "tab", label: "Table entries" }]);
    const verdict = verdictBox(view);
    let table = new Map(), now = 0, sent = 0, copies = 0, last = null;
    const pos = { A: [70, 40], B: [370, 40], C: [40, 170], D: [220, 205], E: [400, 170] };
    function svg() {
      const cx = 220, cy = 110;
      let s = `<svg class="sch" viewBox="0 0 440 250" role="img" aria-label="Star topology around a ${mode.value}">`;
      HOSTS.forEach(([n, port]) => {
        const [x, y] = pos[n];
        let cls = "";
        if (last) { if (n === last.src) cls = "lo"; else if (last.out.includes(n)) cls = "hi"; }
        s += `<line class="w ${cls}" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
        s += `<text class="small" x="${cx + (x - cx) * 0.4 + 6}" y="${cy + (y - cy) * 0.4 - 4}">${port}</text>`;
      });
      s += `<rect class="box" x="${cx - 44}" y="${cy - 20}" width="88" height="40" rx="5"/><text class="lbl" x="${cx}" y="${cy + 5}" text-anchor="middle">${mode.value === "switch" ? "Switch" : "Hub"}</text>`;
      HOSTS.forEach(([n]) => {
        const [x, y] = pos[n];
        let note = "", cls = "";
        if (last) {
          if (n === last.src) { note = "sender"; cls = "t-lo"; }
          else if (last.out.includes(n)) { const mine = last.dst === "*" || last.dst === n; note = mine ? "accepts" : "ignores"; cls = mine ? "t-ok" : "t-z"; }
        }
        s += `<rect class="box" x="${x - 26}" y="${y - 16}" width="52" height="32" rx="4"/><text class="lbl" x="${x}" y="${y + 5}" text-anchor="middle">${n}</text>`;
        if (note) s += `<text class="state ${cls}" x="${x}" y="${y + 32}" text-anchor="middle">${note}</text>`;
      });
      return s + "</svg>";
    }
    function render() {
      st.innerHTML = svg();
      const rows = [...table.entries()].sort((a, b) => a[0].localeCompare(b[0]));
      tbl.innerHTML = mode.value === "hub" ? `<p class="lab-hint" style="margin:0">A hub keeps no table: it repeats every frame to every other port, like one shared bus.</p>` :
        `<table class="tt"><thead><tr><th>MAC</th><th>Port</th><th class="out">Age</th></tr></thead><tbody>` +
        (rows.length ? rows.map(([m, e]) => `<tr><td>${m}</td><td>${e.port}</td><td class="out">${now - e.t} min</td></tr>`).join("") : `<tr><td colspan="3">(empty: nothing learned yet)</td></tr>`) + "</tbody></table>";
      stats.set("sent", String(sent));
      stats.set("links", String(copies));
      stats.set("tab", mode.value === "hub" ? "-" : String(table.size));
    }
    const mac = (n) => "MAC " + n;
    send.addEventListener("click", () => {
      const s = from.value, d = to.value;
      if (s === d) { verdict.set("warn", "<b>Pick a different destination.</b> A device does not send frames to itself over the network."); return; }
      const sp = HOSTS.find((x) => x[0] === s)[1];
      let out, why;
      if (mode.value === "hub") { out = HOSTS.map((x) => x[0]).filter((n) => n !== s); why = "<b>Repeated to every port.</b> The hub does not look at addresses; every device receives the frame and all but the destination ignore it."; }
      else {
        table.set(mac(s), { port: sp, t: now });
        if (d === "*") { out = HOSTS.map((x) => x[0]).filter((n) => n !== s); why = "<b>Broadcast.</b> Addressed to FF:FF:FF:FF:FF:FF, so it goes to every port except the one it came from."; }
        else if (table.has(mac(d))) { out = [d]; why = "<b>Forwarded to port " + table.get(mac(d)).port + " only.</b> The switch already learned where " + d + " is, so the other cables stay free."; }
        else { out = HOSTS.map((x) => x[0]).filter((n) => n !== s); why = "<b>Unknown destination: flooded.</b> " + d + " is not in the table yet, so the frame is repeated to all other ports. The switch did learn that " + s + " is on port " + sp + "."; }
      }
      sent++; copies += out.length;
      last = { src: s, dst: d, out };
      verdict.set(out.length === 1 ? "good" : "warn", why);
      render();
    });
    wait.addEventListener("click", () => {
      now += 3;
      let expired = 0;
      [...table.entries()].forEach(([m, e]) => { if (now - e.t >= 5) { table.delete(m); expired++; } });
      last = null;
      verdict.set("", "<b>3 minutes later.</b> " + (expired ? expired + " entr" + (expired === 1 ? "y" : "ies") + " expired and will have to be learned again." : "No entry has expired yet (they expire after 5 minutes without traffic from that address)."));
      render();
    });
    reset.addEventListener("click", () => { table = new Map(); now = 0; sent = 0; copies = 0; last = null; verdict.set("", "Send a frame from A to C."); render(); });
    mode.onchange = () => { last = null; render(); };
    from.onchange = to.onchange = () => {};
    verdict.set("", "Send a frame from A to C, then from C back to A, then A to C again.");
    render();
  }

  /* =====================================================================
     LAB: MLT-3 (and 4B/5B)
     ===================================================================== */
  const T4B5B = ["11110", "01001", "10100", "10101", "01010", "01011", "01110", "01111", "10010", "10011", "10110", "10111", "11010", "11011", "11100", "11101"];
  // MLT-3: cycle 0, -1, 0, +1; a '1' moves one step, a '0' stays (start at 0 heading to -1, as in the slide)
  function mlt3(bits) { const cyc = [0, -1, 0, 1]; let k = 0; return bits.map((b) => { if (b) k = (k + 1) % 4; return cyc[k]; }); }
  function labMlt3(el, opt) {
    const with4b = !!opt.with4b5b;
    const { controls, view } = NES.lab(el, {
      title: with4b ? "4B/5B, then MLT-3" : "MLT-3 line coding",
      hint: with4b
        ? "Each 4-bit nibble is replaced by its 5-bit code from the table, and the result is sent with MLT-3. Start with data 0x00 and switch 4B/5B off to see why it is needed."
        : "Three levels in the fixed order -1, 0, +1, 0, -1, ... A '1' moves one step, a '0' stays. The default bits are the slide's example.",
    });
    let ed = null, byte = null, use = null;
    if (with4b) {
      byte = NES.slider(controls, { label: "Data byte (two nibbles)", min: 0, max: 255, step: 1, value: 0, fmt: (v) => "0x" + v.toString(16).toUpperCase().padStart(2, "0") });
      use = NES.seg(controls, { label: "4B/5B encoding", options: [[1, "On"], [0, "Off"]], value: 1 });
    } else {
      ed = bitEditor(view, { bits: S2B("11101101"), presets: [["Slide example", S2B("11101101")], ["All 1", allOf(1)], ["All 0", allOf(0)], ["Random", randomBits]] });
    }
    const map = h("div", { class: "bitrow" });
    view.append(map);
    const cv = canvas(140, "MLT-3 waveform");
    view.append(stage(cv));
    const stats = NES.stats(view, with4b
      ? [{ key: "n", label: "Bits on the wire" }, { key: "tr", label: "Transitions" }, { key: "flat", label: "Longest flat stretch" }, { key: "rate", label: "For 100 Mbps of data" }]
      : [{ key: "tr", label: "Transitions" }, { key: "flat", label: "Longest flat stretch" }, { key: "f", label: "All 1s repeat every" }]);
    let bits = [], lv = [];
    const draw = NES.canvas(cv, (ctx, w) => {
      const n = bits.length, padL = 34, padR = 8;
      const X = (t) => padL + (t / n) * (w - padL - padR), Y = (v) => 70 - v * 42;
      ctx.strokeStyle = C("--grid"); ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
      for (let i = 0; i <= n; i++) { ctx.beginPath(); ctx.moveTo(X(i), 14); ctx.lineTo(X(i), 126); ctx.stroke(); }
      ctx.setLineDash([]);
      [-1, 0, 1].forEach((v) => { label(ctx, (v > 0 ? "+" : "") + v, padL - 6, Y(v) + 4, C("--muted"), 10, false, "end"); hline(ctx, X(0), X(n), Y(v), C("--grid"), [1, 4]); });
      trace(ctx, [[0, 0, 0]].concat(lv.map((v, i) => [i, i + 1, v])), X, Y, C("--tech"), 2.4);
      bits.forEach((b, i) => label(ctx, String(b), X(i + 0.5), 11, b ? C("--hi") : C("--lo"), 10, true, "center"));
    });
    function update() {
      let rows = "";
      if (with4b) {
        const nib = [byte.value >> 4, byte.value & 15];
        if (use.value) {
          bits = S2B(T4B5B[nib[0]] + T4B5B[nib[1]]);
          rows = bitLine("Nibbles", nib.map((x) => ({ t: x.toString(16).toUpperCase() + " = " + x.toString(2).padStart(4, "0") }))) +
            bitLine("4B/5B", nib.map((x) => ({ t: T4B5B[x] })));
        } else {
          bits = S2B(nib.map((x) => x.toString(2).padStart(4, "0")).join(""));
          rows = bitLine("Raw bits", bits.map((v) => ({ t: v, cls: "b" + v })));
        }
      } else bits = ed.bits;
      lv = mlt3(bits);
      rows += bitLine("Code", lv.map((v) => ({ t: (v > 0 ? "+" : "") + v })));
      map.innerHTML = rows;
      const tr = lv.reduce((a, v, i) => a + ((i ? lv[i - 1] : 0) !== v ? 1 : 0), 0);
      let flat = 0, run = 0, lastV = 0;
      lv.forEach((v) => { run = v === lastV ? run + 1 : 1; lastV = v; flat = Math.max(flat, run); });
      stats.set("tr", String(tr), tr ? "" : "bad");
      stats.set("flat", flat + " bit" + (flat === 1 ? "" : "s"), flat >= bits.length ? "bad" : flat > 4 ? "warn" : "good");
      if (with4b) { stats.set("n", String(bits.length)); stats.set("rate", use.value ? "125 Mbaud" : "100 Mbaud"); }
      else stats.set("f", "4 bits");
      draw();
    }
    if (with4b) byte.onchange = use.onchange = update; else ed.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: line rates of Ethernet variants
     ===================================================================== */
  function labRates(el) {
    const { controls, view } = NES.lab(el, {
      title: "Where do the megabits come from?",
      hint: "Data rate per direction = pairs × bits per symbol × code efficiency × symbol rate. Load a standard, then change one factor at a time.",
    });
    const STD = {
      t10: { name: "10BASE-T", pairs: 1, bps: 0.5, eff: 1, mbd: 20, code: "Manchester (2 half-bit levels per bit)", note: "2 pairs: one each way", dist: "100 m" },
      tx: { name: "100BASE-TX", pairs: 1, bps: 1, eff: 0.8, mbd: 125, code: "4B/5B + MLT-3", note: "2 pairs: one each way", dist: "100 m" },
      t1: { name: "100BASE-T1", pairs: 1, bps: 1.5, eff: 1, mbd: 66.67, code: "4B/3B, 3B2T, PAM-3 (3 bits in 2 symbols)", note: "1 pair, both ways (echo cancellation)", dist: "15 m" },
      gt: { name: "1000BASE-T", pairs: 4, bps: 2, eff: 1, mbd: 125, code: "4D-PAM-5 (2 bits per symbol per pair)", note: "4 pairs, all both ways (echo cancellation)", dist: "100 m" },
    };
    const std = NES.seg(controls, { label: "Standard", options: [["t10", "10BASE-T"], ["tx", "100BASE-TX"], ["t1", "100BASE-T1"], ["gt", "1000BASE-T"]], value: "gt" });
    const pairs = NES.slider(controls, { label: "Pairs carrying data each way", min: 1, max: 4, step: 1, value: 4, fmt: (v) => String(v) });
    const bps = NES.seg(controls, { label: "Data bits per symbol", options: [[0.5, "0.5"], [1, "1"], [1.5, "1.5"], [2, "2"]], value: 2 });
    const eff = NES.seg(controls, { label: "Block code efficiency", options: [[1, "1"], [0.8, "4/5"]], value: 1 });
    const mbd = NES.slider(controls, { label: "Symbol rate per pair", min: 10, max: 250, step: 0.01, value: 125, fmt: (v) => trimNum(v, 2) + " MBd" });
    const out = h("div", { class: "rate-eq" });
    view.append(out);
    const stats = NES.stats(view, [{ key: "rate", label: "Data rate per direction" }, { key: "code", label: "Line code" }, { key: "cable", label: "Cable" }, { key: "dist", label: "Max distance" }]);
    const verdict = verdictBox(view);
    function load() { const s = STD[std.value]; pairs.set(s.pairs); bps.set(s.bps, true); eff.set(s.eff, true); mbd.set(s.mbd); update(); }
    function update() {
      const r = pairs.value * bps.value * eff.value * mbd.value, s = STD[std.value];
      const match = pairs.value === s.pairs && bps.value === s.bps && eff.value === s.eff && Math.abs(mbd.value - s.mbd) < 0.01;
      out.innerHTML = `<div class="formula">${pairs.value} × ${bps.value} × ${eff.value === 0.8 ? "4/5" : "1"} × ${trimNum(mbd.value, 2)} MBd = <b>${trimNum(r, 1)} Mbps</b></div>`;
      stats.set("rate", trimNum(r, 1) + " Mbps", match ? "good" : "");
      stats.set("code", match ? s.code : "custom");
      stats.set("cable", match ? s.note : "custom");
      stats.set("dist", match ? s.dist : "-");
      verdict.set(match ? "good" : "", match ? "<b>" + s.name + ".</b> " + ({ t10: "Manchester needs two signal levels per bit, so 10 Mbps runs at 20 MBd.", tx: "4B/5B adds one bit per four, so 100 Mbps needs 125 MBd on the wire.", t1: "3 bits in 2 ternary symbols: 100 Mbps at 66.67 MBd, over a single pair.", gt: "Four pairs in parallel, 2 bits per symbol each, at 125 MBd: 8 bits per symbol period." })[std.value]
        : "<b>Your own variant.</b> Click a standard to load its numbers again.");
    }
    std.onchange = load;
    [pairs, bps, eff, mbd].forEach((x) => (x.onchange = update));
    load();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    layers: labLayers,
    linecode: labLineCode,
    manchester: labManchester,
    wire: labWire,
    diff: labDiff,
    resync: labResync,
    usb: labUsb,
    crc: labCrc,
    polling: labPolling,
    csma: (el) => labCsma(el, { mode: "csma", seed: 3 }),
    "csma-cd": (el) => labCsma(el, { mode: "cd", seed: 7 }),
    "csma-ca": (el) => labCsma(el, { mode: "ca", seed: 9 }),
    backoff: labBackoff,
    prio: labPrio,
    canlevels: labCanLevels,
    dominant: labDominant,
    canarb: labCanArb,
    canframe: labCanFrame,
    mac: labMac,
    ethframe: labEthFrame,
    switch: labSwitch,
    mlt3: (el) => labMlt3(el, {}),
    "4b5b": (el) => labMlt3(el, { with4b5b: true }),
    rates: labRates,
  };


  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("wired-nes", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
