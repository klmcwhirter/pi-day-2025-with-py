#!/usr/bin/env bash

source etc/vsc-utils.sh

echo $0: `pwd`

ZIGARCH=x86_64
ZIGVER=0.14.0-dev.2571+01081cc8e
ZIGDIR=zig-linux-$ZIGARCH-$ZIGVER
ZIGTAR=$ZIGDIR.tar.xz
# ZIGURL=https://ziglang.org/download/${ZIGVER}/  # only for released version
ZIGURL=https://ziglang.org/builds

if [ ! -f ~/.local/bin/zig ]
then
    if [ ! -d ~/.local/bin -o ! -d ~/.local/share ]
    then
        echo_eval mkdir -p ~/.local/share ~/.local/bin && cd ~/.local/share
    fi

    if [ ! -d ${ZIGDIR} ]
    then
        echo Retrieving ${ZIGTAR}
        echo_eval wget --progress=none -O ${ZIGTAR} ${ZIGURL}/${ZIGTAR} && tar xf ${ZIGTAR}
    fi
    echo_eval cd ../bin && ln -fs ../share/${ZIGDIR}/zig .
else
    echo zig already installed ...
fi

exit 0
