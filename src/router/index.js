import Vue from 'vue'
import Router from 'vue-router'
import { firebase } from '@firebase/app'

import TodosPage from '@/components/TodosPage'
import WelcomePage from '@/components/WelcomePage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      component: WelcomePage
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodosPage,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage
    }
  ]
})

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('welcome')
  else next()
})

export default router
