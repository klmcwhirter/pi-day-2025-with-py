const std = @import("std");
const logConsole = @import("../wasm_runtime.zig").logConsole;

pub const pi_random_seed = &pi_random_array;
var pi_random_array = [_]u8{0} ** 1000000;

pub fn pi_random_init() void {
    // logConsole("pi_random_init ... starting", .{});

    const seed: u64 = 3141592653; // of course ;)
    var isaac64 = std.rand.Isaac64.init(seed);
    const prng = std.rand.Isaac64.random(&isaac64);

    var i: usize = 0;
    while (i < pi_random_array.len) : (i += 1) {
        pi_random_array[i] = std.rand.uintAtMost(prng, u8, 9);
    }

    // logConsole("pi_random_init ... done", .{});
}
