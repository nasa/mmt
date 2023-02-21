import {
  makeObservable, observable, action
} from 'mobx'

export default class FormProperties {
  focusField: string
  arrayField: number
  constructor() {
    this.focusField = ''
    this.arrayField = null
    makeObservable(this, {
      focusField: observable,
      arrayField: observable,
      setFocusField: action,
      setArrayField: action
    })
  }
  setFocusField(value:string) {
    this.focusField = value
  }
  setArrayField(value:number) {
    this.arrayField = value
  }
}
