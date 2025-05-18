import { Accessor, createContext, createSignal, Signal, useContext } from 'solid-js';

import { loadWasm, WasmLoadResult } from './pi-digits.loader.js';
import { logJS } from './utils.js';

export const PiAlgorithms = {
  'Baseline': 'Baseline',
  'BBP': 'BBP',
  'Bellard': 'Bellard',
  'Gosper': 'Gosper',
  'Sinha_Saha': 'Sinha_Saha',
  'Tachus': 'Tachus',  // From https://bellard.org/pi/pi2700e9/index.html
  'Ten_Digits': 'Ten_Digits',
};

export class PiState {
  public version = [];
  public stateInitialized: Accessor<boolean>;
  public cmpSource: Signal<string>;
  public cmpAgainst: Signal<string>;
  public cmpNumMatch: Signal<number>;
  public cmpPctMatch: Signal<number>;
  public histoAlgo: Signal<string>;
  public digitsAlgo: Signal<string>;

  public wasm: WasmLoadResult;

  constructor() {
    this.cmpSource = createSignal(PiAlgorithms.Baseline);
    this.cmpAgainst = createSignal(PiAlgorithms.Sinha_Saha);
    this.cmpNumMatch = createSignal(0.0);
    this.cmpPctMatch = createSignal(0.0);
    this.digitsAlgo = createSignal(PiAlgorithms.Baseline);
    this.histoAlgo = createSignal(PiAlgorithms.Baseline);
  }

  init = async () => {
    const [stateInitialized, setStateInitialized] = createSignal(false);
    this.stateInitialized = stateInitialized;

    logJS('PiState.init: Loading wasm ...');

    await loadWasm()
      .then((rc: WasmLoadResult) => {
        this.wasm = rc;

        const pythonVer = import.meta.env.VITE_PYTHON_VER || '3.13.*';
        const solidjsVer = import.meta.env.VITE_SOLIDJS_VER || '1.8.*';
        this.version = [rc.as_version(), `solidjs: ${solidjsVer}`, `python: ${pythonVer}`];

        // Use setTimeout(..., 0) to make sure page has rendered
        setTimeout(() => setStateInitialized(true), 0);

        logJS('PiState.init: Loading wasm ... done');
      });
  }
}

const piStateContext = createContext<PiState>(new PiState());

export const PiAdapterProvider = (props) => {
  const piState = piStateContext.defaultValue;  // new PiState();
  piState.init();

  return (
    <piStateContext.Provider value={piState}>
      {props.children}
    </piStateContext.Provider>
  );
};

export const usePiState = () => useContext<PiState>(piStateContext);
