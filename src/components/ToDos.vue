<template>
  <v-layout row>
  	<v-flex  v-if="!ready" xs1 offset-sm12>
    	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </v-flex>
    <v-slide-y-transition>
      <v-flex v-show="ready && !noTodos" xs12 sm12>
      	<v-card flat class="flat">
              <v-card-text style="height: 100%" class="grey lighten-5">
                <v-data-table
                  v-bind:headers="headers"
                  :items="items"
                  hide-actions
                  class="elevation-1"
                >
                <template slot="items" scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">{{ props.item.dueDate }}</td>
                  <td class="text-xs-right">{{ props.item.dueTime }}</td>
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
                      @click.native="deleteToDo(props.item)"
                    >
                      <v-icon>delete</v-icon>
                    </v-btn>
                    <v-btn
                      flat
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
          v-show="ready && !noTodos"
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
            var allTodos = this.$root.$data.database.getTodos().find({});
            if(this.$root.$data.debug) console.log(allTodos)
            if(allTodos.length == 0) {
              this.noTodos = true
              this.$router.push({name: 'dashboard'})
              return
            }
            this.ready = true
            this.items = allTodos;
        },
        createtodo: function () {
          this.$router.push('/createtodo')
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
        }
    }
}
</script>
