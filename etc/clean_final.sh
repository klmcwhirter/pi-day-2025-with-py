#!/bin/sh

# Clean up final image by deleting stuff not needed at runtime.

rm -fr .containerignore
rm -fr .dockerignore
rm -fr pyproject.toml
rm -fr tox.ini
