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

var TodoModel = Backbone.Model.extend({
	defaults: {
		todo: '',
		completed: false
	},
	parseClassName: 'todo', // use `parseClassName` property to specify which parse class to connect this model to
	idAttribute: 'objectId' // set the idAttribute to parse's standard `objectId`
});

var TodoCollection = Backbone.Collection.extend({
	model: TodoModel,
	parseClassName: 'todo', // use `parseClassName` property to specify which parse class to connect this collection to
});
```