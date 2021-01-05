#!/usr/bin/env bash

set -e

mkdir -p ./release

zip -r "extension.zip" "./build"
mv extension.* ./release
