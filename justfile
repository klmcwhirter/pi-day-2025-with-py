# Create .venv
[group: 'env']
create:
    #!/usr/bin/env bash
    uv sync --group dev

# Clean build artifacts
[group: 'env']
clean:
    #!/usr/bin/env bash
    find . -type d -name __pycache__ -exec rm -fr {} \;

    TO_DEL="build .coverage coverage.xml log .mypy_cache .pdm-build pi_py.egg-info pi_ui/dist pi_wasm/build pi_wasm/.zig-cache pi_wasm/zig-out __pycache__ .pytest_cache .tox"
    for d in ${TO_DEL}
    do
        echo $d
        rm -fr $d
    done

# Clean environment
[group: 'env']
envclean:
    #!/usr/bin/env bash
    TO_DEL="pi_ui/node_modules .venv"
    for d in ${TO_DEL}
    do
        echo $d
        rm -fr $d
    done

# Clean build artifacts and environment
[group: 'env']
allclean: clean envclean

# generate .gitignore
[group: 'env']
gitignore:
    #!/usr/bin/env bash
    source $HOME/.local/.bash.d/gitignore.io
    gi -s -- python,zig >.gitignore
    echo -e '\n.devcontainer/\nuv.lock\n.zig-cache/' >>.gitignore

[group: 'build']
pybuild:
    #!/usr/bin/env bash
    ENABLE_TESTS=0 .devcontainer/vsc-run-pytests.sh

[group: 'build']
wasmbuild:
    #!/usr/bin/env bash
    ENABLE_TESTS=0 .devcontainer/vsc-run-zig-tests.sh

[group: 'build']
uibuild:
    #!/usr/bin/env bash
    .devcontainer/vsc-build-ui.sh


# Build wasm & ui; then start ui
[group: 'run']
gen +ARGS:
    uv run python -m pi_py.pi_digits {{ ARGS }}

# Build wasm & ui; then start ui
[group: 'run']
ui: pybuild wasmbuild uibuild uistart

[group: 'run']
uistart:
    cd pi_ui && pnpm start



[group: 'test']
flake8:
    uv run flake8 pi_py/

[group: 'test']
mypy:
    uv run mypy pi_py/

[group: 'test']
test: pytest wasmtest

[group: 'test']
pytest:
    ENABLE_TESTS=1 .devcontainer/vsc-run-pytests.sh

[group: 'test']
wasmtest:
    ENABLE_TESTS=1 .devcontainer/vsc-run-zig-tests.sh

# Produce test coverage xml and term reports
[group: 'test']
testcov:
    uv run pytest --cov=pi_py --cov-report xml:coverage.xml --cov-report term

[group: 'test']
tox:
    uv run tox
