#!/bin/bash

# Tests the stageConceptForProduction endpoint against a locally running MMT API
# (serverless-offline).
#
# Route (confirmed from local server startup log):
#   POST {BASE_URL}/dev/providers/:providerId/:conceptType/:nativeId/stage-for-production
#
# This is the UAT-side forwarding Lambda. Locally, local-env.sh points
# PRODUCTION_API_HOST back at the same local API, so a successful run writes the
# posted metadata into the local S3 concepts bucket (via the createOrUpdateConcept
# route) and returns a productionUrl built from PRODUCTION_MMT_HOST.
#
# Sources local-env.sh (if present) for shared local dev config.
#
# Usage:
#   ./stageForProduction.sh
#       Stages a default sample collection as nativeId "TestStageForProd".
#
#   ./stageForProduction.sh <nativeId> <path-to-json-file>
#       Stages the JSON body read from <path-to-json-file> under <nativeId>.
#
#   PROVIDER_ID=MMT_2 CONCEPT_TYPE=collections ./stageForProduction.sh TestCollection1 ./record.json

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/local-env.sh" ]; then
  # shellcheck source=local-env.sh
  source "$SCRIPT_DIR/local-env.sh"
fi

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://localhost:4001}}"
STAGE="${STAGE:-${STAGE_NAME:-dev}}"
# 'Bearer ABC-1' is a special test-mode token hardcoded in fetchProviders.js
# that grants access to MMT_1 and MMT_2 without needing real EDL/JWT auth.
AUTH_TOKEN="${AUTH_TOKEN:-Bearer ABC-1}"
PROVIDER_ID="${PROVIDER_ID:-MMT_1}"
CONCEPT_TYPE="${CONCEPT_TYPE:-collections}"

NATIVE_ID="${1:-TestStageForProd}"

if [ "$#" -ge 2 ]; then
  RECORD_FILE_ARG="$2"

  if [ ! -f "$RECORD_FILE_ARG" ]; then
    echo "FAIL: file not found: $RECORD_FILE_ARG"
    exit 1
  fi

  BODY="$(cat "$RECORD_FILE_ARG")"
else
  BODY=$(cat <<EOF
{
  "ShortName": "$NATIVE_ID",
  "Version": "1",
  "EntryTitle": "Sample concept staged for production by stageForProduction.sh"
}
EOF
)
fi

URL="${BASE_URL}/${STAGE}/providers/${PROVIDER_ID}/${CONCEPT_TYPE}/${NATIVE_ID}/stage-for-production"

echo "== POST $URL =="
echo

STATUS="$(
  curl -s -o /tmp/stage_for_production_response_body.json -w '%{http_code}' \
    -X POST "$URL" \
    -H "Authorization: $AUTH_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$BODY"
)"

echo "HTTP $STATUS"
echo "Response body:"
sed 's/^/  /' /tmp/stage_for_production_response_body.json
echo
rm -f /tmp/stage_for_production_response_body.json

if [ "$STATUS" != "200" ]; then
  exit 1
fi
