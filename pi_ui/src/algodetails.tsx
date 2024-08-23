
export const AlgorithmDetails = () => {

  return (
    <div class='mt-8 m-4 rounded-lg bg-emerald-100 p-2 text-left text-base italic text-emerald-600 shadow-inner shadow-stone-400'>
      <ul>
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
      </ul>
    </div>
  );
};
