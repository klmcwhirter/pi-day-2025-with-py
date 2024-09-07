#!/bin/sh

# Clean up final image by deleting stuff not needed at runtime.

rm -fr .containerignore
rm -fr .dockerignore
rm -fr pyproject.toml
rm -fr tox.ini

# Add .env file - continue from pythonbuild
echo 'VITE_SOLIDJS_VER='$(cat package.json | jq -cr '.dependencies["solid-js"]') | tee -a .env
