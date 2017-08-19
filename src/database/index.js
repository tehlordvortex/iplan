import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter.js'
class DB {
	constructor() {
		this._ready = false
		this._readyCallbacks = [];
		this._idbAdapter = new LokiIndexedAdapter()
		this._db = new Loki('iplan-data.db', {
			autoload: true,
			autoloadCallback: this.initializeDB.bind(this),
			autosave: true,
			autosaveInterval: 4000,
			adapter: this._idbAdapter,
		})
		this.whenReady = this.whenReady.bind(this)

	}
	initializeDB() {
		if (!(this._todos = this._db.getCollection('todos'))) {
			this._todos = this._db.addCollection('todos')
		}
		if (!(this._goals = this._db.getCollection('goals'))) {

			this._goals = this._db.addCollection('goals')
		}
		this._ready = true;
		this._readyCallbacks.reduce((_, cb) => cb(this), 0)
	}
	isReady() {
		return this._ready
	}
	whenReady(cb) {
		this._readyCallbacks.push(cb)
	}
	getDB() {
		return this._db;
	}
	getTodos() {
		return this._todos;
	}
	getGoals() {
		return this._goals;
	}
	addGoal(name, dueDate, todo_ids, callback) {
		if(!this._goals) {
			callback(true, null)
		}
		var goal = {
			_id: btoa(new Date().toISOString()),
			name: name,
			dueDate: dueDate,
			todo_ids: todo_ids
		}
		if (!this._goals.insert(goal)) {
			callback(true, null)
		}
		else {
			callback(false, goal._id)
		}
	}
	updateGoal(goal) {
		this._goals.update(goal)
	}
	addToDo(name, dueDate, dueTime, callback) {
		if (!this._todos) {
			callback(true, null);
			return;
		}
		var todo = {
			_id: btoa(new Date().toISOString()),
			name: name,
			dueDate: dueDate,
			dueTime: dueTime,
			done: false
		}
		if(!this._todos.insert(todo)) {
			callback(true, todo._id)
		}
		else {
			callback(false, todo._id)
		}

	}
	getToDo(id) {
		return this._todos.find({_id: id})[0]
	}
	updateToDo(todo) {
		this._todos.update(todo)
	}
	deleteToDo(todo) {
		this._todos.remove(todo)
	}
}
let dbInstance = new DB();
export default dbInstance;