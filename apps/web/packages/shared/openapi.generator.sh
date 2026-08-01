#!/bin/bash
(
  # # Read the .env.local file, remove double quotes and comments, and extract the value of SWAGGER_JSON_DEV_ENDPOINT
  # SWAGGER_JSON_DEV_ENDPOINT=$(sed 's/"//g; s/#.*//' .env.local | grep -E "^SWAGGER_JSON_DEV_ENDPOINT=" | cut -d '=' -f 2-)
  #
  # SWAGGER_JSON_DEV_ENDPOINT=$1

  # Read the SWAGGER_JSON_DEV_ENDPOINT from the file and extract the URL
  SWAGGER_JSON_DEV_ENDPOINT=$(grep -E "^SWAGGER_JSON_DEV_ENDPOINT=" openapi.url.env | sed 's/SWAGGER_JSON_DEV_ENDPOINT=//; s/^"\(.*\)"$/\1/')

  # Check if SWAGGER_JSON_DEV_ENDPOINT is set
  if [ -z "$SWAGGER_JSON_DEV_ENDPOINT" ]; then
    echo "SWAGGER_JSON_DEV_ENDPOINT is not set."
    exit 1
  fi

  echo "USING SWAGGER_JSON_DEV_ENDPOINT: $SWAGGER_JSON_DEV_ENDPOINT"

  # Remove existing directories if they exist
  rm -rf src/api_temp
  rm -rf src/_api

  # Create the output directory
  mkdir -p src/_api

  # Generate code using openapi-generator-cli
  openapi-generator-cli \
    generate -i $SWAGGER_JSON_DEV_ENDPOINT \
    --skip-validate-spec \
    --generator-name typescript-axios \
    --output src/api_temp \
    --config openapi.config.json

  # Move generated files to _api directory
  cd src || exit
  cp api_temp/api.ts _api/
  cp api_temp/base.ts _api/
  cp api_temp/common.ts _api/
  cp api_temp/configuration.ts _api/
  cp api_temp/index.ts _api/

  # Remove temporary directory
  rm -rf api_temp
)
