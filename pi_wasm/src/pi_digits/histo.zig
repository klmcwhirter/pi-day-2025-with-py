const std = @import("std");
const testing = std.testing;

const allocator = @import("../wasm_runtime.zig").allocator;
const logToConsole = @import("../wasm_runtime.zig").logToConsole;

/// calculate histogram based on the presence of digits 0-9 in pi.
/// number is the N digits to consider in pi (sample size from left)
pub export fn histogram(pi: [*]u8, number: i32) [*]i32 {
    logToConsole("histogram(pi={*}, number={d}) ... starting", .{ pi, number });
    const array_len: usize = 10;
    const upper: usize = @intCast(number);

    const slice_of_pi = pi[0..upper];

    const slice: []i32 = allocator.alloc(i32, array_len) catch {
        // logConsole("PANIC: {}", .{err}); // err=OutOfMemory - this won't work!

        // ** And I cannot return the err - i.e., return type ![*]i32
        //   ... not allowed in function with calling convention 'C'
        //     pub export fn histogram(number: i32) ![*]i32 {
        //                                           ~^~~~~
        // ** cannot return null or @ptrFromInt(0) - this would be ideal
        //     src/histo.zig:29:17: error: expected type '[*]i32', found '@TypeOf(null)'
        //     return (null);
        //             ^~~~
        //     src/histo.zig:26:28: error: pointer type '[*]i32' does not allow address zero
        //        return @ptrFromInt(0);

        // ** So ... crash the wasm runtime in the browser process

        @panic("OutOfMemory");
    };

    // Make sure the memory allocated is zeroed out before beginning to increment.
    // Creates issues when built with -Dwasm=false otherwise.
    // The std.heap.wasm_alloctor seems to 0 memory.
    @memset(slice[0..array_len], 0);
    // alternate form, but I'll trust the builtin: for (array[0..array_len]) |*p| p.* = 0;

    // Increment the histogram for each of the digits in our slice_of_pi ;)
    for (slice_of_pi) |d| slice[d] += 1;

    logToConsole("histogram(pi={*}, number={d}) ... done", .{ pi, number });

    const rc: [*]i32 = @ptrCast(slice);
    return rc;
}

test "histograms forms correct result" {
    // allocator = testing.allocator;
    const number = 10;
    const ten: usize = number;

    // 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 = 0, 2, 1, 2, 1, 2, 1, 0, 0, 1
    const pi = [ten]u8{ 3, 1, 4, 1, 5, 9, 2, 6, 5, 3 };
    const pi_ptr: [*]u8 = @constCast(&pi);
    const expected_seed = [_]i32{ 0, 2, 1, 2, 1, 2, 1, 0, 0, 1 };
    const expected: []const i32 = expected_seed[0..ten];

    var rc = histogram(pi_ptr, number);
    defer allocator.free(rc[0..ten]);

    const slice: []const i32 = rc[0..ten];

    std.debug.print("\nChecking each value for equality individually...\n", .{});
    for (expected, 0..) |ex, i| try testing.expectEqual(ex, slice[i]);

    std.debug.print("\nChecking with expectEqualSlices...\n", .{});
    try testing.expectEqualSlices(i32, expected, slice);
}
