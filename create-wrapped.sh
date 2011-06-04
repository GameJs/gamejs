#!/bin/bash
# Creates ./gamejs-wrapped.js file for game use

TEMP_WORKING=/tmp/gjs-wrapped/

mkdir ${TEMP_WORKING}
rm -rf ${TEMP_WORKING}/*
java -jar ./yabbler/jars/js.jar ./yabbler/yabbler.js -i ./lib/ -o ${TEMP_WORKING}
find ${TEMP_WORKING} -type f -exec cat {} \; > ./examples/skeleton/public/gamejs-wrapped.js
rm -rf ${TEMP_WORKING}/*
