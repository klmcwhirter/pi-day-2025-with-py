#!/bin/sh

ZIG_BUILD=zig-build
ZIG_TESTS=zig-tests

rm -f ${ZIG_BUILD}.out ${ZIG_TESTS}.out step.out

[ -z "$ENABLE_TESTS" ] && ENABLE_TESTS=0

echo "ZIGARCH=${ZIGARCH}" >step.out
echo "ZIGBIN=${ZIGBIN}" >>step.out

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

if [ -z "$ZIGARCH" ]
then
    echo "ZIGARCH cannot be empty" >>step.out

    clean_up $rc ${ZIG_BUILD}
    echo "zig build failed" >${ZIG_TESTS}.skipped
    exit 0
fi

zig_dir=`echo $ZIGARCH | sed 's/.tar.xz$//'`
echo mv ${zig_dir} $ZIGBIN | tee -a step.out
mv ${zig_dir} $ZIGBIN 2>&1 | tee -a step.out


echo "ENABLE_TESTS=$ENABLE_TESTS" | tee -a step.out
if [ "$ENABLE_TESTS" = "1" ]
then
    echo ${ZIGBIN}/zig build test -Dwasm=false --summary all -Doptimize=Debug --verbose 2>&1 | tee -a step.out
    ${ZIGBIN}/zig build test -Dwasm=false --summary all -Doptimize=Debug --verbose 2>&1 | tee -a step.out
    rc=$?
    echo test rc=${rc}
    clean_up $rc ${ZIG_TESTS}
else
    mv step.out ${ZIG_TESTS}.skipped
fi

echo rm -fr .zig-cache/ zig-out/ | tee step.out
rm -fr .zig-cache/ zig-out/ 2>&1 | tee -a step.out

echo ${ZIGBIN}/zig build copy-js --summary all -Dwasm --verbose
${ZIGBIN}/zig build copy-js --summary all -Dwasm --verbose 2>&1 | tee -a step.out
rc=$?
echo build rc=${rc}

if [ $rc -ne 0 ];then
    clean_up $rc ${ZIG_BUILD}
    echo "zig build failed" >>${ZIG_TESTS}.skipped
    exit 0
else
    clean_up $rc ${ZIG_BUILD}
fi
