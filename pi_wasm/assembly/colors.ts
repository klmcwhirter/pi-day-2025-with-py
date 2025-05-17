// purple,violet,blue,lightblue,green,yellow,orange,red,crimson,black

export const digits_palette: u8[][] = [
    [ 0, 0, 0 ], // 'bg-black',
    [ 127, 29, 29 ], // 'bg-red-900', // crimson
    [ 185, 28, 28 ], // 'bg-red-700',
    [ 251, 146, 60 ], // 'bg-orange-400',
    [ 255, 255, 0 ], // 'bg-[yellow]',
    [ 22, 163, 74 ], // 'bg-green-600',
    [ 186, 230, 253 ], // 'bg-sky-200',
    [ 29, 78, 216 ], // 'bg-blue-700',
    [ 196, 181, 253 ], // 'bg-violet-300',
    [ 126, 34, 206 ], // 'bg-purple-700',
];

export const diff_palette: u8[][] = [
    [ 255, 0, 0 ], // red if 0
    [ 0, 255, 0 ], // green if 1
];

export function palette_from_id(id: u8): u8[][] {
  if (id === 1) {
    return diff_palette;
  }

  return digits_palette;
}
