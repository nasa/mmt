#!/bin/bash

# Seeds sample concepts into local S3 via the createOrUpdateConcept endpoint,
# so there's data available to list/retrieve/delete when testing locally
# (e.g. with test-get-concepts-endpoint.sh).
#
# Route (confirmed from local server startup log):
#   PUT {BASE_URL}/dev/providers/:providerId/:conceptType/:nativeId
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, STAGING_API_KEY, etc). Override any of these by
# exporting them yourself before running this script.
#
# Usage:
#   ./postConcepts.sh
#       Seeds the default sample concepts (TestCollection1/2/3) defined below.
#
#   ./postConcepts.sh <nativeId> <path-to-json-file>
#       Seeds a single concept using <nativeId> and the JSON body read from
#       <path-to-json-file>, e.g.:
#
#         ./postConcepts.sh TestCollection1 ./record.json
#
#   PROVIDER_ID=MMT_2 CONCEPT_TYPE=collections ./postConcepts.sh TestCollection1 ./record.json

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/local-env.sh" ]; then
  # shellcheck source=local-env.sh
  source "$SCRIPT_DIR/local-env.sh"
fi

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://localhost:4001}}"
STAGE="${STAGE:-${STAGE_NAME:-dev}}"
STAGING_API_KEY="${STAGING_API_KEY:-local-staging-api-key}"
# 'Bearer ABC-1' is a special test-mode token hardcoded in fetchProviders.js
# that grants access to MMT_1 and MMT_2 without needing real EDL/JWT auth.
AUTH_TOKEN="${AUTH_TOKEN:-Bearer ABC-1}"
PROVIDER_ID="${PROVIDER_ID:-MMT_1}"
CONCEPT_TYPE="${CONCEPT_TYPE:-collections}"

# nativeId:JSON-body pairs to seed. Add/edit as needed.
# The handler doesn't schema-validate the body, so any valid JSON works here -
# these are just enough to look like plausible concepts.
NATIVE_IDS=(
  "TestCollection1"
  "TestCollection2"
  "TestCollection3"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

seed_concept() {
  local native_id="$1"
  local body="$2"

  local url="${BASE_URL}/${STAGE}/providers/${PROVIDER_ID}/${CONCEPT_TYPE}/${native_id}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/seed_concept_response_body.json -w '%{http_code}' \
      -X PUT "$url" \
      -H "Staging-Api-Key: $STAGING_API_KEY" \
      -H "Authorization: $AUTH_TOKEN" \
      -H "Content-Type: application/json" \
      -d "$body"
  )"

  if [ "$actual_status" = "200" ]; then
    echo "OK   ($actual_status): $native_id"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo "FAIL ($actual_status): $native_id"
    echo "  Response body:"
    sed 's/^/    /' /tmp/seed_concept_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Seeding concepts at ${BASE_URL}/${STAGE}/providers/${PROVIDER_ID}/${CONCEPT_TYPE}/... =="
echo

# If a nativeId and a JSON file path are given as positional args, seed just
# that one concept from the file instead of the default sample list.
if [ "$#" -ge 2 ]; then
  NATIVE_ID_ARG="$1"
  RECORD_FILE_ARG="$2"

  if [ ! -f "$RECORD_FILE_ARG" ]; then
    echo "FAIL: file not found: $RECORD_FILE_ARG"
    exit 1
  fi

  body="$(cat "$RECORD_FILE_ARG")"
  seed_concept "$NATIVE_ID_ARG" "$body"

  echo
  echo "== Results: $SUCCESS_COUNT seeded, $FAIL_COUNT failed =="

  rm -f /tmp/seed_concept_response_body.json

  if [ "$FAIL_COUNT" -ne 0 ]; then
    exit 1
  fi

  exit 0
fi

for native_id in "${NATIVE_IDS[@]}"; do
  body=$(cat <<EOF
{
  "ShortName": "$native_id",
  "Version": "1",
  "EntryTitle": "Sample concept for $native_id",
  "Description": "Seeded locally by postConcepts.sh for testing"
}
EOF
)
  seed_concept "$native_id" "$body"
done

echo
echo "== Results: $SUCCESS_COUNT seeded, $FAIL_COUNT failed =="

rm -f /tmp/seed_concept_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi