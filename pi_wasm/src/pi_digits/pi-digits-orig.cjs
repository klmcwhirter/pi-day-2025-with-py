
const WASMFILE = 'pi-digits.wasm';

const jsLog = (msg) => {
    console.log('JS: %s', msg);
}

// Functions imported from WASM.
let wasm_alloc, wasm_free, wasm_memory;

let wasm_pi_baseline, wasm_pi_bbp, wasm_pi_bellard, wasm_pi_gosper, wasm_pi_random, wasm_pi_sinha_saha, wasm_pi_ten_digits;

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

const main = wasmModule => {
    jsLog(wasmModule.instance.exports);

    const {
        pi_baseline, pi_baseline_len, pi_bbp, pi_bbp_len, pi_bellard, pi_bellard_len, pi_gosper, pi_gosper_len, pi_random, pi_random_len,
        pi_sinha_saha, pi_sinha_saha_len, pi_ten_digits, pi_ten_digits_len, pi_tachus, pi_tachus_len,
        fn_cmp_digits, fn_map_colors, fn_histogram,
        mem_alloc, mem_free, memory, zig_log, zig_version
    } = wasmModule.instance.exports;
    wasm_alloc = mem_alloc;
    wasm_free = mem_free;
    wasm_memory = memory;

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_bbp_len=${pi_bbp_len()}, pi_bbp=${pi_bbp()}`);
    jsLog(`pi_bellard_len=${pi_bellard_len()}, pi_bellard=${pi_bellard()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    // jsLog(`pi_random_len=${pi_random_len()}, pi_random=${pi_random()}`);
    jsLog(`pi_sinha_saha_len=${pi_sinha_saha_len()}, pi_sinha_saha=${pi_sinha_saha()}`);
    jsLog(`pi_tachus_len=${pi_tachus_len()}, pi_tachus=${pi_tachus()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    wasm_pi_baseline = pi_baseline;  // getView(pi_baseline(), pi_baseline_len());
    // wasm_pi_bbp = getView(pi_bbp(), pi_bbp_len());
    // wasm_pi_bellard = getView(pi_bellard(), pi_bellard_len());
    // wasm_pi_gosper = getView(pi_gosper(), pi_gosper_len());
    // // wasm_pi_random = getView(pi_random(), pi_random_len());
    // wasm_pi_sinha_saha = getView(pi_sinha_saha(), pi_sinha_saha_len());
    // wasm_pi_ten_digits = getView(pi_ten_digits(), pi_ten_digits_len());

    // zig_version();

    // console.log(
    //     'JS: wasm_pi_baseline=', wasm_pi_baseline,
    //     ', wasm_pi_baseline.length=', wasm_pi_baseline.length,
    //     ', wasm_pi_baseline.buffer.byteLength:=', wasm_pi_baseline.buffer.byteLength);

    // console.log('JS: wasm_pi_bbp: ', wasm_pi_bbp);

    // console.log('JS: wasm_pi_bellard: ', wasm_pi_bellard);

    // console.log('JS: wasm_pi_gosper: ', wasm_pi_gosper);

    // // console.log('JS: wasm_pi_random: ', wasm_pi_random);

    // console.log('JS: wasm_pi_sinha_saha: ', wasm_pi_sinha_saha);

    // console.log('JS: wasm_pi_ten_digits: ', wasm_pi_ten_digits);

    // fn_histogram baseline
    let histo_result_wasm = fn_histogram(pi_baseline(), pi_baseline_len());
    jsLog(`fn_histogram baseline: histo_result_wasm=${histo_result_wasm}`);

    let histo_result = getView(histo_result_wasm, 10);
    jsLog(`fn_histogram baseline=${histo_result}`)
    wasm_free(histo_result_wasm, 10);

    // fn_histogram bbp
    histo_result_wasm = fn_histogram(pi_bbp(), pi_bbp_len());
    jsLog(`fn_histogram baseline: histo_result_wasm=${histo_result_wasm}`);

    // fn_histogram gosper
    histo_result_wasm = fn_histogram(pi_gosper(), pi_gosper_len());
    jsLog(`fn_histogram baseline: histo_result_wasm=${histo_result_wasm}`);

    histo_result = getView(histo_result_wasm, 10);
    jsLog(`fn_histogram baseline=${histo_result}`)
    wasm_free(histo_result_wasm, 10);

    // fn_histogram random
    histo_result_wasm = fn_histogram(pi_random(), pi_random_len());
    jsLog(`fn_histogram random: histo_result_wasm=${histo_result_wasm}`);

    histo_result = getView(histo_result_wasm, 10);
    jsLog(`fn_histogram random=${histo_result}`)
    wasm_free(histo_result_wasm, 10);

    // Test baseline vs ten_digits - should differ at 10th element
    let cmp_result_wasm = fn_cmp_digits(pi_baseline(fn_), pi_baseline_len(), pi_ten_digits(), pi_ten_digits_len());
    jsLog(`fn_cmp_digits: fn_cmp_result_wasm=${cmp_result_wasm}`);

    let cmp_result = getView(cmp_result_wasm, pi_baseline_len());
    let all_equal = cmp_result.every((v) => v === 1);
    jsLog(`fn_cmp_digits baseline<fn_>ten_digits result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`fn_cmp_digits: fn_baseline<>ten_digits first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_baseline_len());

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_bbp_len=${pi_bbp_len()}, pi_bbp=${pi_bbp()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    jsLog(`pi_sinha_saha_len=${pi_sinha_saha_len()}, pi_sinha_saha=${pi_sinha_saha()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    // Test baseline vs gosper - should all be the same
    cmp_result_wasm = fn_cmp_digits(pi_baseline(fn_), pi_baseline_len(), pi_gosper(), pi_baseline_len());
    jsLog(`fn_cmp_digits: fn_cmp_result_wasm=${cmp_result_wasm}`);

    cmp_result = getView(cmp_result_wasm, pi_baseline_len());
    all_equal = cmp_result.every((v) => v === 1);
    jsLog(`fn_cmp_digits baseline<fn_>gosper result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`fn_cmp_digits: fn_baseline<>gosper first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_baseline_len());

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_bbp_len=${pi_bbp_len()}, pi_bbp=${pi_bbp()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    jsLog(`pi_sinha_saha_len=${pi_sinha_saha_len()}, pi_sinha_saha=${pi_sinha_saha()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    // Test baseline vs random - should not all be the same
    cmp_result_wasm = fn_cmp_digits(pi_baseline(fn_), pi_baseline_len(), pi_random(), pi_random_len());
    jsLog(`fn_cmp_digits: fn_cmp_result_wasm=${cmp_result_wasm}`);

    cmp_result = getView(cmp_result_wasm, pi_baseline_len());
    all_equal = cmp_result.every((v) => v === 1);
    jsLog(`fn_cmp_digits baseline<fn_>random result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`fn_cmp_digits: fn_baseline<>random first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_baseline_len());

    // Test random vs random - should not all be the same
    cmp_result_wasm = fn_cmp_digits(pi_random(fn_), pi_random_len(), pi_random(), pi_random_len());
    jsLog(`fn_cmp_digits: fn_cmp_result_wasm=${cmp_result_wasm}`);

    cmp_result = getView(cmp_result_wasm, pi_random_len());
    all_equal = cmp_result.every((v) => v === 1);
    jsLog(`fn_cmp_digits random<fn_>random result were all equal: ${all_equal}`)

    if (!all_equal) {
        jsLog(`fn_cmp_digits: fn_random<>random first diff at: ${cmp_result.findIndex((v) => v === 0)}`);
    }
    wasm_free(cmp_result_wasm, pi_random_len());

    jsLog(`pi_baseline_len=${pi_baseline_len()}, pi_baseline=${pi_baseline()}`);
    jsLog(`pi_bbp_len=${pi_bbp_len()}, pi_bbp=${pi_bbp()}`);
    jsLog(`pi_gosper_len=${pi_gosper_len()}, pi_gosper=${pi_gosper()}`);
    jsLog(`pi_sinha_saha_len=${pi_sinha_saha_len()}, pi_sinha_saha=${pi_sinha_saha()}`);
    jsLog(`pi_ten_digits_len=${pi_ten_digits_len()}, pi_ten_digits=${pi_ten_digits()}`);

    jsLog(`fn_map_colors: pi_ten_digits ... starting`);
    const map_result_wasm = fn_map_colors(pi_ten_digits(), pi_ten_digits_len(), 0);
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
    jsLog(`fn_map_colors: pi_ten_digits ... done`);
    wasm_free(map_result_wasm, pi_ten_digits_len() * 3);

    // Passing a string across the JS to WASM boundary.
    const [ptr, zlen, capacity] = encodeStr("Hello from Zig + JS + WASM with unicode 🦎⚡!");
    zig_log(ptr, zlen);

    // We need to manually free the string's bytes in WASM memory.
    wasm_free(ptr, capacity);

    zig_version();
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
        }
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
