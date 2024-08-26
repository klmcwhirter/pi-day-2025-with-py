const std = @import("std");
const allocator = @import("../wasm_runtime.zig").allocator;
const logToConsole = @import("../wasm_runtime.zig").logToConsole;

pub const pi_random_array_len: usize = 1000000;

var isaac64: std.Random.Isaac64 = undefined;
var firstTime = true;

pub fn pi_random_init() []u8 {
    logToConsole("pi_random_init ... starting", .{});

    if (firstTime) {
        logToConsole("pi_random_init ... seeding isaac64 ...", .{});
        const seed: u32 = 3141592653; // of course ;)
        isaac64 = std.Random.Isaac64.init(seed);
        firstTime = false;
    }
    const prng = std.Random.Isaac64.random(&isaac64);

    // skip a few random numbers ...
    var r: usize = 0;
    while (r < std.Random.uintAtMost(prng, u8, 9)) : (r += 1) {
        _ = std.Random.uintAtMost(prng, u8, 9);
    }

    // allocate pi_random_array
    const array = allocator.alloc(u8, pi_random_array_len) catch {
        @panic("OutOfMemory");
    };

    var i: usize = 0;
    while (i < array.len) : (i += 1) {
        array[i] = std.Random.uintAtMost(prng, u8, 9);
    }

    logToConsole("pi_random_init ... done", .{});

    return array;
}
