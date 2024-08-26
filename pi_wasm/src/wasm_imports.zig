const std = @import("std");

const allocator = std.heap.wasm_allocator;

pub fn logConsole(comptime fmt: []const u8, args: anytype) void {
    var hasError: bool = false;
    const msg: []u8 = if (std.fmt.allocPrint(allocator, fmt, args)) |m|
        m
    else |_| with_error: {
        hasError = true;
        break :with_error @constCast(fmt);
    };

    if (!hasError) {
        defer allocator.free(msg);

        consoleLog(msg.ptr, msg.len);
    }

    if (hasError) {
        const errStr = "Out of memory!";
        consoleLog(errStr.ptr, errStr.len);
    }
}

/// Called from JS but turns around and calls back to JS
/// in order to log to the JS console.
pub export fn zlog(ptr: [*]const u8, len: usize) void {
    consoleLog(ptr, len);
}

// Log to the JS console.
extern "env" fn consoleLog(ptr: [*]const u8, len: usize) void;

pub export fn zig_version() void {
    const builtin = @import("builtin");
    const zvers: []const u8 = builtin.zig_version_string;
    version(zvers.ptr, zvers.len);
}

extern "env" fn version(ptr: [*]const u8, len: usize) void;
