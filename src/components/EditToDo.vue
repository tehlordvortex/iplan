<template>
  <v-slide-x-transition>
  	<v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-toolbar flat class="purple" dark>
          <v-toolbar-title>Edit ToDo</v-toolbar-title>
        </v-toolbar>
        <v-card class="primary white">
          <v-card-text>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  label="Name"
                  v-model="todo.name"
                  prepend-icon="create"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menu"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-left="40"
                  max-width="290px"
                  class="hidden-xs-only"
                >
                  <v-text-field
                    slot="activator"
                    label="Date when ToDo is due"
                    v-model="todo.dueDate"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="todo.dueDate"
                    scrollable
                    actions
                  >
                    <template scope=" { save, cancel }">
                      <v-card-actions>
                        <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                        <v-btn flat primary @click.native="save()">Save</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-menu>
                <v-dialog
                  persistent
                  v-model="modal"
                  lazy
                  full-width
                  class="hidden-sm-and-up"
                >
                   <v-text-field
                    slot="activator"
                    label="Date when ToDo is due"
                    v-model="todo.dueDate"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="todo.dueDate"
                    scrollable
                    actions
                  >
                    <template scope=" { save, cancel }">
                      <v-card-actions>
                        <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                        <v-btn flat primary @click.native="save()">Save</v-btn>
                      </v-card-actions>
                    </template>
                  </v-date-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-menu
                  lazy
                  :close-on-content-click="false"
                  v-model="menuTime"
                  transition="scale-transition"
                  offset-y
                  full-width
                  :nudge-left="40"
                  max-width="290px"
                  class="hidden-xs-only"
                >
                  <v-text-field
                    slot="activator"
                    label="Time when ToDo is due"
                    v-model="todo.dueTime"
                    prepend-icon="alarm"
                    readonly
                  ></v-text-field>
                  <v-time-picker
                    v-model="todo.dueTime"
                    scrollable
                    actions
                  >
                    <template scope=" { save, cancel }">
                      <v-card-actions>
                        <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                        <v-btn flat primary @click.native="save()">Save</v-btn>
                      </v-card-actions>
                    </template>
                  </v-time-picker>
                </v-menu>
                <v-dialog
                  persistent
                  v-model="modalTime"
                  lazy
                  full-width
                  class="hidden-sm-and-up"
                >
                  <v-text-field
                    slot="activator"
                    label="Time when ToDo is due"
                    v-model="todo.dueTime"
                    prepend-icon="alarm"
                    readonly
                  ></v-text-field>
                  <v-time-picker
                    v-model="todo.dueTime"
                    scrollable
                    actions
                  >
                    <template scope=" { save, cancel }">
                      <v-card-actions>
                        <v-btn flat primary @click.native="cancel()">Cancel</v-btn>
                        <v-btn flat primary @click.native="save()">Save</v-btn>
                      </v-card-actions>
                    </template>
                  </v-time-picker>
                </v-dialog>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-checkbox
                  primary
                  hide-details
                  :input-value="todo.done"
                  @click.native="todo.done = !todo.done"
                  label="Done"
                >
                </v-checkbox>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-btn class="blue--text" @click.native.stop="editToDo" primary flat>Update</v-btn>
            <v-btn class="red--text" @click.native.stop="goBack" flat>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-slide-x-transition>
</template>

<script>
export default {
	name: 'editToDo',
  created() {
      if(this.$root.$data.database.isReady()) {
        this.buildData()
      }
      else {
        this.$root.$data.database.whenReady(() => {
          this.buildData()
        })
      }
  },
  data() {
    return {
      todo: null,
      menuTime: false,
      menu: false,
      modalTime: false,
      modal: false
    }
  },
  methods: {
    buildData: function () {
      this.todo = {...this.$root.$data.database.getToDo(this.$route.params.id)} // make a copy to avoid weird issues
      // whereby typing nothing in todo.name and hitting cancel nullifies the original todo
    },
    editToDo: function () {
      if(!this.todo.name) return
      this.$root.$data.database.updateToDo(this.todo)
      this.$router.go(-1)
    },
    goBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>