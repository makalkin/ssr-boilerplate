import React, { useEffect } from 'react'

import { Route, Switch } from 'react-router-dom'

import { ThemeWrapper } from './containers'

import { Home } from './pages'

const App = () => (
  <ThemeWrapper>
    <Switch>
      <Route exact={true} path="/" component={Home} />
    </Switch>
  </ThemeWrapper>
)

export default App
