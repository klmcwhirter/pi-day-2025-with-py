#!/usr/bin/env bash

source etc/vsc-utils.sh

echo $0: `pwd`

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

# run tests if enabled
echo "ENABLE_TESTS=$ENABLE_TESTS"

if ! grep -E '^VITE_PYTHON_VER=' .env
then
    echo 'VITE_PYTHON_VER='$(python -c 'import platform; print(platform.python_version())') | tee -a pi_ui/.env
fi

if [ "$ENABLE_TESTS" = "1" ]
then
    /bin/sh -c etc/vsc-install-pdm.sh

    echo_eval pdm run tox
    rc=$?
    echo rc=${rc}
fi
