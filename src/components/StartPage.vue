<template>
    <div id="content">
        <v-layout row>
            <v-flex v-if="ready && noTodos" xs6 sm6 offset-sm3>
                <v-card class="primary white">
                    <v-card-title primary-title><h3 class="headline mb-0">SO BLENK</h3></v-card-title>
                    <v-card-text>You have yet to create any ToDo, Ser User.</v-card-text>
                    <v-card-actions>
                        <v-btn flat to="/createtodo" class="blue--text">Create</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
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
                        <td class="xs1 right">
                          <v-btn
                            flat
                            @click.native="deleteToDo(props.item)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
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
    </div>
</template>

<script>
import database from "../database"
export default {
    name: 'startPage',
    created() {
        if(this.database.ready) {
            this.noTodos = this.database.todos.count() < 1
            if (this.noTodos) {
                this.ready = true
                return
            }
            this.buildData()
        }
        else this.database.whenReady(() => {
            this.noTodos = this.database.todos.count() < 1
            if (this.noTodos) {
                this.ready = true
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
              { text: 'Actions', value: 'actions' }
            ],
            items: []
        }
    },
    methods: {
        buildData: function () {
            var allTodos = this.database.todos.find({});
            console.log(allTodos)
            if(allTodos.length == 0) {
              this.noTodos = true
              return
            }
            this.ready = true
            this.items = allTodos;
        },
        createtodo: function () {
          this.$router.push('/createtodo')
        },
        deleteToDo: function (todo) {
          console.log(todo)
          this.database.deleteToDo(todo)
          this.buildData()
        }
    }
}
</script>

<style scoped>
#content {

}
</style>