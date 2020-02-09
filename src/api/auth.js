export class AuthAPI {
  constructor(axios) {
    this.axios = axios
  }

  loginWithToken(token) {
    return this.axios.post('/v1/loginToken', { token })
  }

  loginWithEmail(email, password) {
    return this.axios.post('/v1/login', { email, password })
  }
}
