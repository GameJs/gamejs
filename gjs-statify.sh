#!/bin/bash
# Launches GameJs

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}
./server/ringojs/bin/ringo --packages server/packages/ ${GAMEJS_DIR}/server/statify.js "${1}" "${2}"
