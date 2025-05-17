#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

echo $0: $(pwd)

if [ $(which pnpm >/dev/null 2>&1) -neq 0]
then
    echo "installing pnpm ..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -

    mkdir -p ~/.local/share/pnpm-store
    pnpm config set store-dir ~/.local/share/pnpm-store
fi

echo_eval cd pi_ui
echo_eval rm -fr node_modules/
echo_eval pnpm install
