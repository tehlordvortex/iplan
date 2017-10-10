<template>
  <v-layout row>
  	<v-flex  v-if="!ready" xs1 offset-sm12>
    	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </v-flex>
    <v-slide-y-transition>
      <v-flex v-show="ready && !noTodos" xs12>
      	<v-card class="hidden-sm-and-down" :flat="ids || goal">
          <v-card-text>
            <v-data-table
              v-bind:headers="headers"
              v-bind:items="items"
              hide-actions
              v-model="$root.$data.selected"
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
            <v-list-group 
              v-for="item in items"
              :value="actives[item.name]"
              v-bind:key="item.name"
              @contextmenu.stop.prevent=""
              >
              <v-touch v-on:press="select(item)"  slot="item">
                <v-list-tile :id="item._id">
                  <v-checkbox
                    primary
                    hide-details
                    style="display:inline"
                    :input-value="item.done"
                    @click.native.stop="updateToDo(item)"
                  >
                  </v-checkbox>
                  <v-list-tile-content>
                    
                    <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-icon v-show="item.dueDate">event</v-icon>
                      <span v-show="item.dueDate">{{ item.dueDate }}</span>
                      <v-icon v-show="item.dueTime">alarm</v-icon>
                      <span v-show="item.dueTime">{{ item.dueTime }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                  
                </v-list-tile>
              </v-touch>
              <v-list-tile @click="">
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
              </v-list-tile>
            </v-list-group>
          </v-list>
        </v-card>
        <v-card class="hidden-xs-only hidden-md-and-up" :flat="ids || goal" style="padding:0px">
          <v-list two-line>
            <template v-for="item in items">
              <v-touch v-on:press="select(item)" v-bind:key="item.name">
                <v-list-tile :id="item._id" @contextmenu.stop.prevent="">
                  <v-checkbox
                    primary
                    hide-details
                    style="display:inline"
                    :input-value="item.done"
                    @click.native="updateToDo(item)"
                  >
                  </v-checkbox>
                  <v-list-tile-content>
                    
                    <v-list-tile-title v-html="item.name"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <v-icon v-show="item.dueDate">event</v-icon>
                      <span v-show="item.dueDate">{{ item.dueDate }}</span>
                      <v-icon v-show="item.dueTime">alarm</v-icon>
                      <span v-show="item.dueTime">{{ item.dueTime }}</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
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
                </v-list-tile>
              </v-touch>
            </template>
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
      this.$root.$data.selected = this.selected
      this.$root.$data.actions = this.actions
      this.$root.$data.handler = (action) => {
        this.actionSelected = action
        this.doTheThings()
      }
    },
    data() {
      return {
          actions: [
          {
            text: 'Delete',
            action: 'delete',
            icon: 'delete'
          },
          {
            text: 'Make into Goal',
            action: 'makegoal',
            icon: 'done_all'
          }],
          actionSelected: "",
          selected: [],
          className: {},
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
          this.ready = true
          this.items = []
          this.actives = {}
          for (let i=0;i<this.goal.todo_ids.length;i++) {
            let todo = null
            if (todo = this.$root.$data.database.getToDo(this.goal.todo_ids[i])) {
              this.items.push(todo)
              this.actives[todo.name] = false
            }
          }  
        }
        else if (this.ids) {
          this.ready = true
          this.items = []
          this.actives = {}
          let ids = (typeof this.ids == 'string') ? this.ids.split(',') : this.ids
          for (let i = 0;i<ids.length;i++) {
            let todo = null;
            if (todo = this.$root.$data.database.getToDo(ids[i])) {
              this.items.push(todo)
              this.actives[todo.name] = false
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
          this.actives = {}
          this.items = allTodos;
          for(let i=0;i<this.items.length;i++) {
            this.actives[this.items[i].name] = false
          }
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
        if(this.goal) {
          this.goal.todo_ids = this.goal.todo_ids.filter((id) => id != todo._id)
          this.$root.$data.database.updateGoal(this.goal)
        }
        this.$root.$data.database.deleteToDo(todo)
        this.buildData()
      },
      editTodo: function (props) {
        if(this.$root.$data.debug) console.log(props)
        this.$router.push({name: 'edittodo', params: {id: props._id}})
      },
      doTheThings: function() {
        if(this.$root.$data.debug) console.log(this.actionSelected, this.selected)
        if (this.actionSelected && this.actionSelected.action == "delete") {
          for (var i = 0;i < this.$root.$data.selected.length;i++) {
            var todo = this.$root.$data.selected[i]
            if (this.$root.$data.debug) console.log(todo)
            if (this.goal) {
              this.goal.todo_ids = this.goal.todo_ids.filter((value, index) => value != todo._id)
              this.$root.$data.database.whenReady((db) => db.updateGoal(this.goal))
            }
            this.$root.$data.database.deleteToDo(todo)
          }
          this.$root.$data.selected = []
          this.buildData()
        }
        else if(this.actionSelected && this.actionSelected.action == "makegoal") {
          let ids = []
          for (var i = 0;i < this.$root.$data.selected.length;i++) {
            ids.push(this.$root.$data.selected[i]._id)
          }
          this.$root.$data.selected = []
          this.$router.push({name: 'creategoal', params: {ids: ids}})
        }
      },
      select: function(item, e) {
        if (this.$root.$data.debug) console.log(document.getElementById(item._id))
        if(this.$root.$data.selected.indexOf(item) >= 0) {
          document.getElementById(item._id).classList.remove("grey")
          this.$root.$data.selected = this.$root.$data.selected.filter((a) => a != item)
          if (this.$root.$data.debug) console.log("de-selected: " + item)
        }
        else {
          document.getElementById(item._id).classList.add("grey")
          this.$root.$data.selected.push(item)
          if (this.$root.$data.debug) console.log("selected: " + item)
        }
      }
  }
}
</script>
