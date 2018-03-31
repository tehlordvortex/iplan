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
              <v-list-tile-title v-if="currentUser.isAnonymous">Anonymous</v-list-tile-title>
              <v-list-tile-title v-else v-text="currentUser.displayName" />
              <v-list-tile-sub-title v-if="currentUser.email" v-text="currentUser.email"/>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="logoutUser" v-if="!currentUser.isAnonymous">
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
        <v-list-tile avatar @click="upgradeUser" v-else>
          <v-list-tile-avatar>
            <v-icon large>account_circle</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Signing in as Anonymous...</v-list-tile-title>
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
      v-if="!loggingIn"
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <v-container v-if="loggingIn" class="blue" fluid fill-height>
        <v-layout justify-center align-center>
          <v-progress-circular class="white--text" indeterminate />
        </v-layout>
      </v-container>
      <router-view v-else/>
    </v-content>
    <v-dialog
      v-model="loginDialog"
      max-width="500px"
    >
      <v-card>
        <v-toolbar class="pink" dark flat align-center justify-center>
          <v-spacer></v-spacer>
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-layout row style="text-align: center">
            <v-flex xs12>
              <p>Login to iPlan to enable sync across devices</p>
            </v-flex>
          </v-layout>
          <div id="firebaseui-auth-container"></div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="showNotification"
      :timeout="notificationTimeout"
    >
      {{ notificationText }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { firebase } from '@firebase/app'
import * as firebaseui from 'firebaseui'
import { fbUIConfig } from '@/config'
export default {
  created () {
    let self = this
    firebase.firestore().enablePersistence()
      .then(() => console.log('Persistence enabled'))
      .catch((err) => {
        console.log(err)
      })
    if (!this.currentUser) {
      console.log('Anonymous sign in')
      firebase.auth().signInAnonymously()
    }
    firebase.auth().onAuthStateChanged(function (user) {
      // console.log(user)
      // self.currentUser = user
      if (user) {
        self.loginDialog = false
        self.loggingIn = false
        self.notificationText = 'Signed in as ' + ((user.isAnonymous) ? 'Anonymous' : (user.displayName || user.email))
        self.showNotification = true
        // console.log(user)
        if (!self.currentUser || user.uid !== self.currentUser.uid) {
          // reactive properties make Vuex scream at me, get rid of them
          let clone = JSON.parse(JSON.stringify(user))
          // console.log(test)
          // console.log(user)
          // console.log(self.currentUser)
          console.log('Switched accounts?')
          self.$store.commit('LOG_IN', clone)
        }
      } else {
        if (self.$store.state.App.loggedIn) {
          self.$store.commit('LOG_OUT')
        }
      }
    })
  },
  mounted () {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.updateAvailable) {
          this.notificationText = 'An update has been installed, please refresh the page.'
          this.showNotification = true
        }
      })
    }
    if (this.loggingIn) {
      setTimeout(() => {
        if (self.loggingIn) {
          this.notificationText = 'Authentication seems to be taking a while, try reloading the page.'
          this.showNotification = true
        }
      }, 5000)
    }
    if (this.ui) {
      this.ui.reset()
    }
    if (!this.ui) {
      this.ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    }
    let self = this
    let data = null
    let firestore = firebase.firestore()
    fbUIConfig.callbacks.signInSuccessWithAuthResult = (userData, redirectURL) => {
      self.$router.push({name: 'todos'})
      return false
    }
    fbUIConfig.callbacks.signInFailure = (err) => {
      console.log(err)
      let anonymousUser = firebase.auth().currentUser
      console.log(anonymousUser)
      if (err.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve()
      }
      let cred = err.credential
      firestore.collection(anonymousUser.uid).get()
        .then((snapshot) => {
          data = snapshot
          return firebase.auth().signInWithCredential(cred)
        })
        .then((user) => {
          // console.log(user.uid)
          let anonymousCollection = firestore.collection(anonymousUser.uid)
          let userCollection = firestore.collection(user.uid)
          // Grab the anonymous users documents from firestore
          // console.log(data)
          let docs = Array.from(data.docs)
          var documents = docs.map((doc) => anonymousCollection.doc(doc.id))
          // Copy them to the new user
          let copiedDocuments = documents.map((doc) => doc.get().then((doc) => {
            // console.log(doc.exists)
            // console.log(doc.data)
            userCollection.doc(doc.id).set(doc.data())
          }))
          // wait for everything to copy before deleting the old user
          return Promise.all(copiedDocuments)
        })
        .then(() => {
          return firestore.collection(anonymousUser.uid).get().then((docSnaps) => {
            docSnaps = Array.from(docSnaps.docs)
            let anonymousCollection = firestore.collection(anonymousUser.uid)
            docSnaps = docSnaps.map((doc) => anonymousCollection.doc(doc.id))
            return Promise.all(docSnaps.map((doc) => doc.delete()))
          }).then(() => anonymousUser.delete())
        })
        .then(() => {
          data = null
          self.$router.push({name: 'todos'})
        })
    }
    this.ui.start('#firebaseui-auth-container', fbUIConfig)
  },
  data () {
    return {
      drawer: false,
      items: [{
        icon: 'home',
        title: 'Home'
      }],
      title: 'iPlan',
      ui: null,
      loginDialog: false,
      showNotification: false,
      notificationText: '',
      notificationTimeout: 1500,
      loggingIn: true
    }
  },
  // watch: {
  //   logInHappened (val) {
  //     if (val == true)
  //   }
  // },
  methods: {
    logoutUser () {
      firebase.auth().signOut().then(() => {
        this.$router.go('/')
      }).catch((err) => {
        console.log(err)
      })
    },
    upgradeUser () {
      this.drawer = false
      this.loginDialog = true
    }
  },
  computed: {
    currentUser () {
      console.log(this.$store)
      return this.$store.state.App.userData
    }
  },
  name: 'App'
}
</script>
