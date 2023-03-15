/* eslint-disable @typescript-eslint/ban-ts-comment */
import Form from '@rjsf/core'
import { RJSFSchema, SchemaUtilsType } from '@rjsf/utils'
import { removeEmpty } from '../utils/json_utils'

export default class ReactJsonSchemaForm<T> extends Form<T> {
  validate(formData: unknown, schema: RJSFSchema, altSchemaUtils:SchemaUtilsType) {
    const data = removeEmpty(formData as object)
    return super.validate(data, schema, altSchemaUtils)
  }
}
