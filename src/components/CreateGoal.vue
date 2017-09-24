<template>
  <v-slide-y-reverse-transition>
  	<v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <v-toolbar flat class="purple" dark>
          <v-toolbar-title>New Goal</v-toolbar-title>
        </v-toolbar>
        <v-card class="primary white">
          <v-card-text>
            <form>
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
                      label="Date when Goal is due"
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
                      label="Date when Goal is due"
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
            </form>
            <ToDos :ids="ids" :hideAddButton="true"></ToDos>
          </v-card-text>
          <v-card-actions>
            <v-btn class="blue--text" @click.native.stop="createGoal" primary flat>Create</v-btn>
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
  name: 'createGoal',
  created() {
    this.ids = JSON.parse(JSON.stringify(this.$route.params.ids))
  },
  data() {
    return {
      dueDate: null,
      name: null,
      menu: false,
      modalTime: false,
      modal: false,
      ids: []
    }
  },
  methods: {
    createGoal: function () {
      if (!this.name || !this.ids || this.ids.length == 0) return;
      let that = this;
      this.$root.$data.database.whenReady(() => this.$root.$data.database.addGoal(this.name, this.dueDate, this.ids, (err, id) => {
        if (!err)
          that.$router.push({name: 'goal', params: {id: id}})
      }))
      
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
