import React from 'react'

import { inject, observer } from 'mobx-react'

const ThemeContext = React.createContext(null)

@inject(stores => ({
  themeKey: stores.UIStore.themeKey
}))
@observer
export class ThemeWrapper extends React.Component {
  updateTheme = () => {
    const body = document.body
    console.log({ theme: this.props })
    if (!body.className !== this.props.themeKey) {
      body.className = this.props.themeKey
    }
  }

  componentDidUpdate() {
    this.updateTheme()
  }

  render() {
    const { themeKey, children } = this.props
    const ThemeProvider = ThemeContext.Provider
    return <ThemeProvider value={themeKey}>{children}</ThemeProvider>
  }
}
