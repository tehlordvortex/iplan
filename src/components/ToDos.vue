<template>
  <v-layout row>
  	<v-flex  v-if="!ready" xs1 offset-sm12>
    	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </v-flex>
    <v-slide-y-transition>
      <v-flex v-show="ready && !noTodos" xs12>
        <v-card :flat="!!(ids || goal)" style="padding:0px">
          <v-list>
            <ToDoItem
              v-for="todo in items"
              :key="todo.name"
              :todo="todo"
              :callbacks="callbacks"
            >
            </ToDoItem>
          </v-list>
        </v-card>
        <v-dialog
          persistent
          v-model="showDeleteConfirm"
          lazy
          full-width
        >
          <v-card>
            <v-card-title><span class="headline mb-0">Are you sure?</span></v-card-title>
            <v-card-text>Are you sure you want to delete these todo(s)? This action is irreversible.</v-card-text>
            <v-card-actions>
              <v-btn @click.native.stop="confirmCallback" flat class="blue--text">Yes</v-btn>
              <v-btn @click.native.stop="abortCallback" flat class="red--text">No</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-slide-y-transition>
    <v-fab-transition>
      <v-btn
      	absolute
        fixed
        dark
        fab
        bottom
        right
        class="pink"
        style="margin-bottom: 3rem"
        v-show="ready && !hideAddButton"
        @click.native="createtodo"
      >
          <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-layout>
</template>

<script>
import ToDoItem from './ToDoItem'
export default {
    name: 'todos',
    props: ['goal', 'ids', 'hideAddButton'],
    created() {
      if (this.$root.$data.debug) console.log('created ToDos component')
      this.$root.$data.database.whenReady(() => {
          this.noTodos = this.$root.$data.database.getTodos().count() < 1
          if (this.noTodos) {
              this.ready = true
              this.$router.push({name: 'dashboard'})
              return
          }

          // makegoal action should not be available when viewing a goal/specific set of ids
          if (this.$root.$data.debug) console.log("ids or goals not specified", !(this.ids || this.goal))
          if (!(this.ids || this.goal))
            this.actions.push({
              text: 'Make into Goal',
              action: 'makegoal',
              icon: 'done_all'
            })
          this.$root.$data.actions = this.actions
          this.$root.$data.handlers.push(this.actionHandler)
          console.log(this.$root.$data.handler)
          this.buildData()
      })
    },
    destroyed() {
      if (this.$root.$data.debug) console.log('destroyed ToDos component')
      this.$root.$data.showActions = false
      //this.$root.$data.actions = []
      this.$root.$data.handlers = this.$root.$data.handlers.filter((e) => e != this.actionHandler)
    },
    data() {
      return {
          actions: [
          {
            text: 'Delete',
            action: 'delete',
            icon: 'delete',
          },
          ],
          actionSelected: "",
          selected: [],
          className: {},
          ready: false,
          noTodos: false,
          showDeleteConfirm: false,
          headers: [
            { text: 'Name', value: 'name' },
            { text: 'Due Date', value: 'dueDate'},
            { text: 'Due Time', value: 'dueTime'},
            { text: 'Done', value: 'done'},
            { text: 'Actions', value: 'actions' }
          ],
          items: [],
          callbacks: {
            select: this.select,
            update: this.updateToDo,
            delete_: this.deleteToDo,
            edit: this.editToDo
          }
      }
    },
    methods: {
      actionHandler: function (action) {
        this.actionSelected = action
        this.doTheThings()
      },
      buildData: function () {
        if (this.goal) {
          this.ready = true
          this.items = []
          for (let i=0;i<this.goal.todo_ids.length;i++) {
            let todo = null
            if (todo = this.$root.$data.database.getToDo(this.goal.todo_ids[i])) {
              this.items.push(todo)
            }
          }  
        }
        else if (this.ids) {
          this.ready = true
          this.items = []
          let ids = (typeof this.ids == 'string') ? this.ids.split(',') : this.ids
          for (let i = 0;i<ids.length;i++) {
            let todo = null;
            if (todo = this.$root.$data.database.getToDo(ids[i])) {
              this.items.push(todo)
            }
          }
        }
        else {
          var allTodos = this.$root.$data.database.getTodos().find({});
          if(this.$root.$data.debug) console.log(allTodos)
          if(allTodos.length == 0) {
            this.noTodos = true
            this.$router.push({name: 'dashboard'})
            return
          }
          this.ready = true
          this.items = allTodos;
        }
      },
      createtodo: function () {
        if (this.goal) {
          this.$router.push({name: 'createtodo', params: {goalId: this.goal._id}})
        }
        else {
          this.$router.push({name: 'createtodo'})
        }
      },
      updateToDo: function(todo) {
        todo.done = !todo.done
        this.$root.$data.database.updateToDo(todo)
        this.buildData()
      },
      deleteToDo: function (todo) {
        if(this.$root.$data.debug) console.log(todo)
        this.showDeleteConfirm = true
        this.confirmCallback = () => {
          if(this.goal) {
            this.goal.todo_ids = this.goal.todo_ids.filter((id) => id != todo._id)
            this.$root.$data.database.updateGoal(this.goal)
          }
          this.$root.$data.database.deleteToDo(todo)
          this.showDeleteConfirm = false
          this.confirmCallback = undefined
          this.buildData()
        }
        this.abortCallback = () => {
          this.showDeleteConfirm = false
          this.abortCallback = undefined
        }
      },
      editToDo: function (props) {
        if(this.$root.$data.debug) console.log(props)
        this.$router.push({name: 'edittodo', params: {id: props._id}})
      },
      doTheThings: function() {
        if(this.$root.$data.debug) console.log(this.actionSelected, this.selected)
        if (this.actionSelected && this.actionSelected.action == "delete") {
          this.showDeleteConfirm = true
          this.confirmCallback = () => {
            for (var i = 0;i < this.selected.length;i++) {
              var todo = this.selected[i]
              if (this.$root.$data.debug) console.log(todo)
              // if we're attached to a goal, remove the todo(s) from the goal
              // TODO: remove todos attached to a goal even when not called from Goal.vue
              if (this.goal) {
                this.goal.todo_ids = this.goal.todo_ids.filter((value, index) => value != todo._id)
                this.$root.$data.database.whenReady((db) => db.updateGoal(this.goal))
              }
              this.$root.$data.database.deleteToDo(todo)
            }
            this.$root.$data.showActions = false
            this.selected = []
            this.showDeleteConfirm = false
            this.confirmCallback = undefined
            this.buildData()
          }
          this.abortCallback = () => {
            this.selected.forEach((item) => this.select(item)) // undo selection
            this.selected = []
            this.showDeleteConfirm = false
            this.abortCallback = undefined
          }
        }
        else if(this.actionSelected && this.actionSelected.action == "makegoal") {
          let ids = []
          for (var i = 0;i < this.selected.length;i++) {
            ids.push(this.selected[i]._id)
          }
          this.selected = []
          this.$router.push({name: 'creategoal', params: {ids: ids}})
        }
      },
      select: function(item, e) {
        if (this.$root.$data.debug) console.log(document.getElementById(item._id))
        if(this.selected.indexOf(item) >= 0) {
          document.getElementsByName(item._id).forEach((e) => e.classList.remove("grey"))
          this.selected = this.selected.filter((a) => a != item)
          if (this.$root.$data.debug) console.log("de-selected: " + item)
        }
        else {
          document.getElementsByName(item._id).forEach((e) => e.classList.add("grey"))
          this.selected.push(item)
          if (this.$root.$data.debug) console.log("selected: " + item)
        }
        this.$root.$data.showActions = this.selected.length > 0
      }
  },
  components: {
    ToDoItem
  }
}
</script>
