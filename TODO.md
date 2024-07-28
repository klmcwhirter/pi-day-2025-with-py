# pi-day-2025-with-py

## TODO
* [X] init py, ui and wasm
* [X] copy pi_digits.py
* [ ] add saha_sinha_series impl
* [ ] create wasm module(s) and/or component(s) needed
* [ ] create web app for visualization
* [ ] Dockerfile(s) and docker-compose.yml
* [ ] test deploy to Raspberry Pi 4b


## UI Ideas
* [ ] show digits with input to select different values for λ (lambda) parameter
* [ ] show histogram with 1_000_000 digits for Saha / Sinha series with different values for λ (lambda) parameter, Gosper's series and baseline
* [ ] show comparison of digit accuracy - what should be the source of truth?


## Technology
* python 3.12 - pdm
* solidjs - vitejs
* wasm - zig 0.13.0
* docker compose

## High Level App Architecture (Conceptual View)
* rely on docker compose build

```
+----+
| UI | <-- solidjs
+----+
  |   \
  v    +-> Canvas to visualize digits and digit diffs
+----+
|WASM| <-- built from zig and/or python
+----+
```

* during pre-build use python to generate digits of pi as static generated zig source module(s)

-or-

* use py2wasm to compile python library to wasm (later; nice to have)


## Build Pipelines

### python
* python - generate pi_1000000.zig from pi1000000.txt (baseline) - []u8
* python - generate pi_gosper.zig - []u8
* python - generate pi_saha_sinha.zig - hash where key is a value of the λ (lambda) param

### wasm
* zig build to wasm

### ui
* vitejs build of solidjs
* wasm reference(s)
