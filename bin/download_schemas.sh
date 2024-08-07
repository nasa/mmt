#!/bin/bash
ummC() {
    echo "Downloading ummC"
    #Reads version number
    schema_version=`jq '.ummVersions.ummC' ../static.config.json`
    schema_version=${schema_version//\"/}
    #Download
    curl https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/raw/collection/v${schema_version}/umm-c-json-schema.json > umm-c-json-schema.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-c-json-schema.json"
      exit 1
    fi
    curl https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/raw/collection/v${schema_version}/umm-cmn-json-schema.json > umm-cmn-json-schema.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-cmn-json-schema.json"
      exit 1
    fi
    #Remove key '$schema' of the common file because it would overwrite the same key in the main file
    jq 'del(."$schema")' umm-cmn-json-schema.json > umm-cmn-json-schema-minus-schema-version.json
    #Merge and create js file
    echo "$(echo "const ummCSchema =")" "$(jq -s '.[0] * .[1]' umm-c-json-schema.json umm-cmn-json-schema-minus-schema-version.json)" > ummCSchemaRaw.js
    echo "$(echo "export default ummCSchema")" >> ummCSchemaRaw.js
    #Replace pointers to the common file
    sed 's/umm-cmn-json-schema.json#/#/g' ummCSchemaRaw.js > ummCSchema.js
    #sed "s/\"/\'/g" ummCSchemaRaw.js > ummCSchema.js
}

ummS() {
    echo "Downloading ummS"
    #Reads version number
    schema_version=`jq '.ummVersions.ummS' ../static.config.json`
    schema_version=${schema_version//\"/}
    #Download
    curl https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/raw/service/v${schema_version}/umm-s-json-schema.json > umm-s-json-schema.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-s-json-schema.json"
      exit 1
    fi
    #Create js file
    echo "$(echo "const ummSSchema =")" "$(jq '.' umm-s-json-schema.json)" > ummSSchema.js
    echo "$(echo "export default ummSSchema")" >> ummSSchema.js
}

ummV() {
    echo "Downloading ummV"
    #Reads version number
    schema_version=`jq '.ummVersions.ummV' ../static.config.json`
    schema_version=${schema_version//\"/}
    #Download
    curl https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/raw/variable/v${schema_version}/umm-var-json-schema.json > umm-var-json-schema.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-var-json-schema.json"
      exit 1
    fi
    #Create js file
    echo "$(echo "const ummVarSchema =")" "$(jq '.' umm-var-json-schema.json)" > ummVarSchema.js
    echo "$(echo "export default ummVarSchema")" >> ummVarSchema.js
}

ummT() {
    echo "Downloading ummT"
    #Reads version number
    schema_version=`jq '.ummVersions.ummT' ../static.config.json`
    schema_version=${schema_version//\"/}
    #Download
    curl https://git.earthdata.nasa.gov/projects/EMFD/repos/unified-metadata-model/raw/tool/v${schema_version}/umm-t-json-schema.json > umm-t-json-schema.json
    if [ $? -ne 0 ]; then
      echo "Failed downloading umm-t-json-schema.json"
      exit 1
    fi
    #Create js file
    echo "$(echo "const ummTSchema =")" "$(jq '.' umm-t-json-schema.json)" > ummTSchema.js
    echo "$(echo "export default ummTSchema")" >> ummTSchema.js
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
cp ummCSchema.js ummSSchema.js ummVarSchema.js ummTSchema.js ../static/src/js/schemas/umm/
if [ $? -ne 0 ]; then
  echo "Failed copying schema files"
  exit 1
fi
echo "Done"
