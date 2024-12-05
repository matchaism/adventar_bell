#!/bin/sh

CLASP=$(cat << END
  {
    "scriptId": "$SCRIPT_ID"
  }
END
)

echo $CLASP > ~/.clasp.json
