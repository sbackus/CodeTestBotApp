#!/bin/bash

set -e

ember build --environment production
git add dist
git commit -m "Build for production deploy."
