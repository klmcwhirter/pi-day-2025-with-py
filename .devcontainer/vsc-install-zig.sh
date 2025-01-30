#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

workdir=$(pwd)

echo $0: ${workdir} ...

ZIGARCH=x86_64
ZIGVER=0.14.0-dev.2571+01081cc8e
ZIGDIR=zig-linux-$ZIGARCH-$ZIGVER
ZIGTAR=$ZIGDIR.tar.xz
# ZIGURL=https://ziglang.org/download/${ZIGVER}/  # only for released version
ZIGURL=https://ziglang.org/builds

install_bin zig "${ZIGDIR}" "${ZIGURL}" "${ZIGTAR}" 1

ZLSARCH=x86_64
ZLSVER=0.14.0-dev.329+19421e0
ZLSDIR=zls-linux-${ZLSARCH}-${ZLSVER}
ZLSTAR=${ZLSDIR}.tar.xz
ZLSURL=https://builds.zigtools.org/

install_bin zls "${ZLSDIR}" "${ZLSURL}" "${ZLSTAR}" 0

echo $0: ${workdir} ... done

exit 0
