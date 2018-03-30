<template>
  <v-container fluid fill-height class="fullscreen blue">
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4 lg3>
        <v-card>
          <v-toolbar class="pink" dark flat align-center justify-center>
            <v-spacer></v-spacer>
            <v-toolbar-title>Login</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn flat dark @click="guestSignIn">Guest</v-btn>
          </v-toolbar>
          <v-card-text>
            <div id="firebaseui-auth-container"></div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { firebase } from '@firebase/app'
import ui from '@/authui'
import { fbUIConfig } from '@/config'
export default {
  data: () => ({

  }),
  mounted () {
    ui.start('#firebaseui-auth-container', fbUIConfig)
  },
  created () {
    if (firebase.auth().currentUser) {
      this.$router.replace('todos')
    } else {
      let self = this
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          self.$router.replace('todos')
        }
      })
    }
  },
  methods: {
    guestSignIn () {
      firebase.auth().signInAnonymously().catch(function (error) {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.fullscreen {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  /* height: 100%; */
  z-index: 9001;
}
</style>
