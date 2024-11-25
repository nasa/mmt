#!/bin/bash
ummJsonSchemaUrl=`jq '.ummJsonSchemaUrl' ./static.config.json`
ummJsonSchemaUrl=${ummJsonSchemaUrl//\"/}
bamboo_STAGE_NAME="sit"
stage=$bamboo_STAGE_NAME
if [ "$stage" == "prod" ]; then
  stage=""
fi
if [[ "$stage" == "sit" || "$stage" == "uat" ]]; then
  stage="${stage}."
fi
ummC() {
    echo "Downloading ummC"
    #Reads version number
    schema_version=`jq '.ummVersions.ummC' ./static.config.json`
    schema_version=${schema_version//\"/}
    echo ummC schema version=${schema_version}
    #Download
    downloadURL="https://cdn.${stage}earthdata.nasa.gov/umm/collection/v${schema_version}/umm-c-json-schema.json"
    echo "download URL=${downloadURL}"
    curl -L "${downloadURL}" > umm-c-json-schema-temp.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-c-json-schema.json"
      exit 1
    fi
    jq --arg ummJsonSchemaUrl "$ummJsonSchemaUrl" '."$schema" = $ummJsonSchemaUrl' umm-c-json-schema-temp.json > umm-c-json-schema.json
    downloadURL="https://cdn.${stage}earthdata.nasa.gov/umm/collection/v${schema_version}/umm-cmn-json-schema.json"
    echo "download URL=${downloadURL}"
    curl -L "${downloadURL}" > umm-cmn-json-schema-temp.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-cmn-json-schema.json"
      exit 1
    fi
    #Remove key '$schema' of the common file because it would overwrite the same key in the main file
    jq 'del(."$schema")' umm-cmn-json-schema-temp.json > umm-cmn-json-schema.json
    #Merge and create js file
    echo "$(echo "const ummCSchema =")" "$(jq -s '.[0] * .[1]' umm-c-json-schema.json umm-cmn-json-schema.json)" > ummCSchema-temp.js
    echo "$(echo "export default ummCSchema")" >> ummCSchema-temp.js
    #Replace pointers to the common file
    sed 's/umm-cmn-json-schema.json#/#/g' ummCSchema-temp.js > ummCSchema.js
}

ummS() {
    echo "Downloading ummS"
    #Reads version number
    schema_version=`jq '.ummVersions.ummS' ./static.config.json`
    schema_version=${schema_version//\"/}
    echo ummS schema version=${schema_version}
    #Download
    downloadURL="https://cdn.${stage}earthdata.nasa.gov/umm/service/v${schema_version}/umm-s-json-schema.json"
    echo "download URL=${downloadURL}"
    curl -L "${downloadURL}" > umm-s-json-schema-temp.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-s-json-schema.json"
      exit 1
    fi
    jq --arg ummJsonSchemaUrl "$ummJsonSchemaUrl" '."$schema" = $ummJsonSchemaUrl' umm-s-json-schema-temp.json > umm-s-json-schema.json
    #Create js file
    echo "$(echo "const ummSSchema =")" "$(jq '.' umm-s-json-schema.json)" > ummSSchema.js
    echo "$(echo "export default ummSSchema")" >> ummSSchema.js
}

ummV() {
    echo "Downloading ummV"
    #Reads version number
    schema_version=`jq '.ummVersions.ummV' ./static.config.json`
    schema_version=${schema_version//\"/}
    echo ummV schema version=${schema_version}
    #Download
    downloadURL="https://cdn.${stage}earthdata.nasa.gov/umm/variable/v${schema_version}/umm-var-json-schema.json"
    echo "download URL=${downloadURL}"
    curl -L "${downloadURL}" > umm-var-json-schema-temp.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-var-json-schema.json"
      exit 1
    fi
    jq --arg ummJsonSchemaUrl "$ummJsonSchemaUrl" '."$schema" = $ummJsonSchemaUrl' umm-var-json-schema-temp.json > umm-var-json-schema.json
    #Create js file
    echo "$(echo "const ummVarSchema =")" "$(jq '.' umm-var-json-schema.json)" > ummVarSchema.js
    echo "$(echo "export default ummVarSchema")" >> ummVarSchema.js
}

ummT() {
    echo "Downloading ummT"
    #Reads version number
    schema_version=`jq '.ummVersions.ummT' ./static.config.json`
    schema_version=${schema_version//\"/}
    echo ummT schema version=${schema_version}
    #Download
    downloadURL="https://cdn.${stage}earthdata.nasa.gov/umm/tool/v${schema_version}/umm-t-json-schema.json"
    echo "download URL=${downloadURL}"
    curl -L "${downloadURL}" > umm-t-json-schema-temp.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-t-json-schema.json"
      exit 1
    fi
    jq --arg ummJsonSchemaUrl "$ummJsonSchemaUrl" '."$schema" = $ummJsonSchemaUrl' umm-t-json-schema-temp.json > umm-t-json-schema.json
    #Create js file
    echo "$(echo "const ummTSchema =")" "$(jq '.' umm-t-json-schema.json)" > ummTSchema.js
    echo "$(echo "export default ummTSchema")" >> ummTSchema.js
}

cleanup() {
  \rm ./*-temp.*
  \rm ./*-schema.json
  \rm ./*Schema.js
}

{
  echo "Start downloading schema files"
  (ummC -ne 1) && (ummS -ne 1) && (ummV -ne 1) && (ummT -ne 1)
} || {
  echo "Failed downloading schema files"
  exit 1
}
echo "Successfully downloaded schema files"
echo "Copying schema files"
cp ./ummCSchema.js ./ummSSchema.js ./ummVarSchema.js ./ummTSchema.js ./static/src/js/schemas/umm/
if [ $? -ne 0 ]; then
  echo "Failed copying schema files"
  exit 1
fi
cleanup
echo "Done"
