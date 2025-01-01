#!/usr/bin/env bash

source etc/vsc-utils.sh

workdir=$(pwd)

echo $0: ${workdir}

ZIGARCH=x86_64
ZIGVER=0.14.0-dev.2571+01081cc8e
ZIGDIR=zig-linux-$ZIGARCH-$ZIGVER
ZIGTAR=$ZIGDIR.tar.xz
# ZIGURL=https://ziglang.org/download/${ZIGVER}/  # only for released version
ZIGURL=https://ziglang.org/builds

if [ ! -h ~/.local/bin/zig ]
then
    if [ ! -d ~/.local/bin -o ! -d ~/.local/share ]
    then
        echo_eval mkdir -p ~/.local/bin ~/.local/share
    fi

    echo_eval cd ~/.local/share

    if [ ! -d ${ZIGDIR} ]
    then
        if [ -f ${ZIGTAR} ]
        then
            echo Reusing already retrieved tar file ...

            # NOP - fall through
        elif [ -f ${workdir}/${ZIGTAR} ]
        then
            # This is common for nightly builds as the zig project limits the # of times a build can be d/l-ed per day.
            # I have learned to d/l a local copy and place it in the workspace dir and use it instead.

            echo Reusing local tar file ...
            echo_eval cp ${workdir}/${ZIGTAR} ${ZIGTAR}
        else
            echo Retrieving ${ZIGTAR}
            echo_eval wget --quiet -O ${ZIGTAR} ${ZIGURL}/${ZIGTAR}
        fi

        echo_eval tar xf ${ZIGTAR}
    fi

    echo_eval cd ../bin
    echo_eval ln -fs ../share/${ZIGDIR}/zig .
else
    echo zig already installed ...
fi

ZLSARCH=x86_64
ZLSVER=0.14.0-dev.329+19421e0
ZLSDIR=zls-linux-${ZLSARCH}-${ZLSVER}
ZLSTAR=${ZLSDIR}.tar.xz
ZLSURL=https://builds.zigtools.org/

if [ ! -h ~/.local/bin/zls ]
then
    if [ ! -d ~/.local/bin -o ! -d ~/.local/share ]
    then
        echo_eval mkdir -p ~/.local/bin ~/.local/share
    fi

    echo_eval cd ~/.local/share

    if [ ! -d ${ZLSDIR} ]
    then
        if [ -f ${ZLSTAR} ]
        then
            echo Reusing already retrieved tar file ...

            # NOP - fall through
        elif [ -f ${workdir}/${ZLSTAR} ]
        then
            # This is common for nightly builds as the zig project limits the # of times a build can be d/l-ed per day.
            # I have learned to d/l a local copy and place it in the workspace dir and use it instead.

            echo Reusing local tar file ...
            echo_eval cp ${workdir}/${ZLSTAR} ${ZLSTAR}
        else
            echo Retrieving ${ZLSTAR}
            echo_eval wget --quiet -O ${ZLSTAR} ${ZLSURL}/${ZLSTAR}
        fi

        echo_eval mkdir -p ${ZLSDIR}
        echo_eval tar x -C ${ZLSDIR} -f ${ZLSTAR}
    fi

    echo_eval cd ../bin
    echo_eval ln -fs ../share/${ZLSDIR}/zls .
else
    echo zls already installed ...
fi


exit 0
