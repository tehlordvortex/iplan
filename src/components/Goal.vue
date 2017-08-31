<template>
  <v-layout>
    <v-flex xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title>
          <div class="subheading">{{ goal.name }}</div>
          <div class="subheading offset-sm1">{{ goal.dueDate }}</div>
        </v-card-title>
        <v-card-text>
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
