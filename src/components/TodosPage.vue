<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <v-card>
          <v-card-title class="title">Todos</v-card-title>
          <v-card-text>
            <v-list transition="fade" v-show="dbLoading">
              <vcl-todo-item></vcl-todo-item>
              <vcl-todo-item></vcl-todo-item>
            </v-list>
            <template v-if="todos && todos.length > 0">
              <v-list v-if="!smallScreen">
                <v-list-tile ripple v-for="(todo, index) in todos" :key="index" class="taller">
                  <v-list-tile-action>
                    <v-checkbox v-model="todo.done" @click="markDone(todo)"/>
                  </v-list-tile-action>
                  <v-list-tile-content>
                    <v-list-tile-title v-if="!editingTodo || toEdit !== todo['.key']" :class="todo.done ? 'strike' : ''">
                      {{ todo.task }}
                    </v-list-tile-title>
                    <v-text-field single-line v-model="todo.task" v-else-if="editingTodo && toEdit === todo['.key']" @blur="updateTodo(todo)" @keyup.enter="updateTodo(todo)" />
                  </v-list-tile-content>
                  <!-- <v-list-tile-action> -->
                    <v-btn icon data-tour-step="2" flat @click="editTodo(todo)"><v-icon>create</v-icon></v-btn>
                    <v-btn icon data-tour-step="3" flat @click="deleteTodo(todo)"><v-icon>delete</v-icon></v-btn>
                  <!-- </v-list-tile-action> -->
                </v-list-tile>
              </v-list>
              <v-list v-else>
                <v-list-group v-for="(todo, index) in todos" :key="index" >
                  <v-list-tile slot="activator">
                    <v-list-tile-action>
                      <v-checkbox v-model="todo.done" @click="markDone(todo)"/>
                    </v-list-tile-action>
                    <v-list-tile-content>
                      <v-list-tile-title v-if="!editingTodo || toEdit != todo['.key']" :class="todo.done ? 'strike' : ''">{{ todo.task }}</v-list-tile-title>
                      <v-text-field v-model="todo.task" v-else-if="editingTodo && toEdit == todo['.key']" @blur="updateTodo(todo)" @keyup.enter="updateTodo(todo)" />
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile>
                    <v-btn data-tour-mobile-step="2" icon flat @click="editTodoMobile(todo)"><v-icon>create</v-icon></v-btn>
                    <v-btn data-tour-mobile-step="3" icon flat @click="deleteTodo(todo)"><v-icon>delete</v-icon></v-btn>
                    <!-- </v-list-tile-content> -->
                  </v-list-tile>
                </v-list-group>
              </v-list>
            </template>
            <p v-else-if="(!dbLoading) && todos && todos.length === 0">No todos yet. Try adding one below.</p>
            <v-text-field data-tour-step="1" single-line label="What do you plan on doing?" v-model="newTodo" @keyup.enter="addTodo" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="editDialog"
      v-if="editDialog"
    >
      <v-card>
        <v-card-title class="title">Edit Todo</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="todoToEdit.task"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat class="blue--text" @click="updateTodo(todoToEdit)">Done</v-btn>
          <v-btn flat class="pink--text" @click="stopEditing">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-tour name="welcomeTour" :steps="welcomeSteps"></v-tour>
    <v-tour name="actionsTour" :steps="actionsSteps"></v-tour>
    <v-tour name="actionsMobileTour" :steps="actionsMobileSteps"></v-tour>
  </v-container>
</template>

<script>
// import { firestore } from '@/fbase'
import { firebase } from '@firebase/app'
import VclTodoItem from './VclTodoItem'
// let firestore = null

export default {
  // firestore () {
  //   let firestore = firebase.firestore()
  //   return {
  //     todos: firestore.collection(firebase.auth().currentUser.uid)
  //   }
  // },
  data: () => ({
    editingTodo: false,
    toEdit: '',
    todoToEdit: null,
    todos: [],
    newTodo: '',
    editDialog: false,
    dbLoading: true,
    wasAnonymous: false,
    welcomeSteps: [
      {
        target: '[data-tour-step="1"]',
        content: `Type a todo here and hit enter!`
      }
    ],
    actionsSteps: [
      {
        target: '[data-tour-step="2"]',
        content: `Click here to edit your todo!`
      },
      {
        target: '[data-tour-step="3"]',
        content: `Click here to delete your todo!`
      }
    ],
    actionsMobileSteps: [
      {
        target: '[data-tour-mobile-step="2"]',
        content: `Click here to edit your todo!`
      },
      {
        target: '[data-tour-mobile-step="2"]',
        content: `Click here to delete your todo!`
      }
    ]
  }),
  created () {
    // let self = this
    if (!this.currentUser) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          if (user.isAnonymous) this.wasAnonymous = true
          // changing from anonymous to signed in user, db will reload
          if (this.wasAnonymous && !user.isAnonymous) {
            this.dbLoading = true
            this.wasAnonymous = false
          }
          this.$binding('todos', firebase.firestore().collection(user.uid)).then(() => {
            this.doneLoading()
          })
        } else {
          console.log('Signed out!')
        }
      })
    } else {
      this.wasAnonymous = this.currentUser.isAnonymous
      this.$binding('todos', firebase.firestore().collection(this.currentUser.uid)).then(() => {
        this.doneLoading()
      })
    }
  },
  mounted () {
  },
  methods: {
    doneLoading () {
      this.dbLoading = false
      this.$tours['welcomeTour'].start()
    },
    addTodo () {
      let todo = {
        task: this.newTodo,
        done: false
      }
      this.$firestore.todos.add(todo)
      this.newTodo = ''
      setTimeout(() => this.$tours[(this.smallScreen) ? 'actionsMobileTour' : 'actionsTour'].start(), 1000)
    },
    deleteTodo (todo) {
      this.$firestore.todos.doc(todo['.key']).delete()
    },
    markDone (todo) {
      this.$firestore.todos.doc(todo['.key']).update({
        done: !todo.done
      })
    },
    editTodo (todo) {
      if (this.editingTodo === true && this.toEdit === todo['.key']) {
        this.stopEditing()
      } else {
        this.editingTodo = true
        this.toEdit = todo['.key']
      }
    },
    updateTodoTask (todo, newTask) {
      newTask = newTask || todo.task
      this.$firestore.todos.doc(todo['.key']).update({
        task: newTask
      })
    },
    updateTodo (todo) {
      this.updateTodoTask(todo)
      this.stopEditing()
    },
    stopEditing () {
      this.editingTodo = false
      this.toEdit = ''
      this.todoToEdit = null
      this.editDialog = false
    },
    editTodoMobile (todo) {
      this.editDialog = true
      this.todoToEdit = todo
    }
  },
  computed: {
    smallScreen () {
      // console.log(this.$vuetify.breakpoint.name)
      return this.$vuetify.breakpoint.name === 'xs'
    },
    currentUser () {
      return this.$store.state.App.user
    }
  },
  components: {
    VclTodoItem
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.strike {
  text-decoration: line-through;
}
.taller > .list__tile {
  height: 56px !important;
}
</style>
