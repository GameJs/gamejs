#!/bin/bash
# Launches GameJs

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}
./server/ringojs/bin/ringo --modules server/packages/ --modules examples/ ${GAMEJS_DIR}/server/main.js
