#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

workdir=$(pwd)

echo $0: ${workdir} ...

set -e

ARCH="x86_64"

# WASMTIME_VERSION=v28.0.0 WASM_TOOLS_VERSION=1.223.0 

WASMTIME_VERSION="${WASMTIME_VERSION:-"v32.0.0"}"
WTTAR=wasmtime-${WASMTIME_VERSION}-${ARCH}-linux.tar.xz
WTDIR=${WTTAR%.tar.xz}
WTURL=https://github.com/bytecodealliance/wasmtime/releases/download/${WASMTIME_VERSION}

install_bin wasmtime "${WTDIR}" "${WTURL}" "${WTTAR}" 1

WASM_TOOLS_VERSION="${WASM_TOOLS_VERSION:-"1.230.0"}"
WTOOLSTAR=wasm-tools-${WASM_TOOLS_VERSION}-${ARCH}-linux.tar.gz
WTOOLSDIR=${WTOOLSTAR%.tar.gz}
WTOOLSURL=https://github.com/bytecodealliance/wasm-tools/releases/download/v${WASM_TOOLS_VERSION}

install_bin wasm-tools "${WTOOLSDIR}" "${WTOOLSURL}" "${WTOOLSTAR}" 1

echo $0: ${workdir} ... done
