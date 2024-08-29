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
  [PiAlgorithms.Saha_Sinha]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Saha_Sinha
        </span>{' '}
        <span>- Celebrate the new finding from Saha / Sinha - <a class="underline" target="_empty" href="https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.132.221601#d5e8137">series that quickly converges to &pi;</a></span>
      </p>
    </li>
  ),
  [PiAlgorithms.Tachus_Pi]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Tachus_Pi
        </span>{' '}
        <span>- 1M digits using Bellard's 2009 record breaker. See <a class="underline" target="_empty" href="https://bellard.org/pi/">Bellard's Pi</a> and <a class="underline" target="_empty" href="https://bellard.org/pi/pi2700e9/tpi.html"> software download</a> pages</span>
      </p>
    </li >
  ),
  [PiAlgorithms.Random]: (
    <li class='mt-2'>
      <p>
        <span class='text-md ml-2 bg-emerald-100 p-1 not-italic text-purple-700'>
          &pi;
        </span>
        <span class='rounded-md p-2 font-semibold'>
          Random
        </span>{' '}
        <span>- a million random digits 0 - 9.</span>
      </p>
    </li>
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
      <div class='m-2 rounded-lg bg-emerald-100 p-2 text-left text-base italic text-emerald-600 shadow-inner shadow-stone-400'>
        <ul>
          {algo_map[PiAlgorithms.Baseline]}
          {algo_map[PiAlgorithms.Gosper]}
          {algo_map[PiAlgorithms.Saha_Sinha]}
          {algo_map[PiAlgorithms.Tachus_Pi]}
        </ul>
      </div>

      <div class='m-2 rounded-lg bg-emerald-100 p-2 text-left text-base italic text-emerald-600 shadow-inner shadow-stone-400'>
        <p class='m-2 font-semibold'>For testing comparison ...</p>

        <ul>
          {algo_map[PiAlgorithms.Random]}
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
      classList={{ 'h-24': state() == AppStateEnum.DIGITS }}>
      <div class='h-24 hidden'></div>
      <ul>
        {algo_map[algo()]}
      </ul>
    </div>
  );
};
