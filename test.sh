#!/bin/bash
set -e

echo "Starting application and API servers."
npm run start >servers.log 2>&1 &
START_PID="$!"

function cleanup {
  rkill -2 "$START_PID" >/dev/null
}

trap cleanup EXIT

echo "Building."

npm run build:css &
CSS_PID="$!"

npm run build:js &
JS_PID="$!"

wait "$CSS_PID" "$JS_PID"

echo "Running tests."

npm test
