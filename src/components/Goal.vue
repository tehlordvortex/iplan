<template>
  <v-layout>
    <v-flex xs12 sm10 offset-sm1>
      <v-card v-if="!this.notFound">
        <v-card-title>
          <div class="headline">{{ goal.name }}</div>
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
      notFound: false
    }
  },
  methods: {
    buildData(db) {
      this.goal = db.getGoal(this.$route.params.id)
      if (!this.goal)
        this.notFound = true
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
