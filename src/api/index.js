import Axios from 'axios'
import { AuthAPI } from './auth'

export class API {
  constructor() {
    this.main = Axios.create({
      baseURL: process.env.RAZZLE_API_SERVER
    })

    this.predictions = Axios.create({
      baseURL: process.env.RAZZLE_PREDICTIONS_SERVER
    })

    this.auth = new AuthAPI(this.main)
  }

  setAuth(token) {
    this.main.defaults.headers.Authorization = token
    this.predictions.defaults.headers.Authorization = token
  }

  logout() {
    delete this.main.defaults.headers.Authorization
    delete this.predictions.defaults.headers.Authorization
  }
}
