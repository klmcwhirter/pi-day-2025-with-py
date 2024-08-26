const std = @import("std");

pub fn build(b: *std.Build) void {
    var artifact: *std.Build.Step.Compile = undefined;

    // This adds a command line option to zig build via the -D flag. i.e. -Dwasm
    const is_wasm = b.option(bool, "wasm", "build for wasm") orelse false;
    // Now we can make a build decision based on that option.

    // This adds a command line option to zig build via the -D flag. i.e. -Dwasi
    const is_wasi = b.option(bool, "wasi", "build for wasi else freestanding") orelse false;

    const options = b.addOptions();
    options.addOption(bool, "is_wasm", is_wasm);
    options.addOption(bool, "is_wasi", is_wasi);

    if (is_wasm) {
        const os_tag: std.Target.Os.Tag = if (is_wasi) .wasi else .freestanding;

        const wasm_target = b.resolveTargetQuery(.{ .cpu_arch = .wasm32, .os_tag = os_tag, .abi = .musl });
        artifact = b.addExecutable(.{
            .name = "pi-digits",
            .root_source_file = b.path("src/root.zig"),
            .target = wasm_target,
            .optimize = .ReleaseSmall,
            .use_lld = false,
            .use_llvm = false,
            // .link_libc = false,
        });
        artifact.entry = .disabled;
        // artifact.export_symbol_names = &.{
        //     "pi_baseline",   "pi_baseline_len", "pi_gosper", "pi_gosper_len", "pi_saha_sinha", "pi_saha_sinha",
        //     "pi_cmp_digits", "alloc",           "free",      "memory",        "zlog",          "zig_version",
        // };
        // artifact.import_memory = false;
        // artifact.export_memory = true;
        // artifact.initial_memory = 16 * 64 * 1024;
        // artifact.max_memory = 20 * 64 * 1024;
        // artifact.import_table = false;
        // artifact.export_table = true;

        if (is_wasi) {
            // artifact.rdynamic = true;
            artifact.export_memory = true;
        } else {
            artifact.rdynamic = true;
        }

        artifact.root_module.addOptions("options", options);
        b.installArtifact(artifact);

        const install_dir: std.Build.InstallDir = .bin;

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

        // Creates a step for unit testing. This only builds the test executable
        // but does not run it.
        const unit_tests = b.addTest(.{ //
            .root_source_file = b.path("src/main.zig"),
            .target = wasm_target,
            .optimize = .ReleaseSmall,
            .use_lld = false,
            .use_llvm = false,
        });

        unit_tests.root_module.addOptions("options", options);
        const run_unit_tests = b.addRunArtifact(unit_tests);

        // Similar to creating the run step earlier, this exposes a `test` step to
        // the `zig build --help` menu, providing a way for the user to request
        // running the unit tests.
        const test_step = b.step("test", "Run unit tests");
        test_step.dependOn(&run_unit_tests.step);
    } else {
        @panic("Must supply at least -Dwasm option.");
    }
}
