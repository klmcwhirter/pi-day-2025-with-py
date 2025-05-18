import * as pi_wasm from '../pi-wasm/pi-wasm.js';
import { logAS } from '../pi-wasm/utils.mjs';

globalThis.loggingAS = logAS;

export class WasmLoadResult {
    as_version;
    cmp_digits;
    histogram;
    map_colors;
    pi_baseline;
    pi_bbp;
    pi_bellard;
    pi_gosper;
    pi_sinha_saha;
    pi_tachus;
    pi_ten_digits;
};

const wasmLoadResult = new WasmLoadResult();

export const loadWasm = async () => {
    wasmLoadResult.as_version = pi_wasm.as_version;
    wasmLoadResult.cmp_digits = pi_wasm.cmp_digits;
    wasmLoadResult.map_colors = pi_wasm.map_colors;
    wasmLoadResult.histogram = pi_wasm.histogram;

    wasmLoadResult.pi_baseline = pi_wasm.pi_baseline;
    wasmLoadResult.pi_bbp = pi_wasm.pi_bbp;
    wasmLoadResult.pi_bellard = pi_wasm.pi_bellard;
    wasmLoadResult.pi_gosper = pi_wasm.pi_gosper;
    wasmLoadResult.pi_sinha_saha = pi_wasm.pi_sinha_saha;
    wasmLoadResult.pi_ten_digits = pi_wasm.pi_ten_digits;
    wasmLoadResult.pi_tachus = pi_wasm.pi_tachus;

    // Passing a unicode string across the JS to WASM boundary.
    // pi_wasm.as_log("Hello from AS + JS + WASM 🦎⚡!");

    // pi_wasm.as_log(`${pi_wasm.as_version()}`);

    return new Promise((resolve) => resolve(wasmLoadResult));
}
