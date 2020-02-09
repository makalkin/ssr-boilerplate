import { create } from 'mobx-persist'

export function initializeStore(
  Store,
  rootStore,
  api,
  initialData
) {
  console.log(Store._persistKey, initialData)

  let store = null
  // Always make a new store if server, otherwise state is shared between requests
  if (process.env.BUILD_TARGET === 'server') {
    return new Store(rootStore, api, initialData)
  }
  if (store === null) {
    const hydrate = create({
      storage: localStorage,
      jsonify: true
    })

    store = new Store(rootStore, api, initialData)
    // TODO: maybe add cookie for this
    hydrate(Store._persistKey, store).then(({ ...args }) =>
      console.log('hydrated', Store._persistKey, args)
    )
  }
  return store
}
