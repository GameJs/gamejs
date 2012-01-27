#!/bin/bash
# -----------------------------------------------------------------------------
# Wraps a game into one JavaScript file for efficient deployment.
# Optional argument `compress`:
#
#    $ ./bin/minify-app.sh /path/to/game/javascript/ [compress]
#
# REQUIRES RingoJs on path.
#
# Environment Variables
#
#   GAMEJS_HOME   (Optional) Ringo installation directory
#   JAVA_HOME    (Optional) JDK installation directory
# -----------------------------------------------------------------------------
# Many thanks to the RingoJs bash file writers.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$GAMEJS_HOME" ]; then
    source "$SCRIPT_DIR/find-gamejs-home.sh"
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

if [[ -z "$1" ]] ; then
 echo "Usage: $0 /path/to/game/javascript/ [compress]"
 echo "Creates app.min.js in the first argument directory."
 exit
fi

TEMP_WORKING=`mktemp -d /tmp/gamejs.XXXX`
WRAPPED_FILE=$1/app.min.js
EXEC_YABBLER="${java_cmd} -jar ${GAMEJS_HOME}/utils/rhino/js.jar ${GAMEJS_HOME}/utils/yabbler/yabbler.js"
EXEC_CLOSURE="cat"
if [ "$2" = "compress" ] ; then
   EXEC_CLOSURE="${java_cmd} -jar ${GAMEJS_HOME}/utils/closure-compiler/compiler.jar --jscomp_warning=internetExplorerChecks"
fi


rm -f ${WRAPPED_FILE}
${EXEC_YABBLER} -i $1 -o ${TEMP_WORKING}
${EXEC_YABBLER} -i ${GAMEJS_HOME}/lib/ -o ${TEMP_WORKING}
cat ${GAMEJS_HOME}/examples/skeleton/public/yabble.js | ${EXEC_CLOSURE} > ${WRAPPED_FILE}
find ${TEMP_WORKING} -type f -exec cat {} \; | ${EXEC_CLOSURE} >> ${WRAPPED_FILE}
rm -rf ${TEMP_WORKING}
echo "Wrote ${WRAPPED_FILE}"
