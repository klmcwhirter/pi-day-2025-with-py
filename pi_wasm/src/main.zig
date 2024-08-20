const std = @import("std");
const pi_digits = @import("root.zig");

const runtime = @import("runtime");

pub fn main() !void {
    runtime.zig_version();

    runtime.logConsole("[", .{});

    const pi_slize = pi_digits.pi_baseline()[0..10];
    for (pi_slize) |d| runtime.logConsole("{}, ", .{d});

    runtime.logConsole("]\n", .{});
}

test {
    _ = @import("root.zig");
}
