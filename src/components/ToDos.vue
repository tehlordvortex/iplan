<template>
  <v-layout row>
  	<v-flex  v-if="!ready" xs1 offset-sm12>
    	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </v-flex>
    <v-slide-y-transition>
      <v-flex v-show="ready && !noTodos" xs12>
      	<v-card class="hidden-xs-only" :flat="ids || goal">
              <v-card-text>
                <v-toolbar v-show="selected.length != 0" class="white" flat absolute fixed dense style="margin-top: 3em">
                  <v-toolbar-title>With selected:</v-toolbar-title>
                  <v-select
                    v-bind:items="actions"
                    v-model="actionSelected"
                    label="Select"
                    single-line
                    hide-details
                  ></v-select>
                  <v-btn
                    icon
                    flat
                    @click.native="doTheThings"
                  >
                    <v-icon>done</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-data-table
                  v-bind:headers="headers"
                  v-bind:items="items"
                  hide-actions
                  v-model="selected"
                  selected-key="_id"
                  select-all
                >
                <template slot="items" scope="props">
                  <td>
                    <v-checkbox
                      primary
                      hide-details
                      v-model="props.selected"
                    ></v-checkbox>
                  </td>
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">{{ props.item.dueDate || "Never" }}</td>
                  <td class="text-xs-right">{{ props.item.dueTime || "Never" }}</td>
                  <td class="text-xs-right">
                    <v-checkbox
                      primary
                      hide-details
                      :input-value="props.item.done"
                      @click.native="updateToDo(props.item)"
                    >
                    </v-checkbox>
                  </td>
                  <td class="text-xs-right center">
                    <v-btn
                      flat
                      class="xs1 sm1"
                      icon
                      @click.native="deleteToDo(props.item)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn
                      flat
                      icon
                      class="xs1 sm1"
                      @click.native="editTodo(props.item)"
                    >
                      <v-icon>create</v-icon>
                    </v-btn>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-card class="hidden-sm-and-up" :flat="ids || goal" style="padding:0px">
            <v-list>
              <v-list-group v-for="item in items" :value="actives[item.name]" v-bind:key="item.name">
                <v-list-tile slot="item">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-icon v-show="item.dueDate">event</v-icon>
                      <span v-show="item.dueDate">{{ item.dueDate }}</span>
                      <v-icon v-show="item.dueTime">alarm</v-icon>
                      <span v-show="item.dueTime">{{ item.dueTime }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-checkbox
                    primary
                    hide-details
                    :input-value="item.done"
                    @click.native="updateToDo(item)"
                  >
                  </v-checkbox>
                </v-list-tile>
                <v-list-tile>
                    <v-list-tile-title>
                      <v-btn
                        flat
                        class="xs1 sm1"
                        icon
                        @click.native="deleteToDo(item)"
                      >
                        <v-icon>delete</v-icon>
                      </v-btn>
                      <v-btn
                        flat
                        icon
                        class="xs1 sm1"
                        @click.native="editTodo(item)"
                      >
                        <v-icon>create</v-icon>
                      </v-btn>
                    </v-list-tile-title>
                </v-list-tile>
              </v-list-group>
            </v-list>
          </v-card>
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
export default {
    name: 'todos',
    props: ['goal', 'ids', 'hideAddButton'],
    created() {
        if(this.$root.$data.database.isReady()) {
            this.noTodos = this.$root.$data.database.getTodos().count() < 1
            if (this.noTodos) {
                this.ready = true
                this.$router.push({name: 'dashboard'})
                return
            }
            this.buildData()
        }
        else this.$root.$data.database.whenReady(() => {
            this.noTodos = this.$root.$data.database.getTodos().count() < 1
            if (this.noTodos) {
                this.ready = true
                this.$router.push({name: 'dashboard'})
                return
            }
            this.buildData()
        })
    },
    data() {
        return {
            actions: [
            {
              text: 'Delete',
              action: 'delete'
            },
            {
              text: 'Make into Goal',
              action: 'makegoal'
            }],
            actionSelected: "",
            selected: [],
            ready: false,
            noTodos: false,
            headers: [
              { text: 'Name', value: 'name' },
              { text: 'Due Date', value: 'dueDate'},
              { text: 'Due Time', value: 'dueTime'},
              { text: 'Done', value: 'done'},
              { text: 'Actions', value: 'actions' }
            ],
            items: []
        }
    },
    methods: {
        buildData: function () {
          if (this.goal) {
            var goal = this.$root.$data.database.getGoal(goal);
            this.ready = true
            this.items = []
            this.actives = {}
            for (let i=0;i<goal.todos.length;i++) {
              let todo = null
              if (todo = this.$root.$data.database.getToDo(goal.todos[i]))
                this.items.push(todo);
                this.actives[todo.name] = false
            }  
          }
          else if (this.ids) {
            this.ready = true
            this.items = []
            this.actives = {}
            let ids = (typeof this.ids == 'string') ? this.ids.split(',') : this.ids
            for (let i = 0;i<ids.length;i++) {
              let todo = null;
              if ((todo = this.$root.$data.database.getToDo(ids[i])))
                this.items.push(todo);
                this.actives[todo.name] = false
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
            this.actives = {}
            this.items = allTodos;
            for(let i=0;i<this.items.length;i++) {
              this.actives[this.items[i].name] = false
            }
          }
        },
        createtodo: function () {
          if (this.goal) {
            this.$router.push({name: 'createtodo', params: {goalId: this.goal}})
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
          this.$root.$data.database.deleteToDo(todo)
          this.buildData()
        },
        editTodo: function (props) {
          if(this.$root.$data.debug) console.log(props)
          this.$router.push({name: 'edittodo', params: {id: props._id}})
        },
        doTheThings: function() {
          if (this.actionSelected && this.actionSelected.action == "delete") {
            for (var i = 0;i < this.selected.length;i++) {
              var todo = this.$root.$data.database.getToDo(this.selected[i]._id)
              if (this.$root.$data.debug) console.log(todo)
              if (this.goal) {
                this.goal.todo_ids = this.goal.todo_ids.filter((value, index) => value != todo._id)
                this.$root.$data.database.whenReady((db) => db.updateGoal(this.goal))
              }
              this.$root.$data.database.deleteToDo(todo)
            }
            this.selected = []
            this.buildData()
          }
          else if(this.actionSelected && this.actionSelected.action == "makegoal") {
            let ids = []
            for (var i = 0;i < this.selected.length;i++) {
              ids.push(this.selected[i]._id)
            }
            this.selected = []
            this.$router.push({name: 'creategoal', params: {ids: ids}})
          }
        }
    }
}
</script>
