# π pi-day-2025-with-py


Celebrate the work done by several people over the years, including Sinha / Saha who found another inf. series to calculate pi that converges much quicker than the Madhava series.

### Snippet from Sinha / Saha paper Appendix
![Appendix snippet](./docs/snippet.svg)

---
![1,000,000 digits of pi](https://github.com/klmcwhirter/stuff/blob/master/pi-day-2025-demo.gif)
---
They never claimed that it was an [earth shattering new way to calculate digits of pi](https://youtu.be/2lvTjEZ-bbw?t=44). And I can tell you it is not. I have struggled to get it to produce 2000 digits in a reasonable amount of time (~25 mins).

But the fact that they saw this side-effect of their research into aspects of *string theory* brings credence and validation to their work because they recognized this hidden jewel in the formula that was taking shape. In my opinion, it demonstrates the level of analysis and review was above and beyond.

> And so, this project is dedicated to Aninda Sinha and Arnab Priya Saha for their contribution to our common pursuit of adding to the ways we consume π.

Good job, men!

### Summary

This project was a crazy amount of fun. I dug deep into many things from WebAssembly, Bluefin and devcontainers, to testing wasm, to the math involved with the various algorithms to generate digits of π.

I found while profiling the Python code that it is certainly the right language to evaluate these kinds of series with simple syntax. In at least one of them (Gosper's), the individual terms were getting to ~4,000 integer digits long! Wow. I had no idea.

> I have gained new appreciation for Python's int type.

And while I did not get to 1,000,000 digits of π with the Saha / Sinha algorithm, I learned a lot - including pochhammer mark (rising factorial) - something to which I had not been exposed before. A very cool byproduct of physics research, but too computationally complex for me to go much further than a couple thousand digits for a hobby project.

I greatly appreciate the fact that they shared that side-effect of the research they were doing. And I sincerely hope the weird reaction from the press that they experienced will not prevent them from sharing unexpected mathematical advancements in the future. Physicists and mathematicians working together - awesome!

### [HL Design](./TODO.md)
* Developed using [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) on:

  [![project bluefin](./docs/project-bluefin.svg)](https://projectbluefin.io/)
* Python use before and during build steps
* AssemblyScript for wasm
* SolidJS for ui
* 1,000,000 digits of pi
  * visualize digits using color pallete like [pi-day-2024-with-py](https://github.com/klmcwhirter/pi-day-2024-with-py) for any algorithm
  * compare accuracy between any 2 algorithms
  * show histrograms - Sinha / Saha series, Gosper's Series, Tachus Pi (F. Bellard), BBP, baseline and also (for testing) random digits and ten_digits
  * samples of algorithms are pre-generated and checked in as .ts source files.

> See [with-compose](https://github.com/klmcwhirter/pi-day-2025-with-py/tree/with-compose) for the code before devcontainer was used.

## Run it

### Uses Docker as the only dependency ...

The build and deployment process relies on Docker and a vscode [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers).

Just **Open Folder in Container** and run `pdm run ui` in a terminal. Then open [http://localhost:9000/](http://localhost:9000/) in a browser.

The build process takes a little less than 4 mins on my laptop. So be patient before clicking on the link above.

You will see output like the following when it is done building and is ready for the browser:

```
$ pdm create
...
$ pdm ui
...

  VITE v5.4.11  ready in 224 ms

  ➜  Local:   http://localhost:9000/
  ➜  Network: http://172.17.0.2:9000/
  ➜  press h + enter to show help

```

Hit CTRl-C in the terminal where `pdm run ui` was executed to exit.

If you have no other docker images that you want to keep then run this to finish the clean up: `docker system prune -af --volumes`.


> Note that to run tests locally python, assemblyscript and pnpm also need to be installed. Installation of all dependencies is automated in the devcontainer, however.

## Build Local OCI Image Pre-requisite

Please see [klmcwhirter/oci-shared-images](https://github.com/klmcwhirter/oci-shared-images) for instructions on building the `fedora-python-dx:latest` image used by the [devcontainer.json](./.devcontainer/devcontainer.json).

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
* [Compiling Python to Native Wasm](https://youtu.be/_Gq273qvNMg) using [wasmer.io py2wasm](https://wasmer.io/posts/py2wasm-a-python-to-wasm-compiler) - still produces large wasm files & requires Python 3.11 (not 3.12+) - **wait for at least 3.12 support**
* [MDN Web - Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
