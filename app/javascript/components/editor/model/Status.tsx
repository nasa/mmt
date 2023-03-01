import { makeObservable, observable } from 'mobx'

export default class Status {
  type: string = null
  message: string = null

  constructor(type: string, message: string) {
    this.type = type
    this.message = message
    makeObservable(this, {
      type: observable, message: observable
    })
  }
}
