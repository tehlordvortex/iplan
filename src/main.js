// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'Vuetify'
import './assets/material-icons/material-icons.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'vuetify/dist/vuetify.min.css'
import router from './router'
import App from './App'
import database from './database'

Vue.config.productionTip = false
Vue.use(Vuetify)
/* eslint-disable no-new */
var vueApp = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
  	database: database,
  	debug: true
  }
})