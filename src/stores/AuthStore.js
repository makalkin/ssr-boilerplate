import { action, observable } from 'mobx'
import { create, persist } from 'mobx-persist'
import shajs from 'sha.js'
import { API } from '../api'
import { User } from '../models/user'

const trim = (str) => str.trim().toLowerCase()
const hash = (str) =>
  new shajs.sha256().update(str).digest('hex')

export class AuthStore {
  static _persistKey = 'auth'

  @persist @observable token = null
  @persist('object') @observable user = null

  constructor(rootStore, api, initialData) {
    this.rootStore = rootStore
    this.api = api

    this._login()
  }

  async _login() {
    if (this.token) {
      const res = await this.api.auth.loginWithToken(this.token)
      this.api.setAuth(res.token)
      return
    }

    return this._logout()
  }

  _logout() {
    this.token = null
    this.user = null
    this.api.logout()
  }

  @action
  login = async (email, password) => {
    email = trim(email)
    password = hash(password)

    this.api.auth.loginWithEmail(email, password)

    // if (user.demo) {
    //   localStorage.setItem('demo', 'true')
    // } else {
    //   localStorage.removeItem('demo')
    // }
  }

  @action
  setToken = (token) => {
    this.token = token
  }

  @action
  logout = () => {
    this.user = null
    this.token = null
  }

  toJson() {
    return {
      token: this.token,
      user: this.user
    }
  }
}
