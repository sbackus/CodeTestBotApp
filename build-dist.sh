#!/bin/bash

if ! `git diff --quiet`; then
    echo "You have unstaged local changes. Commit or stash them before running the build."
    exit
fi

if ! `git diff --cached --quiet`; then
    echo "You have uncommitted staged changes. Commit or stash them before running the build."
    exit
fi

set -e
bower cache clean
bower install
ember build --environment production
git add dist
git commit -m "Build for production deploy."
