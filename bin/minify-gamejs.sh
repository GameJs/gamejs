#!/bin/bash
# -----------------------------------------------------------------------------
# Create wrapped GameJs file.
#
# Environment Variables
#
#   GAMEJS_HOME   (Optional) Ringo installation directory
#   JAVA_HOME    (Optional) JDK installation directory
# -----------------------------------------------------------------------------
# Many thanks to the RingoJs bash file writers.

#
# find_ringo_home - mostly an emulation of GNU's `readlink -f`
#
function find_gamejs_home() {
    # save original working directory
    ORIG_PWD="$(pwd -P)"

    # walk the links! we cd into the dir of the target binary, read the link,
    # make this link our new target, and start over. we stop as soon as the
    # target is no link anymore.
    T="$1"
    while true; do
        cd "$(dirname "$T")"
        T="$(basename "$T")"
        if [ ! -L "$T" ]; then break; fi
        T="$(readlink "$T")"
    done

    # the final target is in bin/, change to parent and echo as home
    cd ..
    echo "$(pwd -P)"

    # restore original working directory
    cd "$ORIG_PWD"
}

if [ -z "$GAMEJS_HOME" ]; then
    GAMEJS_HOME="$(find_gamejs_home "$0")"
fi

if [ -z "$JAVA_HOME" ] ; then
    java_cmd='java'
else
    if [ "$OSTYPE" == 'cygwin' ]; then
        java_cmd="`cygpath -u "$JAVA_HOME"`/bin/java"
    else
        java_cmd="$JAVA_HOME/bin/java"
    fi
fi

TEMP_WORKING=`mktemp --directory`
EXEC_YABBLER="${java_cmd} -jar ${GAMEJS_HOME}/utils/rhino/js.jar ${GAMEJS_HOME}/utils/yabbler/yabbler.js"
EXEC_CLOSURE="cat"
OUTPUT_FILE="${GAMEJS_HOME}/gamejs.min.js"
OUTPUT_FILE_SKELETON="${GAMEJS_HOME}/examples/skeleton/public/gamejs.min.js"
if [ "$1" = "compress" ] ; then
   EXEC_CLOSURE="${java_cmd} -jar ${GAMEJS_HOME}/utils/closure-compiler/compiler.jar --jscomp_warning=internetExplorerChecks"
fi

${EXEC_YABBLER} -i ${GAMEJS_HOME}/lib/ -o ${TEMP_WORKING}
find ${TEMP_WORKING} -type f -exec cat {} \; | ${EXEC_CLOSURE} > ${OUTPUT_FILE}
cp ${OUTPUT_FILE} ${OUTPUT_FILE_SKELETON}
rm -rf ${TEMP_WORKING}
echo "Wrote ${OUTPUT_FILE}"
