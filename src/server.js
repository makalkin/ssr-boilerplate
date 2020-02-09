import React from 'react'
import { renderToNodeStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'

import { Provider, useStaticRendering } from 'mobx-react'
import { Helmet } from 'react-helmet'

import express from 'express'
import fs from 'fs'
import path from 'path'

import compression from 'compression'
import middleware from 'i18next-express-middleware'
import Backend from 'i18next-node-fs-backend'
import serialize from 'serialize-javascript';
import netjet from 'netjet'
import cookieParser from 'cookie-parser'
import i18n from './lib/i18n'

import { I18nextProvider } from 'react-i18next'
import App from './App'
import { RootStore } from './stores'
import { runtimeConfig } from './config'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)

const appSrc = resolveApp('src')

i18n
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    backend: {
      addPath: `${appSrc}/locales/{{lng}}/{{ns}}.missing.json`,
      loadPath: `${appSrc}/locales/{{lng}}/{{ns}}.json`,
    },
    debug: false,
    defaultNS: 'translations',
    ns: ['translations'],
    preload: ['en', 'uk', 'ru', 'es'],
  })

useStaticRendering(true)

const Server = ({ rootStore, context, req }) => {
  return (
    <I18nextProvider i18n={req.i18n}>
      <Provider {...rootStore}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    </I18nextProvider>
  )
}

let assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()
  .use(compression())
  .use(netjet())
  .disable('x-powered-by')
  .use(
    middleware.handle(i18n, {
      ignoreRoutes: ['/static'], // or function(req, res, options, i18next) { /* return true to ignore */ }
      removeLngFromUrl: true,
    })
  )
  .use('/locales', express.static(`${appSrc}/locales`))
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .post('/locales/add/:lng/:ns', middleware.missingKeyHandler(i18n))
  .use(cookieParser())
  .get('/*', (req, res) => {
    const context = {}

    // you can init some store state from backend right here
    const rootStore = new RootStore({
      auth: { token: '123' },
      ui: { themeKey: req.cookies && req.cookies['themeKey'] || 'DEFAULT' }
    })

    const jsx = (
      <Server rootStore={rootStore} context={context} req={req} />
    )
    const stream = renderToNodeStream(jsx)

    const { url } = context
    if (url) {
      return res.redirect(url)
    }

    const head = Helmet.renderStatic()

    const initialI18nStore = {}
    req.i18n.languages.forEach((l) => {
      initialI18nStore[l] = req.i18n.services.resourceStore.data[l]
    })
    const initialLanguage = req.i18n.language

    res.write(`
      <!doctype html>
      <html lang="${initialLanguage}">
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            ${head.title}
            ${head.meta}
            <script>
              window.__INITIAL_STATE__ = ${JSON.stringify(rootStore.toJson())};
              window.initialI18nStore = JSON.parse('${JSON.stringify(initialI18nStore)}');
              window.initialLanguage = '${initialLanguage}';
            </script>

            ${assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ''
      }
      <link rel="manifest" href="/manifest.json">
              ${process.env.NODE_ENV === 'production'
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`
      }
        </head>
        <body class="${rootStore.UIStore.themeKey === 'DARK' ? 'dark' : 'light'}">
    <div id="root">
  `)

    stream.pipe(
      res,
      { end: false }
    )

    stream.on('end', () =>
      res.end(`
            </div>

  <script defer>
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
      });
  }
            </script>

  <script>window.env = ${serialize(runtimeConfig)};</script>  
          </body >
        </html >
  `)
    )
  })

export default server
