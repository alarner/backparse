# backparse

backparse is a commonjs implementation that adds parse integration to Backbone models and collections. Code is havily borrowed from neebz's [backbone-parse](https://github.com/neebz/backbone-parse).

## usage

```js
// Load the `backparse` module instead of `backbone`
var Backbone = require('backparse')({
	appId: 'appidgoeshere',
	apiKey: 'parserestapikeygoeshere',
	apiVersion: 1
});

// use `parseClassName` property to specify which parse class to connect
var TodoModel = Backbone.Model.extend({
	defaults: {
		todo: '',
		completed: false
	},
	parseClassName: 'todo',
	idAttribute: 'objectId' // set the idAttribute to parse's standard `objectId`
});

// use `parseClassName` property to specify which parse class to connect
var TodoCollection = Backbone.Collection.extend({
	model: TodoModel,
	parseClassName: 'todo',
});

// User login method is supported if you set the `isUser` property on the
// model to `true`.
var UserModel = Backbone.Model.extend({
	defaults: {
		username: '',
		password: '',
		email: ''
	},
	parseClassName: '_User',
	idAttribute: 'objectId',
	isUser: true
});

var user = new UserModel();
user.login({
	username: 'test@test.com',
	password: 'password123'
}, {
	success: function(userModel) {
		console.log('user was logged in');
	},
	error: function(userModel, response) {
		console.log('user was not logged in', response.responseJSON);
	}
})
```