<template>
    <div id="content">
        <v-layout row>
            <v-fab-transition>
                <v-flex v-if="ready && noTodos" xs12 sm6 offset-sm3>
                    <v-card class="primary white">
                        <v-card-title primary-title><h3 class="headline mb-0">SO BLENK</h3></v-card-title>
                        <v-card-text>You have yet to create any ToDo, Ser User.</v-card-text>
                        <v-card-actions>
                            <v-btn flat to="/create/todo" class="blue--text">Create</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-fab-transition>
            <v-flex  v-if="!ready" offset-sm6>
              <v-progress-circular indeterminate class="primary--text"></v-progress-circular>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
export default {
    name: 'startPage',
    created() {
        if(this.$root.$data.database.isReady()) {
            this.noTodos = this.$root.$data.database.getTodos().count() < 1
            if (this.noTodos) {
                this.ready = true
                return
            }
            this.$router.push({name: 'todos'})
        }
        else this.$root.$data.database.whenReady(() => {
            this.noTodos = this.$root.$data.database.getTodos().count() < 1
            if (this.noTodos) {
                this.ready = true
                return
            }
            this.$router.push({name: 'todos'})
        })
    },
    data() {
        return {
            ready: false,
            noTodos: false,
        }
    },
    methods: {
    }
}
</script>

<style scoped>
#content {

}
</style>