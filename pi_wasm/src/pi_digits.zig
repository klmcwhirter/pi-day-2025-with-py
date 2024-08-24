const std = @import("std");
const testing = std.testing;

pub const pi_1000000_seed = @import("pi_digits/pi_1000000.zig").pi_1000000_seed;

pub const pi_gosper_seed = @import("pi_digits/pi_gosper.zig").pi_gosper_seed;

pub const pi_random_init = @import("pi_digits/pi_random.zig").pi_random_init;
pub const pi_random_seed = @import("pi_digits/pi_random.zig").pi_random_seed;

pub const pi_saha_sinha_seed = @import("pi_digits/pi_saha_sinha.zig").pi_saha_sinha_seed;

pub const pi_ten_digits_seed = @import("pi_digits/pi_ten_digits.zig").pi_ten_digits_seed;

pub const pallete_from_id = @import("pi_digits/colors.zig").pallete_from_id;

pub export fn pi_baseline() [*]const u8 {
    return pi_1000000_seed.ptr;
}

pub export fn pi_baseline_len() usize {
    return pi_1000000_seed.len;
}

test "baseline should have len 1_000_000" {
    try testing.expect(1000000 == pi_1000000_seed.len);
    try testing.expect(pi_1000000_seed.len == pi_baseline_len());
}

pub export fn pi_gosper() [*]const u8 {
    return pi_gosper_seed.ptr;
}

pub export fn pi_gosper_len() usize {
    return pi_gosper_seed.len;
}

test "gosper should have len 1_000_000" {
    try testing.expect(1000000 == pi_gosper_seed.len);
    try testing.expect(pi_gosper_seed.len == pi_gosper_len());
}

pub export fn pi_random() [*]const u8 {
    pi_random_init();
    return pi_random_seed.ptr;
}

pub export fn pi_random_len() usize {
    return pi_random_seed.len;
}

test "random should have len 1_000_000" {
    try testing.expect(1000000 == pi_random_seed.len);
    try testing.expect(pi_random_seed.len == pi_random_len());
}

pub export fn pi_saha_sinha() [*]const u8 {
    return pi_saha_sinha_seed.ptr;
}

pub export fn pi_saha_sinha_len() usize {
    return pi_saha_sinha_seed.len;
}

test "saha_sinha should have len 10 - TODO 1_000_000" {
    try testing.expect(10 == pi_saha_sinha_seed.len);
    try testing.expect(pi_saha_sinha_seed.len == pi_saha_sinha_len());
}

pub export fn pi_ten_digits() [*]const u8 {
    return pi_ten_digits_seed.ptr;
}

pub export fn pi_ten_digits_len() usize {
    return pi_ten_digits_seed.len;
}

test "ten_digits should have len 10" {
    try testing.expect(10 == pi_ten_digits_seed.len);
    try testing.expect(pi_ten_digits_seed.len == pi_saha_sinha_len());
}
