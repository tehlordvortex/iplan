<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card>
        <v-card-title>
          <div class="headline">{{ goal.name }}</div>
        </v-card-title>
        <v-card-text>
           <span v-show="goal.dueDate">
            <v-icon>event</v-icon>
            <span>{{ goal.dueDate }}</span>
           </span>
          <ToDos v-bind:ids="goal.todo_ids.join(',')"></ToDos>
        </v-card-text>
      </v-card>
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
      goal: null
    }
  },
  methods: {
    buildData(db) {
      this.goal = db.getGoal(this.$route.params.id)
    }
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
