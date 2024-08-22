import { Accessor, createContext, createSignal, Signal, useContext } from 'solid-js';

import { loadWasm, WasmLoadResult } from './pi-digits.loader.js';
import { logJS } from './utils.js';

export const PiAlgorithms = {
  'Baseline': 'Baseline',
  'Gosper': 'Gosper',
  'Saha_Sinha': 'Saha_Sinha'
};

export class PiState {
  public pi_baseline: Uint8Array = new Uint8Array();
  public pi_gosper: Uint8Array = new Uint8Array();
  public pi_saha_sinha: Uint8Array = new Uint8Array();
  public version = [];
  public stateInitialized: Accessor<boolean>;
  public cmpSource: Signal<string>;
  public cmpAgainst: Signal<string>;

  constructor() {
    this.cmpSource = createSignal(PiAlgorithms.Baseline);
    this.cmpAgainst = createSignal(PiAlgorithms.Gosper);
  }

  init = async () => {
    const [stateInitialized, setStateInitialized] = createSignal(false);
    this.stateInitialized = stateInitialized;
    logJS('Loading wasm ...');
    await loadWasm()
      .then((rc: WasmLoadResult) => {
        this.pi_baseline = rc.pi_baseline;
        this.pi_gosper = rc.pi_gosper;
        this.pi_saha_sinha = rc.pi_saha_sinha;
        this.version = [rc.zig_version];
        logJS('Loading wasm ... done')

        setStateInitialized(true);
      });
  }


  dataFromAlgo(algo: string): Uint8Array {
    const piMap = {
      [PiAlgorithms.Baseline]: this.pi_baseline,
      [PiAlgorithms.Gosper]: this.pi_gosper,
      [PiAlgorithms.Saha_Sinha]: this.pi_saha_sinha,
    }
    return Object.keys(piMap).includes(algo) ? piMap[algo] : this.pi_baseline;
  }
}

const PiStateContext = createContext<PiState>();

export const PiAdapterProvider = (props) => {
  const piState = new PiState();
  piState.init();

  return (
    <PiStateContext.Provider value={piState}>
      {props.children}
    </PiStateContext.Provider>
  );
};

export const usePiState = () => useContext<PiState>(PiStateContext);
