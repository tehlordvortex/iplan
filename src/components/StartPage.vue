<template>
    <div id="content">
      <v-layout row>
        <v-fab-transition>
          <v-flex v-if="ready" xs12 sm6 offset-sm3>
            <v-card v-if="noTodos" class="primary white">
              <v-card-title primary-title><h3 class="headline mb-0">SO BLENK</h3></v-card-title>
              <v-card-text>You have yet to create any ToDo, Ser User.</v-card-text>
              <v-card-actions>
                <v-btn flat to="/create/todo" class="blue--text">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-fab-transition>
      </v-layout>
      <v-container grid-list-xl>
        <v-layout row>
          <v-flex xs12>
            <v-card v-if="!noTodos && ready"class="primary white">
              <v-card-title primary-title><h3 class="headline mb-0">Upcoming ToDos</h3></v-card-title>
              <v-card-text>
                <ToDos v-if="upcomingTodos != ''" :ids="upcomingTodos" :hideAddButton="true"></ToDos>
                <span v-else>Nothing left to do!</span>
              </v-card-text>
              <v-card-actions>
                <v-btn flat to="/todos" class="blue--text">View All</v-btn>
                <v-btn flat to="/create/todo" class="pink--text">Create One</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-card v-if="!noGoals && ready" class="primary white">
              <v-card-title primary-title><h3 class="headline mb-0">Upcoming Goals</h3></v-card-title>
              <v-card-text>
                <Goals v-if="upcomingGoals != ''" :ids="upcomingGoals"></Goals>
                <span v-else>No goals in the near future!</span>
              </v-card-text>
              <v-card-actions>
                <v-btn flat to="/goals" class="blue--text">View All</v-btn>
                <v-btn flat to="/todos" class="pink--text">Create One</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-fade-transition>
        <div class="splash blue" v-show="!ready">
          <v-progress-circular style="margin-top: 50vh;" indeterminate class="white--text">
            <h2 class="white--text" style="margin-bottom: 5rem">iPlan</h2>
          </v-progress-circular>
        </div>
      </v-fade-transition>
    </div>
</template>

<script>
import ToDos from './ToDos'
import Goals from './Goals'
export default {
    name: 'startPage',
    created() {
      this.$root.$data.database.whenReady(() => {
        this.noTodos = this.$root.$data.database.getTodos().count() < 1
        this.noGoals = this.$root.$data.database.getGoals().count() < 1
        this.ready = true
        if (this.noTodos) return
        var upcomingTodosData = this.$root.$data.database.getTodos()
                              .chain()
                              // do not include results without a dueDate
                              .find({"dueDate": {"$ne": null}, "done": {"$ne": true}})
                              .simplesort('dueDate')
                              //.simplesort('dueTime')
                              .limit(5)
                              .data()
        if (this.$root.$data.debug) console.log(upcomingTodosData)
        var upcomingTodosArray = []
        upcomingTodosData.forEach((data, i) => upcomingTodosArray.push(data._id))
        this.upcomingTodos = upcomingTodosArray.join(",")
        // grab up to five goals, sorted by due date and display them
        var upcomingGoalsData = this.$root.$data.database.getGoals()
                              .chain()
                              // do not include results without a dueDate
                              .find({"dueDate": {"$ne": null}})
                              .simplesort('dueDate')
                              .limit(5)
                              .data()
        if (this.$root.$data.debug) console.log(upcomingGoalsData)
        var upcomingGoalsArray = []
        upcomingGoalsData.forEach((data, i) => upcomingGoalsArray.push(data._id))
        this.upcomingGoals = upcomingGoalsArray.join(",")
      })
    },
    data() {
      return {
        ready: false,
        noTodos: false,
        upcomingTodos: "",
        upcomingGoals: ""
      }
    },
    methods: {
    },
    components: {
      ToDos,
      Goals
    }
}
</script>

<style scoped>
.splash {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9001;
  text-align: center;
}
.center {
  /*margin: auto;*/
}
</style>