#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

echo $0: $(pwd)

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

# run tests if enabled
echo "ENABLE_TESTS=$ENABLE_TESTS"

if ! grep -E '^VITE_PYTHON_VER=' pi_ui/.env >/dev/null 2>&1
then
    echo 'VITE_PYTHON_VER='$(pdm run python -c 'import platform; print(platform.python_version())') | tee -a pi_ui/.env
fi

if [ "$ENABLE_TESTS" = "1" ]
then
    echo_eval pdm run create
    echo_eval pdm run pytest
    rc=$?
    echo rc=${rc}
fi
