#!/usr/bin/env bash

source etc/vsc-utils.sh

echo $0: $(pwd)

echo_eval asdf plugin add pnpm
echo_eval asdf install pnpm latest
echo_eval asdf local pnpm latest

mkdir -p ~/.local/share/pnpm-store
pnpm config set store-dir ~/.local/share/pnpm-store

echo_eval cd pi_ui
echo_eval rm -fr node_modules/
echo_eval pnpm install
