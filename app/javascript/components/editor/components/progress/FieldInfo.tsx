import { ProgressCircleType } from './ProgressCircleType'

export class FieldInfo {
  section: string
  name: string
  index: number
  status: ProgressCircleType
  required: boolean
  error: FormError
  constructor(section: string, name: string, index: number, status: ProgressCircleType, required: boolean, error: FormError) {
    this.section = section
    this.name = name
    this.index = index
    this.status = status
    this.required = required
    this.error = error
  }
}
