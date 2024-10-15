import { Accessor, createContext, createSignal, Signal, useContext } from 'solid-js';

import { loadWasm, WasmLoadResult } from './pi-digits.loader.js';
import { logJS } from './utils.js';

export const PiAlgorithms = {
  'Baseline': 'Baseline',
  'Gosper': 'Gosper',
  'Sinha_Saha': 'Sinha_Saha',
  'Tachus_Pi': 'Tachus_Pi',  // From https://bellard.org/pi/pi2700e9/index.html
  'Random': 'Random',
  'Ten_Digits': 'Ten_Digits',
};

export class PiState {
  public pi_cmp_digits;
  public map_colors;
  public histogram_wasm: (pi: number, n: number) => number;

  public version = [];
  public stateInitialized: Accessor<boolean>;
  public cmpSource: Signal<string>;
  public cmpAgainst: Signal<string>;
  public cmpPctMatch: Signal<number>;
  public histoAlgo: Signal<string>;
  public digitsAlgo: Signal<string>;

  public pi_baseline;
  public pi_baseline_len;
  public pi_baseline_uint8arr: Uint8Array = new Uint8Array();
  public pi_gosper;
  public pi_gosper_len;
  public pi_random;
  public pi_random_len;
  public pi_sinha_saha;
  public pi_sinha_saha_len;
  public pi_ten_digits;
  public pi_ten_digits_len;
  public tachus_pi;
  public tachus_pi_len;
  public alloc;
  public free;
  public memory;

  constructor() {
    this.cmpSource = createSignal(PiAlgorithms.Baseline);
    this.cmpAgainst = createSignal(PiAlgorithms.Sinha_Saha);
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
        this.pi_baseline_len = rc.pi_baseline_len;
        this.pi_baseline_uint8arr = rc.pi_baseline_uint8arr;
        this.pi_gosper = rc.pi_gosper;
        this.pi_gosper_len = rc.pi_gosper_len;
        this.pi_random = rc.pi_random;
        this.pi_random_len = rc.pi_random_len;
        this.pi_sinha_saha = rc.pi_sinha_saha;
        this.pi_sinha_saha_len = rc.pi_sinha_saha_len;
        this.pi_ten_digits = rc.pi_ten_digits;
        this.pi_ten_digits_len = rc.pi_ten_digits_len;
        this.tachus_pi = rc.tachus_pi;
        this.tachus_pi_len = rc.tachus_pi_len;
        this.pi_cmp_digits = rc.pi_cmp_digits;
        this.map_colors = rc.map_colors;
        this.histogram_wasm = rc.histogram;

        const pythonVer = import.meta.env.VITE_PYTHON_VER || '3.12.*';
        const solidjsVer = import.meta.env.VITE_SOLIDJS_VER || '1.8.*';
        this.version = [rc.zig_version, `solidjs: ${solidjsVer}`, `python: ${pythonVer}`];

        this.alloc = rc.alloc;
        this.free = rc.free;
        this.memory = rc.memory;

        // Use setTimeout(..., 0) to make sure page has rendered
        setTimeout(() => setStateInitialized(true), 0);

        logJS('PiState.init: Loading wasm ... done');
      });
  }


  dataFromAlgo(algo: string) {
    logJS(`PiState.dataFromAlgo: algo=${algo}`);

    const piMap = {
      [PiAlgorithms.Baseline]: [this.pi_baseline, this.pi_baseline_len],
      [PiAlgorithms.Gosper]: [this.pi_gosper, this.pi_gosper_len],
      [PiAlgorithms.Random]: [this.pi_random, this.pi_random_len],
      [PiAlgorithms.Sinha_Saha]: [this.pi_sinha_saha, this.pi_sinha_saha_len],
      [PiAlgorithms.Ten_Digits]: [this.pi_ten_digits, this.pi_ten_digits_len],
      [PiAlgorithms.Tachus_Pi]: [this.tachus_pi, this.tachus_pi_len],
    };

    let [ptr, len] = piMap[algo];
    if (algo === PiAlgorithms.Random) {
      // generate a new random set of digits each time - note this currently takes 5 secs
      ptr = this.pi_random();
    }

    const rc = Object.keys(piMap).includes(algo) ? [ptr, len] : [this.pi_baseline, this.pi_baseline_len];
    logJS(`PiState.dataFromAlgo: rc=${rc}`);
    return rc;
  }

  histogram(pi: number, n: number): number[] {
    const rc_wasm_ptr = this.histogram_wasm(pi, n);
    const rc: number[] = [...new Int32Array(this.memory.buffer, rc_wasm_ptr, 10)];
    this.free(rc_wasm_ptr, 10);
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
