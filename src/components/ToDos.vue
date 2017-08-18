<template>
  <v-layout row>
  	<v-flex  v-if="!ready" offset-sm6>
    	<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
    </v-flex>
    <v-flex v-if="ready && !noTodos" xs12 sm12>
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
    <v-btn
    	absolute
        fixed
        dark
        fab
        bottom
        right
        class="pink"
        style="margin-bottom: 3rem"
        v-if="ready && !noTodos"
        @click.native="createtodo"
    >
        <v-icon>add</v-icon>
    </v-btn>
  </v-layout>
</template>

<script>
import database from "../database"
export default {
    name: 'todos',
    created() {
        if(this.database.isReady()) {
            this.noTodos = this.database.getTodos().count() < 1
            if (this.noTodos) {
                this.ready = true
                this.$router.push({name: 'dashboard'})
                return
            }
            this.buildData()
        }
        else this.database.whenReady(() => {
            this.noTodos = this.database.getTodos().count() < 1
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
            database: database,
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
            var allTodos = this.database.getTodos().find({});
            console.log(allTodos)
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
          this.database.updateToDo(todo)
          this.buildData()
        },
        deleteToDo: function (todo) {
          console.log(todo)
          this.database.deleteToDo(todo)
          this.buildData()
        },
        editTodo: function (props) {
          console.log(props)
          this.$router.push({name: 'edittodo', params: {id: props._id}})
        }
    }
}
</script>
