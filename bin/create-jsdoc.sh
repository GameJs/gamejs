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
    source "$SCRIPT_DIR/find-gamejs-home.sh"
    GAMEJS_HOME="$(find_gamejs_home "$0")"
fi

rm -rf ${GAMEJS_HOME}/docs/api/
ringo-doc -q --file-urls --source ${GAMEJS_HOME}/lib/ --directory ${GAMEJS_HOME}/docs/api/ --name 'GameJs API'
