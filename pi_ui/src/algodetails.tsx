import { AppStateEnum } from "./App";
import { PiAlgorithms } from "./pi/pi.context";

const algo_map = {
  [PiAlgorithms.Baseline]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Baseline
        </span>{' '}
        <span>- The baseline is based on data from <a class="underline" target="_empty" href="https://www.angio.net/pi/digits.html">Digits of Pi - Up to 1 Million Digits</a></span>
      </p>
    </li>
  ),
  [PiAlgorithms.BBP]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          BBP
        </span>{' '}
        <span>- The BBP (named after <a class="underline" target="_empty" href="https://mathworld.wolfram.com/BBPFormula.html">Bailey-Borwein-Plouffe</a>) is a formula for calculating pi discovered by Simon Plouffe in 1995</span>
      </p>
    </li>
  ),
  [PiAlgorithms.Bellard]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Bellard
        </span>{' '}
        <span>- The <a class="underline" target="_empty" href="https://en.wikipedia.org/wiki/Bellard%27s_formula">Bellard</a> formula set several records - including the quadriollionth digit!</span>
      </p>
    </li>
  ),
  [PiAlgorithms.Gosper]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Gosper
        </span>{' '}
        <span>- What I have been using for a few years - <a class="underline" target="_empty" href="https://www.gavalas.dev/blog/spigot-algorithms-for-pi-in-python/#using-gospers-series">Spigot Algorithms for pi in Python</a></span>
      </p>
    </li>
  ),
  [PiAlgorithms.Sinha_Saha]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Sinha_Saha
        </span>{' '}
        <span>- Celebrate the new finding from Sinha / Saha - <a class="underline" target="_empty" href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137">series that quickly converges to &pi;</a></span>
      </p>
    </li>
  ),
  [PiAlgorithms.Tachus]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Tachus
        </span>{' '}
        <span>- 1M digits using Bellard's 2009 record breaker. See <a class="underline" target="_empty" href="https://bellard.org/pi/">Bellard's Pi</a> and <a class="underline" target="_empty" href="https://bellard.org/pi/pi2700e9/tpi.html"> software download</a> pages</span>
      </p>
    </li >
  ),
  [PiAlgorithms.Ten_Digits]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Ten_Digits
        </span>{' '}
        <span>- First 10 digits of pi = 3.141592653</span>
      </p>
    </li>
  ),
};

export const AlgorithmDetails = () => {

  return (
    <>
      <div class='m-2 rounded-lg bg-emerald-100 p-2 text-left text-sm italic text-emerald-600 shadow-inner shadow-stone-400'>
        <ul>
          {algo_map[PiAlgorithms.Baseline]}
          {algo_map[PiAlgorithms.BBP]}
          {algo_map[PiAlgorithms.Bellard]}
          {algo_map[PiAlgorithms.Gosper]}
          {algo_map[PiAlgorithms.Sinha_Saha]}
          {algo_map[PiAlgorithms.Tachus]}
        </ul>
        {/* <p class='m-2 font-semibold'>For testing comparison ...</p> */}
        <ul>
          {algo_map[PiAlgorithms.Ten_Digits]}
        </ul>
      </div>
    </>
  );
};

export const CurrAlgorithmDetails = (props) => {
  const [algo] = props.algo;
  const [state] = props.state;

  return (
    <div class='m-4 rounded-lg bg-emerald-100 p-2 text-left text-base italic text-emerald-600 shadow-inner shadow-stone-400'
      classList={{ 'h-24 mb-0': state() == AppStateEnum.DIGITS }}>
      <div class='h-24 mb-0 hidden'></div>
      <ul>
        {algo_map[algo()]}
      </ul>
    </div>
  );
};
