# pi-day-2025-with-py

## TODO
* [X] init py, ui and wasm
* [X] copy pi_digits.py
* [X] add Madhava Python impl
* [X] devcontainer.json and associated scripts
* [X] create pi_digits.gosper wasm module - generalize design as much as possible
* [X] add pi_digits.sinha_saha wasm stub
* [X] create web app for visualization
  * [X] prepare app skeleton
  * [X] Create PiCanvas component
  * [X] Integrate pi_digits.wasm
  * [X] Create PiDigits view for baseline
  * [X] Create PiDigitsDiff view to compare baseline and Gosper
* [X] Resolve zig export issue by simplifying build.zig to just wasm output - but this breaks tests ... see separate task
* [X] Move the logic in pi-canvas.tsx:setPiImageData to build up the imageData to pi_wasm
* [X] Chase down the problems with alloc / free - put the UTF-8/UTF-16 string logging example back into pi-digits.loader.js
* [X] Add Random pi algorithm that provides 1,000,000 random digits to provide some more test data for the compare screen
* [X] Make tests work again
  * [X] document wasmtime dependency and -Dwasi & -fwasmtime options to run tests
* [x] Add histogram page - select algo: baseline, gosper and sinha_saha, random, ten_digits
* [X] add Sinha / Saha Python impl
  * [X] generate zig source module
* [-] ~~add SinhaSaha λ = 10 to 100 to PiAlogorithms - the value of λ is tighly coupled to the number of terms and precision - no good way to do this easily~~
* [X] finalize wasm module(s) and/or component(s) needed
* [-] ~~test deploy to Raspberry Pi 4b - **ENABLE_TESTS=0 must be set in compose.yml - especially for zigbuild; wasmtime is only available for x86_64**~~


## UI Ideas
* [X] show digits with input from different PiAlgorithms
  * [-] ~~select different values for λ (lambda) parameter - paper says 10 to 100; but is that the correct range for million digits of pi?~~
  * ~~this [Numberphiles video](https://youtu.be/nXexsSWrc1Q?t=672) show values of λ < 10 are more likely to closely approximate pi.~~
* [X] show histogram with 1_000_000 digits for supported formulae
  * [-] ~~for Sinha / Saha series with different values for λ (lambda) parameter~~
* [X] show comparison of digit accuracy - what should be the source of truth? see pi1000000.txt as baseline
  * [X] pct match in console.log
  * [X] pct match on comparison screen


## Technology
* python 3.13 - pdm
* solidjs - vite
* wasm - zig 0.14.0
* devcontainers

## High Level App Architecture (Conceptual View)
* rely on devcontainers build

```
+----+
| UI | <-- solidjs
+----+
  |   \
  v    +-> Canvas to visualize digits and digit diffs - 1000 px x 1000 px square (1_000_000 pixels)
+----+
|WASM| <-- built from zig
+----+
```

* use python to generate digits of pi as static zig source module(s) - commit source modules


## Docker Build Pipelines

### pythonbuild

> This build step is to run tests only. The code is used to pre-generate zig source files.

```
    #
    # pre-generate these - gosper takes ~3 hrs to generate 1_000_000 digits!
    #
    # pdm run python -m pi_py.pi_1000000 pi_wasm/src/pi_1000000.zig
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_digits/pi_bbp.zig bbp 1_000_000
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_digits/pi_bellard.zig bellard 1_000_000 350_000
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_gosper.zig gosper
    # pdm run python -m pi_py.pi_digits pi_wasm/src/pi_digits/pi_sinha_saha.zig sinha_saha 711 5_000
```

* python - generate pi_1000000.zig from pi1000000.txt (baseline) - []u8
* python - generate pi_bbp.zig - []u8
* python - generate pi_bellard.zig - []u8
* python - generate pi_gosper.zig - []u8
* python - generate pi_sinha_saha.zig - []u8

### zigbuild
* zig build to wasm

### build
* vite build of solidjs
* pythonbuild and zigbuild logs
* wasm reference(s)
