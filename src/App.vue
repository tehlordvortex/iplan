<template>
  <v-app :dark="$root.$data.settings.theme == 'dark'">
    <v-navigation-drawer
      temporary
      :dark="$root.$data.settings.theme == 'dark'"
      v-model="drawer">
       <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title>iPlan</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile :to="page.url" v-if="!page.divider" v-for="page in pages" :key="page.name">
          <v-list-tile-action>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ page.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider v-else></v-divider>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="blue" id="main-toolbar" flat dark>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>iPlan</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-for="action in $root.$data.actions">
        <v-btn icon :key="action.action" v-show="$root.$data.showActions" @click="$root.$data.handlers.forEach((handler, i) => handler(action, i))">
          <v-icon>{{action.icon}}</v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <main>
      <!--<v-container class="hidden-xs-only" fluid>
        <router-view></router-view>
      </v-container>-->
      <v-container class="condensed" fluid>
        <router-view></router-view>
      </v-container>
    </main>
    <v-fade-transition>
      <div class="splash blue" v-show="!ready">
        <v-progress-circular style="margin-top: 50vh;" v-if="!showWelcome" indeterminate class="white--text">
          <h2 class="white--text" style="margin-bottom: 5rem">iPlan</h2>
        </v-progress-circular>
        <v-fade-transition>
          <h2 style="margin-top: 40vh" v-show="showWelcome" class="white--text">Welcome</h2>
        </v-fade-transition>
      </div>
    </v-fade-transition>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  created() {
    this.$root.$data.database.whenReady(() => {
      this.darkTheme = this.$root.$data.database.getSettings().theme == 'dark'
      setTimeout( () => this.showWelcome = true, 1000)
      setTimeout( () => this.ready = true, 2000)
    })
  },
  data() {
    return {
      pages: [
        {
          name: "Dashboard",
          url: '/',
          icon: 'dashboard'
        },
        {
          name: "Goals",
          url: '/goals',
          icon: 'view_agenda'
        },
        {
          name: "ToDos",
          url: '/todos',
          icon: 'list'
        },
        {
          divider: true
        },
        {
          name: "Settings",
          url: '/settings',
          icon: 'settings_cog'
        }
      ],
      drawer: false,
      ready: false,
      showWelcome: false,
      darkTheme: true
    }
  }
}
</script>

<style scoped>
.splash {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 9001;
  text-align: center;
}

@media only screen and (max-width: 600px) {
  .condensed {
    padding: 0px;
  }
}
</style>
