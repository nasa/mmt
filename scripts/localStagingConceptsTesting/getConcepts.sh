#!/bin/bash

# Tests the getConcepts endpoint (list staged concepts for a conceptType)
# against a locally running MMT API (serverless-offline).
#
# Route (confirmed from local server startup log):
#   GET {BASE_URL}/dev/staged/:conceptType
#
# This route is EDL-authenticated (real browser user). Staged concepts have no
# provider dimension, so there is no per-user provider check - any authenticated
# user may list them. It does NOT use the Staging-Api-Key.
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, etc). Override any of these by exporting them
# yourself before running this script.
#
# Usage:
#   ./getConcepts.sh
#   CONCEPT_TYPE=collections ./getConcepts.sh

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/local-env.sh" ]; then
  # shellcheck source=local-env.sh
  source "$SCRIPT_DIR/local-env.sh"
fi

BASE_URL="${BASE_URL:-${API_BASE_URL:-http://localhost:4001}}"
STAGE="${STAGE:-${STAGE_NAME:-dev}}"
# 'Bearer ABC-1' is a special test-mode token hardcoded in fetchProviders.js.
# The get/list/delete routes no longer call fetchProviders, but the local API
# runner ignores auth anyway; the header is kept for realism.
AUTH_TOKEN="${AUTH_TOKEN:-Bearer ABC-1}"
CONCEPT_TYPE="${CONCEPT_TYPE:-collections}"

PASS_COUNT=0
FAIL_COUNT=0

# Args: description, expected_status, concept_type
run_test() {
  local description="$1"
  local expected_status="$2"
  local concept_type="$3"

  local url="${BASE_URL}/${STAGE}/staged/${concept_type}"

  local actual_status
  actual_status="$(
    curl -s -o /tmp/get_concepts_response_body.json -w '%{http_code}' \
      -X GET "$url" -H "Authorization: $AUTH_TOKEN"
  )"

  if [ "$actual_status" = "$expected_status" ]; then
    echo "PASS: $description (got $actual_status)"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo "FAIL: $description (expected $expected_status, got $actual_status)"
    echo "  Response body:"
    sed 's/^/    /' /tmp/get_concepts_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Testing getConcepts endpoint at ${BASE_URL}/${STAGE}/staged/... =="
echo

run_test "successful list" "200" "$CONCEPT_TYPE"

echo "  Records:"
jq -r '.[] | "    \(.recordId)  \(.lastModified)"' /tmp/get_concepts_response_body.json 2>/dev/null \
  || echo "    (response was not a JSON array)"

run_test "invalid conceptType" "400" "invalid-type"

echo
echo "== Results: $PASS_COUNT passed, $FAIL_COUNT failed =="

rm -f /tmp/get_concepts_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
