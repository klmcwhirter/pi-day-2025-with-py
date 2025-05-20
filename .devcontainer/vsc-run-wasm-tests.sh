#!/usr/bin/env bash

root=$(readlink -f $(dirname $0))

source ${root}/vsc-utils.sh

echo $0: $(pwd)

echo_eval cd $(readlink -f ${root}/../pi_wasm)

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0
[ -z "$ASC_TARGET" ] && ASC_TARGET=release

echo_eval rm -fr build/

echo_eval pnpm install
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

echo_eval pnpm asbuild:${ASC_TARGET}:copy
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc


# run tests if enabled
echo "ENABLE_TESTS=$ENABLE_TESTS"

if [ "$ENABLE_TESTS" = "1" ]
then
    echo_eval pnpm astest
    rc=$?
    echo rc=${rc}
    [ $rc -ne 0 ] && exit $rc

fi

exit 0
