<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
      <v-card flat v-if="!this.notFound">
        <v-card-title>
          <span style="font-size: 2em">{{ goal.name }}</span>
          <v-spacer></v-spacer>
          <v-btn icon flat :to="'/edit/goal/' + goal._id"><v-icon>create</v-icon></v-btn>
          <v-btn icon flat @click.native.stop="deleteGoal"><v-icon>delete</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
           <span v-show="goal.dueDate">
            <v-icon>event</v-icon>
            <span>{{ goal.dueDate }}</span>
           </span>
          <ToDos v-if="goal.todo_ids.length > 0" v-bind:goal="goal"></ToDos>
          <v-layout v-else row>
            <v-flex xs1 offset-xs4 sm2 offset-sm5>
              <v-btn
                fab
                flat
                large
                class="pink"
                xs2
                offset-xs10
                :to="'/create/todo/' + goal._id">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card flat v-else>
        <v-card-title>
          <span style="font-size: 2em">Goal Not Found</span>
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
          <v-card-text>Are you sure you want to delete these goal(s)? This action is irreversible.</v-card-text>
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
      if(this.$root.$data.debug) console.log(this.goal.todo_ids)
      if (!this.goal)
        this.notFound = true
    },
    deleteGoal() {
      this.showDeleteConfirm = true
      this.confirmCallback = () => {
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
