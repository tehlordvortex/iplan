const state = {
  loggedIn: false,
  userData: null,
  userAvatar: null
}

const mutations = {
  LOG_IN (state, user) {
    state.loggedIn = true
    state.userData = user
  },
  LOG_OUT (state) {
    state.loggedIn = false
    state.userData = null
  },
  CACHE_AVATAR (state, dataURL) {
    state.userAvatar = dataURL
  }
}

const actions = {
  cacheAvatar ({ commit }, photoURL) {
    console.log('Caching avatar:', photoURL)
    let xhttp = new window.XMLHttpRequest()
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        let reader = new FileReader()
        reader.onloadend = function () {
          commit('CACHE_AVATAR', reader.result)
        }
        reader.readAsDataURL(xhttp.response)
      } else {
        console.log('Couldn\'t cache avatar:', this.readyState, this.status)
      }
    }
    xhttp.open('GET', photoURL, true)
    xhttp.send()
  }
}

export default {
  state,
  mutations,
  actions
}
