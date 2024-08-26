const std = @import("std");
const options = @import("options");

comptime {
    if (options.is_wasi) {
        _ = @import("wasi_imports.zig");
    } else {
        _ = @import("wasm_imports.zig");
    }
}

pub const allocator = std.heap.wasm_allocator;

pub fn logToConsole(comptime fmt: []const u8, args: anytype) void {
    if (options.is_wasi) {
        const logConsole = @import("wasi_imports.zig").logConsole;
        logConsole(fmt, args);
    } else {
        const logConsole = @import("wasm_imports.zig").logConsole;
        logConsole(fmt, args);
    }
}

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
