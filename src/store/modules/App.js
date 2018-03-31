const state = {
  loggedIn: false,
  userData: null
}

const mutations = {
  LOG_IN (state, user) {
    state.loggedIn = true
    state.userData = user
  },
  LOG_OUT (state) {
    state.loggedIn = false
    state.userData = null
  }
}

export default {
  state,
  mutations
}
