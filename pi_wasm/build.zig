const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});

    const optimize = b.standardOptimizeOption(.{});

    var artifact: *std.Build.Step.Compile = undefined;

    // This adds a command line option to zig build via the -D flag. i.e. -Dwasm
    const is_wasm = b.option(bool, "wasm", "build for wasm") orelse false;
    // Now we can make a build decision based on that option.

    // This adds a command line option to zig build via the -D flag. i.e. -Dwasi
    const is_wasi = b.option(bool, "wasi", "build for wasi else freestanding") orelse false;

    const runtimeName = "runtime";
    const runtimeFile = if (is_wasm) b.path("src/wasm_runtime.zig") else b.path("src/zig_runtime.zig");
    const runtime: std.Build.Module.CreateOptions = .{ .root_source_file = runtimeFile };

    if (is_wasm) {
        const os_tag: std.Target.Os.Tag = if (is_wasi) .wasi else .freestanding;

        const wasm_target = b.resolveTargetQuery(.{ .cpu_arch = .wasm32, .os_tag = os_tag });

        if (is_wasi) {
            artifact = b.addSharedLibrary(.{ //
                .name = "pi-digits",
                .root_source_file = b.path("src/root.zig"),
                .target = wasm_target,
                .optimize = .ReleaseSmall,
                .use_lld = false,
                .use_llvm = false,
                .link_libc = false,
            });
            artifact.rdynamic = true;
            artifact.export_memory = true;
            // artifact.export_table = true;
        } else {
            artifact = b.addExecutable(.{ //
                .name = "pi-digits",
                .root_source_file = b.path("src/root.zig"),
                .target = wasm_target,
                .optimize = .ReleaseSmall,
                .use_lld = false,
                .use_llvm = false,
                .link_libc = false,
            });
            artifact.entry = .disabled;
            artifact.rdynamic = true;
            // artifact.export_symbol_names = &.{ "histogram", "pi_digits", "pi_digits_len", "alloc", "free", "memory", "zlog", "zig_version" };
            // artifact.import_memory = false;
            // artifact.export_memory = true;
            // artifact.initial_memory = 16 * 64 * 1024;
            // artifact.max_memory = 20 * 64 * 1024;
            // artifact.import_table = false;
            // artifact.export_table = true;
        }

        const install_dir: std.Build.InstallDir = switch (artifact.kind) {
            .exe => .bin,
            .lib => .lib,
            else => .bin,
        };

        const wat = b.addSystemCommand(&[_][]const u8{
            "wasm2wat",
            b.getInstallPath(install_dir, "pi-digits.wasm"),
            "-o",
            b.getInstallPath(install_dir, "pi-digits.wat"),
        });
        wat.step.dependOn(b.getInstallStep());

        // Create build step for generating wat file
        const wat_step = b.step("gen-wat", "Generate the wat file using wasm2wat");
        wat_step.dependOn(&wat.step);

        const copy_js = b.addSystemCommand(&[_][]const u8{
            "cp",
            "src/pi_digits/pi-digits.cjs",
            b.getInstallPath(install_dir, "pi-digits.cjs"),
        });
        copy_js.step.dependOn(b.getInstallStep());

        // Create build step for generating wat file
        const copy_js_step = b.step("copy-js", "Copy the js script used for testing");
        copy_js_step.dependOn(&copy_js.step);
    } else {
        artifact = b.addExecutable(.{ //
            .name = "pi-digits",
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            .single_threaded = true,
            .use_lld = false,
            .use_llvm = false,
        });

        // This *creates* a Run step in the build graph, to be executed when another
        // step is evaluated that depends on it. The next line below will establish
        // such a dependency.
        const run_cmd = b.addRunArtifact(artifact);

        // By making the run step depend on the install step, it will be run from the
        // installation directory rather than directly from within the cache directory.
        // This is not necessary, however, if the application depends on other installed
        // files, this ensures they will be present and in the expected location.
        run_cmd.step.dependOn(b.getInstallStep());

        // This allows the user to pass arguments to the application in the build
        // command itself, like this: `zig build run -- arg1 arg2 etc`
        if (b.args) |args| {
            run_cmd.addArgs(args);
        }

        // This creates a build step. It will be visible in the `zig build --help` menu,
        // and can be selected like this: `zig build run`
        // This will evaluate the `run` step rather than the default, which is "install".
        const run_step = b.step("run", "Run the app");
        run_step.dependOn(&run_cmd.step);
    }
    artifact.root_module.addAnonymousImport(runtimeName, runtime);

    b.installArtifact(artifact);

    // Creates a step for unit testing. This only builds the test executable
    // but does not run it.
    const unit_tests = b.addTest(.{ //
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
        .use_lld = false,
        .use_llvm = false,
    });
    unit_tests.root_module.addAnonymousImport(runtimeName, runtime);

    const run_unit_tests = b.addRunArtifact(unit_tests);

    // Similar to creating the run step earlier, this exposes a `test` step to
    // the `zig build --help` menu, providing a way for the user to request
    // running the unit tests.
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
}
