<template>
	<div id="content">
		<v-layout row>
			<v-flex xs12 sm6 offset-sm3>
				<v-card v-if="dbReady && noTodos" class="primary white">
					<v-card-title primary-title><h3 class="headline mb-0">SO BLENK</h3></v-card-title>
					<v-card-text>You have yet to create any ToDo, Ser User.</v-card-text>
					<v-card-actions>
						<v-btn flat to="/createtodo" class="blue--text">Create</v-btn>
					</v-card-actions>
				</v-card>
				<v-flex  v-if="!dbReady" offset-sm6>
					<v-progress-circular indeterminate class="primary--text"></v-progress-circular>
				</v-flex>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import database from "../database"
export default {
	name: 'startPage',
	created() {
		if(this.database.ready) {
			this.dbReady = true
			this.noTodos = this.database.todos.count() < 1
		}
		else this.database.whenReady(() => {
			this.dbReady = true
			this.noTodos = this.database.todos.count() < 1
		})
	},
	data() {
		return {
			database: database,
			dbReady: false,
			noTodos: false
		}
	}
}
</script>

<style scoped>
#content {

}
</style>