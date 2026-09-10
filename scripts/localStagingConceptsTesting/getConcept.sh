#!/bin/bash

# Tests the getConcept endpoint (fetch a single staged concept by recordId)
# against a locally running MMT API (serverless-offline).
#
# Route:
#   GET {BASE_URL}/dev/staged/:conceptType/:recordId
#
# This route is EDL-authenticated (real browser user). Staged concepts have no
# provider dimension, so there is no per-user provider check. It does NOT use
# the Staging-Api-Key - only createOrUpdateStagedConcept (PUT) does.
#
# The script seeds one concept via the machine-to-machine PUT route, captures
# the generated recordId, then exercises the GET route against it.
#
# Sources local-env.sh (if present) for shared local dev config.
#
# Usage:
#   ./getConcept.sh
#   CONCEPT_TYPE=collections ./getConcept.sh

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

# Args: description, expected_status, concept_type, record_id
run_test() {
  local description="$1"
  local expected_status="$2"
  local concept_type="$3"
  local record_id="$4"

  local url="${BASE_URL}/${STAGE}/staged/${concept_type}/${record_id}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/get_concept_response_body.json -w '%{http_code}' \
      -X GET "$url" -H "Authorization: $AUTH_TOKEN"
  )"

  if [ "$actual_status" = "$expected_status" ]; then
    echo "PASS: $description (got $actual_status)"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: $description (expected $expected_status, got $actual_status)"
    echo "  Response body:"
    sed 's/^/    /' /tmp/get_concept_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Seeding a concept to retrieve =="
SEED_STATUS="$(
  curl -s -o /tmp/get_concept_seed.json -w '%{http_code}' \
    -X PUT "${BASE_URL}/${STAGE}/staged/${CONCEPT_TYPE}" \
    -H "Staging-Api-Key: $STAGING_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"ShortName":"getConcept.sh seed","Version":"1"}'
)"

if [ "$SEED_STATUS" != "200" ]; then
  echo "FAIL: could not seed a concept (HTTP $SEED_STATUS)"
  sed 's/^/  /' /tmp/get_concept_seed.json
  exit 1
fi

RECORD_ID="$(jq -r '.recordId' /tmp/get_concept_seed.json)"
echo "  seeded recordId: $RECORD_ID"
echo

echo "== Testing getConcept endpoint at ${BASE_URL}/${STAGE}/staged/... =="
echo

run_test "successful get by recordId" "200" "$CONCEPT_TYPE" "$RECORD_ID"
run_test "invalid conceptType" "400" "invalid-type" "$RECORD_ID"
run_test "nonexistent recordId" "404" "$CONCEPT_TYPE" "does-not-exist"

echo
echo "== Results: $PASS_COUNT passed, $FAIL_COUNT failed =="

rm -f /tmp/get_concept_response_body.json /tmp/get_concept_seed.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
