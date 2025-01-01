#!/usr/bin/env bash
source etc/vsc-utils.sh

echo $0: $(pwd)

###
### PYTHON
###

# install python dependencies
echo_eval sudo apt-get update -y
echo_eval sudo apt-get install -y bzip2 libffi-dev liblzma-dev libncurses-dev libreadline-dev libsqlite3-dev tk-dev

echo $0: starting python install $(date)

echo_eval asdf plugin add python
echo_eval asdf install python 3.13.1
echo_eval asdf local python 3.13.1

echo $0: done python install $(date)

###
### PDM
###

echo $0: starting pdm install $(date)

export PDM_HOME=~/.local/share/pdm

echo_eval asdf plugin add pdm
echo_eval asdf install pdm latest
echo_eval asdf local pdm latest

echo $0: done pdm install $(date)


###
### PDM CREATE
###

echo $0: starting pdm create $(date)

echo_eval pdm create --with default,dev,jupyter

echo $0: done pdm create $(date)
