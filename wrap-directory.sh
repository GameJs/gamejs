#!/bin/bash
# Creates output of wrapped files for deployment

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}

if [[ -z "$1" ]] ; then
 echo "Usage: $0 directory-to-JS-files/ [compress]"
 echo "Will create gjs-app-wrapped.js in the given directory."
 exit
fi

TEMP_WORKING=/tmp/gjs-wrapped/
WRAPPED_FILE=$1/gjs-app-wrapped.js
EXEC_YABBLER="java -jar ./utils/rhino/js.jar ./utils/yabbler/yabbler.js"
EXEC_CLOSURE="cat"
if [ "$2" = "compress" ] ; then
   EXEC_CLOSURE="java -jar ./utils/closure-compiler/compiler.jar --jscomp_warning=internetExplorerChecks"
fi

mkdir -p ${TEMP_WORKING}
rm -rf ${TEMP_WORKING}/*
rm ${WRAPPED_FILE}
${EXEC_YABBLER} -i $1 -o ${TEMP_WORKING}
${EXEC_YABBLER} -i ./lib/ -o ${TEMP_WORKING}
cat ./examples/skeleton/public/yabble.js | ${EXEC_CLOSURE} > ${WRAPPED_FILE}
find ${TEMP_WORKING} -type f -exec cat {} \; | ${EXEC_CLOSURE} >> ${WRAPPED_FILE}
rm -rf ${TEMP_WORKING}/*
