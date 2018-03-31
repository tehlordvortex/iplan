import Vue from 'vue'
import Router from 'vue-router'
import { firebase } from '@firebase/app'

import TodosPage from '@/components/TodosPage'
// import LoginPage from '@/components/LoginPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '*',
      component: TodosPage
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodosPage
    }
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: LoginPage
    // }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(firebase.app())
  let currentUser = firebase.auth().currentUser
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('welcome')
  else next()
})

export default router
