#!/bin/bash
# Creates JsDoc, requires RingoJs.org

GAMEJS_DIR="${0%/*}"
cd ${GAMEJS_DIR}

rm -rf ./docs/api/
ringo-doc -q --file-urls --source ./lib/ --directory ./docs/api/ --name 'GameJs API'
