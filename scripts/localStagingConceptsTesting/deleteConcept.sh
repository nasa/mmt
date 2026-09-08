#!/bin/bash

# Tests the deleteConcept endpoint against a locally running MMT API
# (serverless-offline).
#
# Route:
#   DELETE {BASE_URL}/dev/providers/:providerId/:conceptType/:nativeId
#
# This route is EDL-authenticated (real browser user) and runs a per-user
# `fetchProviders` provider-permission check in the handler. It does NOT use
# the Staging-Api-Key. The seed step below uses PUT createOrUpdateConcept,
# which IS the machine-to-machine route and still needs the Staging-Api-Key.
#
# Sources local-env.sh (if present) for shared local dev config
# (STAGE_NAME, API_BASE_URL, STAGING_API_KEY, etc). Override any of these by
# exporting them yourself before running this script.
#
# This script seeds its own throwaway concept (NATIVE_ID below) via PUT
# before testing delete, so it doesn't consume/remove data seeded by
# postConcepts.sh (e.g. TestCollection1/2/3) that other scripts may rely on.
#
# Usage:
#   ./deleteConcept.sh
#   PROVIDER_ID=MMT_2 CONCEPT_TYPE=collections ./deleteConcept.sh

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
NATIVE_ID="${NATIVE_ID:-TestDeleteMe}"

PASS_COUNT=0
FAIL_COUNT=0

# Seeds the throwaway concept used by the delete tests below via the
# machine-to-machine PUT route (Staging-Api-Key required).
seed_concept() {
  local url="${BASE_URL}/${STAGE}/providers/${PROVIDER_ID}/${CONCEPT_TYPE}/${NATIVE_ID}"
  local body
  body=$(cat <<EOF
{
  "ShortName": "$NATIVE_ID",
  "Version": "1",
  "EntryTitle": "Throwaway concept for deleteConcept.sh",
  "Description": "Seeded by deleteConcept.sh; expected to be deleted by this script"
}
EOF
)

  local actual_status
  actual_status="$(
    curl -s -o /tmp/delete_concept_seed_body.json -w '%{http_code}' \
      -X PUT "$url" \
      -H "Staging-Api-Key: $STAGING_API_KEY" \
      -H "Content-Type: application/json" \
      -d "$body"
  )"

  if [ "$actual_status" != "200" ]; then
    echo "FAIL: setup - could not seed $NATIVE_ID (got $actual_status)"
    echo "  Response body:"
    sed 's/^/    /' /tmp/delete_concept_seed_body.json
    rm -f /tmp/delete_concept_seed_body.json
    exit 1
  fi

  rm -f /tmp/delete_concept_seed_body.json
}

# Runs a curl DELETE request and asserts the response status code.
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

  local curl_args=(-s -o /tmp/delete_concept_response_body.json -w '%{http_code}' -X DELETE "$url")

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
    sed 's/^/    /' /tmp/delete_concept_response_body.json
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo "== Testing deleteConcept endpoint at ${BASE_URL}/${STAGE}/providers/... =="
echo

echo "-- seeding throwaway concept ($NATIVE_ID) for delete tests --"
seed_concept
echo

# Negative-path tests first: these must NOT actually delete the concept, so
# the final successful-delete test below still has something to delete.

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

# S3's DeleteObject doesn't error on a missing key, so deleteConcept is
# idempotent - deleting a nativeId that was never seeded (or was already
# deleted) still returns 204, same as a real delete.
run_test \
  "nonexistent nativeId (delete is idempotent via S3)" \
  "204" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "NativeIdThatDoesNotExist"

# Successful delete, then confirm re-deleting is still a 204 (idempotent).

run_test \
  "successful delete with valid EDL token" \
  "204" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID"

run_test \
  "delete again after already deleted (still 204, idempotent)" \
  "204" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID"

echo
echo "== Results: $PASS_COUNT passed, $FAIL_COUNT failed =="

rm -f /tmp/delete_concept_response_body.json

if [ "$FAIL_COUNT" -ne 0 ]; then
  exit 1
fi
