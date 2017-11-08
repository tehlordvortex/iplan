<template>
  <v-app>
    <v-navigation-drawer
      temporary
      light
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
        <v-list-tile :to="page.url" v-for="page in pages" :key="page.name">
          <v-list-tile-action>
            <v-icon>{{ page.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ page.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="blue" id="main-toolbar" dark>
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
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  name: 'app',
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
        }
      ],
      drawer: false,
    }
  }
}
</script>

<style>

</style>
