import { Accessor, createContext, createSignal, Signal, useContext } from 'solid-js';

import { loadWasm, WasmLoadResult } from './pi-digits.loader.js';
import { logJS } from './utils.js';

export const PiAlgorithms = {
  'Baseline': 'Baseline',
  'BBP': 'BBP',
  'Bellard': 'Bellard',
  'Gosper': 'Gosper',
  'Sinha_Saha': 'Sinha_Saha',
  'Tachus_Pi': 'Tachus_Pi',  // From https://bellard.org/pi/pi2700e9/index.html
  'Ten_Digits': 'Ten_Digits',
};

export class PiState {
  public cmp_digits;
  public map_colors;
  public histogram_wasm: (pi: number[]) => number[];

  public version = [];
  public stateInitialized: Accessor<boolean>;
  public cmpSource: Signal<string>;
  public cmpAgainst: Signal<string>;
  public cmpNumMatch: Signal<number>;
  public cmpPctMatch: Signal<number>;
  public histoAlgo: Signal<string>;
  public digitsAlgo: Signal<string>;

  public pi_baseline: () => number[];
  public pi_bbp: () => number[];
  public pi_bellard: () => number[];
  public pi_gosper: () => number[];
  public pi_sinha_saha: () => number[];
  public pi_ten_digits: () => number[];
  public pi_tachus: () => number[];

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
        this.pi_baseline = rc.pi_baseline;
        this.pi_bbp = rc.pi_bbp;
        this.pi_bellard = rc.pi_bellard;
        this.pi_gosper = rc.pi_gosper;
        this.pi_sinha_saha = rc.pi_sinha_saha;
        this.pi_ten_digits = rc.pi_ten_digits;
        this.pi_tachus = rc.pi_tachus;

        this.cmp_digits = rc.cmp_digits;
        this.histogram_wasm = rc.histogram;
        this.map_colors = rc.map_colors;

        const pythonVer = import.meta.env.VITE_PYTHON_VER || '3.12.*';
        const solidjsVer = import.meta.env.VITE_SOLIDJS_VER || '1.8.*';
        this.version = [rc.as_version(), `solidjs: ${solidjsVer}`, `python: ${pythonVer}`];

        // Use setTimeout(..., 0) to make sure page has rendered
        setTimeout(() => setStateInitialized(true), 0);

        logJS('PiState.init: Loading wasm ... done');
      });
  }


  dataFromAlgo(algo: string) {
    logJS(`PiState.dataFromAlgo: algo=${algo}`);

    const piMap = {
      [PiAlgorithms.Baseline]: this.pi_baseline,
      [PiAlgorithms.BBP]: this.pi_bbp,
      [PiAlgorithms.Bellard]: this.pi_bellard,
      [PiAlgorithms.Gosper]: this.pi_gosper,
      [PiAlgorithms.Sinha_Saha]: this.pi_sinha_saha,
      [PiAlgorithms.Ten_Digits]: this.pi_ten_digits,
      [PiAlgorithms.Tachus_Pi]: this.pi_tachus,
    };

    const rc = Object.keys(piMap).includes(algo) ? piMap[algo]() : [];
    logJS(`PiState.dataFromAlgo: rc=${rc}`);
    return rc;
  }

  histogram(pi: number[]): number[] {
    const rc = this.histogram_wasm(pi);
    return rc;
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
