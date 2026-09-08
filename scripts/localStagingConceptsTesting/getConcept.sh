#!/bin/bash

# Tests the getConcept endpoint (fetch a single concept by nativeId)
# against a locally running MMT API (serverless-offline).
#
# Route:
#   GET {BASE_URL}/dev/providers/:providerId/:conceptType/:nativeId
#
# This route is EDL-authenticated (real browser user) and runs a per-user
# `fetchProviders` provider-permission check in the handler. It does NOT use
# the Staging-Api-Key - only createOrUpdateConcept (PUT) does.
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, etc). Override any of these by exporting them
# yourself before running this script.
#
# Assumes TestCollection1 has already been seeded, e.g. via:
#   ./postConcepts.sh
#
# Usage:
#   ./getConcept.sh
#   PROVIDER_ID=MMT_2 CONCEPT_TYPE=collections NATIVE_ID=TestCollection1 ./getConcept.sh

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
NATIVE_ID="${NATIVE_ID:-TestCollection1}"

PASS_COUNT=0
FAIL_COUNT=0

# Runs a curl request and asserts the response status code.
# Args: description, expected_status, provider_id, concept_type, native_id, [auth_header_override]
#
# auth_header defaults to $AUTH_TOKEN when the arg is omitted entirely.
# Pass "" explicitly to omit the Authorization header (missing-auth case).
run_test() {
  local description="$1"
  local expected_status="$2"
  local provider_id="$3"
  local concept_type="$4"
  local native_id="$5"
  local auth_header="${6-$AUTH_TOKEN}"

  local url="${BASE_URL}/${STAGE}/providers/${provider_id}/${concept_type}/${native_id}"

  local curl_args=(-s -o /tmp/get_concept_response_body.json -w '%{http_code}' -X GET "$url")

  if [ -n "$auth_header" ]; then
    curl_args+=(-H "Authorization: $auth_header")
  fi

  local actual_status
  actual_status="$(curl "${curl_args[@]}")"

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

echo "== Testing getConcept endpoint at ${BASE_URL}/${STAGE}/providers/... =="
echo

run_test \
  "successful get with valid EDL token" \
  "200" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID"

# fetchProviders throws when no token is present, and the handler maps that to 404.
run_test \
  "missing Authorization header" \
  "404" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID" \
  ""

# 'Bearer ABC-1' only grants MMT_1 / MMT_2, so any other provider fails the
# per-user provider-permission check with 401.
run_test \
  "unauthorized provider (outside test-mode allowlist MMT_1/MMT_2)" \
  "401" \
  "MMT_UNAUTHORIZED" "$CONCEPT_TYPE" "$NATIVE_ID"

run_test \
  "invalid conceptType" \
  "400" \
  "$PROVIDER_ID" "invalid-type" "$NATIVE_ID"

run_test \
  "nonexistent nativeId" \
  "404" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "NativeIdThatDoesNotExist"

echo
echo "== Results: $PASS_COUNT passed, $FAIL_COUNT failed =="

rm -f /tmp/get_concept_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
