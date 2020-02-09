import React, { Suspense, useEffect, useRef } from 'react'

import { Provider } from 'mobx-react'
import { hydrate, render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { RootStore } from './stores'

import { useSSR } from 'react-i18next'
import { ToastContainer } from 'react-toastify'

import './styles/global-styles'

import App from './App'
import './lib/i18n'

const Client = ({
  initialMobxState
}) => {
  const mobxStore = useRef(new RootStore(initialMobxState))

  useSSR(window.initialI18nStore, window.initialLanguage)

  return (
    <Suspense fallback={<div> Loading... </div>}>
      <React.Fragment>
        <Provider {...mobxStore.current}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>

        <ToastContainer />
      </React.Fragment>
    </Suspense>
  )
}

const renderMethod = module.hot ? render : hydrate
renderMethod(<Client />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
