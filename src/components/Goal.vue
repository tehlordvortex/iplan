<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-if="!this.notFound">
        <v-card-title>
          <div class="headline">{{ goal.name }}</div>
          <div>
            <v-btn icon flat @click.native.stop="deleteGoal"><v-icon>delete</v-icon></v-btn>
          </div>
        </v-card-title>
        <v-card-text>
           <span v-show="goal.dueDate">
            <v-icon>event</v-icon>
            <span>{{ goal.dueDate }}</span>
           </span>
          <ToDos v-bind:goal="goal"></ToDos>
        </v-card-text>
      </v-card>
      <v-card v-if="this.notFound">
        <v-card-title>
          <div class="headline">Goal Not Found</div>
        </v-card-title>
        <v-card-text>There exists no goal with the specified ID</v-card-text>
        <v-card-actions>
          <v-btn flat primary @click.native.stop="goBack()">Back</v-btn>
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
  name: 'goal',
  created() {
    this.$root.$data.database.whenReady(this.buildData)
  },
  data() {
    return {
      goal: null,
      notFound: false,
      showDeleteConfirm: false
    }
  },
  methods: {
    buildData(db) {
      this.goal = db.getGoal(this.$route.params.id)
      if(this.$root.$data.debug) console.log(this.goal)
      if (!this.goal)
        this.notFound = true
    },
    deleteGoal() {
      this.showDeleteConfirm = true
      this.confirmCallback = () => {
        this.goal.todo_ids.forEach((todoId) => {
          var todo = this.$root.$data.database.getToDo(todoId)
          if(this.$root.$data.debug) console.log(todo)
          if(!todo) return
          if (todo.goalId && todo.goalId == this.goal._id) {
            this.$root.$data.database.deleteToDo(todo)
          }
        })
        this.$root.$data.database.deleteGoal(this.goal)
        this.showDeleteConfirm = false
        this.$router.go(-1)
      }
      this.abortCallback = () => {
        this.showDeleteConfirm = false
      }
    },
    goBack() {
      this.$router.go(-1)
    }
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
