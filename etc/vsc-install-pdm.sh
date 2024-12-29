#!/usr/bin/env bash
source etc/vsc-utils.sh

echo $0: `pwd`

echo_eval asdf plugin add pdm
echo_eval asdf install pdm latest
echo_eval asdf local pdm latest
echo_eval pdm create --with default,dev
