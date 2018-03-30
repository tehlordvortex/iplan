<template>
  <v-container fluid>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
        <v-card>
          <v-card-title class="title">Todos</v-card-title>
          <v-card-text>
            <v-list two-line>
              <v-list-tile ripple v-for="(todo, index) in todos" :key="index">
                <v-list-tile-action>
                  <v-checkbox v-model="todo.done" @click="markDone(todo)"/>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-if="!editingTodo || toEdit != todo['.key']">{{ todo.task }}</v-list-tile-title>
                  <v-text-field v-model="todo.task" v-else-if="editingTodo && toEdit == todo['.key']" @blur="updateTodo(todo)" @keyup.enter="updateTodo(todo)" />
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon flat @click="editTodo(todo)"><v-icon>create</v-icon></v-btn>
                  <v-btn icon flat @click="deleteTodo(todo)"><v-icon>delete</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
            <v-text-field v-model="newTodo" @keyup.enter="addTodo" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// import { firestore } from '@/fbase'
import { firebase } from '@firebase/app'
// let firestore = null

export default {
  created () {
    if (!firebase.auth().currentUser) {
      this.$router.go('/')
    }
  },
  firestore () {
    let firestore = firebase.firestore()
    return {
      todos: firestore.collection(firebase.auth().currentUser.uid)
    }
  },
  data: () => ({
    editingTodo: false,
    toEdit: '',
    todos: [
    ],
    newTodo: ''
  }),
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
      this.editingTodo = true
      this.toEdit = todo['.key']
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
