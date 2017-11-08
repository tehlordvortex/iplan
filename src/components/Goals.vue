<template>
  <v-layout row>
    <v-flex xs12>
      <!-- if there are specific ids being displayed, then flatten the card to fit into the UI -->
      <v-card v-if="this.goals.length > 0" :flat="!!ids" style="padding:0px">
        <v-list two-line>
          <template v-for="goal in goals">
            <v-list-tile v-bind:key="goal.name" @click.native.stop="viewGoal(goal._id)" :ripple="false">
              <v-list-tile-content>
                <v-list-tile-title v-html="goal.name"></v-list-tile-title>
                <v-list-tile-sub-title v-show="goal.dueDate">
                  <v-icon>event</v-icon>
                  <span>{{ goal.dueDate }}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <!--<v-list-tile-action>-->
                <v-btn
                  flat
                  icon
                  @click.native.stop="deleteGoal(goal)"
                >
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn
                  flat
                  icon
                  @click.native.stop="viewGoal(goal._id)"
                >
                  <v-icon>keyboard_arrow_right</v-icon>
                </v-btn>
              <!--</v-list-tile-action>-->
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
      <v-card v-else>
        <v-card-title><h3 class="headline mb-0">No Goals</h3></v-card-title>
        <v-card-text>You seem to have no goals in life.</v-card-text>
        <v-card-actions>
          <v-btn to="/todos" class="blue--text" flat>Create One</v-btn>
        </v-card-actions>
      </v-card>
      <v-dialog
          persistent
          v-model="showDeleteConfirm"
          lazy
          full-width
      >
        <v-card>
          <v-card-title><span class="headline mb-0">Are you sure?</span></v-card-title>
          <v-card-text>Are you sure you want to delete these goals(s)? This action is irreversible.</v-card-text>
          <v-card-actions>
            <v-btn @click.native.stop="confirmCallback" flat class="blue--text">Yes</v-btn>
            <v-btn @click.native.stop="abortCallback" flat class="red--text">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import ToDos from './ToDos'
export default {
  name: 'goals',
  props: ['ids'],
  created() {
    if(!this.ids)
      this.$root.$data.database.whenReady(() => 
        this.goals = this.$root.$data.database.getGoalsArray())
    else {
      this.goals = []
      this.ids.split(",").forEach((id) => this.goals.push(this.$root.$data.database.getGoal(id)))
    }
  },
  data() {
    return {
      goals: [],
      showDeleteConfirm: false
    }
  },
  methods: {
    viewGoal(id) {
      this.$router.push({name: 'goal', params: {id: id}})
    },
    deleteGoal(goal) {
      this.showDeleteConfirm = true
      this.confirmCallback = () => {
        this.goals = this.goals.filter((g) => g != goal)
        goal.todo_ids.forEach((todoId) => {
          var todo = this.$root.$data.database.getToDo(todoId)
          if(this.$root.$data.debug) console.log(todo)
          if(!todo) return
          if (todo.goalId && todo.goalId == goal._id) {
            this.$root.$data.database.deleteToDo(todo)
          }
        })
        this.showDeleteConfirm = false
        this.$root.$data.database.deleteGoal(goal)
      }
      this.abortCallback = () => {
        this.showDeleteConfirm = false
      }
    }
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
