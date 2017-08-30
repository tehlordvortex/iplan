import Vue from 'vue'
import Router from 'vue-router'
import StartPage from '@/components/StartPage'
import CreateToDo from '@/components/CreateToDo'
import EditToDo from '@/components/EditToDo'
import ToDos from '@/components/ToDos'
import CreateGoal from '@/components/CreateGoal'
import Goal from '@/components/Goal'
import Goals from '@/components/Goals'

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
      path: '/goals',
      name: 'goals',
      component: Goals
    },
    {
      path: '/goal/:id',
      name: 'goal',
      component: Goal
    },
    {
    	path: '/create/todo',
    	name: 'createtodo',
    	component: CreateToDo
    },
    {
      path: '/create/goal',
      name: 'creategoal',
      component: CreateGoal
    },
    {
      path: '/edit/todo/:id',
      name: 'edittodo',
      component: EditToDo
    },
  ]
})
