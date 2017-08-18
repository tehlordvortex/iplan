<template>
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
                v-model="name"
                prepend-icon="create"
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
                  v-model="dueDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="dueDate"
                  no-title
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
                  v-model="dueDate"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker
                  v-model="dueDate"
                  no-title
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
                  v-model="dueTime"
                  prepend-icon="alarm"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-model="dueTime"
                  no-title
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
                  v-model="dueTime"
                  prepend-icon="alarm"
                  readonly
                ></v-text-field>
                <v-time-picker
                  v-model="dueTime"
                  no-title
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
                :input-value="done"
                @click.native="done = !done"
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
</template>

<script>
import database from "../database"
export default {
	name: 'editToDo',
  created() {
      if(database.isReady()) {
        this.buildData()
      }
      else {
        database.whenReady(() => {
          this.buildData()
        })
      }
  },
  data() {
    return {
      todo: null,
      dueDate: null,
      dueTime: null,
      done: false,
      name: null,
      menuTime: false,
      menu: false,
      modalTime: false,
      modal: false
    }
  },
  methods: {
    buildData: function () {
      this.todo = database.getToDo(this.$route.params.id)
      console.log(this.todo)
      this.name = this.todo.name
      this.dueDate = this.todo.dueDate
      this.dueTime = this.todo.dueTime
      this.done = this.todo.done
      console.log(this.dueDate)
    },
    editToDo: function () {
      this.todo.name = this.name
      this.todo.dueDate = this.dueDate
      this.todo.dueTime = this.dueTime
      this.todo.done = this.done
      database.updateToDo(this.todo)
      this.$router.push('/')
    },
    goBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>