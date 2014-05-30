#!/bin/bash
# -----------------------------------------------------------------------------
# Creates the API documentation for GameJs.
#
# REQUIRES RingoJs on path.
#
# Environment Variables
#
#   GAMEJS_HOME   (Optional) Ringo installation directory
# -----------------------------------------------------------------------------
# Many thanks to the RingoJs bash file writers.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [ -z "$GAMEJS_HOME" ]; then
    source "$SCRIPT_DIR/utils/find-gamejs-home.sh"
    GAMEJS_HOME="$(find_gamejs_home "$0")"
fi

DOC_PATH=${GAMEJS_HOME}/doc/api/
SRC_PATH=${GAMEJS_HOME}/src/

rm -rf ${DOC_PATH}
ringo-doc -q --file-urls --source ${SRC_PATH} --directory ${DOC_PATH} --name 'GameJs API'
echo "Wrote ${DOC_PATH}"