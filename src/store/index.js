import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
// import localForage from 'localforage'

import modules from './modules'

Vue.use(Vuex)
// first define a plugin that emits when the state has been persisted
// const vuexPersistEmitter = () => {
//   return store => {
//     store.subscribe(mutation => {
//       if (mutation.type === 'RESTORE_MUTATION') {
//         store._vm.$root.$emit('storeRestored')
//         store.commit('STORE_RESTORED')
//       }
//     })
//   }
// }

const vuexLocal = new VuexPersistence({
  strictMode: true,
  storage: window.localStorage,
  key: 'iplan--data',
  // asyncStorage: true,
  modules: ['App']
})
export default new Vuex.Store({
  modules,
  plugins: [vuexLocal.plugin],
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
  },
  strict: process.env.NODE_ENV !== 'production'
})
