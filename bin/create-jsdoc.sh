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

rm -rf ${GAMEJS_HOME}/docs/api/
ringo-doc -q --file-urls --source ${GAMEJS_HOME}/lib/ --directory ${GAMEJS_HOME}/docs/api/ --name 'GameJs API'
