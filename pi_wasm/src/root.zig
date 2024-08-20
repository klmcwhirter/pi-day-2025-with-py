const std = @import("std");
const testing = std.testing;

const runtime = @import("runtime");
var allocator = runtime.allocator; // var for tests
// const logConsole = runtime.logConsole;

const pi_digits = @import("pi_digits.zig");

const baseline = pi_digits.pi_1000000_seed;

pub export fn pi_baseline() [*]u8 {
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

pub export fn pi_gosper() [*]u8 {
    return gosper.ptr;
}

pub export fn pi_gosper_len() usize {
    return gosper.len;
}

test "gosper should have len 1_000_000" {
    try testing.expect(1000000 == gosper.len);
    try testing.expect(gosper.len == pi_gosper_len());
}

const saha_sinha = pi_digits.pi_saha_sinha_seed;

pub export fn pi_saha_sinha() [*]u8 {
    return saha_sinha.ptr;
}

pub export fn pi_saha_sinha_len() usize {
    return saha_sinha.len;
}

test "saha_sinha should have len 10 - TODO 1_000_000" {
    try testing.expect(10 == saha_sinha.len);
    try testing.expect(saha_sinha.len == pi_saha_sinha_len());
}

/// Allocate `len` bytes in WASM memory. Returns
/// many item pointer on success, null on error.
pub export fn alloc(len: usize) ?[*]u8 {
    return if (allocator.alloc(u8, len)) |slice|
        slice.ptr
    else |_|
        null;
}

/// Free `len` bytes in WASM memory pointed to by `ptr`.
pub export fn free(ptr: [*]u8, len: usize) void {
    allocator.free(ptr[0..len]);
}
