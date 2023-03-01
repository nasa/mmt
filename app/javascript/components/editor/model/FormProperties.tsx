import {
  makeObservable, observable, action
} from 'mobx'
import Status from './Status'

export default class FormProperties {
  loading: boolean
  status: Status
  focusField: string
  arrayField: number
  constructor() {
    this.loading = false
    this.status = null
    this.focusField = ''
    this.arrayField = null
    makeObservable(this, {
      loading: observable,
      status: observable,
      focusField: observable,
      arrayField: observable,
      setFocusField: action,
      setArrayField: action,
      setStatus: action,
      setLoading: action
    })
  }
  setFocusField(value:string) {
    this.focusField = value
  }
  setArrayField(value:number) {
    this.arrayField = value
  }
  setStatus(status:Status) {
    this.status = status
  }
  setLoading(loading: boolean) {
    this.loading = loading
  }
}
