<template>
  <v-slide-y-reverse-transition>
  	<v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-toolbar flat class="purple" dark>
          <v-toolbar-title>Edit Goal</v-toolbar-title>
        </v-toolbar>
        <v-card flat>
          <v-card-text>
            <form>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    label="Name"
                    v-model="goal.name"
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
                      label="Date when Goal is due"
                      v-model="goal.dueDate"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="goal.dueDate"
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
                      label="Date when Goal is due"
                      v-model="goal.dueDate"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker
                      v-model="goal.dueDate"
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
            </form>
          </v-card-text>
          <v-card-actions>
            <v-btn class="blue--text" @click.native.stop="updateGoal" primary flat>Update</v-btn>
            <v-btn class="red--text" @click.native.stop="goBack" flat>Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-slide-y-reverse-transition>
</template>

<script>
import ToDos from './ToDos.vue'
export default {
  name: 'edit-goal',
  created() {
    this.$root.$data.database.whenReady(() => {
      this.goal = this.$root.$data.database.getGoal(this.$route.params.id)
    })
  },
  data() {
    return {
      dueDate: null,
      name: null,
      menu: false,
      modalTime: false,
      modal: false,
      goal: null
    }
  },
  methods: {
    updateGoal: function () {
      if (!this.goal.name || !this.goal.todo_ids || this.goal.todo_ids.length == 0) return;
      this.$root.$data.database.updateGoal(this.goal)
      this.goBack()
    },
    goBack: function () {
      this.$router.go(-1)
    }
  },
  components: {
    ToDos
  }
}
</script>
