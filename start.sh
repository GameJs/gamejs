#!/bin/bash
# Launches GameJs

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}
./app/ringojs/bin/ringo --packages app/packages/ ${GAMEJS_DIR}/app/main.js

