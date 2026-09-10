#!/bin/bash

# Seeds sample concepts into local S3 by calling the createOrUpdateStagedConcept
# endpoint directly, so there's data available for getConcepts.sh, getConcept.sh
# and deleteConcept.sh to list/retrieve/delete.
#
# Route (confirmed from local server startup log):
#   PUT {BASE_URL}/dev/staged/:conceptType
#
# A staged concept has no caller-supplied identity: createOrUpdateStagedConcept
# generates a `recordId` (UUID) and returns `{ conceptType, recordId }`. This
# script prints each generated recordId so you can feed one to getConcept.sh /
# deleteConcept.sh.
#
# This is a direct exercise of the machine-to-machine PUT route, authenticated
# with the Staging-Api-Key header. It is NOT stageForProduction.sh: that script
# POSTs to /stage-for-production, which runs the UAT forwarding Lambda (EDL auth
# + a server-side call back to this same PUT route).
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, STAGING_API_KEY, etc). Override any of these by
# exporting them yourself before running this script.
#
# Usage:
#   ./postConcepts.sh
#       Seeds three sample concepts and prints their recordIds.
#
#   ./postConcepts.sh <label> <path-to-json-file>
#       Seeds a single concept from <path-to-json-file> (<label> is only used in
#       log output), e.g.:
#
#         ./postConcepts.sh MyCollection ./record.json
#
#   CONCEPT_TYPE=collections ./postConcepts.sh MyCollection ./record.json

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/local-env.sh" ]; then
  # shellcheck source=local-env.sh
  source "$SCRIPT_DIR/local-env.sh"
fi

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://localhost:4001}}"
STAGE="${STAGE:-${STAGE_NAME:-dev}}"
STAGING_API_KEY="${STAGING_API_KEY:-local-staging-api-key}"
CONCEPT_TYPE="${CONCEPT_TYPE:-collections}"

# Labels to seed (only used for log output / the sample body). Add/edit as needed.
LABELS=(
  "TestCollection1"
  "TestCollection2"
  "TestCollection3"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

seed_concept() {
  local label="$1"
  local body="$2"

  local url="${BASE_URL}/${STAGE}/staged/${CONCEPT_TYPE}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/seed_concept_response_body.json -w '%{http_code}' \
      -X PUT "$url" \
      -H "Staging-Api-Key: $STAGING_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$body"
  )"

  if [ "$actual_status" = "200" ]; then
    local record_id
    record_id="$(jq -r '.recordId' /tmp/seed_concept_response_body.json)"
    echo "OK   ($actual_status): $label -> recordId $record_id"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    echo "FAIL ($actual_status): $label"
    echo "  Response body:"
    sed 's/^/    /' /tmp/seed_concept_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Seeding concepts at ${BASE_URL}/${STAGE}/staged/${CONCEPT_TYPE} =="
echo

# If a label and a JSON file path are given as positional args, seed just that
# one concept from the file instead of the default sample list.
if [ "$#" -ge 2 ]; then
  LABEL_ARG="$1"
  RECORD_FILE_ARG="$2"

  if [ ! -f "$RECORD_FILE_ARG" ]; then
    echo "FAIL: file not found: $RECORD_FILE_ARG"
    exit 1
  fi

  body="$(cat "$RECORD_FILE_ARG")"
  seed_concept "$LABEL_ARG" "$body"

  echo
  echo "== Results: $SUCCESS_COUNT seeded, $FAIL_COUNT failed =="

  rm -f /tmp/seed_concept_response_body.json

  if [ "$FAIL_COUNT" -ne 0 ]; then
    exit 1
  fi

  exit 0
fi

for label in "${LABELS[@]}"; do
  body=$(cat <<EOF
{
  "ShortName": "$label",
  "Version": "1",
  "EntryTitle": "Sample concept for $label",
  "Description": "Seeded locally by postConcepts.sh for testing"
}
EOF
)
  seed_concept "$label" "$body"
done

echo
echo "== Results: $SUCCESS_COUNT seeded, $FAIL_COUNT failed =="

rm -f /tmp/seed_concept_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
