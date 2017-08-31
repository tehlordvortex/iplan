<template>
  <v-layout>
    <v-layout row v-for="goal in goals" v-bind:key="goal.name">
      <v-flex xs12 sm8 offset-sm2>
        <v-card>
          <v-card-title>
            <div class="subheading">{{ goal.name }}</div>
            <div class="text-xs-right">{{ goal.dueDate }}</div>
          </v-card-title>
          <v-card-actions>
            <v-btn
              flat
              @click.native="viewGoal(goal._id)"
            >
              <v-icon>arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
import ToDos from './ToDos'
export default {
  name: 'goals',
  created() {
    this.$root.$data.database.whenReady(() => 
    this.goals = this.$root.$data.database.getGoalsArray())
  },
  data() {
    return {
      goals: []
    }
  },
  methods: {
    viewGoal(id) {
      this.$router.push({name: 'goal', params: {id: id}})
    }
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
