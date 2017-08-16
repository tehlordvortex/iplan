import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter.js'

class DB {
	constructor() {
		this.ready = false
		this.readyCallbacks = [];
		this.idbAdapter = new LokiIndexedAdapter()
		this.db = new Loki('iplan-data.db', {
			autoload: true,
			autoloadCallback: this.initializeDB.bind(this),
			autosave: true,
			autosaveInterval: 4000,
			adapter: this.idbAdapter,
		})
		this.whenReady = this.whenReady.bind(this)

	}
	initializeDB() {
		if (!(this.todos = this.db.getCollection('todos'))) {
			this.todos = this.db.addCollection('todos')
		}
		this.ready = true;
		this.readyCallbacks.reduce((accum, cb) => cb(this), 0)
	}
	whenReady(cb) {
		this.readyCallbacks.push(cb)
	}
	getDB() {
		return this.db;
	}
	addToDo(name, dueDate, dueTime, callback) {
		if (!this.todos) {
			callback(true, null);
			return;
		}
		var todo = {
			_id: new Date().toISOString(),
			name: name,
			dueDate: dueDate,
			dueTime: dueTime,
			done: false
		}
		console.log(todo);
		if(!this.todos.insert(todo)) {
			callback(true, todo._id)
		}
		else {
			callback(false, todo._id)
		}

	}
	deleteToDo(todo) {
		this.todos.remove(todo)
	}
}
let dbInstance = new DB();
export default dbInstance;