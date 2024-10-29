#!/bin/sh

touch step.out

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

# run tests if enabled
echo "ENABLE_TESTS=$ENABLE_TESTS"  | tee -a step.out

echo 'VITE_PYTHON_VER='$(python -c 'import platform; print(platform.python_version())') >/app/.env

if [ "$ENABLE_TESTS" = "1" ]
then
    set -o pipefail

    echo pip install -U pdm | tee step.out
    pip install -U pdm 2>&1 | tee -a step.out

    export PDM_CHECK_UPDATE=false
    echo pdm create --with default,dev| tee -a step.out
    pdm create --with default,dev 2>&1 | tee -a step.out

    echo pdm run tox | tee -a step.out
    pdm run tox 2>&1 | tee -a step.out
    rc=$?
    echo rc=${rc}

    if [ $rc -ne 0 ]
    then
        mv step.out python-tests.failed
        exit 0
    fi
    mv step.out python-tests.passed
else
    mv step.out python-tests.skipped
fi
