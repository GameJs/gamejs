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
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$GAMEJS_HOME" ]; then
    source "$SCRIPT_DIR/find-gamejs-home.sh"
    GAMEJS_HOME="$(find_gamejs_home "$0")"

    if [ "$OSTYPE" == 'cygwin' ]; then
		GAMEJS_HOME=`cygpath -m ${GAMEJS_HOME}`
	fi
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

TEMP_WORKING=`mktemp -d /tmp/gamejs.XXXX`

if [ "$OSTYPE" == 'cygwin' ]; then
  TEMP_WORKING=`cygpath -m ${TEMP_WORKING}`
fi

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
