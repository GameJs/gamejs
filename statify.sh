#!/bin/bash
# Launches GameJs

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}

ringo ${GAMEJS_DIR}/app/statify.js "${1}" "${2}"
