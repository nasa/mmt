#!/bin/bash

# Tests the deleteConcept endpoint against a locally running MMT API
# (serverless-offline).
#
# Route:
#   DELETE {BASE_URL}/dev/providers/:providerId/:conceptType/:nativeId
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

# Seeds the throwaway concept used by the delete tests below.
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
      -H "Authorization: $AUTH_TOKEN" \
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
# Args: description, expected_status, provider_id, concept_type, native_id, [staging_key_override], [auth_header_override]
#
# staging_key/auth_header default to the env vars (STAGING_API_KEY/AUTH_TOKEN,
# normally set via local-env.sh) when the arg is omitted entirely.
# Pass "" explicitly to omit the header (e.g. to test a missing-header case),
# or pass a specific string to test a wrong/overridden value.
run_test() {
  local description="$1"
  local expected_status="$2"
  local provider_id="$3"
  local concept_type="$4"
  local native_id="$5"
  local staging_key="${6-$STAGING_API_KEY}"
  local auth_header="${7-$AUTH_TOKEN}"

  local url="${BASE_URL}/${STAGE}/providers/${provider_id}/${concept_type}/${native_id}"

  local curl_args=(-s -o /tmp/delete_concept_response_body.json -w '%{http_code}' -X DELETE "$url")

  if [ -n "$staging_key" ]; then
    curl_args+=(-H "Staging-Api-Key: $staging_key")
  fi

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

run_test \
  "missing Staging-Api-Key header" \
  "401" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID" \
  ""

run_test \
  "wrong Staging-Api-Key header" \
  "401" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "$NATIVE_ID" \
  "wrong-key"

run_test \
  "invalid conceptType" \
  "400" \
  "$PROVIDER_ID" "invalid-type" "$NATIVE_ID"

# The 'Bearer ABC-1' test-mode auth check runs before any provider-existence
# check, so a provider outside the allowlist fails auth (401), not 404.
run_test \
  "unauthorized provider (outside test-mode allowlist MMT_1/MMT_2)" \
  "401" \
  "MMT_UNAUTHORIZED" "$CONCEPT_TYPE" "$NATIVE_ID"

# S3's DeleteObject doesn't error on a missing key, so deleteConcept is
# idempotent - deleting a nativeId that was never seeded (or was already
# deleted) still returns 204, same as a real delete.
run_test \
  "nonexistent nativeId (delete is idempotent via S3)" \
  "204" \
  "$PROVIDER_ID" "$CONCEPT_TYPE" "NativeIdThatDoesNotExist"

# Successful delete, then confirm re-deleting is still a 204 (idempotent).

run_test \
  "successful delete with valid headers" \
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