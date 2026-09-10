#!/bin/bash

# Tests the deleteConcept endpoint against a locally running MMT API
# (serverless-offline).
#
# Route:
#   DELETE {BASE_URL}/dev/staged/:conceptType/:recordId
#
# This route is EDL-authenticated (real browser user). Staged concepts have no
# provider dimension, so there is no per-user provider check. It does NOT use
# the Staging-Api-Key. The seed step below uses PUT createOrUpdateConcept,
# which IS the machine-to-machine route and still needs the Staging-Api-Key.
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, STAGING_API_KEY, etc). Override any of these by
# exporting them yourself before running this script.
#
# This script seeds its own throwaway concept via PUT (capturing the generated
# recordId) before testing delete, so it doesn't consume data other scripts
# may rely on.
#
# Usage:
#   ./deleteConcept.sh
#   CONCEPT_TYPE=collections ./deleteConcept.sh

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/local-env.sh" ]; then
  # shellcheck source=local-env.sh
  source "$SCRIPT_DIR/local-env.sh"
fi

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://localhost:4001}}"
STAGE="${STAGE:-${STAGE_NAME:-dev}}"
STAGING_API_KEY="${STAGING_API_KEY:-local-staging-api-key}"
AUTH_TOKEN="${AUTH_TOKEN:-Bearer ABC-1}"
CONCEPT_TYPE="${CONCEPT_TYPE:-collections}"

PASS_COUNT=0
FAIL_COUNT=0

# Seeds a throwaway concept via the machine-to-machine PUT route and echoes the
# generated recordId.
seed_concept() {
  local url="${BASE_URL}/${STAGE}/staged/${CONCEPT_TYPE}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/delete_concept_seed_body.json -w '%{http_code}' \
      -X PUT "$url" \
      -H "Staging-Api-Key: $STAGING_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"ShortName":"deleteConcept.sh seed","Version":"1"}'
  )"

  if [ "$actual_status" != "200" ]; then
    echo "FAIL: setup - could not seed a concept (got $actual_status)"
    echo "  Response body:"
    sed 's/^/    /' /tmp/delete_concept_seed_body.json
    rm -f /tmp/delete_concept_seed_body.json
    exit 1
  fi

  jq -r '.recordId' /tmp/delete_concept_seed_body.json
  rm -f /tmp/delete_concept_seed_body.json
}

# Runs a curl DELETE request and asserts the response status code.
# Args: description, expected_status, concept_type, record_id
run_test() {
  local description="$1"
  local expected_status="$2"
  local concept_type="$3"
  local record_id="$4"

  local url="${BASE_URL}/${STAGE}/staged/${concept_type}/${record_id}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/delete_concept_response_body.json -w '%{http_code}' \
      -X DELETE "$url" -H "Authorization: $AUTH_TOKEN"
  )"

  if [ "$actual_status" = "$expected_status" ]; then
    echo "PASS: $description (got $actual_status)"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: $description (expected $expected_status, got $actual_status)"
    echo "  Response body:"
    sed 's/^/    /' /tmp/delete_concept_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Testing deleteConcept endpoint at ${BASE_URL}/${STAGE}/staged/... =="
echo

echo "-- seeding throwaway concept for delete tests --"
RECORD_ID="$(seed_concept)"
echo "  seeded recordId: $RECORD_ID"
echo

# Negative-path tests first: these must NOT delete the seeded concept.
run_test \
  "invalid conceptType" \
  "400" \
  "invalid-type" "$RECORD_ID"

# S3's DeleteObject doesn't error on a missing key, so deleteConcept is
# idempotent - deleting a recordId that was never seeded still returns 204.
run_test \
  "nonexistent recordId (delete is idempotent via S3)" \
  "204" \
  "$CONCEPT_TYPE" "record-that-does-not-exist"

# Successful delete, then confirm re-deleting is still a 204 (idempotent).
run_test \
  "successful delete" \
  "204" \
  "$CONCEPT_TYPE" "$RECORD_ID"

run_test \
  "delete again after already deleted (still 204, idempotent)" \
  "204" \
  "$CONCEPT_TYPE" "$RECORD_ID"

echo
echo "== Results: $PASS_COUNT passed, $FAIL_COUNT failed =="

rm -f /tmp/delete_concept_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
