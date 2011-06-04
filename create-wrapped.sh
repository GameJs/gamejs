#!/bin/bash
# Creates ./gamejs-wrapped.js file for game use

TEMP_WORKING=/tmp/gjs-wrapped/
EXEC_YABBLER="java -jar ./utils/rhino/js.jar ./utils/yabbler/yabbler.js"
EXEC_CLOSURE="java -jar ./utils/closure-compiler/compiler.jar --jscomp_warning=internetExplorerChecks"

mkdir -p ${TEMP_WORKING}
rm -rf ${TEMP_WORKING}/*
${EXEC_YABBLER} -i ./lib/ -o ${TEMP_WORKING}
find ${TEMP_WORKING} -type f -exec cat {} \; | ${EXEC_CLOSURE} > ./examples/skeleton/public/gamejs-wrapped.js
rm -rf ${TEMP_WORKING}/*
