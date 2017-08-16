import Vue from 'vue'
import Router from 'vue-router'
import StartPage from '@/components/StartPage'
import CreateToDo from '@/components/CreateToDo'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: StartPage
    },
    {
    	path: '/createtodo',
    	name: 'Create ToDo',
    	component: CreateToDo
    }
  ]
})
