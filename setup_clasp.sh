#!/bin/sh

CLASP=$(cat << END
  {
    "scriptId": "$SCRIPT_ID",
    "rootDir": "./src"
  }
END
)

echo $CLASP > ~/.clasp.json
