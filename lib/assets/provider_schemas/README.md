# Provider Specific Validation Examples

Providers are able to provide custom validation rules for the MMT. The rules are defined in a JSON Schema file within the `lib/assets/provider_schemas/` directory. We have placed a `mmt_1.json` file there to serve as an example.

You can find more information about JSON Schema here, http://json-schema.org/latest/json-schema-validation.html#rfc.section.6

## Validations

All of these examples can be found in `lib/assets/provider_schemas/mmt_1.json`, and they are active when viewing the MMT forms with MMT 1 set as your current provider.

`definitions/NilType` is used to completely overwrite an existing `"$ref": ...` for a property. See `properties/Version` for example usage. Please note that any existing validations will need to be copied into the property to ensure UMM validation.
```
"NilType": {
  "description": "Empty type we can use as $ref to ignore the UMM type. See properties/Version"
}
```

You can make generic type changes in the `definitions` portion of the UMM Schema. Any change made to a Type here will effect every field in the forms that uses the type.
Here we change the maxLength to 50.
```
"VersionType": {
  "description": "The version of the metadata record.",
  "type": "string",
  "minLength": 1,
  "maxLength": 50
}
```

Within `properties` you can make changes to a specific single field. Here we are doing a few things:
1. Setting `"$ref": "#/definitions/NilType"` will ignore the default $ref of `#/definitions/VersionType`. This can cause duplicate error messages in the forms. Because of this we need to be sure to copy all the validation from `definitions/VersionType` into `properties/Version`
2. We are setting a pattern validation (`"pattern": "^[^vV]+$",`) to not allow the letter `V` into the Version. We are also modifying the description to better explain the pattern, as regular expressions can be difficult for a user to understand.
3. We copied the minLength value from `definitions/VersionType`
4. We are setting the maxLength to 5.

```
"properties": {
  "Version": {
    "$ref": "#/definitions/NilType",
    "description": "The Version of the collection. Must not contain the letter V",
    "pattern": "^[^vV]+$",
    "minLength": 1,
    "maxLength": 5
  }
}
```

## Adding your own validations
To add custom validations for your provider follow these steps:

1. Fork this repository
2. Add a new file to the repository (`lib/assets/provider_schemas/<your provider id>.json`) with the custom validation rules
3. Submit a pull request to this repository where the MMT development team will review and test the new validations.
4. After the pull request is merged your validations will be deployed during the regular MMT deployments.
