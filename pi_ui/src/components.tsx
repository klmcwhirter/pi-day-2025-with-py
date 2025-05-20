import { For, Match, Resource, Show, Suspense, Switch, createResource, createSignal } from 'solid-js';
import { AlgorithmDetails, CurrAlgorithmDetails } from './algodetails';
import { AppStateEnum } from './App';
import { AppDescription, PiHaiku } from './AppDescription';
import { PiCanvas } from './pi/pi-canvas';
import { HistogramItemValues, HistogramValues } from './pi/pi-digits.model';
import { PiAlgorithms, usePiState } from './pi/pi.context';
import { pi_palette, pi_shadow_palette } from './pi/pi.palette';
import { logJS } from './pi/utils.js';


export const Bar = (props) => {
  const TOTAL_WIDTH = 30; // in rem; for zen and firefox browsers (at least)

  const item = (): HistogramItemValues => props.item;
  const values = (): Resource<HistogramValues> => props.values;

  const width = `${TOTAL_WIDTH * values()().ratio(item().value * 2)}rem`;
  const rest = `${TOTAL_WIDTH - TOTAL_WIDTH * values()().ratio(item().value * 2)}rem`;

  return (
    <div class={`mb-6 bg-stone-200 text-left rounded-lg shadow-lg ${item().shadow}`}>
      <span class='inline-block h-8 bg-stone-100 p-0.5 !pr-1 text-center text-lg font-medium'>
        {item().index}
      </span>
      <span
        class={`${item().color} inline-block h-8.5 p-0.5 text-left text-lg font-medium`}
        style={`width: ${width}; max-width: ${width}`}
      >
        <p class='inline-block'>{values()().percent(item().value)}</p>
      </span>
      <span
        class='inline-block h-8 bg-stone-200 p-0.5 text-right'
        classList={{
          'font-bold text-2xl text-green-500': item().value === values()().maxValue,
          'font-bold text-xl text-yellow-800': item().value === values()().minValue,
        }}
        style={`width: ${rest}; max-width: ${rest}`}
      >
        {item().value}
      </span>
    </div>
  );
};

export const ExpandableSection = (props) => {
  const classes = props.class;
  const expanded_default = props.default || false;
  const fallback = props.fallback;

  const [expanded, setExpanded] = createSignal(expanded_default);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <section
      class={`${classes} hover:cursor-pointer hover:font-semibold`}
      onclick={toggleExpanded}
    >
      <Show when={expanded()} fallback={fallback}>
        {props.children}
      </Show>
    </section>
  );
};

export const Footer = (props) => {
  return (
    <div class='mb-0 bg-blue-700 p-2 text-center text-xs text-green-300 hover:p-0.5 hover:text-lg hover:font-bold'>
      {props.children}
    </div>
  );
};

export const Header = () => {
  return (
    <div class='mt-0 bg-blue-700 p-1'>
      <img src='./pi.svg' class='mr-12 inline w-6' />

      <h1 class='inline fill-green-300 text-center align-middle text-xl font-semibold text-green-300'>
        Welcome to Pi Day 2025 with Python, AssemblyScript (WASM) and SolidJS !
      </h1>

      <div class='w-18 float-right m-0 mr-4 inline aspect-square h-auto align-middle'>
        <a
          href='https://github.com/klmcwhirter/pi-day-2025-with-py'
          class='hover:cursor-pointer'
          target='_blank'
        >
          <svg
            height='24'
            aria-hidden='true'
            viewBox='0 0 16 16'
            version='1.1'
            width='24'
            data-view-component='true'
            class='inline fill-green-300'
          >
            <path d='M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z'></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export const MainSwitcher = (props) => {
  const piState = usePiState();
  const [state] = props.state;

  return (
    <div class='col-span-3 col-start-2 h-[89vh] m-2 rounded-lg bg-stone-100'>
      <Show
        when={piState.stateInitialized()}
        fallback={
          <div class='m-28 rounded-lg bg-stone-300 p-28 text-blue-700 shadow-2xl shadow-blue-900'>
            <p class='text-6xl'>Loading lots of &pi; ...</p>
            <p class='mt-10 text-2xl text-green-600'>
              but the server can be shut down now
            </p>
            <p class='mt-10 text-4xl text-purple-700'>
              do examine the console.log !
            </p>
            <p class='mt-10 text-xl text-red-900'>
              and hover over the footer so it can actually be read
            </p>
          </div>
        }
      >
        <Switch>
          <Match when={state() === AppStateEnum.DIGITS}>
            <PiCanvas state={props.state} source={piState.digitsAlgo} />
          </Match>
          <Match when={state() === AppStateEnum.COMPARE}>
            <PiCanvas state={props.state} source={piState.cmpSource} />
          </Match>
          <Match when={state() === AppStateEnum.HISTOGRAM}>
            <PiDigitsHistogram />
          </Match>
        </Switch>
      </Show>
    </div>
  );
};

const CmpSelector = (props) => {
  const [signal, setSignal] = props.signal;
  const label = props.label;

  return (
    <div class="mt-4">
      <span>{label} </span>
      <select
        class='rounded-lg pl-2 pr-1 text-blue-800 ring-2 ring-stone-100 hover:font-semibold hover:ring-stone-500'
        value={signal()}
        onInput={(e) => setSignal(e.currentTarget.value)}
      >
        <For each={Object.keys(PiAlgorithms)}>
          {(n) => (
            <Show when={n == signal()}
              fallback={<option value={n}>{n}</option>}
            >
              <option value={n} selected>{n}</option>
            </Show>
          )}
        </For>
      </select>
    </div>
  );
};

export const NavView = (props) => {
  const piState = usePiState();

  const [state, setState] = props.state;
  const appStates = [AppStateEnum.DIGITS, AppStateEnum.COMPARE, AppStateEnum.HISTOGRAM];

  return (
    <nav class='m-2 h-[89vh] rounded-lg bg-stone-200 text-emerald-600'>
      <ul class='shadow-lg'>
        <For each={appStates}>
          {(s) => (
            <li class='m-1 p-2 inline-block'>
              <button
                disabled={!piState.stateInitialized}
                class='hover:disabled::cursor-auto m-1 block p-2 rounded-lg bg-emerald-50 text-lg text-blue-700
                hover:cursor-pointer hover:rounded-lg hover:bg-emerald-700 hover:font-bold
                hover:text-white disabled:rounded-lg disabled:bg-stone-300 disabled:text-stone-700'
                classList={{
                  'bg-emerald-500 font-bold text-white shadow-xl':
                    state() === s,
                }}
                onclick={() => setState(s)}
              >
                {s}
              </button>
            </li>
          )}
        </For>
      </ul>

      <p class='m-1 text-lg font-semibold'>1,000,000 digits of pi !</p>

      <AppDescription state={props.state} />

      <Switch>
        <Match when={state() === AppStateEnum.DIGITS}>
          <div class='mt-1 font-semibold'>Select algorithm for which to display digits of pi</div>

          <CmpSelector signal={piState.digitsAlgo} label="Algorithm:" />

          <CurrAlgorithmDetails algo={piState.digitsAlgo} state={props.state} />

          <div><img src="./pi.svg" class="m-0 w-24 mx-auto" /></div>

          <PiHaiku />
        </Match>

        <Match when={state() === AppStateEnum.COMPARE}>
          <div class="mt-1">
            <div class='font-semibold'>Select algorithms to compare</div>

            <CmpSelector signal={piState.cmpSource} label="Source:" />

            <CmpSelector signal={piState.cmpAgainst} label="Against:" />

            <div class='text-sm font-semibold'>Matches: {piState.cmpPctMatch[0]()} %, {piState.cmpNumMatch[0]()} digits</div>

            <AlgorithmDetails />
          </div>
        </Match>

        <Match when={state() === AppStateEnum.HISTOGRAM}>
          <div class="mt-1">
            <div class='font-semibold'>Select algorithm for which to display histogram</div>

            <CmpSelector signal={piState.histoAlgo} label="Algorithm:" />

            <CurrAlgorithmDetails algo={piState.histoAlgo} state={props.state}/>
          </div>
        </Match>
      </Switch>
    </nav>
  );
};

export const PiDigitsHistogram = (props) => {
  const piState = usePiState();

  const fetchHistogram = async (algo: string): Promise<HistogramValues> => {
    logJS(`PiDigitsHistogram.fetchHistogram: algo=${algo}`);

    const rc = new Promise<HistogramValues>((resolve) => {
      const pi_len = piState.wasm.pi_digits_len(algo);
      logJS(`pi length for ${algo} = ${pi_len}`);
      const numbers: number[] = piState.wasm.histogram(algo);
      logJS(`PiDigitsHistogram.fetchHistogram: numbers=${numbers}, sum=${numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}`);

      const items: HistogramItemValues[] = numbers.map(
        (v: number, i: number): HistogramItemValues =>
          new HistogramItemValues(i, v, pi_palette[i], pi_shadow_palette[i]),
      );
      const hv = new HistogramValues(algo, pi_len, items);
      resolve(hv);
    });

    return rc;
  }

  const [selected] = piState.histoAlgo;
  const [values] = createResource<HistogramValues, string>(
    selected,
    fetchHistogram,
  );

  return (
    <div>
      <Suspense fallback={<div class='mb-6 mt-0 rounded-lg bg-stone-200 pt-0 p-4 text-center text-blue-800 shadow-lg'>Loading...</div>}>
        <div class='mb-6 mt-0 rounded-lg bg-stone-200 pt-0 p-4 text-center text-blue-800 shadow-lg'>
          <p class='text-2xl font-semibold'>
            Number of times each digit appears in Pi
          </p>
          <p class='text-lg text-blue-500'>
            <span class='mr-2'>using the {selected()} algorithm</span>
          </p>
        </div>

        <div class='mt-2 ml-96 mr-96 p-2'>
          <For each={values()?.items}>
            {(e) => <Bar item={e} values={values} />}
          </For>
        </div>
      </Suspense>
    </div>
  );
};
