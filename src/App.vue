<template>
  <v-app>
    <v-navigation-drawer
      temporary
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list two-line class="pa-0 ma-0">
        <v-list-group v-if="currentUser">
          <v-list-tile avatar slot="activator">
            <v-list-tile-avatar>
              <img v-if="!currentUser.isAnonymous" :src="currentUser.photoURL" />
              <v-icon large v-else>account_circle</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="currentUser.isAnonymous">Guest</v-list-tile-title>
              <v-list-tile-title v-else v-text="currentUser.displayName" />
              <v-list-tile-sub-title v-if="currentUser.email" v-text="currentUser.email"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logoutUser">
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon flat><v-icon>exit_to_app</v-icon></v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-if="currentUser.isAnonymous" @click="upgradeUser">
            <v-list-tile-content>
              <v-list-tile-title>Enable Sync</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon flat><v-icon>sync</v-icon></v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
        <v-list-tile avatar v-else>
          <v-list-tile-avatar>
            <v-icon>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      class="blue"
      dark
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { firebase } from '@firebase/app'
export default {
  created () {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      // console.log(user)
      self.currentUser = user
    })
  },
  data () {
    return {
      drawer: false,
      items: [{
        icon: 'home',
        title: 'Home'
      }],
      title: 'iPlan',
      currentUser: firebase.auth().currentUser
    }
  },
  methods: {
    logoutUser () {
      firebase.auth().signOut().then(() => {
        this.$router.go('/')
      }).catch((err) => {
        console.log(err)
      })
    },
    upgradeUser () {

    }
  },
  name: 'App'
}
</script>
