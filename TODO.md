# pi-day-2025-with-py

## TODO
* [X] init py, ui and wasm
* [X] copy pi_digits.py
* [X] add Madhava Python impl
* [X] Dockerfile(s), associated scripts and compose.yml
* [X] create pi_digits.gosper wasm module - generalize design as much as possible
* [X] create web app for visualization
  * [X] prepare app skeleton
  * [X] Create PiCanvas component
  * [X] Integrate pi_digits.wasm
  * [X] Create PiDigits view for baseline
  * [X] Create PiDigitsDiff view to compare baseline and Gosper
* [X] Resolve zig export issue by simplifying build.zig to just wasm output - but this breaks tests ... see separate task
* [X] Move the logic in pi-canvas.tsx:setPiImageData to build up the imageData to pi_wasm
* [X] Chase down the problems with alloc / free - put the UTF-8/UTF-16 string logging example back into pi-digits.loader.js
* [ ] Add Random pi algorithm that provides 1,000,000 random digits to provide some more color for the compare screen
* [ ] Make tests work again
* [ ] add Saha / Sinha Python impl
  * [ ] generate zig source module
* [X] add pi_digits.saha_sinha wasm impl
* [ ] add SahaSinha λ = 10 to 100 to digits and diff views
* [ ] histogram ?
* [ ] finalize wasm module(s) and/or component(s) needed
* [ ] test deploy to Raspberry Pi 4b


## UI Ideas
* [ ] show digits with input to select different values for λ (lambda) parameter - paper says 10 to 100; but is that the correct range for million digits of pi?
* [DESCOPE] show histogram with 1_000_000 digits for Saha / Sinha series with different values for λ (lambda) parameter, Gosper's series and baseline
* [ ] show comparison of digit accuracy - what should be the source of truth? see pi1000000.txt as baseline


## Technology
* python 3.12 - pdm
* solidjs - vite
* wasm - zig 0.13.0
* docker compose

## High Level App Architecture (Conceptual View)
* rely on docker compose build

```
+----+
| UI | <-- solidjs
+----+
  |   \
  v    +-> Canvas to visualize digits and digit diffs - 1000 px x 1000 px square (1_000_000 pixels)
+----+
|WASM| <-- built from zig and/or python
+----+
```

* use python to generate digits of pi as static zig source module(s) - commit source modules


## Docker Build Pipelines

### python

```
    #
    # pre-generate these - gosper takes ~3 hrs to generate 1_000_000 digits!
    #
    # pdm run python -m pi_py.pi_1000000 pi_wasm/src/pi_1000000.zig
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_gosper.zig gosper
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_saha_sinha.zig saha_sinha
```

* python - generate pi_1000000.zig from pi1000000.txt (baseline) - []u8
* python - generate pi_gosper.zig - []u8
* python - generate pi_saha_sinha.zig - hash where key is a value of the λ (lambda) param

### wasm
* zig build to wasm

### ui
* vite build of solidjs
* wasm reference(s)
