<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          <v-list two-line>
            <template v-for="goal in goals">
              <v-list-tile @click.native="viewGoal(goal._id)" v-bind:key="goal.name">
                <v-list-tile-content>
                  <v-list-tile-title v-html="goal.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-show="goal.dueDate">
                    <v-icon>event</v-icon>
                    <span>{{ goal.dueDate }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                   <v-btn
                    flat
                    icon
                    @click.native="viewGoal(goal._id)"
                  >
                    <v-icon>keyboard_arrow_right</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
          <!--
          <v-card-text>
            <div class="headline" style="overflow-wrap:break-word">{{ goal.name }}</div>
            <span>{{ goal.dueDate ? "Due: "+goal.dueDate : "" }}</span>
            <v-spacer></v-spacer>
            <v-btn
              flat
              icon
              style="z-index: 1; float: right; margin-top: -2em"
              @click.native="viewGoal(goal._id)"
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-card-text>
          -->
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
