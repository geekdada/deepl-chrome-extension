#!/usr/bin/env bash

set -e

mkdir -p ./release

zip -r "extension.${npm_package_version}.zip" "./build"
mv extension.* ./release
