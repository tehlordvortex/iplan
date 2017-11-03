<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <!-- if there are specific ids being displayed, then flatten the card to fit into the UI -->
        <v-card :flat="!!ids">
          <v-list two-line>
            <template v-for="goal in goals">
              <v-list-tile v-bind:key="goal.name">
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
                    @click.native="deleteGoal(goal)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                  <v-btn
                    flat
                    icon
                    @click.native="viewGoal(goal._id)"
                  >
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-btn>
                <!--</v-list-tile-action>-->
              </v-list-tile>
            </template>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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
      goals: []
    }
  },
  methods: {
    viewGoal(id) {
      this.$router.push({name: 'goal', params: {id: id}})
    },
    deleteGoal(goal) {
      this.goals = this.goals.filter((g) => g != goal)
      this.$root.$data.database.deleteGoal(goal)
    }
  },
  components: {
    ToDos
  }
}
</script>

<style>

</style>
