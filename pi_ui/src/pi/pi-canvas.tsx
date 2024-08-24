import { createResource } from "solid-js";
import { AppStateEnum } from "../App";
import { logJS } from './utils.js';
import { PiState, usePiState } from "./pi.context";
import { getWasmView } from './pi-digits.loader.js';

const ROWS = 830;
const COLS = Math.floor(1000000 / ROWS) + 1;
// Note that 1000 * 1000 is 1,000,000 - but, 830 rows is all that will fit
const NUM_DIGITS = ROWS * COLS;

function diffDigits(piState: PiState, src, src_len, trg, trg_len): [any, any] {
    logJS(`diffDigits: src=${src}, src_len=${src_len}, trg=${trg}, trg_len=${trg_len}`);
    const cmp_result_wasm = piState.pi_cmp_digits(src, src_len, trg, trg_len);

    return [cmp_result_wasm, src_len];
}

function map_colors(piState: PiState, src, src_len, palette_id: number) {
    const map_result_wasm = piState.map_colors(src, src_len, palette_id);

    // logJS(`map_result_wasm=${map_result_wasm}`);

    const map_result_flat = getWasmView(map_result_wasm, src_len * 3);

    const map_result = [];
    for (let i = 0; i < map_result_flat.length; i += 3) { // because [3]u8
        map_result.push([
            map_result_flat[i + 0],
            map_result_flat[i + 1],
            map_result_flat[i + 2],
        ]);
    }

    piState.free(map_result_wasm, src_len);

    return map_result;
}

function setPiImageData(id: string, piState: PiState, src, src_len, palette_id: number) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(COLS, ROWS);

        logJS(`setPiImageData: set ROWS=${ROWS}, COLS=${COLS}, NUM_DIGITS=${NUM_DIGITS}, bytes=${imageData.data.byteLength}`);

        // logJS(`setPiImageData: src=${src}, src_len=${src_len}`);

        const map_result = map_colors(piState, src, src_len, palette_id);

        let red: number = 0, green: number = 0, blue: number = 0;
        let last_i = 0;

        var num_matched = 0; // if COMPARE

        for (let i = 0, di = 0; di < src_len && i < imageData.data.length && last_i < 1000000; di++, i += 4) {
            last_i++;

            const colors = map_result[di];
            red = colors[0];
            green = colors[1];
            blue = colors[2];

            // Modify pixel data
            imageData.data[i + 0] = red; // R value
            imageData.data[i + 1] = green; // G value
            imageData.data[i + 2] = blue; // B value
            imageData.data[i + 3] = 255; // A value

            if (palette_id === 1 && green === 255) { // COMPARE
                num_matched += 1;
            }
        }

        // Draw image data to the canvas
        ctx.putImageData(imageData, 0, 0);

        if (palette_id === 1) {
            logJS(`setPiImageData: pct_match=${(num_matched * 100) / src_len}`);
        }

        logJS(`setPiImageData: last_i=${last_i}`);
    }
}

export const PiCanvas = (props) => {
    const piState = usePiState();

    const [state] = props.state;
    const id = `canvas-${state()} `;

    const [cmpSource] = piState.cmpSource;
    const [cmpAgainst] = piState.cmpAgainst;

    const sourceAgainstKey = () => `${state()}-${cmpSource()}-${cmpAgainst()}`;

    createResource(sourceAgainstKey, async (key: string): Promise<void> => {
        const rc = new Promise<void>((resolve) => resolve());
        // Use setTimeout to make sure page has rendered
        setTimeout(() => {
            logJS(`PiCanvas [resource]: setting image data for ${id} because key=${key} changed`);

            const [src, src_len] = piState.dataFromAlgo(cmpSource());
            let [digits, digits_len] = [src, src_len];

            let palette_id = 0;
            if (state() === AppStateEnum.COMPARE) {
                const [trg, trg_len] = piState.dataFromAlgo(cmpAgainst());
                [digits, digits_len] = diffDigits(piState, src, src_len, trg, trg_len);
                palette_id = 1;
            }

            setPiImageData(id, piState, digits, digits_len, palette_id);

            if (state() === AppStateEnum.COMPARE) {
                piState.free(digits, digits_len);
            }

        }, 0);
        return rc;
    });

    return (
        <div class="m-4 text-center">
            <canvas id={id} class="bg-stone-100" width={COLS} height={ROWS}>Placeholder for {state()} mode</canvas>
        </div>
    );
};
