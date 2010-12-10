#!/bin/bash
# Launches GameJs

GAMEJS_DIR="${0%/*}"
cd $GAMEJS_DIR

ringo app/main.js
