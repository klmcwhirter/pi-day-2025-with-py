const std = @import("std");
const root = @import("root.zig");

pub fn main() !void {
    root.zig_version();

    root.logConsole("[", .{});

    const pi_slize = root.pi_baseline()[0..10];
    for (pi_slize) |d| root.logConsole("{}, ", .{d});

    root.logConsole("]\n", .{});
}

test {
    _ = @import("root.zig");
}
