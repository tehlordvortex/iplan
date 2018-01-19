<template>
  <div>
    <v-layout row>
    	<v-flex  v-if="!ready" xs1 offset-sm12>
      	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
      </v-flex>
      <v-slide-y-transition>
        <v-flex v-show="ready && !noTodos" class="todolist-flex" xs12 sm10 offset-sm1 md8 offset-md2>
          <!--<v-card :flat="!!(ids || goal)" style="padding:0px">-->
          <v-card flat class="pa-0">
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
          class="pink hidden-sm-and-up"
          style="margin-bottom: 3rem"
          v-show="ready && !hideAddButton"
          @click.native="createtodo"
        >
            <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-layout>
    <v-fab-transition>
      <v-speed-dial
        fixed
        v-model="showFab"
        direction="top"
        transition="scale-transition"
        v-show="ready && !hideAddButton"
        class="hidden-xs-only"
        bottom
        right
      >
        <v-btn
          slot="activator"
          class="pink"
          fab
          hover
          :dark="!showFab"
          :outline="showFab"
          v-model="showFab"
        >
          <v-icon>create</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn
          dark
          small
          fab
          class="green"
          @click.native="createtodo"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          dark
          small
          fab
          class="purple"
          v-if="!!!(ids || goal)"
          @click.native="callbacks.showSelect = !callbacks.showSelect"
        >
          <v-icon>view_agenda</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>
  </div>
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
          if (this.noTodos && !(this.ids || this.goal)) {
              this.ready = true
              this.$router.push({name: 'dashboard'})
              return
          }
          this.noTodos = false

          // makegoal action should not be available when viewing a goal/specific set of ids
          if (this.$root.$data.debug) console.log("ids or goals not specified", !(this.ids || this.goal))
          if (!(this.ids || this.goal))
            this.actions.push({
              text: 'Make into Goal',
              action: 'makegoal',
              icon: 'done_all'
            })
          let actionsObject = {}
          actionsObject.actions = this.actions
          actionsObject.handler = this.actionHandler
          actionsObject.callback = (id) => {
            this.actionsId = id;
          }
          eventBus.$emit('register-actions', actionsObject)
          if (this.$root.$data.debug) console.log(actionsObject)
          this.buildData()
      })
    },
    mounted() {
      let items = this.$el.querySelectorAll(".todolist-flex")
      if (this.$root.$data.debug) console.log(items)
      if (this.ids || this.goal) {
        items.forEach((n) => {
          n.classList.remove('sm10')
          n.classList.remove('offset-sm1')
          n.classList.remove('md8')
          n.classList.remove('offset-md2')
        })
      }
    },
    destroyed() {
      if (this.$root.$data.debug) console.log('destroying ToDos component')
      eventBus.$emit('unregister-actions', this.actionsId)
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
        showFab: false,
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
          edit: this.editToDo,
          isSelected: this.isToDoSelected,
          showSelect: false
        },
        actionsId: ''
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
          var allTodos = this.$root.$data.database.getTodos().find({})//{"goalId": {"$eq": null}});
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
      deleteToDo: function (todo, noConfirm) {
        if(this.$root.$data.debug) console.log(todo)
        if (noConfirm) {
          this.$root.$data.database.deleteToDo(todo);
          return;
        }
        this.showDeleteConfirm = true
        this.confirmCallback = () => {
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
          if (this.$root.$data.debug) console.log("delete popup")
          this.showDeleteConfirm = true
          this.confirmCallback = () => {
            this.selected.forEach((todo) => this.$root.$data.database.deleteToDo(todo));
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
          let length = this.selected.length
          if (this.$root.$data.debug) console.log(`selected array length: ${length}`)
          if (length == 0) { // all items deselected, hide the actions
            eventBus.$emit('hide-actions', this.actionsId);
          }
          if (this.$root.$data.debug) console.log("de-selected: " + item)
        }
        else {
          document.getElementsByName(item._id).forEach((e) => e.classList.add("grey"))
          let index = this.selected.push(item)
          if (index == 1) { // first item selected, show the actions
            eventBus.$emit('show-actions', this.actionsId);
          }
          if (this.$root.$data.debug) console.log(`selected ${item} ${index}`);
        }
      },
      isToDoSelected: function(todo) {
        let selected = this.selected.indexOf(todo) > -1
        if(this.$root.$data.debug) console.log("is " + todo + "selected: " + selected);
        return selected;
      }
  },
  components: {
    ToDoItem
  }
}
</script>
