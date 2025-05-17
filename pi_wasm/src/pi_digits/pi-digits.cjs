
const WASMFILE = 'pi-digits.wasm';

let wasm_memory;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
const getView = (ptr, len) => new Uint8Array(wasm_memory.buffer, ptr, len);

const jsLog = (msg) => {
    console.log('JS: %s', msg);
}

function main(mod) {
    jsLog(mod);
    jsLog(mod.instance);
    jsLog(mod.instance.exports);

    exports = mod.instance.exports;

    wasm_memory = exports.memory;

    jsLog(`pi_baseline=${exports.pi_baseline}`);
    jsLog(`pi_baseline()=${exports.pi_baseline()}`);

    // fn_histogram baseline
    let histo_result_wasm = exports.fn_histogram(exports.pi_baseline(), exports.pi_baseline_len());
    jsLog(`fn_histogram baseline: histo_result_wasm=${histo_result_wasm}`);

    let histo_result = getView(histo_result_wasm, 10);
    jsLog(`fn_histogram baseline=${histo_result}`)
    exports.mem_free(histo_result_wasm, 10);
};

// The environment we export to WASM.
const importObject = {
    env: {
        // We export this function to WASM land.
        consoleLog: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            console.log(`ZIG: ${msg}`);
        },
        version: (ptr, len) => {
            const msg = decodeStr(ptr, len);
            wasm_zig_version = `zig: ${msg}`;
            console.log(wasm_zig_version);
        },
        // memory: new WebAssembly.Memory({
        //     initial: 32,
        //     maximum: 64,
        //     shared: true
        // })
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('ZIG: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

function browser_strategy(wasmFile) {
    const pre = document.getElementById('result');
    const msgs = [];
    jsLog = (orig => {
        m = `JS: ${orig}`;
        console.log(m);
        if (typeof (m) === 'string') {
            msgs.push(m);
            pre.textContent = msgs.join('\n')
        }
    });

    WebAssembly
        .instantiateStreaming(fetch(wasmFile), importObject)
        .then(main);
}

function node_strategy(wasmFile) {
    const fs = require('node:fs');
    const path = require('node:path');
    const wasmFileContent = fs.readFileSync(path.join(__dirname, wasmFile));

    WebAssembly
        .instantiate(wasmFileContent, importObject)
        .then(main);
}

const strategies = [
    browser_strategy,
    node_strategy
];

const strategy = typeof window !== 'undefined' ? 0 : 1;

strategies[strategy](WASMFILE);
