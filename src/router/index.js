import Vue from 'vue'
import Router from 'vue-router'
import StartPage from '@/components/StartPage'
import CreateToDo from '@/components/CreateToDo'
import EditToDo from '@/components/EditToDo'
import ToDos from '@/components/ToDos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: StartPage
    },
    {
      path: '/todos',
      name: 'todos',
      component: ToDos
    },
    {
    	path: '/createtodo',
    	name: 'createtodo',
    	component: CreateToDo
    },
    {
      path: '/edittodo/:id',
      name: 'edittodo',
      component: EditToDo
    }
  ]
})
