import { cloneDeep } from 'lodash'
import Form from '@rjsf/core'
import removeEmpty from '../../utils/removeEmpty'

class ReactJsonSchemaForm extends Form {
  validate(formData, schema, altSchemaUtils) {
    const data = removeEmpty(cloneDeep(formData))

    return super.validate(data, schema, altSchemaUtils)
  }
}
export default ReactJsonSchemaForm
