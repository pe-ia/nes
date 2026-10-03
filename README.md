# NES Study

Interactive study notes for the course **02226 Networked Embedded Systems** (DTU Compute, 2026/2027).

Each lecture page explains every concept twice, first in plain words and then technically, alongside figures from the lecture slides, interactive labs and multiple-choice questions where every answer option explains why it is right or wrong.

| Week | Page | Lecture |
|------|------|---------|
| 1 | [`nes-intro.html`](site/nes-intro.html) | Introduction to Networked Embedded Systems |
| 2 | [`electronics-basics.html`](site/electronics-basics.html) | Practical Electronics for Embedded Systems |
| 3 | [`embedded-software.html`](site/embedded-software.html) | Embedded Software |
| 4 | [`mcu-io.html`](site/mcu-io.html) | MCU Input/Output |
| 5 | [`serial-communication.html`](site/serial-communication.html) | Serial Communication |

## Running it

Live site: [pe-ia.github.io/nes](https://pe-ia.github.io/nes/)

The site is plain HTML, CSS and JavaScript with no build step and no dependencies. Open `site/index.html` in a browser, or serve the `site/` folder from any static host. Quiz progress is stored in the browser's `localStorage` only.

## Layout

```
site/
  index.html                  home page with one card per lecture
  <lecture>.html              one page per lecture
  assets/css/style.css        shared styles (light and dark theme)
  assets/css/<lecture>.css    lecture-specific styles, where needed
  assets/js/core.js           shared runtime: navigation, theme, quiz engine, lab helpers
  assets/js/<lecture>.js      the lecture's question bank and interactive labs
  img/<lecture>/              figures cropped from that lecture's slides
```

## Credits

### Lecture material

All lecture content this site is based on, and every figure under `site/img/`, comes from the slides of **02226 Networked Embedded Systems** at the Technical University of Denmark (DTU), DTU Compute:

| Week | Slides | Authors |
|------|--------|---------|
| 1 | Introduction to Networked Embedded Systems | Xenofon (Fontas) Fafoutis |
| 2 | Practical Electronics for Embedded Systems | Xenofon (Fontas) Fafoutis |
| 3 | Week 3: Embedded Software | Xenofon (Fontas) Fafoutis and Massimo Pavan |
| 4 | MCU Input/Output | Xenofon (Fontas) Fafoutis |
| 5 | Week 5: Serial Communication | Xenofon (Fontas) Fafoutis and Massimo Pavan |

Xenofon (Fontas) Fafoutis is a Professor and Massimo Pavan a Postdoc at DTU Compute. The slides and their figures remain the property of their authors and of the original sources listed below. This site is an unofficial study aid; it is not affiliated with or endorsed by DTU or the lecturers.

### Third-party figures

Many slide figures are themselves taken from other sources, as credited on the slides. Each figure caption on the site repeats that credit. Collected per lecture:

**Week 1: Introduction to NES**
- Wikipedia (Wikimedia Commons)
- Texas Instruments, CC2650 datasheet
- Analog Devices, ADXL362 datasheet
- Solomon Systech, SSD1306 datasheet
- ARM, *Cortex-M for Beginners*
- University of Michigan, EECS 461 course notes on CAN (eecs.umich.edu)
- Research papers: [10.1016/j.compag.2015.08.011](https://doi.org/10.1016/j.compag.2015.08.011), [10.1016/j.future.2016.11.031](https://doi.org/10.1016/j.future.2016.11.031), [10.1109/ACCESS.2020.3009819](https://doi.org/10.1109/ACCESS.2020.3009819), [10.1109/ACCESS.2020.3032388](https://doi.org/10.1109/ACCESS.2020.3032388)

**Week 2: Practical Electronics**
- Analog Devices, ADXL362 datasheet
- Murata, NTC Thermistors datasheet

**Week 3: Embedded Software**
- Andrew S. Tanenbaum and Herbert Bos, *Modern Operating Systems*
- Wikipedia (Wikimedia Commons)
- Texas Instruments, CC2650 datasheet; *CC13xx, CC26xx SimpleLink Wireless MCU Technical Reference Manual*; LAUNCHXL-CC2650 product page (ti.com/tool/LAUNCHXL-CC2650)
- Nordic Semiconductor, nRF52832 datasheet
- Analog Devices, ADXL362 datasheet
- Ikalogic, SP209 logic analyzer product page (ikalogic.com/sp209-logic-analyzer)
- Research papers: [10.1109/JIOT.2015.2505901](https://doi.org/10.1109/JIOT.2015.2505901), [10.1109/ACCESS.2022.3153521](https://doi.org/10.1109/ACCESS.2022.3153521)

**Week 4: MCU Input/Output**
- Wikipedia (Wikimedia Commons)
- Nordic Semiconductor, nRF52832 datasheet
- Texas Instruments, DRV8835 datasheet

**Week 5: Serial Communication**
- Wikipedia (Wikimedia Commons)
- Analog Devices, ADXL362 datasheet
- Texas Instruments, TMP1075N datasheet
- Gas Sensing Solutions (GSS), CozIR datasheet

All trademarks and product names belong to their respective owners.

### Removal requests

If you are a rights holder and would like a figure or page removed, please open an issue and it will be taken down.
