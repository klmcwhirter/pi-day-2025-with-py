// purple,violet,blue,lightblue,green,yellow,orange,red,crimson,black

const digits_pallette = [_][3]u8{
    .{ 0, 0, 0 }, // 'bg-black',
    .{ 127, 29, 29 }, // 'bg-red-900', // crimson
    .{ 185, 28, 28 }, // 'bg-red-700',
    .{ 251, 146, 60 }, // 'bg-orange-400',
    .{ 255, 255, 0 }, // 'bg-[yellow]',
    .{ 22, 163, 74 }, // 'bg-green-600',
    .{ 186, 230, 253 }, // 'bg-sky-200',
    .{ 29, 78, 216 }, // 'bg-blue-700',
    .{ 196, 181, 253 }, // 'bg-violet-300',
    .{ 126, 34, 206 }, // 'bg-purple-700',
};

const diff_pallete = [_][3]u8{
    .{ 255, 0, 0 }, // red if 0
    .{ 0, 255, 0 }, // green if 1
};

pub fn pallete_from_id(id: u8) []const [3]u8 {
    const rc = switch (id) {
        1 => diff_pallete[0..],
        else => digits_pallette[0..],
    };
    return rc[0..];
}
