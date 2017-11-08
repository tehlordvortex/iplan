<template>
  <v-slide-y-reverse-transition>
  	<v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-toolbar flat class="purple" dark>
          <v-toolbar-title>New ToDo</v-toolbar-title>
        </v-toolbar>
        <v-card class="primary white">
          <v-card-text>
            <form>
            <v-layout row>
              <v-flex xs12>
                <v-alert
                  color="info"
                  icon="warning"
                  v-model="showError"
                  dismissible
                  class="red"
                >
                  {{ errorMessage }}
                </v-alert>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  label="Name"
                  v-model="name"
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
                    v-model="dueDate"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker
                    v-model="dueDate"
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
            </form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="blue--text" @click.native.stop="createToDo" primary flat>Create</v-btn>
            <v-btn class="red--text" @click.native.stop="goBack" flat>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-slide-y-reverse-transition>
</template>

<script>
export default {
	name: 'createToDo',
  data() {
    return {
      dueDate: null,
      dueTime: null,
      name: null,
      menuTime: false,
      menu: false,
      modalTime: false,
      modal: false,
      showError: false,
      errorMessage: ""
    }
  },
  methods: {
    createToDo: function () {
      if (!this.name) {
        this.showError = true
        this.errorMessage = "Name is required!"
        return
      }
      if (this.dueTime && !this.dueDate) {
        this.showError = true
        this.errorMessage = "A due date must be specified if a due time is specified!"
        return
      }
      //var that = this
      if (this.$root.$data.debug) console.log(this.name, this.dueDate, this.dueTime);
      this.$root.$data.database.whenReady(() => {
        var todoObj = {
          name: this.name,
          dueDate: this.dueDate,
          dueTime: this.dueTime,
          goalId: (this.$route.params.goalId) ? this.$route.params.goalId : null
        }
        this.$root.$data.database.addToDo(todoObj, (err, id) => {
          if(this.$root.$data.debug) console.log(this.$route.params.goalId)
          if (this.$route.params.goalId) {
            /*var goal = this.$root.$data.database.getGoal(this.$route.params.goalId)
            if(this.$root.$data.debug) console.log("Goal: " + goal)
            goal.todo_ids.push(id)
            this.$root.$data.database.updateGoal(goal)*/
            this.$router.push({name: 'goal', params: {id: this.$route.params.goalId}})
          }
          else {
            this.$router.push({name: 'todos'})
          }
        })
      })
    },
    goBack: function () {
      this.$router.go(-1)
    }
  }
}
</script>