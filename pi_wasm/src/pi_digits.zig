const std = @import("std");
const testing = std.testing;

comptime {
    _ = @import("pi_digits/histo.zig");
}

test {
    _ = @import("pi_digits/histo.zig");
}

pub const pi_1000000_seed = @import("pi_digits/pi_1000000.zig").pi_1000000_seed;
pub const tpi_1000000_seed = @import("pi_digits/tpi_1000000.zig").tpi_1000000_seed;

pub const pi_bbp_seed = @import("pi_digits/pi_bbp.zig").pi_bbp_seed;
pub const pi_bellard_seed = @import("pi_digits/pi_bellard.zig").pi_bellard_seed;

pub const pi_gosper_seed = @import("pi_digits/pi_gosper.zig").pi_gosper_seed;

pub const pi_random_init = @import("pi_digits/pi_random.zig").pi_random_init;
pub const pi_random_array_len = @import("pi_digits/pi_random.zig").pi_random_array_len;

pub const pi_sinha_saha_seed = @import("pi_digits/pi_sinha_saha.zig").pi_sinha_saha_seed;

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

pub export fn pi_bbp() [*]const u8 {
    return pi_bbp_seed.ptr;
}

pub export fn pi_bbp_len() usize {
    return pi_bbp_seed.len;
}

test "bbp should have len 1_000_000" {
    try testing.expect(1000000 == pi_bbp_seed.len);
    try testing.expect(pi_bbp_seed.len == pi_bbp_len());
}

pub export fn pi_bellard() [*]const u8 {
    return pi_bellard_seed.ptr;
}

pub export fn pi_bellard_len() usize {
    return pi_bellard_seed.len;
}

test "bellard should have len 1_000_000" {
    try testing.expect(1000000 == pi_bellard_seed.len);
    try testing.expect(pi_bellard_seed.len == pi_bellard_len());
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

pub export fn pi_sinha_saha() [*]const u8 {
    return pi_sinha_saha_seed.ptr;
}

pub export fn pi_sinha_saha_len() usize {
    return pi_sinha_saha_seed.len;
}

test "sinha_saha should have len 2000 - TODO 1_000_000 some day maybe" {
    try testing.expect(2000 == pi_sinha_saha_seed.len);
    try testing.expect(pi_sinha_saha_seed.len == pi_sinha_saha_len());
}

pub export fn pi_ten_digits() [*]const u8 {
    return pi_ten_digits_seed.ptr;
}

pub export fn pi_ten_digits_len() usize {
    return pi_ten_digits_seed.len;
}

test "ten_digits should have len 10" {
    try testing.expect(10 == pi_ten_digits_seed.len);
    try testing.expect(pi_ten_digits_seed.len == pi_ten_digits_len());
}

pub export fn tachus_pi() [*]const u8 {
    return tpi_1000000_seed.ptr;
}

pub export fn tachus_pi_len() usize {
    return tpi_1000000_seed.len;
}

test "tachus_pi should have len 1_000_000" {
    try testing.expect(1000000 == tpi_1000000_seed.len);
    try testing.expect(tpi_1000000_seed.len == tachus_pi_len());
}

pub var pi_random_array: []u8 = undefined;
pub export fn pi_random() [*]const u8 {
    pi_random_array = pi_random_init();
    return pi_random_array.ptr;
}

pub export fn pi_random_len() usize {
    return pi_random_array_len;
}

test "random should have len 1_000_000" {
    _ = pi_random();

    try testing.expect(1000000 == pi_random_array.len);
    try testing.expect(pi_random_array.len == pi_random_len());
}

test "random should return a diff ptr each time called" {
    const random1 = pi_random();
    const random2 = pi_random();

    try testing.expect(random1 != random2);
}
