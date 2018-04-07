// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueTour from 'vue-tour'
import 'vuetify/dist/vuetify.min.css'
import 'firebaseui/dist/firebaseui.css'
import 'vue-tour/dist/vue-tour.css'
import colors from 'vuetify/es5/util/colors'
import VueFirestore from 'vue-firestore'
import { firebase } from '@firebase/app'
import '@firebase/firestore'
import '@firebase/auth'
import { fbConfig } from '@/config'
import store from '@/store'

Vue.use(Vuetify, {
  theme: {
    primary: colors.blue.base,
    secondary: colors.purple.base,
    accent: colors.pink.base
  }
})
Vue.use(VueFirestore)
Vue.use(VueTour)

firebase.initializeApp(fbConfig)
// console.log(firebase)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
