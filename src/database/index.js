import Loki from 'lokijs'
import LokiIndexedAdapter from 'lokijs/src/loki-indexed-adapter.js'
import { deleteFromArray, debug } from '../helpers.js'
class DB {
	constructor() {
		this._ready = false
		this._readyCallbacks = []
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
		if (!(this._settings = this._db.getCollection('settings'))) {
			this._settings = this._db.addCollection('settings')
		}
		this._ready = true;
		this._readyCallbacks.reduce((_, cb) => cb(this), 0)
	}
	isReady() {
		return this._ready
	}
	whenReady(cb) {
		if(this.isReady()) cb(this)
		else this._readyCallbacks.push(cb)
	}
	getDB() {
		return this._db
	}
	getTodos() {
		return this._todos
	}
	getGoals() {
		return this._goals
	}
	getSettings() {
		let results = this._settings.find({})
		if (results && results.length > 0)
			return results[0]
		else {
			let settings = {
				theme: "dark"
			}
			this._settings.insert(settings)
			return settings
		}
	}
	updateSettings(settings, callback) {
		try {
			this._settings.update(settings)
			if (callback) callback(false);
		} catch (e) {
			if (callback) callback(true, e);
			else if (debug) throw e;
			else { } // TODO: Add logging/telemetry in production mode
		}
	}
	getGoalsArray() {
		return this._goals.find({})
	}
	getGoal(id) {
		var found =  this._goals.find({"_id": id});
		if (found) return found[0];
		return null;
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
			goal.todo_ids.forEach((id) => {
				var todo
				if(( todo = this.getToDo(id) )) {
					todo.goalId = goal._id
				}
			})
			callback(false, goal._id)
		}
	}
	updateGoal(goal, callback) {
		try {
			this._goals.update(goal);
			if (callback) callback(false);
		} catch (e) {
			if (callback) callback(true, e);
			else if (debug) throw e;
			else { } // TODO: Add logging/telemetry in production mode
		}
	}
	deleteGoal(goal) {
		goal.todo_ids.forEach((id) => this.deleteToDo(id))
		this._goals.remove(goal)
	}
	addToDo(todoObj, callback) {
		if (!this._todos) {
			callback(true, null)
			return;
		}
		var todo = {
			_id: btoa(new Date().toISOString()),
			name: todoObj.name,
			dueDate: todoObj.dueDate,
			dueTime: todoObj.dueTime,
			done: false,
			goalId: todoObj.goalId
		}
		if (todo.goalId) {
			var goal
			if (( goal = this.getGoal(todo.goalId) )) {
				if(!this._todos.insert(todo)) {
					callback(true, todo._id)
				}
				else {
					goal.todo_ids.push(todo._id)
					this.updateGoal(goal)
					callback(true, todo._id)
				}
			}
		}
		else {
			if(!this._todos.insert(todo)) {
				callback(true, todo._id)
			}
			else {
				callback(false, todo._id)
			}
		}
	}
	getToDo(id) {
		var found = this._todos.find({"_id": id})
		if (found) return found[0]
		else return null
	}
	updateToDo(todo) {
		this._todos.update(todo)
	}
	deleteToDo(todo, callback) {
		if (typeof todo == "string") {
			todo = this.getToDo(todo);
		}
		if (!todo) {
			if (callback) callback(true, "ToDo does not exist");
			return;
		}
		if (todo.goalId) {
			if (debug) console.log(`detaching ${todo._id} from it's goal`);
			let goal = this.getGoal(todo.goalId);
			if (goal) {
				goal.todo_ids = deleteFromArray(goal.todo_ids, todo._id);
				if (debug) console.log(goal.todo_ids);
				this.updateGoal(goal);
			}
		}
		this._todos.remove(todo)
		if (callback) callback(false);
	}
}
let dbInstance = new DB()
export default dbInstance