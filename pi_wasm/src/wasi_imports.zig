const std = @import("std");

pub fn logConsole(comptime fmt: []const u8, args: anytype) void {
    const stderr = std.io.getStdErr().writer();
    _ = stderr.print(fmt, args) catch {};
    // _ = stderr.print("\n", .{}) catch {};
}
