<template>
  <v-layout row>
    <v-flex xs12 sm10 offset-sm1 md8 offset-md2>
      <v-card flat>
        <v-card-title><span style="font-size: 2em">Settings</span></v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-subheader><v-icon></v-icon>Theme</v-subheader>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                :items="themes"
                v-model="theme"
                label="Select"
                single-line
                bottom
              ></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn flat class="blue--text" @click.native.stop="saveSettings">Save</v-btn>
          <v-btn flat class="pink--text" @click.native.stop="$router.go(-1)">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  name: 'settings',
  created() {
    this.$root.$data.database.whenReady((db) => this.settings = db.getSettings())
    this.theme = {
      text: this.settings.theme.substr(0,1).toLocaleUpperCase() + this.settings.theme.substr(1),
      value: this.settings.theme
    }
  },
  data: function () {
    return {
      settings: {},
      themes: [
      { text: "Light", value: "light" },
      { text: "Dark", value: "dark" }
      ],
      theme: null
    }
  },
  methods: {
    saveSettings() {
      this.settings.theme = this.theme
      this.$root.$data.database.updateSettings(this.settings)
      eventBus.$emit('settings-change', this.settings);
      this.$router.go(-1)
    }
  }
}
</script>
