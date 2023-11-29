/**
 * This function was pulled from ObjectField to support LayoutGridField
 * (The class used to inherit from ObjectField)
 * https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/core/src/components/fields/ObjectField.tsx
 */

const isRequired = (name, schema) => Array.isArray(schema.required)
    && schema.required.indexOf(name) !== -1
export default isRequired
