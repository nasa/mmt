import {
  makeObservable, observable, action
} from 'mobx'
import Status from './Status'

export default class FormProperties {
  loading: boolean
  status: Status
  focusField: string
  arrayFieldAutoScroll: number
  constructor() {
    this.loading = false
    this.status = null
    this.focusField = ''
    this.arrayFieldAutoScroll = null
    makeObservable(this, {
      loading: observable,
      status: observable,
      focusField: observable,
      arrayFieldAutoScroll: observable,
      setArrayAutoScroll: action,
      setFocusField: action,
      setStatus: action,
      setLoading: action
    })
  }
  setFocusField(value: string) {
    this.focusField = value
  }
  setArrayAutoScroll(value: number) {
    this.arrayFieldAutoScroll = value
  }
  setStatus(status: Status) {
    this.status = status
  }
  setLoading(loading: boolean) {
    this.loading = loading
  }
}
