#!/bin/bash
# Creates JsDoc, requires RingoJs.org
rm -rf ./docs/api/
ringo-doc -q --file-urls --source ./lib/ --directory ./docs/api/ --name 'GameJs API'
