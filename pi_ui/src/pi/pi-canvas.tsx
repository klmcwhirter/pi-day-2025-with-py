import { createResource, Signal } from "solid-js";
import { AppStateEnum } from "../App";
import { logJS } from './utils.js';
import { PiState, usePiState } from "./pi.context";

const ROWS = 830;
const COLS = Math.floor(1000000 / ROWS) + 1;
// Note that 1000 * 1000 is 1,000,000 - but, 830 rows is all that will fit
const NUM_DIGITS = ROWS * COLS;


function setPiImageData(id: string, piState: PiState, items: number[], palette_id: number) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(COLS, ROWS);

        logJS(`setPiImageData: set ROWS=${ROWS}, COLS=${COLS}, NUM_DIGITS=${NUM_DIGITS}, bytes=${imageData.data.byteLength}`);

        const map_result = piState.wasm.map_colors(items, palette_id);

        let red: number = 0, green: number = 0, blue: number = 0;
        let last_i = 0;

        let num_matched = 0; // if COMPARE

        for (let i = 0, di = 0; di < items.length && i < imageData.data.length && last_i < 1000000; di++, i += 4) {
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

            if (palette_id === 1 && green === 255) { // COMPARE match
                num_matched += 1;
            }
        }

        // Draw image data to the canvas
        ctx.putImageData(imageData, 0, 0);

        if (palette_id === 1) {
            piState.cmpNumMatch[1](num_matched);

            const pctMatched = (num_matched * 100) / items.length;
            piState.cmpPctMatch[1](pctMatched);
            logJS(`setPiImageData: pct_match=${pctMatched}`);
        }

        logJS(`setPiImageData: last_i=${last_i}`);
    } else {
        logJS('setPiImageData: canvas is null');
    }
}

let resolveId = 0;

export const PiCanvas = (props) => {
    const piState = usePiState();

    const [state] = props.state as Signal<string>;
    const id = `canvas-${state()} `;

    const [source] = props.source as Signal<string>;
    const [cmpAgainst] = piState.cmpAgainst;

    const sourceAgainstKey = () => `${state()}-${source()}-${cmpAgainst()}`;

    createResource(sourceAgainstKey, async (key: string): Promise<number> => {
        const rc = new Promise<number>((resolve) => { resolveId += 1; logJS(`PiCanvas.updateNumber: resolveId = ${resolveId}`); resolve(resolveId); });

        if (piState.stateInitialized() && source() !== null) {
            // Use setTimeout(..., 0) to make sure page has rendered
            setTimeout(() => {
                logJS(`PiCanvas[resource]: setting image data for ${id} because key = ${key} changed`);

                let items = [];

                let palette_id = 0;
                if (state() === AppStateEnum.COMPARE) {
                    items = piState.wasm.cmp_digits(source(), cmpAgainst());
                    palette_id = 1;
                } else {
                    items = piState.wasm.pi_digits(source());
                }

                setPiImageData(id, piState, items, palette_id);
            }, 0);
        } else {
            logJS(`PiCanvas[resource]: skip setting image data for ${id} because key = ${key} `);
        }

        return rc;
    });

    return (
        <div class="m-4 text-center">
            <canvas id={id} class="bg-stone-100 m-auto" width={COLS} height={ROWS}>Placeholder for {state()} mode</canvas>
        </div>
    );
};
