
const WASMFILE = 'pi-digits.wasm';

const jsLog = (msg) => {
    console.log('JS: %s', msg);
}

// Functions imported from WASM.
let wasm_alloc, wasm_free, wasm_memory;

let wasm_pi_baseline, wasm_pi_gosper, wasm_pi_saha_sinha, wasm_pi_ten_digits;

// Convenience function to prepare a typed byte array
// from a pointer and a length into WASM memory.
const getView = (ptr, len) => new Uint8Array(wasm_memory.buffer, ptr, len);

// JS strings are UTF-16 and have to be encoded into an
// UTF-8 typed byte array in WASM memory.
const encodeStr = (str) => {
    const capacity = str.length * 2 + 5; // As per MDN
    const ptr = wasm_alloc(capacity);
    const { written } = new TextEncoder().encodeInto(str, getView(ptr, capacity));
    return [ptr, written, capacity];
}

// Decode UTF-8 typed byte array in WASM memory into
// UTF-16 JS string.
const decodeStr = (ptr, len) => new TextDecoder().decode(getView(ptr, len));

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
        }
    },
    wasi_snapshot_preview1: {
        fd_write: (wuserdata, werror, wtype, wfd_readwrite) => {
            console.error('ZIG: **PANIC** OutOfMemory - fd_write: ', wuserdata, werror, wtype, wfd_readwrite);
            return -1;
        }
    }
};

const call_funcs = wasmModule => {
    jsLog(wasmModule.instance.exports);

    const {
        pi_baseline, pi_baseline_len, pi_gosper, pi_gosper_len, pi_saha_sinha, pi_saha_sinha_len, pi_ten_digits, pi_ten_digits_len,
        pi_cmp_digits, map_colors,
        alloc, free, memory, zlog, zig_version
    } = wasmModule.instance.exports;
    wasm_alloc = alloc;
    wasm_free = free;
    wasm_memory = memory;

    wasm_pi_baseline = new Uint8Array(memory.buffer, pi_baseline(), pi_baseline_len());
    wasm_pi_gosper = new Uint8Array(memory.buffer, pi_gosper(), pi_gosper_len());
    wasm_pi_saha_sinha = new Uint8Array(memory.buffer, pi_saha_sinha(), pi_saha_sinha_len());
    wasm_pi_ten_digits = new Uint8Array(memory.buffer, pi_ten_digits(), pi_ten_digits_len());

    zig_version();

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    console.log(
        'JS: wasm_pi_baseline=', wasm_pi_baseline,
        ', wasm_pi_baseline.length=', wasm_pi_baseline.length,
        ', wasm_pi_baseline.buffer.byteLength:=', wasm_pi_baseline.buffer.byteLength);

    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    console.log('JS: wasm_pi_gosper: ', wasm_pi_gosper);

    jsLog(`pi_saha_sinha_len=${pi_saha_sinha_len()}, pi_saha_sinha=${pi_saha_sinha()}`);
    console.log('JS: wasm_pi_saha_sinha: ', wasm_pi_saha_sinha);

    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);
    console.log('JS: wasm_pi_ten_digits: ', wasm_pi_ten_digits);

    // Test baseline vs ten_digits - should differ at 10th element
    let cmp_result_wasm = pi_cmp_digits(pi_baseline(), pi_baseline_len(), pi_ten_digits(), pi_ten_digits_len());
    jsLog(`pi_cmp_digits: cmp_result_wasm=${cmp_result_wasm}`);

    let cmp_result = getView(cmp_result_wasm, pi_baseline_len());
    let all_equal = cmp_result.every((v) => v === 1);
    jsLog(`pi_cmp_digits baseline<>ten_digits result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`pi_cmp_digits: baseline<>ten_digits first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_baseline_len());

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    jsLog(`pi_saha_sinha_len=${pi_saha_sinha_len()}, pi_saha_sinha=${pi_saha_sinha()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    // Test baseline vs gosper - should all be the same
    cmp_result_wasm = pi_cmp_digits(pi_baseline(), pi_baseline_len(), pi_gosper(), pi_gosper_len());
    jsLog(`pi_cmp_digits: cmp_result_wasm=${cmp_result_wasm}`);

    cmp_result = getView(cmp_result_wasm, pi_baseline_len());
    all_equal = cmp_result.every((v) => v === 1);
    jsLog(`pi_cmp_digits baseline<>gosper result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`pi_cmp_digits: baseline<>gosper first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_baseline_len());

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    jsLog(`pi_saha_sinha_len=${pi_saha_sinha_len()}, pi_saha_sinha=${pi_saha_sinha()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    jsLog(`map_colors: pi_ten_digits ... starting`);
    const map_result_wasm = map_colors(pi_ten_digits(), pi_ten_digits_len(), 0);
    const map_result_flat = getView(map_result_wasm, pi_ten_digits_len() * 3);
    const map_result = [];
    for (let i = 0, t = 0; i < map_result_flat.length; i += 3, t++) { // because [3]u8
        map_result.push([
            map_result_flat[i + 0],
            map_result_flat[i + 1],
            map_result_flat[i + 2],
        ]);
    }
    for (let i = 0; i < map_result.length; i++) {
        jsLog(`map_result[${i}]=${map_result[i]}`);
    }
    jsLog(`map_colors: pi_ten_digits ... done`);

    // Passing a string across the JS to WASM boundary.
    const [ptr, zlen, capacity] = encodeStr("Hello from Zig + JS + WASM with unicode 🦎⚡!");
    zlog(ptr, zlen);

    // We need to manually free the string's bytes in WASM memory.
    wasm_free(ptr, capacity);

    zig_version();
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
        .then(call_funcs);
}

function node_strategy(wasmFile) {
    const fs = require('node:fs');
    const path = require('node:path');
    const wasmFileContent = fs.readFileSync(path.join(__dirname, wasmFile));

    WebAssembly
        .instantiate(wasmFileContent, importObject)
        .then(call_funcs);
}

const strategies = [
    browser_strategy,
    node_strategy
];

const strategy = typeof window !== 'undefined' ? 0 : 1;

strategies[strategy](WASMFILE);
