<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 v-for="goal in goals" v-bind:key="goal.name">
        <v-card>
          <v-card-text>
            <h6 style="overflow-wrap:break-word">{{ goal.name }}</h6>
            <span>{{ goal.dueDate ? "Due: "+goal.dueDate : "" }}</span>
            <v-spacer></v-spacer>
            <v-btn
              flat
              icon
              style="float: right; margin-top: -2em"
              @click.native="viewGoal(goal._id)"
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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
