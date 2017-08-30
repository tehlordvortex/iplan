<template>
  <v-layout>
    <v-flex v-for="goal in goals" v-bind:key="goal.name" xs12 sm8 offset-sm2>
      <v-card>
        <v-card-title>
          <div class="subheading">{{ goal.name }}</div>
          <div>{{ goal.dueDate }}</div>
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
  name: 'goals',
  created() {
    this.goals = this.$root.$data.database.getGoalsArray()
  },
  data() {
    goals: []
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
