<template>
  <v-app :dark="darkTheme">
    <v-navigation-drawer
      temporary
      :dark="darkTheme"
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
      <template v-for="id in actionIds">
        <span v-for="action in actions[id].actions">
          <v-btn icon :key="action.action" v-show="shownActionIds.indexOf(id) > -1" @click="actionTriggered(action, id)">
            <v-icon>{{action.icon}}</v-icon>
          </v-btn>
        </span>
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
import uuidv4 from 'uuid/v4'
export default {
  name: 'app',
  created() {
    this.$root.$data.database.whenReady(() => {
      eventBus.$on('settings-change', this.settingsChanged);
      eventBus.$on('register-actions', this.registerActions);
      eventBus.$on('unregister-actions', this.unregisterActions);
      eventBus.$on('show-actions', this.showActions)
      eventBus.$on('hide-actions', this.hideActions)
      this.darkTheme = this.$root.$data.database.getSettings().theme == 'dark'
      setTimeout( () => this.showWelcome = true, 1000)
      setTimeout( () => this.ready = true, 2000)
    })
  },
  destroyed() {
    eventBus.$off('settings-change', this.settingsChanged);
    eventBus.$off('register-actions', this.registerActions);
    eventBus.$off('unregister-actions', this.unregisterActions);
    eventBus.$off('show-actions', this.showActions)
    eventBus.$off('hide-actions', this.hideActions)
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
      darkTheme: true,
      showTheActions: false,
      actions: {},
      actionIds: [],
      shownActionIds: []
    }
  },
  methods: {
    actionTriggered(action, id) {
      if (this.actions && Object.keys(this.actions).indexOf(id) > -1 && this.actions[id].handler) {
        this.actions[id].handler(action);
      }
    },
    settingsChanged(newSettings) {
      this.darkTheme = newSettings.theme == 'dark';
    },
    registerActions(actions) {
        if (this.$root.$data.debug) console.log(`register-actions: ${actions}`);
        let id = uuidv4();
        this.actions[id] = {
          actions: actions.actions,
          handler: actions.handler,
          showActions: false
        };
        actions.callback(id);
        this.actionIds.push(id);
        if (this.$root.$data.debug) console.log(this.actions);
        //eventBus.$emit('actions-registered', id);
      },
    unregisterActions(id) {
        this.actions[id] = undefined;
        this.actionIds = this.actionIds.filter((i) => i != id);
        //this.showActions = false;
      },
    showActions(id) {
        if (this.$root.$data.debug) {
          console.log(`show-actions ${id}`);
          console.log(this.actions[id]);
          console.log(this.actionIds.indexOf(id));
        }
        if (Object.keys(this.actions).indexOf(id) > -1) {
          this.actions[id].showActions = true;
          if (this.shownActionIds.indexOf(id) == -1)
            this.shownActionIds.push(id);
        }
        else {
          if (this.$root.$data.debug) console.log(`already unregistered ${id}`);
        }
        //this.showTheActions = true;
      },
    hideActions(id) {
        if (Object.keys(this.actions).indexOf(id) > -1) {
          if (this.shownActionIds.indexOf(id) > -1)
            this.shownActionIds = this.shownActionIds.filter((i) => i != id);
          this.actions[id].showActions = false;
        }
        //this.showTheActions = false;
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
