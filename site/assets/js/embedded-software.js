/* Week 3, Embedded Software: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";
  const bin8 = (v) => (v & 0xff).toString(2).padStart(8, "0");
  const hex8 = (v) => "0x" + (v & 0xff).toString(16).toUpperCase().padStart(2, "0");

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    "embedded-software": [
      {
        q: "Why is embedded software also called <em>firmware</em>?",
        options: [
          ["Because it is written by the hardware company (the 'firm')", false, "The name has nothing to do with who writes it. Plenty of firmware is written by third parties or as open source."],
          ["Because it changes far less easily and less often than software on a general purpose computer: it is 'firmer'", true, "Firmware sits between hardware (fixed) and software (easily changed). It is tied to one device and is typically only replaced by reflashing the whole image."],
          ["Because it can never be changed after the device leaves the factory", false, "It can be changed (by flashing a new binary, sometimes even over the air). It is just harder and rarer than installing an app on a laptop."],
          ["Because it runs faster than normal software", false, "Speed is not what the name refers to. Embedded processors are usually much slower than desktop ones."],
        ],
      },
      {
        q: "Which statement best describes embedded software?",
        options: [
          ["It is hardware independent, so the same binary runs on any microcontroller", false, "It is the opposite: embedded software is tied to particular hardware and built around its constraints."],
          ["It is mostly written in JavaScript", false, "The slides state it is most commonly written in C, which gives direct control over memory and registers with little overhead."],
          ["It only does calculations and never touches sensors or actuators", false, "Controlling sensors, actuators and peripherals is one of its defining jobs."],
          ["It is close to the hardware: tied to it, shaped by its limits, and controlling sensors, actuators and peripherals", true, "That is the definition from the lecture: software that runs on the processor of an embedded system and lives close to the hardware."],
        ],
      },
    ],

    "dev-stages": [
      {
        q: "What does 'flashing' (or 'programming') a device mean?",
        options: [
          ["Installing the executable binary, built on a normal computer, into the memory of the embedded device", true, "Development and execution happen on different machines. The build output has to be copied into the device's flash memory before it can run."],
          ["Blinking an LED to show the device is alive", false, "That is a classic first program and a debugging trick, but not what flashing means."],
          ["Compiling the source code", false, "Compiling is the Build stage. Flashing is the next stage: moving the result onto the device."],
          ["Erasing all data from the device's RAM", false, "RAM is not what is being written. The binary goes into non-volatile flash memory."],
        ],
      },
      {
        q: "Where does each stage take place?",
        options: [
          ["Everything happens on the embedded device", false, "A small MCU has no editor or compiler. Writing and building happen on a normal computer."],
          ["Everything happens on the normal computer", false, "The code has to run and be tested on the real device, with its real peripherals and timing."],
          ["Writing and building happen on a normal computer; the binary runs, and is debugged and tested, on the embedded device", true, "This split between development environment and execution environment is what makes embedded development different (it is called cross-development)."],
          ["Building happens on the device, testing on the computer", false, "It is the other way around: the computer builds, the device executes."],
        ],
      },
    ],

    "embedded-os": [
      {
        q: "What is the basic role of an operating system?",
        options: [
          ["To make the CPU run at a higher clock frequency", false, "An OS does not make hardware faster. It organises how the hardware is used."],
          ["To manage and abstract the hardware resources", true, "The OS shares the CPU, memory and peripherals between programs and hides hardware details behind common interfaces."],
          ["To translate C into machine code", false, "That is the compiler's job, and it happens on the development computer."],
          ["To provide a graphical user interface", false, "A GUI is optional. Most embedded OSs have none at all."],
        ],
      },
      {
        q: "What is the trade-off of running <em>bare metal</em> (no OS at all)?",
        options: [
          ["Maximum flexibility but poor efficiency", false, "It is the reverse. Without an OS nothing is wasted, but the code is welded to one specific hardware."],
          ["It is impossible: every MCU needs an OS to boot", false, "An MCU happily runs a single program with no OS. Many simple products work this way."],
          ["Maximum efficiency but no flexibility: the application talks directly to the hardware", true, "No abstraction layer means no overhead, but also no drivers, no threads and no portability. You write everything yourself for that exact chip."],
          ["It uses more memory than using an embedded OS", false, "It uses less. The OS code and its data structures are simply not there."],
        ],
      },
    ],

    "os-requirements": [
      {
        q: "What makes an OS a <em>real-time</em> OS (RTOS)?",
        options: [
          ["It is extremely fast on average", false, "Real-time is about guarantees, not average speed. A slow but predictable system can be real-time; a fast but unpredictable one is not."],
          ["It shows the current time of day", false, "That is a real-time clock (RTC), a piece of hardware. The name is similar but the concept is different."],
          ["It can guarantee worst-case execution times", true, "A time-sensitive application (airbag, motor control) must react before a deadline every single time. An RTOS is built so those upper bounds can be guaranteed."],
          ["It runs without a scheduler", false, "An RTOS has a scheduler. It is a carefully predictable one."],
        ],
      },
      {
        q: "Why must an embedded OS care about energy efficiency?",
        options: [
          ["Because it has to duty cycle the CPU, radio and peripherals (or give the application an API to do so) so battery-powered devices last", true, "Most embedded devices spend nearly all their time doing nothing. An OS that keeps things powered when idle would drain a battery in days instead of years."],
          ["Because MCUs overheat easily", false, "Low-power MCUs draw milliamps. Heat is rarely the concern; battery life is."],
          ["Because energy efficient code is always smaller", false, "Code size (memory footprint) is a separate requirement on the list."],
          ["It does not: energy is purely a hardware matter", false, "The hardware offers sleep modes, but software decides when to enter them. That decision dominates battery life."],
        ],
      },
    ],

    "os-modules": [
      {
        q: "An embedded OS supports 20 CPU families and 200 peripheral drivers. How much of that ends up in your firmware binary?",
        options: [
          ["All of it: the OS is installed once and the application is added later", false, "That is the desktop model. An embedded OS is compiled together with the application into one image."],
          ["All of it, but unused parts are compressed", false, "Unused code is not compressed, it is simply never compiled in."],
          ["None of it: drivers are downloaded at run time", false, "A small MCU has no way to fetch and link drivers at run time. Everything is decided at build time."],
          ["Only the modules you selected: code for other CPUs, absent peripherals and unused protocols is left out", true, "The build system (make) and preprocessor statements (#ifdef) include only what is needed, so the binary contains just the absolutely necessary code."],
        ],
      },
      {
        q: "Which two mechanisms does the developer use to decide which OS modules are included?",
        options: [
          ["The scheduler and the interrupt controller", false, "Those are run-time mechanisms. Module selection happens at build time."],
          ["The bootloader and the debugger", false, "Those are about getting the binary onto the device and inspecting it, not about what the binary contains."],
          ["Mutexes and condition variables", false, "Those are thread synchronisation tools."],
          ["The build system (make) and preprocessor statements (#ifdef)", true, "The build system chooses which source files are compiled; #ifdef removes pieces of code inside files before compilation."],
        ],
      },
    ],

    "os-models": [
      {
        q: "In an event-driven OS such as Contiki-NG, how does code get to run?",
        options: [
          ["Every thread has its own stack and the scheduler switches between them", false, "That is the multi-threading model (e.g. RIOT)."],
          ["All processing is triggered by events (from peripherals or timers); it is roughly an infinite loop that handles events, all in one context", true, "Everything, OS and applications, shares one context and address space like a single program. That is very cheap in memory and processing."],
          ["Code runs only when the user presses a button", false, "Events come from peripherals and timers in general, not just from a user."],
          ["Each application runs in its own protected process with virtual memory", false, "That is a desktop OS. Small MCUs usually do not even have the hardware for that."],
        ],
      },
      {
        q: "What is the price of the more natural multi-threading model?",
        options: [
          ["Programs cannot be written in C", false, "Multi-threaded embedded OSs are written in and programmed with C."],
          ["Overhead: memory for a stack per thread, and run time for context switching", true, "Each thread needs its own stack (RAM is scarce), and every switch costs time to save and restore the context."],
          ["It cannot use interrupts", false, "Interrupts work in every model."],
          ["Nothing: it is better in every respect", false, "If that were true nobody would use event-driven systems. On a device with a few kB of RAM the overhead matters."],
        ],
      },
      {
        q: "Which statement about an RTOS such as FreeRTOS matches the lecture?",
        options: [
          ["Its primary goal is real-time guarantees (worst-case execution time), which brings verification, certification and strict constraints for developers", true, "To be able to promise deadlines, the OS is formally verified, certified and standardised, and developers must follow strict rules."],
          ["Its primary goal is minimal memory use", false, "Small footprint is a general requirement, but the defining goal of an RTOS is timing guarantees."],
          ["Its primary goal is maximum flexibility and easy porting", false, "The slides say the opposite: the constraints needed for guarantees make an RTOS inflexible and difficult to port."],
          ["It is event-driven and has no threads", false, "An RTOS can have threads (tasks). What defines it is the timing guarantee."],
        ],
      },
    ],

    scheduling: [
      {
        q: "In non-preemptive (cooperative) scheduling, what happens if one task never yields?",
        options: [
          ["The scheduler interrupts it after its time slice", false, "That is preemptive scheduling. A cooperative scheduler has no way to take the CPU back."],
          ["The task is deleted automatically", false, "Nothing watches the task in cooperative scheduling (a watchdog timer would eventually reset the whole system)."],
          ["Nothing: other tasks run in parallel", false, "There is one CPU. If a task holds it, nothing else runs."],
          ["It blocks every other task, including important system functions", true, "Each task runs until it voluntarily yields. That is efficient, but one bug (an endless loop) freezes the whole system. It is 'vulnerable to errors'."],
        ],
      },
      {
        q: "Why is classic time-sliced preemptive scheduling less attractive for a battery-powered device?",
        options: [
          ["It cannot run more than one task", false, "It is the scheduling type that handles many tasks most fairly."],
          ["It needs a multicore CPU", false, "Preemption gives pseudo-parallelism on a single CPU."],
          ["The periodic timer tick keeps waking the system, preventing long sleep, and there are more context switches", true, "A tick every few milliseconds means the CPU can never sleep for long. Tickless preemptive scheduling avoids this by preempting only on interrupts and when tasks block."],
          ["It makes starvation of high priority tasks likely", false, "High priority tasks are the ones that get served first."],
        ],
      },
      {
        q: "With priority scheduling, which task can suffer from starvation, and why is that rarely a problem in embedded systems?",
        options: [
          ["The highest priority task; because it is rarely needed", false, "The highest priority task always gets the CPU first, so it cannot starve."],
          ["The lowest priority task; but embedded systems are idle or asleep most of the time, so it still gets its turn", true, "Starvation needs a system that is always busy with higher priority work. A sensor node that sleeps 99% of the time has plenty of free CPU."],
          ["All tasks equally; because priorities are ignored", false, "Priorities are exactly what the scheduler uses to pick the next task."],
          ["The lowest priority task; but it is fixed by adding more RAM", false, "Starvation is about CPU time, not memory."],
        ],
      },
    ],

    sync: [
      {
        q: "Two threads each increment a shared counter that starts at 0, without any protection. What can the final value be?",
        options: [
          ["Always 2", false, "Only if the two read-increment-write sequences do not overlap. Nothing guarantees that."],
          ["1 or 2, depending on how the threads interleave", true, "If both read 0 before either writes back, both write 1 and one increment is lost. That dependence on timing is a race condition."],
          ["Always 1", false, "When the threads happen to run one after the other the result is 2."],
          ["0", false, "At least one write of a value of 1 or more always happens."],
        ],
      },
      {
        q: "Which tool prevents that race condition?",
        options: [
          ["A mutex around the read-increment-write sequence", true, "A mutex lets only one thread at a time execute the critical section, so the second thread reads the value only after the first has written it back."],
          ["A faster CPU", false, "Speed changes how often the unlucky interleaving occurs, not whether it can occur."],
          ["Declaring the counter as a bigger integer type", false, "The size of the variable is irrelevant. The problem is the non-atomic sequence of operations."],
          ["A watchdog timer", false, "A watchdog resets a hung system. It knows nothing about shared data."],
        ],
      },
    ],

    "choose-os": [
      {
        q: "Which of these is <em>not</em> one of the selection criteria from the lecture?",
        options: [
          ["Supported hardware, software and tools", false, "'Features' (platforms, protocols, file systems, simulators, debuggers) is the first criterion on the slide."],
          ["License (proprietary, permissive, copyleft)", false, "License is on the list: it decides what you may do with the code in a product."],
          ["The colour scheme of the OS logo", true, "Correct, this one is made up. The real list is features, portability, certification, license, and documentation/support/community."],
          ["Documentation, support and community", false, "These are on the list and often decide how fast you can actually get work done."],
        ],
      },
      {
        q: "Why does POSIX appear under 'portability'?",
        options: [
          ["It is a hardware debugging interface", false, "That would be JTAG or SWD."],
          ["It is a license type", false, "Licenses are proprietary, permissive or copyleft. POSIX is a standard for OS interfaces."],
          ["It is an open standard API: code written against it can move between operating systems that support it", true, "A generic OS with open standards reduces lock-in compared with a vendor-specific OS and API."],
          ["It is the name of a vendor-specific OS", false, "POSIX is a standard, not a product."],
        ],
      },
    ],

    registers: [
      {
        q: "A peripheral has a register that tells you whether it is busy. What type of register is that?",
        options: [
          ["A command register (write-only)", false, "Command registers are for telling the peripheral to do something."],
          ["A stack register", false, "That belongs to the CPU, not to a peripheral controller."],
          ["A data/configuration register (read/write)", false, "Those hold the data being transferred or the settings. 'Busy' is state reported by the device."],
          ["A status register (read-only)", true, "Status registers report the peripheral's state to the CPU. The CPU reads them; writing makes no sense."],
        ],
      },
      {
        q: "Why is static memory allocation preferred in embedded programming?",
        options: [
          ["Because memory use is known at build time: no fragmentation and no out-of-memory surprise after weeks of running", true, "With a few kB of RAM and a device that must run unattended for years, a failed or fragmented heap is a real risk. Static allocation removes it."],
          ["Because static variables are faster to compute with", false, "Arithmetic speed is the same. The benefit is predictability of memory use."],
          ["Because C has no dynamic allocation", false, "C has malloc() and free(). Embedded developers usually choose to avoid them."],
          ["Because the heap is stored in flash", false, "The heap lives in RAM. That is not the reason."],
        ],
      },
    ],

    interrupts: [
      {
        q: "What happens when an interrupt request (IRQ) reaches the CPU?",
        options: [
          ["The CPU resets", false, "A reset restarts everything. An interrupt is a short, orderly detour."],
          ["The CPU ignores it until the current program ends", false, "The point of an interrupt is that it does not wait. Firmware usually never 'ends' anyway."],
          ["Normal execution is interrupted and the specified interrupt handler runs; afterwards execution continues where it stopped", true, "The CPU saves where it was, jumps to the handler registered for that interrupt, and returns when the handler finishes."],
          ["The peripheral takes over the bus and runs its own code", false, "Peripherals do not execute code. They only raise the signal."],
        ],
      },
      {
        q: "What is the job of the interrupt controller?",
        options: [
          ["It handles the interrupt signals of multiple devices and forwards requests to the CPU", true, "Many peripherals can raise interrupts. The controller collects them, prioritises, and tells the CPU which one needs service."],
          ["It executes the interrupt handlers instead of the CPU", false, "Handlers are ordinary code and run on the CPU."],
          ["It disables all peripherals while the CPU is busy", false, "It does not switch peripherals off. It manages their requests."],
          ["It generates the clock for the timers", false, "Clocks come from oscillators."],
        ],
      },
    ],

    "io-software": [
      {
        q: "What is wrong with busy waiting for a slow peripheral?",
        options: [
          ["It occupies the CPU doing nothing, wastes energy and heats up the system", true, "The CPU spins in a while loop reading the status register. It is fully active yet accomplishes nothing until the peripheral is ready."],
          ["It produces wrong output", false, "The output is correct. The problem is the cost, not the result."],
          ["It cannot be written in C", false, "It is the simplest thing to write: a while loop."],
          ["It requires an operating system", false, "Busy waiting needs nothing at all, which is exactly why it is tempting."],
        ],
      },
      {
        q: "In interrupt-driven I/O, what does the CPU do between two characters?",
        options: [
          ["It keeps reading the status register", false, "That is busy waiting, which interrupt-driven I/O replaces."],
          ["It sleeps (or does other work) until the peripheral's interrupt wakes it", true, "After writing a character the CPU is put to sleep. When the peripheral is done it issues an interrupt, the handler wakes the CPU, and the next character is copied."],
          ["It resets the peripheral", false, "The peripheral is busy handling the character. Resetting it would lose data."],
          ["It transfers the remaining characters with DMA", false, "DMA is a different technique (no CPU per character at all). Here the CPU still copies each character, just without waiting actively."],
        ],
      },
    ],

    timers: [
      {
        q: "What is the resolution of a timer running at 32 768 Hz?",
        options: [
          ["About 30.5 ms", false, "Off by a factor of 1000: 1 / 32 768 s = 0.0000305 s."],
          ["About 41.7 ns", false, "That is the resolution of a 24 MHz timer."],
          ["About 30.5 µs", true, "Resolution = 1/f = 1 / 32 768 Hz ≈ 30.5 µs. The timer cannot distinguish anything shorter than one tick."],
          ["1 second", false, "It counts 32 768 ticks per second, so each tick is far shorter than a second."],
        ],
      },
      {
        q: "After how long does a 24-bit timer at 32 768 Hz overflow?",
        options: [
          ["About 0.7 seconds", false, "That is the 24-bit timer at 24 MHz."],
          ["512 seconds", true, "2<sup>24</sup> ticks / 32 768 ticks per second = 2<sup>24</sup> / 2<sup>15</sup> = 2<sup>9</sup> = 512 s."],
          ["24 seconds", false, "24 is the number of bits, not seconds. The timer counts 2<sup>24</sup> ticks before wrapping."],
          ["It never overflows", false, "Every fixed-size counter wraps to 0 after its maximum value."],
        ],
      },
      {
        q: "How can one hardware timer serve a software timer?",
        options: [
          ["By stopping the hardware timer and restarting it for every software timer", false, "The counter keeps running freely. Stopping it would break every other user of the timer."],
          ["By changing the oscillator frequency", false, "The frequency is fixed by the oscillator (and prescaler). Deadlines are set with COMPARE."],
          ["By polling the counter in a loop", false, "That is busy waiting and defeats the purpose."],
          ["By setting a COMPARE value: the timer raises an interrupt when its counter reaches it, and software updates COMPARE for the next deadline", true, "The counter increments at a fixed frequency and wraps at its maximum. COMPARE marks the moment at which you want to be interrupted."],
        ],
      },
    ],

    "timer-challenge": [
      {
        q: "24-bit LF timer at 32 768 Hz, COUNTER currently reads 12 000 000. You want an event in 300 s. What do you write to COMPARE?",
        options: [
          ["9 830 400", false, "That is the INTERVAL in ticks (300 · 32 768). It has to be added to the current counter value."],
          ["21 830 400", false, "That is COUNTER + INTERVAL, but it does not fit in 24 bits (maximum 16 777 215). The timer wraps, so the compare value must wrap too."],
          ["5 053 184", true, "(12 000 000 + 9 830 400) mod 2<sup>24</sup> = 21 830 400 - 16 777 216 = 5 053 184. The counter wraps past its maximum and reaches this value exactly 300 s from now."],
          ["300", false, "COMPARE is in ticks, not seconds."],
        ],
      },
      {
        q: "Why can you not simply schedule an event 600 s ahead on that timer, and what does PRESCALER = 1 change?",
        options: [
          ["600 s exceeds the 512 s overflow period; halving the tick frequency to 16 384 Hz doubles the period to 1024 s, at the cost of resolution", true, "With f = 16 384 Hz, INTERVAL = 600 · 16 384 = 9 830 400 ticks, which fits in 24 bits. The price is a coarser tick (about 61 µs instead of 30.5 µs)."],
          ["The timer cannot count above 300; the prescaler raises that limit", false, "The limit is the overflow period (512 s), not 300."],
          ["Nothing prevents it; the prescaler only saves energy", false, "600 · 32 768 = 19 660 800 ticks does not fit in 24 bits, so the compare would fire early (after 88 s)."],
          ["The prescaler makes the timer 32 bits wide", false, "The width stays 24 bits. The prescaler slows down the counting."],
        ],
      },
    ],

    watchdog: [
      {
        q: "What must a healthy program do about the watchdog timer?",
        options: [
          ["Let it expire regularly", false, "Expiry means a system reset. That is what should happen only when something went wrong."],
          ["Reset ('kick') it periodically so that it never expires", true, "As long as the main code keeps running and kicking the watchdog, nothing happens. If the code hangs, the kicks stop and the watchdog resets the system."],
          ["Disable interrupts while it runs", false, "The watchdog needs no such thing. It is an independent countdown."],
          ["Read the time from it", false, "It is a safety mechanism, not a clock for the application."],
        ],
      },
      {
        q: "Which failure does a watchdog protect against?",
        options: [
          ["A wrong sensor reading", false, "The watchdog knows nothing about data correctness, only whether it keeps being kicked."],
          ["A drained battery", false, "Without power nothing runs, including the watchdog."],
          ["A short circuit on a GPIO", false, "That is an electrical fault. The watchdog is about software that stops making progress."],
          ["The system hanging, for example in a deadlock or an infinite loop", true, "A hung system no longer kicks the watchdog, the timer expires and the system is reset into a known good state without anyone having to press a button."],
        ],
      },
    ],

    dma: [
      {
        q: "What is the point of Direct Memory Access (DMA)?",
        options: [
          ["It lets peripherals execute code from memory", false, "Peripherals do not execute code. DMA moves data."],
          ["It transfers data between memory and peripherals without involving the CPU in every byte", true, "The CPU programs the DMA controller (address, count, control), then sleeps or does other work. It gets a single interrupt when the whole transfer is done."],
          ["It gives the CPU more RAM", false, "No memory is added. DMA changes who does the copying."],
          ["It makes transfers faster than the CPU could", false, "The slides say it is slower but more energy efficient than the CPU."],
        ],
      },
      {
        q: "How does the CPU find out that a DMA transfer has finished?",
        options: [
          ["It polls the DMA controller in a loop", false, "That would reintroduce busy waiting and waste the benefit."],
          ["The watchdog resets the system", false, "A reset is an error recovery mechanism, not a notification."],
          ["It never finds out", false, "The CPU needs to know in order to use the data or start the next transfer."],
          ["It is notified with an interrupt", true, "One interrupt at the end of the whole transfer, instead of one per byte as in interrupt-driven I/O."],
        ],
      },
    ],

    "power-modes": [
      {
        q: "A sensor node must wake up every 10 minutes to take a measurement and must keep its variables in RAM. Which is the lowest-power mode that works?",
        options: [
          ["Sleep (standby) mode", true, "CPU off, RAM retained, HF clock off, LF clock on: the RTC can schedule the wake-up and the variables survive."],
          ["Idle mode", false, "It works, but the HF clock stays on (about 550 µA on the CC2650). Sleep mode does the same job at about 1 µA."],
          ["Active mode", false, "It works but burns milliamps around the clock."],
          ["Deep sleep (shutdown) mode", false, "No RAM retention and no LF clock, so there is no timed wake-up (only a pin edge) and the variables are lost."],
        ],
      },
      {
        q: "From deep sleep (shutdown) mode, what can wake the MCU?",
        options: [
          ["The RTC at a scheduled time", false, "The LF clock is off in deep sleep, so there is no timer running."],
          ["A UART byte arriving", false, "Internal peripherals are unavailable in deep sleep."],
          ["Nothing, it needs a new battery", false, "Wake-up is possible, just very limited."],
          ["An edge on a pin (or the reset pin)", true, "Only pin-edge detection still works. Since RAM is not retained, the firmware effectively starts again from the beginning."],
        ],
      },
    ],

    "data-types": [
      {
        q: "What is -100 stored as in an 8-bit two's complement integer?",
        options: [
          ["0x64", false, "0x64 is +100, the positive number. The negative value needs the two's complement step."],
          ["0xE4", false, "That would be a sign bit plus the magnitude (sign-and-magnitude), which is not how two's complement works."],
          ["0x9C", true, "Subtract from 2<sup>N</sup>: 256 - 100 = 156 = 0x9C."],
          ["It cannot be stored in 8 bits", false, "A signed 8-bit integer covers -128 to 127, so -100 fits."],
        ],
      },
      {
        q: "Why use <code>int16_t</code> or <code>uint8_t</code> instead of plain <code>int</code>?",
        options: [
          ["Plain int is not allowed in embedded C", false, "It is allowed. It is just ambiguous."],
          ["The size of int depends on the platform (on many embedded systems it is not 32 bits); explicit types say exactly what you get and let you pick the smallest that fits", true, "Code that assumes a 32-bit int overflows silently on a 16-bit MCU. Explicit, minimal types make size and range obvious and save RAM."],
          ["They make the program run on a desktop too", false, "Portability improves, but that is a side effect of being explicit about the size."],
          ["They are automatically volatile", false, "volatile is a separate qualifier with a separate purpose."],
        ],
      },
      {
        q: "A variable is changed inside an interrupt handler and read in the main loop. Which keyword does it need?",
        options: [
          ["static", false, "static controls where a variable is stored and how long it lives. It does not tell the compiler that the value may change behind its back."],
          ["inline", false, "inline is about functions, not variables."],
          ["volatile", true, "volatile says the variable is expected to be changed by other entities (an interrupt, hardware). The compiler then re-reads it from memory every time instead of keeping a copy in a CPU register."],
          ["const", false, "const promises the value will not be modified by this code. That is the opposite of what is happening."],
        ],
      },
    ],

    "inline-macros": [
      {
        q: "<code>#define ONE_PLUS_ONE 1+1</code> and then <code>A = ONE_PLUS_ONE * 10;</code>. What is A?",
        options: [
          ["20", false, "That is what you would get with parentheses: (1+1)*10."],
          ["11", true, "A macro is pure text substitution: the line becomes A = 1+1*10, and multiplication binds tighter than addition, so A = 1 + 10 = 11."],
          ["2", false, "The * 10 is still there after substitution."],
          ["A compile error", false, "The expanded text 1+1*10 is perfectly valid C. That is what makes the bug sneaky."],
        ],
      },
      {
        q: "What does an inline function give you compared with a normal function?",
        options: [
          ["It removes the overhead of the function call while keeping the code in one maintainable place", true, "The compiler pastes the body at the call site, so c = sum(a,b) becomes equivalent to c = a + b, without you copy/pasting code by hand."],
          ["It runs the function in a separate thread", false, "Inlining has nothing to do with threads."],
          ["It stores the function in RAM instead of flash", false, "It does not change where code is stored."],
          ["It makes the function's variables static", false, "Local variables keep their normal behaviour."],
        ],
      },
      {
        q: "<code>#define TIMES_TWO(x) x*2</code>. What is <code>TIMES_TWO(1+1)</code>?",
        options: [
          ["4", false, "You would get 4 with #define TIMES_TWO(x) (x)*2."],
          ["2", false, "Follow the substitution: x is replaced by the text 1+1."],
          ["3", true, "Text substitution gives 1+1*2 = 1 + 2 = 3. Wrapping the parameter in parentheses, (x)*2, fixes it. An inline function avoids the problem entirely."],
          ["6", false, "There is no way to get 6 from 1+1*2."],
        ],
      },
    ],

    "efficient-math": [
      {
        q: "What does <code>A = A &lt;&lt; 3;</code> do to an unsigned integer A (ignoring overflow)?",
        options: [
          ["Multiplies A by 8", true, "Shifting left by N multiplies by 2<sup>N</sup>: 2<sup>3</sup> = 8."],
          ["Divides A by 8", false, "That is a right shift by 3."],
          ["Multiplies A by 3", false, "Each shift position is a factor of 2, not an addition of 1."],
          ["Adds 3 to A", false, "Shifting moves bits, it does not add."],
        ],
      },
      {
        q: "T is an int16 holding temperature in hundredths of a degree, T = 2535. After <code>T = T &gt;&gt; 1;</code> what does T represent?",
        options: [
          ["12.675 °C", false, "An integer cannot hold the half. The remainder of the division is lost."],
          ["25.35 °C, because shifts do not work on fixed-point numbers", false, "A fixed-point number is just an integer with an agreed scale, so shifts work as usual."],
          ["50.70 °C", false, "That would be a left shift (multiplying by 2)."],
          ["12.67 °C (T = 1267)", true, "2535 / 2 = 1267 remainder 1, and the remainder is dropped. In hundredths of a degree that is 12.67 °C, with no floating point involved."],
        ],
      },
    ],

    bitwise: [
      {
        q: "Which expression <em>sets</em> bit 6 of A and leaves all other bits unchanged?",
        options: [
          ["A = A & (0x1&lt;&lt;6);", false, "AND with the mask keeps bit 6 but clears every other bit."],
          ["A = (0x1&lt;&lt;6);", false, "This overwrites the whole byte with 0b01000000, destroying the other bits."],
          ["A = A | (0x1&lt;&lt;6);", true, "OR with 1 sets a bit, OR with 0 keeps it as it is. The mask has a 1 only at position 6."],
          ["A = A ^ (0x1&lt;&lt;6);", false, "XOR toggles: it sets the bit only if it was 0, and clears it if it was already 1."],
        ],
      },
      {
        q: "A = 0b11010010. What is A after <code>A = A &amp; ((0x1&lt;&lt;6) ^ 0xFF);</code>?",
        options: [
          ["0b11010010", false, "Bit 6 was 1 and the operation clears it, so A changes."],
          ["0b01000000", false, "That would be A & (0x1<<6): keeping only bit 6. The mask here is inverted."],
          ["0b10010010", true, "(0x1<<6) ^ 0xFF = 0b10111111. AND with 0 clears bit 6, AND with 1 keeps every other bit."],
          ["0b00000000", false, "Only one bit is cleared, not all of them."],
        ],
      },
      {
        q: "What does <code>if (A &amp; (0x1&lt;&lt;3)) { ... }</code> test?",
        options: [
          ["Whether A equals 3", false, "The mask is 0b00001000 (decimal 8), and only one bit is examined."],
          ["Whether bit 3 of A is set", true, "The AND clears every bit except bit 3. The result is non-zero (true in C) exactly when bit 3 was 1."],
          ["Whether A is greater than 8", false, "A = 16 is greater than 8 but has bit 3 clear, so the branch is not taken."],
          ["Whether the three lowest bits are set", false, "That would need the mask 0b00000111."],
        ],
      },
    ],

    bitfields: [
      {
        q: "What is the value of <code>MASK3 = (0x1&lt;&lt;3) - 1</code>?",
        options: [
          ["0b00001000", false, "That is 0x1<<3 before subtracting 1."],
          ["0b00000111", true, "8 - 1 = 7 = 0b00000111: a mask on the lowest three bits."],
          ["0b00000011", false, "That is (0x1<<2) - 1, a two-bit mask."],
          ["0b11111000", false, "That is the inverted mask, used for clearing the field."],
        ],
      },
      {
        q: "FILTER_CTRL = 0b10010011. What does <code>(FILTER_CTRL &gt;&gt; 6) &amp; MASK2</code> return (the RANGE field)?",
        options: [
          ["0b11", false, "Those are the lowest two bits of the register (part of ODR), not the top two."],
          ["0b01", false, "Bit 7 is 1 and bit 6 is 0, so the field reads 10, not 01."],
          ["0b10000000", false, "That is what you get without the shift. The field value has to be moved down to bit 0."],
          ["0b10", true, "Shifting right by 6 moves bits 7:6 (which are 1 and 0) down to positions 1:0. Masking with 0b11 keeps just those two bits."],
        ],
      },
      {
        q: "Why is a field written as <code>R = (R &amp; (0xFF ^ MASK3)) | (new &amp; MASK3)</code> and not simply <code>R = new</code>?",
        options: [
          ["To make the code slower on purpose", false, "The extra operations cost a few nanoseconds and buy correctness."],
          ["Because registers cannot be assigned directly in C", false, "They can. The issue is what the assignment does to the other bits."],
          ["To change only those three bits: first clear them, then OR in the new value, leaving the other fields of the register intact", true, "A register packs several settings into one byte. Writing the whole byte would silently overwrite RANGE, HALF_BW and the rest."],
          ["Because new might be negative", false, "Sign is not the concern. Masking new with MASK3 just guards against a value that is too big for the field."],
        ],
      },
    ],

    flashing: [
      {
        q: "What is normally used to get the binary into the MCU's flash memory?",
        options: [
          ["A special programmer/debugger chip or board that takes commands from the computer over USB or serial", true, "Development boards such as the CC2650 LaunchPad usually have this programmer/debugger on board, which is why a single USB cable is enough."],
          ["The compiler writes it directly over Wi-Fi", false, "The compiler only produces the file. A physical programming interface carries it to the chip."],
          ["You type it in through the GPIO pins", false, "No. A dedicated programming interface is used."],
          ["The watchdog timer loads it", false, "The watchdog only resets the system."],
        ],
      },
      {
        q: "What is the alternative route mentioned in the lecture, when no programmer is available?",
        options: [
          ["Copying the file to an SD card", false, "Not mentioned, and most small MCUs have no SD card slot."],
          ["The MCU's bootloader receiving the firmware over the UART (serial) interface", true, "A bootloader is a small program already on the chip that can receive a new firmware image over serial and write it to flash."],
          ["Re-soldering the flash chip", false, "Not a practical programming method."],
          ["Sending it through the ADC", false, "The ADC measures voltages. It is not a data interface."],
        ],
      },
    ],

    "debug-interfaces": [
      {
        q: "Which programming/debugging interface is specific to ARM processors and uses two wires?",
        options: [
          ["SWD", true, "Serial Wire Debug is ARM's interface: SWDIO and SWCLK, plus an optional RESET."],
          ["cJTAG", false, "cJTAG (IEEE 1149.7) does use two wires (TMSC, TCKC), but it is a generic standard, not ARM specific."],
          ["JTAG", false, "JTAG is a generic standard (IEEE 1149.1) and uses four wires: TCK, TMS, TDI, TDO."],
          ["UART", false, "UART is a serial communication interface. A bootloader may use it, but it is not a debug standard."],
        ],
      },
      {
        q: "How do JTAG and cJTAG/SWD differ when programming several devices?",
        options: [
          ["JTAG chains them one after another (daisy chain); cJTAG and SWD connect them in a star topology", true, "In a JTAG daisy chain the data output of one device feeds the data input of the next. The two-wire interfaces share their wires among the devices in a star."],
          ["Only JTAG can program more than one device", false, "All three can, according to the slide. They differ in topology."],
          ["cJTAG needs more wires than JTAG", false, "cJTAG is the compact version: two wires instead of four."],
          ["There is no difference", false, "Wire count and topology both differ."],
        ],
      },
    ],

    debugging: [
      {
        q: "Why are debugger breakpoints a poor fit for distributed (networked) embedded software?",
        options: [
          ["Breakpoints only work on desktop CPUs", false, "MCUs support breakpoints through JTAG/SWD."],
          ["Halting one node does not halt the others: they keep running, time out and change state, so the behaviour you wanted to observe is gone", true, "In a network protocol, timing between devices is part of the behaviour. Freezing one participant changes the experiment."],
          ["Breakpoints erase the flash memory", false, "They do not touch the stored program."],
          ["Debuggers cannot read the memory of an embedded system", false, "Reading memory is one of the things the slide lists as a debugger strength."],
        ],
      },
      {
        q: "A deployed device in the field has no debugger and no serial cable attached. Which technique from the lecture still works?",
        options: [
          ["Setting breakpoints", false, "That needs a debugger connected to the device."],
          ["Printing to a serial terminal", false, "That needs the UART wired to a terminal."],
          ["Blinking LEDs, writing logs to a file in flash, or sending log messages over wireless", true, "These need no attached equipment: an LED for a quick visual sign, flash logs to read out later, wireless logs to watch remotely."],
          ["Reading the compiler output", false, "The compiler runs on your computer and knows nothing about what the device does later."],
        ],
      },
    ],
  };

  /* =====================================================================
     Small helpers
     ===================================================================== */
  function bitCells(value, cls) {
    let s = "";
    for (let b = 7; b >= 0; b--) {
      const v = (value >> b) & 1;
      s += `<span class="${(cls && cls(b, v)) || (v ? "on" : "")}">${v}</span>`;
    }
    return s;
  }
  const idxCells = () => [7, 6, 5, 4, 3, 2, 1, 0].map((b) => `<span class="idx">${b}</span>`).join("");
  function regRow(label, value, cls, hex) {
    return `<div class="reg-row"><span class="reg-label">${label}</span><div class="bits">${bitCells(value, cls)}</div><span class="reg-hex">${hex == null ? hex8(value) : hex}</span></div>`;
  }
  const idxRow = () => `<div class="reg-row"><span class="reg-label">bit</span><div class="bits">${idxCells()}</div><span></span></div>`;
  const fmtInt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  /* =====================================================================
     LAB: choose OS modules, watch the binary size
     ===================================================================== */
  function labModules(el) {
    const { controls, view } = NES.lab(el, {
      title: "Build your own firmware image",
      hint: "Tick only the modules your application needs and see whether the image fits in flash. The sizes are illustrative round numbers, not measurements of a real OS.",
    });
    const flash = NES.seg(controls, { label: "Flash on the MCU", options: [[32, "32 kB"], [128, "128 kB"], [512, "512 kB"]], value: 128 });
    const MODS = [
      ["Kernel + scheduler", 6, true, true], ["Application", 8, true, true],
      ["UART driver", 2, true], ["SPI driver", 2, false], ["I2C driver", 2, true],
      ["IPv6 stack", 30, false], ["BLE stack", 60, false], ["CoAP", 8, false],
      ["File system", 14, false], ["Crypto library", 12, false], ["Shell", 10, false],
    ];
    const state = MODS.map((m) => m[2]);
    const grid = h("div", { class: "toggle-grid" });
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Modules compiled in</span>" }), grid]));
    const buttons = MODS.map((m, i) => {
      const b = h("button", { type: "button", class: "btn", html: m[0] + " <span>" + m[1] + " kB</span>" });
      if (m[3]) b.disabled = true;
      b.addEventListener("click", () => { state[i] = !state[i]; update(); });
      grid.append(b);
      return b;
    });
    const meter = h("div", { class: "meter" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), verdict);
    const stats = NES.stats(view, [{ key: "size", label: "Binary size" }, { key: "free", label: "Flash left" }, { key: "all", label: "If everything were included" }]);
    const ALL = MODS.reduce((s, m) => s + m[1], 0);

    function update() {
      buttons.forEach((b, i) => b.setAttribute("aria-pressed", String(state[i])));
      const size = MODS.reduce((s, m, i) => s + (state[i] ? m[1] : 0), 0);
      const cap = flash.value, fits = size <= cap;
      const pct = Math.min(100, (size / cap) * 100);
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Flash used</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:var(--${fits ? (pct > 85 ? "warn" : "ok") : "bad"})"></div></div><span class="m-val">${size} / ${cap} kB</span></div>`;
      stats.set("size", size + " kB", fits ? "" : "bad");
      stats.set("free", fits ? cap - size + " kB" : "does not fit", fits ? "good" : "bad");
      stats.set("all", ALL + " kB", ALL > cap ? "warn" : "");
      if (!fits) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Too big.</b> The linker would fail: the image is " + (size - cap) + " kB larger than the flash. Remove modules you do not need."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Fits.</b> Only the selected modules are compiled and linked. Everything else in the OS source tree simply is not in the binary."; }
    }
    flash.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: scheduler visualiser
     ===================================================================== */
  function labSched(el) {
    const { controls, view } = NES.lab(el, {
      title: "One CPU, three tasks, three schedulers",
      hint: "Task A is short and urgent (high priority) and is needed twice, at t = 0 and t = 8. B (medium) and C (low) are long background jobs. Compare how long A has to wait under each policy.",
    });
    const mode = NES.seg(controls, { label: "Scheduler", options: [["coop", "Cooperative"], ["rr", "Time-sliced"], ["prio", "Priority"]], value: "coop" });
    controls.append(h("p", { class: "lab-hint", html: "Cooperative: a task runs until it yields (here: until it is done).<br>Time-sliced: preemptive round robin, 2 ticks per turn.<br>Priority: tickless preemptive, highest priority ready task runs." }));
    const cv = h("canvas", { style: "height:200px", "aria-label": "Scheduler timeline" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi);height:8px"></i>A (high)</span><span><i style="background:var(--tech);height:8px"></i>B (medium)</span><span><i style="background:var(--ok);height:8px"></i>C (low)</span><span>▼ task becomes ready</span>` }));
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const stats = NES.stats(view, [{ key: "resp", label: "Worst response time of A" }, { key: "pre", label: "Preemptions" }, { key: "tick", label: "Periodic timer tick" }]);

    const JOBS = [
      { task: "A", arr: 0, len: 2, prio: 3 }, { task: "C", arr: 0, len: 8, prio: 1 },
      { task: "B", arr: 1, len: 7, prio: 2 }, { task: "A", arr: 8, len: 2, prio: 3 },
    ];
    const T = 20, Q = 2;
    function simulate(m) {
      const jobs = JOBS.map((j, i) => Object.assign({ id: i, rem: j.len, fin: null }, j));
      const line = []; const ready = []; let cur = null, slice = 0, pre = 0;
      for (let t = 0; t < T; t++) {
        jobs.filter((j) => j.arr === t).forEach((j) => ready.push(j));
        if (cur && cur.rem === 0) cur = null;
        if (m === "coop") { if (!cur) cur = ready.shift() || null; }
        else if (m === "rr") {
          if (cur && slice >= Q && ready.length) { ready.push(cur); pre++; cur = null; }
          if (!cur) { cur = ready.shift() || null; slice = 0; }
        } else {
          if (cur) { ready.push(cur); }
          ready.sort((a, b) => b.prio - a.prio || a.arr - b.arr || a.id - b.id);
          const next = ready.shift() || null;
          if (cur && next !== cur) pre++;
          cur = next;
        }
        line.push(cur ? cur.id : null);
        if (cur) { cur.rem--; slice++; if (cur.rem === 0) cur.fin = t + 1; }
      }
      const resp = Math.max.apply(null, jobs.filter((j) => j.task === "A").map((j) => (j.fin == null ? T : j.fin) - j.arr));
      return { line, pre, resp };
    }
    let res = simulate("coop");
    const COL = { A: "--hi", B: "--tech", C: "--ok" };
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const padL = 28, padR = 8, padT = 22, padB = 22, rows = ["A", "B", "C"];
      const rowH = (hh - padT - padB) / 3, cw = (w - padL - padR) / T;
      ctx.font = "11px " + NES.css("--font");
      rows.forEach((r, i) => {
        const y = padT + i * rowH;
        ctx.fillStyle = NES.css("--lab-bg"); ctx.fillRect(padL, y + 4, w - padL - padR, rowH - 8);
        ctx.fillStyle = NES.css(COL[r]); ctx.font = "bold 13px " + NES.css("--font"); ctx.fillText(r, 8, y + rowH / 2 + 5); ctx.font = "11px " + NES.css("--font");
      });
      res.line.forEach((id, t) => {
        if (id == null) return;
        const r = rows.indexOf(JOBS[id].task);
        ctx.fillStyle = NES.css(COL[JOBS[id].task]);
        ctx.fillRect(padL + t * cw + 1, padT + r * rowH + 4, cw - 2, rowH - 8);
      });
      JOBS.forEach((j) => {
        const x = padL + j.arr * cw + (j.task === "C" ? 3 : 0), y = padT + rows.indexOf(j.task) * rowH + 2;
        ctx.fillStyle = NES.css("--ink"); ctx.beginPath(); ctx.moveTo(x - 4, y - 7); ctx.lineTo(x + 4, y - 7); ctx.lineTo(x, y + 1); ctx.closePath(); ctx.fill();
      });
      ctx.fillStyle = NES.css("--muted");
      for (let t = 0; t <= T; t += 2) ctx.fillText(String(t), padL + t * cw - 3, hh - 6);
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      for (let t = 0; t <= T; t++) { ctx.beginPath(); ctx.moveTo(padL + t * cw, padT); ctx.lineTo(padL + t * cw, hh - padB); ctx.stroke(); }
    });
    function update() {
      res = simulate(mode.value);
      stats.set("resp", res.resp + " ticks", res.resp <= 2 ? "good" : res.resp <= 5 ? "warn" : "bad");
      stats.set("pre", String(res.pre));
      stats.set("tick", mode.value === "rr" ? "needed" : "not needed", mode.value === "rr" ? "warn" : "good");
      if (mode.value === "coop") { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Cooperative.</b> No preemptions and no timer tick, so it is cheap. But when A becomes ready at t = 8 it must wait for the long jobs that got the CPU first."; }
      else if (mode.value === "rr") { verdict.className = "verdict warn"; verdict.innerHTML = "<b>Time-sliced.</b> Everyone makes progress (fair), but there are many context switches and a timer interrupt every slice keeps the system from sleeping."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Priority, tickless.</b> A runs the moment it is ready. Switches happen only when a task arrives or finishes. The cost: low priority C waits until everyone else is done."; }
      draw();
    }
    mode.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: race condition and mutex
     ===================================================================== */
  function labRace(el) {
    const { controls, view } = NES.lab(el, {
      title: "Two threads, one counter",
      hint: "Each thread wants to do counter = counter + 1, which is really three steps: read, increase, write back. Choose how the scheduler interleaves them.",
    });
    const order = NES.seg(controls, { label: "Interleaving", options: [["seq", "One after the other"], ["mix", "Interleaved"]], value: "mix" });
    const mutex = NES.seg(controls, { label: "Mutex around the 3 steps", options: [[0, "Off"], [1, "On"]], value: 0 });
    const table = h("div", { class: "table-wrap" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [table]), verdict);
    const stats = NES.stats(view, [{ key: "fin", label: "Final counter value" }, { key: "exp", label: "Expected" }]);

    function steps() {
      if (order.value === "seq") return [[1, "read value", 0], [1, "increase value", 0], [1, "write back", 1], [2, "read value", 1], [2, "increase value", 1], [2, "write back", 2]];
      if (!mutex.value) return [[1, "read value", 0], [2, "read value", 0], [1, "increase value", 0], [2, "increase value", 0], [1, "write back", 1], [2, "write back", 1]];
      return [[1, "lock mutex", 0], [1, "read value", 0], [2, "lock mutex: blocked, waits", 0], [1, "increase value", 0], [1, "write back", 1], [1, "unlock mutex", 1], [2, "gets the mutex", 1], [2, "read value", 1], [2, "increase value", 1], [2, "write back", 2], [2, "unlock mutex", 2]];
    }
    function update() {
      const st = steps();
      table.innerHTML = `<table class="tt" style="width:100%"><thead><tr><th>Thread 1</th><th>Thread 2</th><th class="out">counter</th></tr></thead><tbody>` +
        st.map(([t, op, v]) => `<tr><td style="text-align:left">${t === 1 ? op : ""}</td><td style="text-align:left">${t === 2 ? op : ""}</td><td class="out">${v}</td></tr>`).join("") + "</tbody></table>";
      const fin = st[st.length - 1][2];
      stats.set("fin", String(fin), fin === 2 ? "good" : "bad");
      stats.set("exp", "2");
      if (fin === 2) { verdict.className = "verdict good"; verdict.innerHTML = order.value === "seq" ? "<b>Correct, by luck.</b> The threads happened not to overlap. Nothing forces the scheduler to be this kind." : "<b>Correct, guaranteed.</b> The mutex makes Thread 2 wait until Thread 1 has written back, whatever the scheduler does."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Lost update.</b> Both threads read 0, both compute 1, both write 1. One increment vanished: a race condition."; }
    }
    order.onchange = mutex.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: busy waiting vs interrupt-driven I/O
     ===================================================================== */
  function labIO(el) {
    const { controls, view } = NES.lab(el, {
      title: "Busy waiting vs interrupt-driven I/O",
      hint: "Send a string to a slow peripheral. The timeline shows what the CPU is doing. Currents are CC2650 figures from the consumption slide: about 2.9 mA active (48 MHz), 0.55 mA idle.",
    });
    const n = NES.slider(controls, { label: "Characters to send", min: 1, max: 12, step: 1, value: 8, fmt: (v) => String(v) });
    const tp = NES.slider(controls, { label: "Peripheral time per character", min: 1, max: 20, step: 1, value: 10, fmt: (v) => v + " ms" });
    const cv = h("canvas", { style: "height:170px", "aria-label": "CPU activity timeline" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi);height:8px"></i>CPU active</span><span><i style="background:var(--lo);height:8px;opacity:.35"></i>CPU asleep (idle mode)</span><span><i style="background:var(--ink-2);height:8px;width:3px"></i>interrupt</span>` }));
    const stats = NES.stats(view, [{ key: "busy", label: "Busy waiting: CPU active" }, { key: "irq", label: "Interrupts: CPU active" }, { key: "qb", label: "Charge, busy waiting" }, { key: "qi", label: "Charge, interrupts" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);
    const IA = 2.94, II = 0.55, TH = 0.2; // mA, mA, ms of CPU work per character

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const N = n.value, t = tp.value, total = N * t;
      const padL = 96, padR = 10, rowH = 40, y1 = 22, y2 = 92;
      const X = (ms) => padL + (ms / total) * (w - padL - padR);
      ctx.font = "12px " + NES.css("--font"); ctx.fillStyle = NES.css("--ink-2");
      ctx.fillText("Busy waiting", 6, y1 + rowH / 2 + 4); ctx.fillText("Interrupt-driven", 6, y2 + rowH / 2 + 4);
      ctx.fillStyle = NES.css("--hi"); ctx.fillRect(X(0), y1, X(total) - X(0), rowH);
      ctx.globalAlpha = 0.3; ctx.fillStyle = NES.css("--lo"); ctx.fillRect(X(0), y2, X(total) - X(0), rowH); ctx.globalAlpha = 1;
      for (let k = 0; k < N; k++) {
        const x = X(k * t);
        ctx.fillStyle = NES.css("--hi"); ctx.fillRect(x, y2, Math.max(2.5, X(TH) - X(0)), rowH);
        if (k) { ctx.fillStyle = NES.css("--ink-2"); ctx.fillRect(x - 1, y2 - 6, 2, 6); }
        ctx.strokeStyle = NES.css("--card"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y1 + rowH); ctx.stroke();
      }
      ctx.fillStyle = NES.css("--muted"); ctx.font = "11px " + NES.css("--font");
      ctx.fillText("0", padL, hh - 8); const lab = total + " ms"; ctx.fillText(lab, w - padR - ctx.measureText(lab).width, hh - 8);
      ctx.fillText("one segment per character", padL + 24, hh - 8);
    });
    function update() {
      const N = n.value, t = tp.value, total = N * t;
      const actI = N * TH;
      const qb = IA * total, qi = IA * actI + II * (total - actI); // in uC (mA * ms)
      stats.set("busy", total + " ms (100%)", "bad");
      stats.set("irq", actI.toFixed(1) + " ms (" + ((actI / total) * 100).toFixed(0) + "%)", "good");
      stats.set("qb", qb.toFixed(0) + " µC");
      stats.set("qi", qi.toFixed(0) + " µC", "good");
      verdict.className = "verdict";
      verdict.innerHTML = "<b>" + ((1 - qi / qb) * 100).toFixed(0) + "% less charge</b> with interrupts, and the CPU is free for other tasks " + ((1 - actI / total) * 100).toFixed(0) + "% of the time. The slower the peripheral, the bigger the gain.";
      draw();
    }
    n.onchange = tp.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: timer calculator
     ===================================================================== */
  function labTimer(el) {
    const { controls, view } = NES.lab(el, {
      title: "Timer calculator: resolution, overflow and COMPARE",
      hint: "Reproduce the timer challenge: with the 32.768 kHz clock and 24 bits, 300 s fits but 600 s does not. Then set PRESCALER = 1. The tick frequency is f / (PRESCALER + 1), and COUNTER is assumed to read 12 000 000 right now.",
    });
    const clk = NES.seg(controls, { label: "Oscillator", options: [[32768, "32.768 kHz (LF)"], [24e6, "24 MHz (HF)"]], value: 32768 });
    const bits = NES.slider(controls, { label: "Timer width", min: 8, max: 32, step: 1, value: 24, fmt: (v) => v + " bit" });
    const PS = [0, 1, 3, 7, 15, 255, 4095];
    const pre = NES.slider(controls, { label: "PRESCALER", min: 0, max: PS.length - 1, step: 1, value: 0, map: (i) => PS[i], unmap: (v) => PS.indexOf(v), fmt: (v) => String(v) });
    const iv = NES.slider(controls, { label: "Event in", min: 10, max: 1200, step: 10, value: 300, fmt: (v) => v + " s" });
    const meter = h("div", { class: "meter" });
    const expr = h("div", { class: "expr" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), expr, verdict);
    const stats = NES.stats(view, [{ key: "f", label: "Tick frequency" }, { key: "res", label: "Resolution (1/f)" }, { key: "ovf", label: "Overflow period" }]);
    const COUNTER = 12000000;
    const fmtT = (s) => (s >= 3600 ? (s / 3600).toFixed(1) + " h" : s >= 1 ? (s >= 100 ? s.toFixed(0) : s.toFixed(2)) + " s" : s >= 1e-3 ? (s * 1e3).toFixed(2) + " ms" : s >= 1e-6 ? (s * 1e6).toFixed(1) + " µs" : (s * 1e9).toFixed(1) + " ns");

    function update() {
      const f = clk.value / (pre.value + 1), max = Math.pow(2, bits.value), ovf = max / f;
      const interval = iv.value * f, fits = interval < max;
      const counter = COUNTER % max;
      stats.set("f", f >= 1e6 ? (f / 1e6).toFixed(2) + " MHz" : f >= 1000 ? (f / 1000).toFixed(3) + " kHz" : f.toFixed(1) + " Hz");
      stats.set("res", fmtT(1 / f));
      stats.set("ovf", fmtT(ovf), fits ? "good" : "bad");
      const pct = Math.min(100, (iv.value / ovf) * 100);
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Interval</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:var(--${fits ? "ok" : "bad"})"></div></div><span class="m-val">${iv.value} s</span></div><div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">full bar = one overflow period (${fmtT(ovf)})</span><span></span></div>`;
      expr.innerHTML =
        `INTERVAL = ${iv.value} s x ${fmtInt(f)} Hz = ${fmtInt(interval)} ticks\n` +
        `MAX      = 2^${bits.value} = ${fmtInt(max)}\n` +
        (fits ? `COMPARE  = (${fmtInt(counter)} + ${fmtInt(interval)}) mod 2^${bits.value} = ${fmtInt((counter + interval) % max)}` : `<span class="c">INTERVAL does not fit in ${bits.value} bits</span>`);
      if (fits) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Fits.</b> The compare interrupt fires exactly once, " + iv.value + " s from now" + (counter + interval >= max ? ", after the counter has wrapped around its maximum." : "."); }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Too long.</b> The timer wraps every " + fmtT(ovf) + ", so it would fire after " + fmtT((interval % max) / f) + " instead. Raise the PRESCALER (coarser ticks, longer period) or schedule shorter events and count them."; }
    }
    [clk, bits, pre, iv].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: watchdog
     ===================================================================== */
  function labWdt(el) {
    const { controls, view } = NES.lab(el, {
      title: "Keep the watchdog happy",
      hint: "The watchdog counts down from 3 s. Healthy firmware kicks it every second. Make the firmware hang and watch what happens.",
    });
    const fw = NES.seg(controls, { label: "Firmware", options: [["ok", "Running"], ["hang", "Hung (infinite loop)"]], value: "ok" });
    const meter = h("div", { class: "meter" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), verdict);
    const stats = NES.stats(view, [{ key: "st", label: "System state" }, { key: "kicks", label: "Watchdog kicks" }, { key: "resets", label: "Watchdog resets" }]);
    const TIMEOUT = 3, KICK = 1;
    let left = TIMEOUT, sinceKick = 0, kicks = 0, resets = 0, boot = 0, last = null, raf = null;

    function render() {
      const pct = (left / TIMEOUT) * 100;
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Time to reset</span><div class="meter-track"><div class="meter-fill" style="transition:none;width:${pct}%;background:var(--${left > 1.5 ? "ok" : left > 0.7 ? "warn" : "bad"})"></div></div><span class="m-val">${left.toFixed(1)} s</span></div>`;
      const hung = fw.value === "hang";
      stats.set("st", boot > 0 ? "RESET, rebooting" : hung ? "hung" : "running", boot > 0 ? "bad" : hung ? "warn" : "good");
      stats.set("kicks", String(kicks));
      stats.set("resets", String(resets), resets ? "warn" : "");
      if (boot > 0) { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Watchdog expired.</b> It reset the system. The firmware starts again from the beginning, in a known good state."; }
      else if (hung) { verdict.className = "verdict warn"; verdict.innerHTML = "<b>No more kicks.</b> The code is stuck, so nobody resets the watchdog. It keeps counting down."; }
      else { verdict.className = "verdict good"; verdict.innerHTML = "<b>Normal operation.</b> The main loop kicks the watchdog every second, so the countdown never reaches zero."; }
    }
    function frame(ts) {
      const t = ts / 1000, dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      if (boot > 0) { boot -= dt; if (boot <= 0) { left = TIMEOUT; sinceKick = 0; fw.set("ok", true); } }
      else {
        left -= dt;
        if (fw.value === "ok") { sinceKick += dt; if (sinceKick >= KICK) { sinceKick = 0; left = TIMEOUT; kicks++; } }
        if (left <= 0) { left = 0; resets++; boot = 1.5; }
      }
      render();
      raf = requestAnimationFrame(frame);
    }
    fw.onchange = render;
    render();
    NES.whenVisible(el, () => { if (!raf) { last = null; raf = requestAnimationFrame(frame); } }, () => { cancelAnimationFrame(raf); raf = null; });
  }

  /* =====================================================================
     LAB: duty cycling and battery life
     ===================================================================== */
  function labPower(el) {
    const { controls, view } = NES.lab(el, {
      title: "Duty cycling: how long does the battery last?",
      hint: "The device wakes up periodically, works, optionally transmits, and goes back to a low-power mode. Currents are from the CC2650 consumption slide (active at 48 MHz ≈ 2.9 mA, radio TX at 0 dBm 6.1 mA). Battery: a 220 mAh coin cell, ideal (no self-discharge).",
    });
    const period = NES.slider(controls, { label: "Wake up every", min: 0, max: 3, step: 0.01, value: Math.log10(60), map: (e) => { const v = Math.pow(10, e); return v < 10 ? Math.round(v) : Math.round(v / 5) * 5; }, unmap: (v) => Math.log10(v), fmt: (v) => v + " s" });
    const act = NES.slider(controls, { label: "CPU active per wake-up", min: 1, max: 500, step: 1, value: 50, fmt: (v) => v + " ms" });
    const tx = NES.slider(controls, { label: "Radio TX per wake-up", min: 0, max: 50, step: 1, value: 5, fmt: (v) => v + " ms" });
    const MODES = { active: ["Stay active", 2.94], idle: ["Idle", 0.55], standby: ["Standby", 0.001], shutdown: ["Shutdown", 0.00015] };
    const mode = NES.seg(controls, { label: "Between wake-ups", options: [["active", "Active"], ["idle", "Idle"], ["standby", "Standby"], ["shutdown", "Shutdown"]], value: "standby" });
    const meter = h("div", { class: "meter" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [meter]), verdict);
    const stats = NES.stats(view, [{ key: "avg", label: "Average current" }, { key: "life", label: "Battery life" }, { key: "duty", label: "Duty cycle" }]);
    const IA = 2.94, ITX = 6.1, CAP = 220;

    function update() {
      const T = period.value * 1000, ta = Math.min(act.value, T), tt = Math.min(tx.value, ta);
      const isl = MODES[mode.value][1];
      const qa = IA * ta + ITX * tt, qs = isl * (T - ta);
      const avg = (qa + qs) / T; // mA
      const hours = CAP / avg;
      const fmtI = (mA) => (mA >= 1 ? mA.toFixed(2) + " mA" : mA >= 0.001 ? (mA * 1000).toFixed(1) + " µA" : (mA * 1e6).toFixed(0) + " nA");
      const life = hours < 48 ? hours.toFixed(1) + " hours" : hours < 24 * 365 ? (hours / 24).toFixed(0) + " days" : (hours / 24 / 365).toFixed(1) + " years";
      stats.set("avg", fmtI(avg));
      stats.set("life", life, hours > 24 * 365 ? "good" : hours > 24 * 30 ? "warn" : "bad");
      stats.set("duty", ((ta / T) * 100).toFixed(ta / T < 0.01 ? 3 : 2) + "%");
      const row = (label, val, color) => `<div class="meter-row"><span class="m-label">${label}</span><div class="meter-track"><div class="meter-fill" style="width:${(val / (qa + qs)) * 100}%;background:var(--${color})"></div></div><span class="m-val">${((val / (qa + qs)) * 100).toFixed(0)}%</span></div>`;
      meter.innerHTML = row("Awake", qa, "hi") + row("Asleep", qs, "lo") + `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">share of the charge used per period</span><span></span></div>`;
      verdict.className = "verdict";
      if (mode.value === "shutdown") verdict.innerHTML = "<b>Shutdown</b> draws the least, but there is no LF clock: the device cannot wake itself on a schedule, only on a pin edge, and RAM is lost. The number is what you would get with an external wake-up signal.";
      else if (mode.value === "standby") verdict.innerHTML = "<b>Standby</b> keeps RAM and the RTC at about 1 µA. This is the mode that makes multi-year battery life possible.";
      else if (mode.value === "idle") verdict.innerHTML = "<b>Idle</b> only stops the CPU. The HF clock and supply systems stay on at 550 µA, which now dominates the budget.";
      else verdict.innerHTML = "<b>Never sleeping</b> drains the coin cell in about three days, regardless of how little work is done.";
    }
    [period, act, tx, mode].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: two's complement
     ===================================================================== */
  function labTwos(el) {
    const { controls, view } = NES.lab(el, {
      title: "Two's complement in 8 bits",
      hint: "The same 8 bits can be read as an unsigned number (0 to 255) or a signed one (-128 to 127). Slide to -100 to check the slide example.",
    });
    const val = NES.slider(controls, { label: "Signed value (int8_t)", min: -128, max: 127, step: 1, value: -100, fmt: (v) => String(v) });
    const reg = h("div", { class: "reg" });
    const expr = h("div", { class: "expr" });
    view.append(h("div", { class: "stage" }, [reg]), expr);
    const stats = NES.stats(view, [{ key: "s", label: "As int8_t" }, { key: "u", label: "As uint8_t" }, { key: "hex", label: "Hex" }]);
    function update() {
      const v = val.value, u = v & 0xff;
      reg.innerHTML = idxRow() + regRow("bits", u, (b, x) => (b === 7 ? (x ? "on mask" : "mask") : x ? "on" : ""));
      stats.set("s", String(v)); stats.set("u", String(u)); stats.set("hex", hex8(u));
      expr.innerHTML = v < 0
        ? `negative: 2^8 - ${-v} = 256 - ${-v} = ${u} = ${hex8(u)}\n<span class="c">bit 7 (outlined) is 1: the value is negative</span>`
        : `non-negative: stored as is, ${v} = ${hex8(u)}\n<span class="c">bit 7 (outlined) is 0: the value is zero or positive</span>`;
    }
    val.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: macro expansion
     ===================================================================== */
  function labMacro(el) {
    const { controls, view } = NES.lab(el, {
      title: "Be the preprocessor",
      hint: "A macro is blind text replacement that happens before compilation. Pick a definition and see what the compiler actually receives.",
    });
    const CASES = {
      a: ["#define ONE_PLUS_ONE 1+1", "A = ONE_PLUS_ONE * 10;", "A = 1+1 * 10;", 11, 20],
      b: ["#define ONE_PLUS_ONE (1+1)", "A = ONE_PLUS_ONE * 10;", "A = (1+1) * 10;", 20, 20],
      c: ["#define TIMES_TWO(x) x*2", "A = TIMES_TWO(1+1);", "A = 1+1*2;", 3, 4],
      d: ["#define TIMES_TWO(x) (x)*2", "A = TIMES_TWO(1+1);", "A = (1+1)*2;", 4, 4],
    };
    const pick = NES.seg(controls, { label: "Constant macro", options: [["a", "1+1"], ["b", "(1+1)"]], value: "a" });
    const pick2 = NES.seg(controls, { label: "Function-like macro", options: [["c", "x*2"], ["d", "(x)*2"]], value: "c" });
    let cur = "a";
    const expr = h("div", { class: "expr" });
    const verdict = h("div", { class: "verdict" });
    view.append(expr, verdict);
    const stats = NES.stats(view, [{ key: "got", label: "A is" }, { key: "want", label: "You meant" }]);
    function update() {
      const [def, use, exp, got, want] = CASES[cur];
      expr.innerHTML = `${def}\n${use}\n\n<span class="c">/* after the preprocessor: */</span>\n${exp}`;
      stats.set("got", String(got), got === want ? "good" : "bad"); stats.set("want", String(want));
      if (got === want) { verdict.className = "verdict good"; verdict.innerHTML = "<b>Correct.</b> The parentheses travel with the replaced text, so operator precedence cannot break the expression."; }
      else { verdict.className = "verdict bad"; verdict.innerHTML = "<b>Bug.</b> Multiplication binds tighter than addition, and the replacement text has no parentheses to protect it. The code compiles without any warning."; }
    }
    pick.onchange = () => { cur = pick.value; update(); };
    pick2.onchange = () => { cur = pick2.value; update(); };
    update();
  }

  /* =====================================================================
     LAB: shifts and fixed point
     ===================================================================== */
  function labShift(el) {
    const { controls, view } = NES.lab(el, {
      title: "Shifts and fixed-point temperature",
      hint: "T is an int16_t holding the temperature in hundredths of a degree. Shift it left or right and see the value it now represents. No floating point is used anywhere.",
    });
    const temp = NES.slider(controls, { label: "T (hundredths of °C)", min: 0, max: 5000, step: 1, value: 2535, fmt: (v) => String(v) });
    const dir = NES.seg(controls, { label: "Operation", options: [[">>", "T &gt;&gt; N"], ["<<", "T &lt;&lt; N"]], value: ">>" });
    const n = NES.slider(controls, { label: "N", min: 0, max: 4, step: 1, value: 1, fmt: (v) => String(v) });
    const expr = h("div", { class: "expr" });
    view.append(expr);
    const stats = NES.stats(view, [{ key: "before", label: "Before" }, { key: "after", label: "After" }, { key: "lost", label: "Remainder lost" }]);
    function update() {
      const t = temp.value, k = n.value, f = Math.pow(2, k), right = dir.value === ">>";
      const r = right ? t >> k : t << k;
      const c = (x) => (x / 100).toFixed(2) + " °C";
      expr.innerHTML = `T = ${t};            <span class="c">// ${c(t)}</span>\nT = T ${dir.value} ${k};        <span class="c">// same as T ${right ? "/" : "*"} ${f}</span>\n<span class="c">// T is now ${r}, that is ${c(r)}</span>`;
      stats.set("before", c(t)); stats.set("after", c(r));
      const lost = right ? t - r * f : 0;
      stats.set("lost", right ? lost + " / " + f + " of a step" : "none", lost ? "warn" : "");
    }
    [temp, dir, n].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: single-bit operations
     ===================================================================== */
  function labBits(el) {
    const { controls, view } = NES.lab(el, {
      title: "Set, clear, toggle and test one bit",
      hint: "Choose a bit position, then apply an operation to the byte A. The outlined cell is the bit the mask selects. Watch that the other seven bits never change.",
    });
    const pos = NES.slider(controls, { label: "Bit position n", min: 0, max: 7, step: 1, value: 6, fmt: (v) => String(v) });
    const row = h("div", { class: "btn-row" });
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Operation on A</span>" }), row]));
    const reg = h("div", { class: "reg" });
    const expr = h("div", { class: "expr" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [reg]), expr, verdict);
    let A = 0b10010010, prev = A, op = null;
    const OPS = {
      set: ["Set", (a, m) => a | m, (n) => `A = A | (0x1<<${n});`, "OR with 1 sets the bit, OR with 0 keeps a bit as it is."],
      clear: ["Clear", (a, m) => a & (m ^ 0xff), (n) => `A = A & ((0x1<<${n}) ^ 0xFF);`, "The mask is inverted first. AND with 0 clears the bit, AND with 1 keeps a bit as it is."],
      toggle: ["Toggle", (a, m) => a ^ m, (n) => `A = A ^ (0x1<<${n});`, "XOR with 1 inverts the bit, XOR with 0 keeps a bit as it is."],
      test: ["Test", (a) => a, (n) => `if (A & (0x1<<${n})) { ... }`, ""],
    };
    Object.keys(OPS).forEach((k) => row.append(h("button", { type: "button", class: "btn", text: OPS[k][0], onclick: () => { prev = A; op = k; A = OPS[k][1](A, 1 << pos.value) & 0xff; update(); } })));
    function update() {
      const n = pos.value, m = 1 << n;
      const usedMask = op === "clear" ? m ^ 0xff : m;
      reg.innerHTML = idxRow() +
        regRow("A before", prev, (b, v) => (v ? "on" : "") + (b === n ? " mask" : "")) +
        regRow(op === "clear" ? "inverted mask" : "mask", usedMask, (b, v) => (v ? "on" : "") + (b === n ? " mask" : "")) +
        regRow("A after", A, (b, v) => (v ? "on" : "") + (b === n ? " mask" : "") + (((A ^ prev) >> b) & 1 ? " changed" : ""));
      expr.innerHTML = `M = (0x1<<${n});   <span class="c">// 0b${bin8(m)}</span>\n` + (op ? OPS[op][2](n) : `<span class="c">// pick an operation</span>`);
      verdict.className = "verdict";
      if (!op) verdict.innerHTML = "A starts as 0b" + bin8(A) + ". Choose an operation.";
      else if (op === "test") { const set = (A & m) !== 0; verdict.className = "verdict " + (set ? "good" : "warn"); verdict.innerHTML = "<b>A & mask = 0b" + bin8(A & m) + ".</b> That is " + (set ? "non-zero, so the branch is taken: bit " + n + " is set." : "zero, so the branch is skipped: bit " + n + " is clear.") + " A itself is not modified."; }
      else verdict.innerHTML = "<b>" + OPS[op][0] + " bit " + n + ":</b> " + OPS[op][3] + (A === prev ? " The bit already had that value, so nothing changed." : "");
    }
    pos.onchange = () => { op = null; prev = A; update(); };
    update();
  }

  /* =====================================================================
     LAB: bit fields in the ADXL362 FILTER_CTRL register
     ===================================================================== */
  function labFields(el) {
    const { controls, view } = NES.lab(el, {
      title: "Read and write fields in FILTER_CTRL",
      hint: "The ADXL362 accelerometer packs several settings into one byte: RANGE in bits 7:6, HALF_BW in bit 4, EXT_SAMPLE in bit 3 and ODR in bits 2:0. Change one field and check that the others survive.",
    });
    const odr = NES.slider(controls, { label: "new_odr (3 bits)", min: 0, max: 7, step: 1, value: 3, fmt: (v) => v + " = 0b" + v.toString(2).padStart(3, "0") });
    const range = NES.slider(controls, { label: "new_range (2 bits)", min: 0, max: 3, step: 1, value: 0, fmt: (v) => v + " = 0b" + v.toString(2).padStart(2, "0") });
    const hbw = NES.seg(controls, { label: "HALF_BW (bit 4)", options: [[0, "0"], [1, "1"]], value: 1 });
    const ext = NES.seg(controls, { label: "EXT_SAMPLE (bit 3)", options: [[0, "0"], [1, "1"]], value: 0 });
    const reg = h("div", { class: "reg" });
    const expr = h("div", { class: "expr" });
    view.append(h("div", { class: "stage" }, [reg]), expr);
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--hi);height:8px"></i>RANGE [7:6]</span><span><i style="background:var(--ok);height:8px"></i>other bits</span><span><i style="background:var(--lo);height:8px"></i>ODR [2:0]</span>` }));
    const stats = NES.stats(view, [{ key: "hex", label: "FILTER_CTRL" }, { key: "odr", label: "Output data rate" }, { key: "range", label: "Measurement range" }]);
    const ODR = ["12.5 Hz", "25 Hz", "50 Hz", "100 Hz", "200 Hz", "400 Hz", "400 Hz", "400 Hz"];
    const RANGE = ["±2 g", "±4 g", "±8 g", "±8 g"];
    const cls = (b, v) => (b >= 6 ? "f-range" : b <= 2 ? "f-odr" : "f-other");
    function update() {
      const MASK3 = 7, MASK2 = 3;
      let R = (hbw.value << 4) | (ext.value << 3);
      R = (R & (0xff ^ MASK3)) | (odr.value & MASK3);
      R = (R & (0xff ^ (MASK2 << 6))) | ((range.value & MASK2) << 6);
      reg.innerHTML = idxRow() + regRow("FILTER_CTRL", R, cls) + regRow("MASK3", MASK3, null) + regRow("MASK2&lt;&lt;6", MASK2 << 6, null);
      const rOdr = R & MASK3, rRange = (R >> 6) & MASK2;
      expr.innerHTML =
        `<span class="c">// write (clear the field, then OR in the new value)</span>\n` +
        `FILTER_CTRL = (FILTER_CTRL & (0xFF ^ MASK3)) | (new_odr & MASK3);\n` +
        `FILTER_CTRL = (FILTER_CTRL & (0xFF ^ (MASK2<<6))) | ((new_range & MASK2)<<6);\n\n` +
        `<span class="c">// read back</span>\n` +
        `ODR   = FILTER_CTRL & MASK3;          <span class="c">// 0b${rOdr.toString(2).padStart(3, "0")} = ${rOdr}</span>\n` +
        `RANGE = (FILTER_CTRL>>6) & MASK2;     <span class="c">// 0b${rRange.toString(2).padStart(2, "0")} = ${rRange}</span>`;
      stats.set("hex", hex8(R) + " = 0b" + bin8(R));
      stats.set("odr", ODR[rOdr], "lo");
      stats.set("range", RANGE[rRange], "hi");
    }
    [odr, range, hbw, ext].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    modules: labModules,
    sched: labSched,
    race: labRace,
    io: labIO,
    timer: labTimer,
    wdt: labWdt,
    power: labPower,
    twos: labTwos,
    macro: labMacro,
    shift: labShift,
    bits: labBits,
    fields: labFields,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("embedded-software", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
