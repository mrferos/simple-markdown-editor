#!/bin/bash

PLATFORMS=(darwin linux win32);
for platform in "${PLATFORMS[@]}"
do
    echo $platform
    electron-packager . "Simple Markdown Editor" --platform=$platform --arch=x64 --version=0.35.0 --out=build/
done