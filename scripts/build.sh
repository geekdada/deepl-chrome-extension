#!/usr/bin/env bash

set -e

mkdir -p ./release

cd build && zip -r  "../extension.zip" "./" && cd -
mv extension.* ./release
