import { createEffect, createResource } from "solid-js";
import { AppStateEnum } from "../App";
import { logJS } from './utils.js';
import { usePiState } from "./pi.context";

const ROWS = 830;
const COLS = Math.floor(1000000 / ROWS) + 1;
// // Note that 32 * 48 = 1536
const NUM_DIGITS = ROWS * COLS;

// purple,violet,blue,lightblue,green,yellow,orange,red,crimson,black

// const pallette = [
//   'bg-purple-700 text-white',
//   'bg-violet-300',
//   'bg-blue-700 text-white',
//   'bg-sky-200',
//   'bg-green-600 text-white',
//   'bg-[yellow]',
//   'bg-orange-400',
//   'bg-red-700 text-white',
//   'bg-red-900 text-white', // crimson
//   'bg-black text-white',
// ];

// const shadow_pallette = [
//   'shadow-purple-700/30',
//   'shadow-violet-300',
//   'shadow-blue-700/30',
//   'shadow-sky-200',
//   'shadow-green-600/30',
//   'shadow-[yellow]/30',
//   'shadow-orange-400/30',
//   'shadow-red-700/30',
//   'shadow-red-900/30', // crimson
//   'shadow-black/30',
// ];

const pallette = [
    [126, 34, 206], // 'bg-purple-700',
    [196, 181, 253], // 'bg-violet-300',
    [29, 78, 216], // 'bg-blue-700',
    [186, 230, 253], // 'bg-sky-200',
    [22, 163, 74], // 'bg-green-600',
    [255, 255, 0], // 'bg-[yellow]',
    [251, 146, 60], // 'bg-orange-400',
    [185, 28, 28], // 'bg-red-700',
    [127, 29, 29], // 'bg-red-900', // crimson
    [0, 0, 0], // 'bg-black',
];

function setPiImageData(id: string, state: string, pi_digits: Uint8Array, other?: Uint8Array) {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(COLS, ROWS);

        logJS(`set ROWS=${ROWS}, COLS=${COLS}, NUM_DIGITS=${NUM_DIGITS}, bytes=${imageData.data.byteLength}`);

        let red: number = 0, green: number = 0, blue: number = 0, alpha: number = 255;
        if (state === AppStateEnum.DIGITS) {
            blue = 255;
        }

        let last_i = 0;
        // Iterate through every pixel
        for (let i = 0, di = 0; i < imageData.data.length && last_i < 1000000; di++, i += 4) {
            last_i++;

            if (state === AppStateEnum.DIGITS) {
                const colors = pallette[pi_digits[di]];
                red = colors[0];
                green = colors[1];
                blue = colors[2];
            } else {
                if (di < pi_digits.length && di < other.length && pi_digits[di] === other[di]) {
                    red = 0;
                    green = 255;
                    blue = 0;
                } else {
                    red = 255;
                    green = 0;
                    blue = 0;
                }
            }

            // Modify pixel data
            imageData.data[i + 0] = red; // R value
            imageData.data[i + 1] = green; // G value
            imageData.data[i + 2] = blue; // B value
            imageData.data[i + 3] = alpha; // A value
        }

        // Draw image data to the canvas
        ctx.putImageData(imageData, 0, 0);

        logJS(`last_i=${last_i}`);
    }
}

export const PiCanvas = (props) => {
    const piState = usePiState();

    const [state] = props.state;
    const id = `canvas-${state()} `;

    const [cmpSource] = piState.cmpSource;
    const [cmpAgainst] = piState.cmpAgainst;

    const sourceAgainstKey = () => cmpSource() + cmpAgainst();

    const [canvasResource, { mutate }] = createResource(sourceAgainstKey, async (key: string): Promise<void> => {
        const rc = new Promise<void>((resolve) => resolve());
        // Use setTimeout to make sure page has rendered
        setTimeout(() => {
            setPiImageData(id, state(), piState.dataFromAlgo(cmpSource()), piState.dataFromAlgo(cmpAgainst()));
        }, 0);
        return rc;
    });

    return (
        <div class="m-4 text-center">
            <canvas id={id} class="bg-stone-200" width={COLS} height={ROWS}>Placeholder for {state()} mode</canvas>
        </div>
    );
};
