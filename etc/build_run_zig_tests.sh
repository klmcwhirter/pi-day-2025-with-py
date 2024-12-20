#!/usr/bin/env bash

ZIG_BUILD=zig-build
ZIG_TESTS=zig-tests

rm -f ${ZIG_BUILD}.out ${ZIG_TESTS}.out step.out

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

echo "ZIGARCH=${ZIGARCH}" | tee -a step.out
echo "ZIGBIN=${ZIGBIN}" | tee -a step.out

function clean_up
{
    rc=$1
    filename=$2

    if [ $rc -ne 0 ]
    then
        mv step.out ${filename}.failed
    else
        mv step.out ${filename}.passed
    fi
}

set -o pipefail

echo "ENABLE_TESTS=$ENABLE_TESTS" | tee -a step.out
if [ "$ENABLE_TESTS" = "1" ]
then
    source ~/.bashrc  # pick up wasmtime config

    echo ${ZIGBIN}/zig build test -Dwasm=true -Dwasi=true --summary all --verbose 2>&1 | tee -a step.out
    ${ZIGBIN}/zig build test -Dwasm=true -Dwasi=true --summary all --verbose 2>&1 | tee -a step.out
    rc=$?
    echo test rc=${rc}
    clean_up $rc ${ZIG_TESTS}
else
    mv step.out ${ZIG_TESTS}.skipped
fi

# Prepare to rebuild after running tests
echo rm -fr .zig-cache/ zig-out/ | tee -a step.out
rm -fr .zig-cache/ zig-out/ 2>&1 | tee -a step.out

echo ${ZIGBIN}/zig build copy-js --summary all -Dwasm --verbose | tee -a step.out
${ZIGBIN}/zig build copy-js --summary all -Dwasm --verbose 2>&1 | tee -a step.out
rc=$?
echo build rc=${rc}

if [ $rc -ne 0 ];then
    clean_up $rc ${ZIG_BUILD}
    # echo "zig build failed" >>${ZIG_TESTS}.skipped
    exit 1
else
    clean_up $rc ${ZIG_BUILD}
fi

echo ${ZIGBIN}/zig build gen-wat --summary all -Dwasm --verbose | tee -a step.out
${ZIGBIN}/zig build gen-wat --summary all -Dwasm --verbose 2>&1 | tee -a step.out
rc=$?
echo build rc=${rc}

if [ $rc -ne 0 ];then
    clean_up $rc ${ZIG_BUILD}
    # echo "zig build failed" >>${ZIG_TESTS}.skipped
    exit 1
else
    clean_up $rc ${ZIG_BUILD}
fi
