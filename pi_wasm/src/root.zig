const std = @import("std");
const testing = std.testing;

const runtime = @import("wasm_runtime.zig");
const logConsole = runtime.logConsole;
const pi_digits = @import("pi_digits.zig");

const pallete_from_id = pi_digits.pallete_from_id;

// var for tests
var allocator = runtime.allocator;

const baseline = pi_digits.pi_1000000_seed;

pub export fn pi_baseline() [*]const u8 {
    return baseline.ptr;
}

pub export fn pi_baseline_len() usize {
    return baseline.len;
}

test "baseline should have len 1_000_000" {
    try testing.expect(1000000 == baseline.len);
    try testing.expect(baseline.len == pi_baseline_len());
}

const gosper = pi_digits.pi_gosper_seed;

pub export fn pi_gosper() [*]const u8 {
    return gosper.ptr;
}

pub export fn pi_gosper_len() usize {
    return gosper.len;
}

test "gosper should have len 1_000_000" {
    try testing.expect(1000000 == gosper.len);
    try testing.expect(gosper.len == pi_gosper_len());
}

const random = pi_digits.pi_random_seed[0..];

pub export fn pi_random() [*]const u8 {
    pi_digits.pi_random_init();
    return random.ptr;
}

pub export fn pi_random_len() usize {
    return random.len;
}

test "random should have len 1_000_000" {
    try testing.expect(1000000 == random.len);
    try testing.expect(random.len == pi_random_len());
}

const saha_sinha = pi_digits.pi_saha_sinha_seed;

pub export fn pi_saha_sinha() [*]const u8 {
    return saha_sinha.ptr;
}

pub export fn pi_saha_sinha_len() usize {
    return saha_sinha.len;
}

test "saha_sinha should have len 10 - TODO 1_000_000" {
    try testing.expect(10 == saha_sinha.len);
    try testing.expect(saha_sinha.len == pi_saha_sinha_len());
}

const ten_digits = pi_digits.pi_ten_digits_seed;

pub export fn pi_ten_digits() [*]const u8 {
    return ten_digits.ptr;
}

pub export fn pi_ten_digits_len() usize {
    return ten_digits.len;
}

test "ten_digits should have len 10" {
    try testing.expect(10 == ten_digits.len);
    try testing.expect(ten_digits.len == pi_saha_sinha_len());
}

/// Compares digits strictly from `src` for `src_len` elements.
/// Returns a ptr to an array of `src_len` of `u8` containing 1 or 0 representing equality
/// for the element in that position of `src`.
/// If `other_len` < `src_len` all elements after `other_len` will be considered not equal
/// and contain 0 in the resulting array.
/// If `other_len` > `src_len` the elements above `src_len` are not considered. This is done
/// by design so that the return value can be depended on to have size `src_len`.
pub export fn pi_cmp_digits(src: [*]u8, src_len: u32, other: [*]u8, other_len: u32) [*]u8 {
    logConsole("pi_cmp_digits ... starting", .{});

    const src_len_usize: usize = @intCast(src_len);
    const other_len_usize: usize = @intCast(other_len);

    // logConsole("pi_cmp_digits: src_len={}, src_len_usize={d}", .{ src_len, src_len_usize });

    const rc = allocator.alloc(u8, src_len_usize) catch { // last element is % match
        @panic("OutOfMemory");
    };

    @memset(rc, 0);

    const slice_src = src[0..src_len_usize];
    const slice_other = other[0..other_len_usize];

    for (slice_src, 0..src_len_usize) |s, i| {
        var val: u8 = 0;
        if (i < slice_other.len) {
            if (s == slice_other[i]) {
                val = 1;
            }
        }

        rc[i] = val;
    }

    logConsole("pi_cmp_digits ... done", .{});

    return rc.ptr;
}

/// The return value can be depended on to have size `src_len`.
pub export fn map_colors(src: [*]const u8, src_len: u32, pallete_id: u8) [*][3]u8 {
    logConsole("map_colors ... starting", .{});

    const src_len_usize: usize = @intCast(src_len * 3); // [3]u8

    const rc = allocator.alloc([3]u8, src_len_usize) catch {
        @panic("OutOfMemory");
    };

    @memset(rc, [3]u8{ 0, 0, 0 });

    // logConsole("map_colors: rc={d}", .{rc});

    const slice_src = src[0..src_len_usize];
    const pallete = pallete_from_id(pallete_id);

    for (slice_src, 0..) |d, i| {
        rc[i] = pallete[d];
    }

    // logConsole("map_colors: after mapping rc={d}", .{rc});

    logConsole("map_colors ... done", .{});

    return rc.ptr;
}
