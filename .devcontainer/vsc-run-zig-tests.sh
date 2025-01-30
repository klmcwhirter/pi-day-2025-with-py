#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

echo $0: $(pwd)

echo_eval cd pi_wasm

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

# run tests if enabled
echo "ENABLE_TESTS=$ENABLE_TESTS"

if [ "$ENABLE_TESTS" = "1" ]
then
    echo_eval zig build test -Dwasm=true -Dwasi=true --summary all --verbose
    rc=$?
    echo rc=${rc}
    [ $rc -ne 0 ] && exit $rc

fi

echo_eval rm -fr .zig-cache/ zig-out/

echo_eval zig build copy-js --summary all -Dwasm --verbose
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

echo_eval zig build gen-wat --summary all -Dwasm --verbose
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

exit 0
