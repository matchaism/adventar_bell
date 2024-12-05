#!/bin/sh

CLASPRC=$(cat << EOF
  {
    "token": {
      "access_token": "$ACCESS_TOKEN",
      "refresh_token": "$REFRESH_TOKEN",
      "scope": "$SCOPE",
      "token_type": "$TOKEN_TYPE",
      "id_token": "$ID_TOKEN",
      "expiry_date": $EXPIRY_DATE
    },
    "oauth2ClientSettings": {
      "clientId": "$CLIENT_ID",
      "clientSecret": "$CLIENT_SECRET",
      "redirectUri": "$REDIRECT_URI"
    },
    "isLocalCreds": $IS_LOCAL_CREDS
  }
EOF
)

echo $CLASPRC > ~/.clasprc.json
