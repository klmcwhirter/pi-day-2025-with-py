import { For, Match, Show, Switch, createSignal } from 'solid-js';
import { AppStateEnum } from './App';
import { PiAlgorithms, usePiState } from './pi/pi.context';
import { AppDescription } from './AppDescription';
import { PiCanvas } from './pi/pi-canvas';

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
        Welcome to Pi Day 2025 with Python (and WASM) !
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

export const NavSwitcher = (props) => {
  const piState = usePiState();
  const [state] = props.state;

  return (
    <div class='col-span-3 col-start-2 h-[89vh] m-4 rounded-lg bg-stone-100'>
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
            <PiCanvas state={props.state} />
          </Match>
          <Match when={state() === AppStateEnum.COMPARE}>
            <PiCanvas state={props.state} />
          </Match>
        </Switch>
      </Show>
    </div>
  );
};

export const NavView = (props) => {
  const piState = usePiState();
  const [cmpSource, setCmpSource] = piState.cmpSource;
  const [cmpAgainst, setCmpAgainst] = piState.cmpAgainst;

  const [state, setState] = props.state;
  const appStates = [AppStateEnum.DIGITS, AppStateEnum.COMPARE];

  return (
    <nav class='m-4 h-[89vh] rounded-lg bg-stone-200 text-emerald-600'>
      <ul class='shadow-lg'>
        <For each={appStates}>
          {(s) => (
            <li class='m-1 p-2 inline-block'>
              <button
                disabled={!piState.pi_baseline}
                class='hover:disabled::cursor-auto m-2 block p-2 rounded-lg bg-emerald-50 text-lg text-blue-700
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

      <p class='m-2 text-xl'>1,000,000 digits of pi!</p>

      <AppDescription state={props.state} />

      <Show when={state() === AppStateEnum.COMPARE}>
        <div class="mt-10">
          <div>Select algorithms to compare</div>

          <div class="mt-4">
            <span>Source: </span>
            <select
              class='rounded-lg pl-2 pr-1 text-blue-800 ring-2 ring-stone-100 hover:font-semibold hover:ring-stone-500'
              value={cmpSource()}
              onInput={(e) => setCmpSource(e.currentTarget.value)}
            >
              <For each={Object.keys(PiAlgorithms)}>
              {(n) => (
                  <Show when={n == cmpSource()}
                    fallback={<option value={n}>{n}</option>}
                  >
                    <option value={n} selected>{n}</option>
                  </Show>
                )}
              </For>
            </select>
          </div>

          <div class="mt-4">
            <span>Against: </span>
            <select
              class='rounded-lg pl-2 pr-1 text-blue-800 ring-2 ring-stone-100 hover:font-semibold hover:ring-stone-500'
              value={cmpAgainst()}
              onInput={(e) => setCmpAgainst(e.currentTarget.value)}
            >
              <For each={Object.keys(PiAlgorithms)}>
                {(n) => (
                  <Show when={n == cmpAgainst()}
                    fallback={<option value={n}>{n}</option>}
                  >
                    <option value={n} selected>{n}</option>
                  </Show>
                )}
              </For>
            </select>
          </div>
        </div>
      </Show>
    </nav>
  );
};
