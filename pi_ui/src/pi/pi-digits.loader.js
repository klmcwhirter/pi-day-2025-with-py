import { current_time } from "./utils";

const WASMFILE = '/dist/pi-digits.wasm';

export class WasmLoadResult {
    zig_version;
    pi_baseline;
    pi_gosper;
    pi_saha_sinha;
    alloc;
    free;
    memory;
};

const wasmLoadResult = new WasmLoadResult();

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
function getView(ptr, len) {
    return new Uint8Array(wasmLoadResult.memory.buffer, ptr, len);
}

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getView(ptr, len));

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = wasmLoadResult.alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getView(ptr, capacity));
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
            const { pi_baseline, pi_baseline_len, pi_gosper, pi_gosper_len, pi_saha_sinha, pi_saha_sinha_len, alloc, free, memory, zlog, zig_version } = wasmModule.instance.exports;
            wasmLoadResult.alloc = alloc;
            wasmLoadResult.free = free;
            wasmLoadResult.memory = memory;

            wasmLoadResult.pi_baseline = getView(pi_baseline(), pi_baseline_len());
            wasmLoadResult.pi_gosper = getView(pi_gosper(), pi_gosper_len());
            wasmLoadResult.pi_saha_sinha = getView(pi_saha_sinha(), pi_saha_sinha_len());

            zig_version();

            // Passing a unicode string across the JS to WASM boundary.
            // const [ptr, len, capacity] = encodeStr("Hello from Zig + JS + WASM 🦎⚡!");
            // zlog(ptr, len);

            // We need to manually free the string's bytes in WASM memory.
            // wasmLoadResult.free(ptr, capacity);
        });

    return new Promise((resolve) => resolve(wasmLoadResult));
}
