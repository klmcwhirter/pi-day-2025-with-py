# π pi-day-2025-with-py


Celebrate the work done by several people over the years, including Sinha / Saha who found another inf. series to calculate pi that converges much quicker than the Madhava series.

### Snippet from Sinha / Saha paper Appendix
![Appendix snippet](./docs/snippet.svg)

---
![1,000,000 digits of pi](https://github.com/klmcwhirter/stuff/blob/master/pi-day-2025-demo.gif)
---
They never claimed that it was an [earth shattering new way to calculate digits of pi](https://youtu.be/2lvTjEZ-bbw?t=44). And I can tell you it is not. I have struggled to get it to produce 2000 digits in a reasonable amount of time (~25 mins).

But the fact that they saw this side-effect of their research into aspects of *string theory*, in my opinion, brings credence and validation to their work because they recognized this hidden jewel in the formula that was taking shape.

> And so, this project is dedicated to Aninda Sinha and Arnab Priya Saha for their contribution to our common pursuit of adding to the ways we consume π.

Good job, men!

### Summary

This project was a crazy amount of fun. I dug deep into many things from WebAssembly, Bluefin and devcontainers, to testing wasm from zig build, to the math involved with the various algorithms to generate digits of π.

I found while profiling the Python code that it is certainly the right language to evaluate these kinds of series with simple syntax. In at least one of them (Gosper's), the individual terms were getting to ~4,000 integer digits long! Wow. I had no idea.

And while I did not get to 1,000,000 digits of π with the Saha / Sinha algorithm, I learned a lot - including pochhammer mark (rising factorial) - something to which I had not been exposed before. A very cool byproduct of physics research, but too computationally complex for me to go much further than a couple thousand digits for a hobby project.

I greatly appreciate the fact that they shared that side-effect of the research they were doing. And I sincerely hope the weird reaction from the press that they experienced will not prevent them from sharing unexpected mathematical advancements in the future. Physicists and mathematicians working together - awesome!

### [HL Design](./TODO.md)
* Developed using [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) on:

  [![project bluefin](./docs/project-bluefin.svg)](https://projectbluefin.io/)
* Python use before and during build steps
* Zig for wasm
* SolidJS for ui
* 1,000,000 digits of pi
  * visualize digits using color pallete like [pi-day-2024-with-py](https://github.com/klmcwhirter/pi-day-2024-with-py) for any algorithm
  * compare accuracy between any 2 algorithms
  * show histrograms - Sinha / Saha series, Gosper's Series, Tachus Pi (F. Bellard), BBP, baseline and also (for testing) random digits and ten_digits
  * samples of algorithms are pre-generated and checked in as .zig source files.

## Run it

### Uses Docker as the only dependency ...

The build and deployment process relies on Docker and a vscode [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers). But those are the only dependencies (aside from an internet connection).

Just **Open Folder in Container** and run `pdm ui` in a terminal. Then open [http://localhost:9000/](http://localhost:9000/) in a browser.

The build process takes a little less than 4 mins on my laptop. So be patient before clicking on the link above.

You will see output like the following when it is done building and is ready for the browser:

```
$ pdm ui
...

  VITE v5.4.11  ready in 224 ms

  ➜  Local:   http://localhost:9000/
  ➜  Network: http://172.17.0.2:9000/
  ➜  press h + enter to show help

```

Hit CTRl-C in the terminal where `pdm ui` was executed to exit.

If you have no other docker images that you want to keep then run this to finish the clean up: `docker system prune -af --volumes`.


> Note that to run tests locally python, zig, wasmtime and pnpm also need to be installed. Installation of all dependencies is automated in the devcontainer, however.

### Wasmtime Dependency for zig Tests

In order to enable running tests from x86_64.wasm.* targets, zig now utilizes the bytecodealliance's [`wasmtime`](https://github.com/bytecodealliance/wasmtime).

> Note that version v18+ of wasmtime is required to integrate with zig. And because of that a nightly 0.14 build of zig is required. All of this is automated in the `devcontainer`.

### Temporary Local zig Dependency
The ziglang project is moving towards a [cap on download frequency in an effort to reduce their infrastructure costs](https://ziglang.org/news/migrate-to-self-hosting/).

In order to help with this, I have moved the devcontainer logic to use a local copy of zig-linux-x86_64-0.14.0-dev.*.tar.gz file.
_This temporary local dependency will be removed once 0.14.0 is officially released._

> See the ZIGTAR variable declaration section near the top of [vsc-install-zig.sh](./.devcontainer/vsc-install-zig.sh) to determine the version expected.

To get this dependency setup, download the expected file and place it in the root of the local repo dir.

```
$ cd ~repo-root-dir~
$ wget -O zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz https://ziglang.org/builds/zig-linux-x86_64-0.14.0-dev.1588+2111f4c38.tar.xz
```
Then, **Rebuild Container**.

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
