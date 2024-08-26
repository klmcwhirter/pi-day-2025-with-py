# π pi-day-2025-with-py
Celebrate the work done by Saha / Sinha who found another infinite series to calculate pi that converges much quicker than the Madhava series.

**[Design and tasks](./TODO.md)**

* Python during build steps
* Zig for wasm
* SolidJS for ui
* 1,000,000 digits of pi
  * visualize digits using color pallete like [pi-day-2024-with-py](https://github.com/klmcwhirter/pi-day-2024-with-py)
  * UI element to modify value for λ (lambda) parameter = default is between 10 and 100 per the Appendix
  * visualize accuracy against baseline
  * show histrograms - Saha / Sinha series with several interesting values for λ, Gosper's Series, baseline

## Run it

### Uses Docker as the only dependency ...

The build and deployment process relies on Docker and docker-compose. But those are the only dependencies (aside from an internet connection).

Just run `docker-compose up` and open [http://localhost:9000/](http://localhost:9000/) in a browser.

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

Hit CTRl-C in the terminal where `docker-compose up` was executed to exit.

Then run `docker-compose down`.
If you have no other docker images that you want to keep then run this to finish the clean up: `docker system prune -af --volumes`.

> Note that to run tests locally python, zig, wasmtime and pnpm also needs to be installed. This is automated in the Containerfile, however.

### Snippet from paper Appendix
![Appendix snippet](./docs/snippet.svg)

## References
* [Appendix - Field Theory Expansions of String Theory Amplitudes - journals.aps.org](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137)
  * [Possible new series for π - mathoverflow.net](https://mathoverflow.net/questions/473931/possible-new-series-for-pi)
  * [The Madhava Series - scipython.com](https://scipython.com/book/chapter-2-the-core-python-language-i/questions/the-madhava-series/)
* [Scientists Just Discovered A New Formula For Pi Accidentally - MindYourDecisions](https://youtu.be/t1ZnptSEPI8) - 10 min
* [Pi-oneers (interview with Sinha & Saha) - Numberphile](https://youtu.be/2lvTjEZ-bbw) - 25 mins
* [Digits of Pi - Up to 1 Million Digits](https://www.angio.net/pi/digits.html)

## Tech References
* [Compiling Python to Native Wasm](https://youtu.be/_Gq273qvNMg) using [wasmer.io py2wasm](https://wasmer.io/posts/py2wasm-a-python-to-wasm-compiler) - still produces large wasm files & requires Python 3.11 (not 3.12+) - **wait for 3.12 support**
* [MDN Web - Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
