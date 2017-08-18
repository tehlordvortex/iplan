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
	addToDo(name, dueDate, dueTime, callback) {
		if (!this._todos) {
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