import { current_time } from "./utils";


const WASMFILE = '/dist/pi-digits.wasm';

export class WasmLoadResult {
    histogram;
    map_colors;
    pi_baseline;
    pi_baseline_len;
    pi_baseline_uint8arr;
    pi_gosper;
    pi_gosper_len;
    pi_random;
    pi_random_len;
    pi_sinha_saha;
    pi_sinha_saha_len;
    pi_ten_digits;
    pi_ten_digits_len;
    tachus_pi;
    tachus_pi_len;
    pi_cmp_digits;
    zig_version;
    alloc;
    free;
    memory;
};

const wasmLoadResult = new WasmLoadResult();

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
export const getWasmView = (ptr, len) => new Uint8Array(wasmLoadResult.memory.buffer, ptr, len);

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getWasmView(ptr, len));

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = wasmLoadResult.alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getWasmView(ptr, capacity));
    return [ptr, written, capacity];
}

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        consoleLog: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`ZIG: ${current_time()} ${msg}`);
        },
        version: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            wasmLoadResult.zig_version = `zig: ${msg}`;
            console.log(wasmLoadResult.zig_version);
        }
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('ZIG: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

export const loadWasm = async () => {
    await WebAssembly
        .instantiateStreaming(fetch(WASMFILE), importObject)
        .then(wasmModule => {
            const {
                pi_baseline, pi_baseline_len, pi_gosper, pi_gosper_len, pi_random, pi_random_len,
                pi_sinha_saha, pi_sinha_saha_len, pi_ten_digits, pi_ten_digits_len, tachus_pi, tachus_pi_len,
                pi_cmp_digits, map_colors, histogram,
                alloc, free, memory, zig_version, zlog
            } = wasmModule.instance.exports;
            wasmLoadResult.alloc = alloc;
            wasmLoadResult.free = free;
            wasmLoadResult.memory = memory;

            wasmLoadResult.pi_baseline = pi_baseline();
            wasmLoadResult.pi_baseline_len = pi_baseline_len();
            wasmLoadResult.pi_baseline_uint8arr = getWasmView(pi_baseline(), pi_baseline_len());
            wasmLoadResult.pi_gosper = pi_gosper();
            wasmLoadResult.pi_gosper_len = pi_gosper_len();
            wasmLoadResult.pi_random = pi_random; // this is going to be called at runtime
            wasmLoadResult.pi_random_len = pi_random_len();
            wasmLoadResult.pi_sinha_saha = pi_sinha_saha();
            wasmLoadResult.pi_sinha_saha_len = pi_sinha_saha_len();
            wasmLoadResult.pi_ten_digits = pi_ten_digits();
            wasmLoadResult.pi_ten_digits_len = pi_ten_digits_len();
            wasmLoadResult.tachus_pi = tachus_pi();
            wasmLoadResult.tachus_pi_len = tachus_pi_len();

            wasmLoadResult.pi_cmp_digits = pi_cmp_digits;
            wasmLoadResult.map_colors = map_colors;
            wasmLoadResult.histogram = histogram;

            // Passing a unicode string across the JS to WASM boundary.
            const [ptr, len, _] = encodeStr("Hello from Zig + JS + WASM 🦎⚡!");
            zlog(ptr, len);
            wasmLoadResult.free(ptr, len);

            // We need to manually free the string's bytes in WASM memory.

            zig_version();
        });

    return new Promise((resolve) => resolve(wasmLoadResult));
}
