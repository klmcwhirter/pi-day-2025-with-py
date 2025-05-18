import * as pi_wasm from '../pi-wasm/pi-wasm.js';
import { logAS } from '../pi-wasm/utils.mjs';

globalThis.loggingAS = logAS;

export class WasmLoadResult {
    as_version = pi_wasm.as_version;
    cmp_digits = pi_wasm.cmp_digits;
    histogram = pi_wasm.histogram;
    map_colors = pi_wasm.map_colors;
    pi_digits = pi_wasm.pi_digits;
    pi_digits_len = pi_wasm.pi_digits_len;
    supported_algos = pi_wasm.supported_algos;
};

const wasmLoadResult = new WasmLoadResult();

export const loadWasm = async () => {
    // Passing a unicode string across the JS to WASM boundary.
    pi_wasm.as_log("Hello from AS + JS + WASM 🦎⚡!");
    pi_wasm.as_log(`${pi_wasm.as_version()}`);
    pi_wasm.as_log(`Supported Algos: ${pi_wasm.supported_algos()}`);

    return new Promise((resolve) => resolve(wasmLoadResult));
}
