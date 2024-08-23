const std = @import("std");

pub const allocator = std.heap.wasm_allocator;

/// Allocate `len` bytes in WASM memory. Returns
/// many item pointer on success, null on error.
pub export fn alloc(len: usize) ?[*]u8 {
    return if (allocator.alloc(u8, len)) |array|
        array.ptr
    else |_|
        null;
}

/// Free `len` bytes in WASM memory pointed to by `ptr`.
pub export fn free(ptr: [*]u8, len: usize) void {
    // From the docs: @ptrCast(...) cannot be used for:
    // Casting a non-slice pointer to a slice, use slicing syntax ptr[start..end].
    allocator.free(ptr[0..len]);

    // /home/klmcw/.local/share/zig-linux-x86_64-0.13.0/lib/std/mem.zig:4117:14: error: type '[*]u8' does not support field access
    //     if (slice.len == 0 and std.meta.sentinel(Slice) == null) return &[0]u8{};
    //         ~~~~~^~~~
    // referenced by:
    //     free__anon_1272: /home/klmcw/.local/share/zig-linux-x86_64-0.13.0/lib/std/mem/Allocator.zig:308:35
    //     free: src/root.zig:67:19

    // allocator.free(ptr);
}

pub fn logConsole(comptime fmt: []const u8, args: anytype) void {
    var hasError: bool = false;
    const msg: []u8 = if (std.fmt.allocPrint(allocator, fmt, args)) |m|
        m
    else |_| with_error: {
        hasError = true;
        break :with_error "";
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
