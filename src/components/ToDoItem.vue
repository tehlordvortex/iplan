<template>
  <div>
    <div class="hidden-sm-and-up">
      <v-list-group v-model="showActions">
        <v-touch v-on:press="callbacks.select(todo)" slot="item">
          <v-list-tile :name="todo._id" @click="click" @contextmenu.stop.prevent="" :ripple="false">
            <v-list-tile-action>
              <v-checkbox
                primary
                hide-details
                :input-value="todo.done"
                @click.native.stop="callbacks.update(todo)"
              >
              </v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-html="todo.name"></v-list-tile-title>
              <v-list-tile-sub-title>
                <v-icon v-show="todo.dueDate">event</v-icon>
                <span v-show="todo.dueDate">{{ todo.dueDate }}</span>
                <v-icon v-show="todo.dueTime">alarm</v-icon>
                <span v-show="todo.dueTime">{{ todo.dueTime }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-touch>
        <v-list-tile @click="">
          <v-btn
            flat
            class="xs1 sm1"
            icon
            @click.native="callbacks.delete_(todo)"
          >
            <v-icon>delete_</v-icon>
          </v-btn>
          <v-btn
            flat
            icon
            class="xs1 sm1"
            @click.native="callbacks.edit(todo)"
          >
            <v-icon>create</v-icon>
          </v-btn>
        </v-list-tile>
      </v-list-group>
    </div>
    <div class="hidden-xs-only">
      <v-touch v-on:press="callbacks.select(todo)">
        <v-list-tile :name="todo._id" @contextmenu.stop.prevent="" :ripple="false">
          <v-checkbox
            primary
            hide-details
            style="display:inline"
            :input-value="todo.done"
            @click.native="callbacks.update(todo)"
          >
          </v-checkbox>
          <v-list-tile-content>
            <v-list-tile-title v-html="todo.name"></v-list-tile-title>
            <v-list-tile-sub-title>
              <v-icon v-show="todo.dueDate">event</v-icon>
              <span v-show="todo.dueDate">{{ todo.dueDate }}</span>
              <v-icon v-show="todo.dueTime">alarm</v-icon>
              <span v-show="todo.dueTime">{{ todo.dueTime }}</span>
            </v-list-tile-sub-title>
          </v-list-tile-content>
            <v-btn
                flat
                class="xs1 sm1"
                icon
                @click.native="callbacks.delete_(todo)"
              >
                <v-icon>delete_</v-icon>
              </v-btn>
              <v-btn
                flat
                icon
                class="xs1 sm1"
                @click.native="callbacks.edit(todo)"
              >
                <v-icon>create</v-icon>
              </v-btn>
        </v-list-tile>
      </v-touch>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'ToDoItem',
  props: ['todo', 'callbacks'],
  data: function () {
    return {
      showActions: false
    }
  },
  methods: {
    click: function() {
      this.showActions = !this.showActions
    }
  },
  computed: {
  }
}
</script>