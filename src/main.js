// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import VueTouch from 'vue-touch'
import './assets/material-icons/material-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import App from './App'
import database from './database'

Array.prototype.pushUnique = function (item) {
  let present = false
  this.forEach((x) => present = x === item)
  if (!present)
    this.push(item)
};
Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueTouch, {name: 'v-touch'})
/* eslint-disable no-new */
database.whenReady(() => window.vueApp = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    database: database,
    showActions: false,
    actions: [],
    handlers: [],
  	debug: true,
    settings: database.getSettings()
  }
}))