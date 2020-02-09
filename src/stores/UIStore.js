import { action, computed, observable } from 'mobx'
import Cookie from 'mobx-cookie'
import { persist } from 'mobx-persist'

export class UIStore {
  @computed get appIsInSync() {
    return this.pendingRequestCount === 0
  }
  cookie = new Cookie('themeKey')

  @observable theme = {}
  @persist @observable themeKey = ''
  @observable language = 'en_US'
  @observable pendingRequestCount = 0

  constructor(initialData = {}) {
    this.setTheme(
      initialData.themeKey != null ? initialData.themeKey : 'DEFAULT'
    )
  }

  @action
  setTheme(themeKey) {
    this.cookie.set('themeKey', { expires: 2147483647 })
    this.themeKey = themeKey
  }

  @action
  toggleTheme() {
    if (this.themeKey === 'LIGHT') {
      this.setTheme('DARK')
    } else {
      this.setTheme('LIGHT')
    }
  }

  toJson() {
    return {
      themeKey: this.themeKey,
      language: this.language
    }
  }
}
