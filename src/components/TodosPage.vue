<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <v-card>
          <v-progress-linear v-if="dbLoading" :indeterminate="true"></v-progress-linear>
          <v-card-title class="title">Todos</v-card-title>
          <v-card-text>
            <v-list v-if="!smallScreen">
              <v-list-tile ripple v-for="(todo, index) in todos" :key="index" class="taller">
                <v-list-tile-action>
                  <v-checkbox v-model="todo.done" @click="markDone(todo)"/>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-if="!editingTodo || toEdit !== todo['.key']">{{ todo.task }}</v-list-tile-title>
                  <v-text-field single-line v-model="todo.task" v-else-if="editingTodo && toEdit === todo['.key']" @blur="updateTodo(todo)" @keyup.enter="updateTodo(todo)" />
                </v-list-tile-content>
                <!-- <v-list-tile-action> -->
                  <v-btn icon flat @click="editTodo(todo)"><v-icon>create</v-icon></v-btn>
                  <v-btn icon flat @click="deleteTodo(todo)"><v-icon>delete</v-icon></v-btn>
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
                    <v-list-tile-title v-if="!editingTodo || toEdit != todo['.key']">{{ todo.task }}</v-list-tile-title>
                    <v-text-field v-model="todo.task" v-else-if="editingTodo && toEdit == todo['.key']" @blur="updateTodo(todo)" @keyup.enter="updateTodo(todo)" />
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-btn icon flat @click="editTodoMobile(todo)"><v-icon>create</v-icon></v-btn>
                  <v-btn icon flat @click="deleteTodo(todo)"><v-icon>delete</v-icon></v-btn>
                  <!-- </v-list-tile-content> -->
                </v-list-tile>
              </v-list-group>
            </v-list>
            <v-text-field v-model="newTodo" @keyup.enter="addTodo" />
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
  </v-container>
</template>

<script>
// import { firestore } from '@/fbase'
import { firebase } from '@firebase/app'
// let firestore = null

export default {
  created () {
    // if (!firebase.auth().currentUser) {
    //   this.$router.go('/')
    // }
  },
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
    todos: [
    ],
    newTodo: '',
    editDialog: false,
    dbLoading: true
  }),
  mounted () {
    // let self = this
    if (!this.currentUser) {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$binding('todos', firebase.firestore().collection(user.uid)).then(() => {
            this.dbLoading = false
          })
        }
      })
    } else {
      this.$binding('todos', firebase.firestore().collection(this.currentUser.uid)).then(() => {
        this.dbLoading = false
      })
    }
  },
  methods: {
    addTodo () {
      let todo = {
        task: this.newTodo,
        done: false
      }
      this.$firestore.todos.add(todo)
      this.newTodo = ''
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.taller > .list__tile {
  height: 56px !important;
}
</style>
