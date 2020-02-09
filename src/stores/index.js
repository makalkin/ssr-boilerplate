import { API } from '../api'
import { AuthStore } from './AuthStore'
import { UIStore } from './UIStore'
import { initializeStore } from './utils'

export class RootStore {
  constructor(initialData = { auth: {}, ui: {} }, api = new API()) {
    this.api = api

    this.UIStore = initializeStore(UIStore, this, api, initialData.ui)
    this.authStore = initializeStore(AuthStore, this, api, initialData.auth)
  }

  toJson() {
    return {
      auth: this.authStore.toJson(),
      ui: this.UIStore.toJson()
    }
  }
}
