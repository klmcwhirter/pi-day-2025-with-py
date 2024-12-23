# π pi-day-2025-with-py
Celebrate the work done by several people over the years, including Sinha / Saha who found another inf. series to calculate pi that converges much quicker than the Madhava series.

**[Design and tasks](./TODO.md)**

* Python use before and during build steps
* Zig for wasm
* SolidJS for ui
* 1,000,000 digits of pi
  * visualize digits using color pallete like [pi-day-2024-with-py](https://github.com/klmcwhirter/pi-day-2024-with-py) for any algorithm
  * compare accuracy between any 2 algorithms
  * show histrograms - Sinha / Saha series, Gosper's Series, Tachus Pi (F. Bellard), baseline and also (for testing) random digits and ten_digits
  * samples of algorithms are pre-generated and checked in as .zig source files.

### Snippet from Sinha / Saha paper Appendix
![Appendix snippet](./docs/snippet.svg)


### Temporary Local zig Dependency
The ziglang project is moving towards a [cap on download frequency in an effort to reduce their infrastructure costs](https://ziglang.org/news/migrate-to-self-hosting/).

In order to help with this, I have moved the Containerfile logic to use a local copy of zig-linux-x86_64-0.14.0-dev.*.tar.gz file.
_This temporary local dependency will be removed once 0.14.0 is officially released._

> See the zigbuild section of [Containerfile](./Containerfile) to determine the version expected.

To get this dependency setup, download the expected file and place it in the root of the local repo dir.

```
$ cd ~repo-root-dir~
$ wget -O zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz https://ziglang.org/builds/zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz
$ docker compose build
...
```

---
![1,000,000 digits of pi](https://github.com/klmcwhirter/stuff/blob/master/pi-day-2025-demo.gif)
---


## Run it

### Uses Docker as the only dependency ...

The build and deployment process relies on Docker and `docker compose`. But those are the only dependencies (aside from an internet connection).

Just run `docker compose up` and open [http://localhost:9000/](http://localhost:9000/) in a browser.

The build process takes a little less than 2 mins on my laptop. So be patient before clicking on the link above.

You will see output like the following when it is done building and is ready for the browser:

```
$ docker compose up
...
[+] Running 2/2
 ✔ Network pi-day-2025-with-py_default       Created                                                                                    0.2s 
 ✔ Container pi-day-2025-with-py-piday2025-1 Created                                                                                    0.0s 
Attaching to piday2025-1
piday2025-1  | 
piday2025-1  | > vite-template-solid@0.0.0 start
piday2025-1  | > vite
piday2025-1  | 
piday2025-1  | 
piday2025-1  |   VITE v5.4.2  ready in 224 ms
piday2025-1  | 
piday2025-1  |   ➜  Local:   http://localhost:9000/
piday2025-1  |   ➜  Network: http://172.18.0.2:9000/
```

Hit CTRl-C in the terminal where `docker compose up` was executed to exit.

Then run `docker compose down`.

If you have no other docker images that you want to keep then run this to finish the clean up: `docker system prune -af --volumes`.


> Note that to run tests locally python, zig, wasmtime and pnpm also need to be installed. Installation of all dependencies is automated in the Containerfile, however.

### Wasmtime Dependency for zig Tests

In order to enable running tests from x86_64.wasm.* targets, zig now utilizes the bytecodealliance's [`wasmtime`](https://github.com/bytecodealliance/wasmtime).

> Note that version v18+ of wasmtime is required to integrate with zig. And because of that a nightly 0.14 build of zig is required. All of this is automated in the `Containerfile`.

### Temporary Local zig Dependency
The ziglang project is moving towards a [cap on download frequency in an effort to reduce their infrastructure costs](https://ziglang.org/news/migrate-to-self-hosting/).

In order to help with this, I have moved the Containerfile logic to use a local copy of zig-linux-x86_64-0.14.0-dev.*.tar.gz file.
_This temporary local dependency will be removed once 0.14.0 is officially released._

> See the zigbuild section of [Containerfile](./Containerfile) to determine the version expected.

> Note that this local copy is needed in order to run `docker compose build` or `docker compose up`.

To get this dependency setup, download the expected file and place it in the root of the local repo dir.

```
$ cd ~repo-root-dir~
$ wget -O zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz https://ziglang.org/builds/zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz
$ docker compose build
...
```

## References
* [Appendix - Field Theory Expansions of String Theory Amplitudes - journals.aps.org](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137)
  * [Possible new series for π - mathoverflow.net](https://mathoverflow.net/questions/473931/possible-new-series-for-pi)
  * [The Madhava Series - scipython.com](https://scipython.com/book/chapter-2-the-core-python-language-i/questions/the-madhava-series/)
* [Scientists Just Discovered A New Formula For Pi Accidentally - MindYourDecisions](https://youtu.be/t1ZnptSEPI8) - 10 mins
* [New Recipe for Pi - Numberphile](https://youtu.be/nXexsSWrc1Q?t=605s) - shows analysis of values for &lambda; - 14 mins
* [Pi-oneers (interview with Sinha & Saha) - Numberphile](https://youtu.be/2lvTjEZ-bbw) - 25 mins
* [Digits of Pi - Up to 1 Million Digits](https://www.angio.net/pi/digits.html)
* [Bellard's record breaking algorithm from 2009 - 2700 Billion digits of pi](https://bellard.org/pi/)
  * The software he built was named tpi which is short for [Tachus Pi](https://bellard.org/pi/pi2700e9/tpi.html); where tachus is an ancient Greek word for fast.
* [Wolfram MathWorld Pi Formulas](https://mathworld.wolfram.com/PiFormulas.html) - about a hundred (I didn't count them) formulas documented

## Tech References
* [Compiling Python to Native Wasm](https://youtu.be/_Gq273qvNMg) using [wasmer.io py2wasm](https://wasmer.io/posts/py2wasm-a-python-to-wasm-compiler) - still produces large wasm files & requires Python 3.11 (not 3.12+) - **wait for 3.12 support**
* [MDN Web - Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
