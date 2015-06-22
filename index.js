var Backbone = require('backbone');
var $ = require('jquery');
Backbone.$ = $;
var _ = require('backbone/node_modules/underscore');

var parseClassNameProperty = 'parseClassName';

// Update collection parse
var original_parse = Backbone.Collection.prototype.parse; 
var ParseCollection = {
	parse : function(options) {
		var className = this.__proto__[parseClassNameProperty];
		data = original_parse.call(this, options);
		if (className && data.results) {
			//do your thing
			return data.results;
		}
		else {
			//return original
			return data;
		}
	}
};
_.extend(Backbone.Collection.prototype, ParseCollection);

var methodMap = {
	'create': 'POST',
	'update': 'PUT',
	'delete': 'DELETE',
	'read':   'GET'
};

var ajaxSync = Backbone.sync;

// parseSettings will have the following properties:
// - appId (required): the parse application id
// - apiKey (required): the parse API key
// - apiVersion: defaults to 1
module.exports = function(parseSettings) {
	parseSettings.apiVersion = parseSettings.apiVersion || 1;

	// Update model parse
	var ParseModel = {
		login : function(credentials, options) {

			if(!this.__proto__.isUser) {
				throw 'Cannot call `login` on non-user models. Set the `isUser` property to `true` on this model to make it a user model.';
			}

			if(!credentials.hasOwnProperty('username')) {
				throw 'Cannot call `login` without a `username`.';
			}

			if(!credentials.hasOwnProperty('password')) {
				throw 'Cannot call `login` without a `password`.';
			}

			var self = this;
			Backbone.$.ajax({
				//data
				contentType: "application/json",
				processData: false,
				dataType: 'json',
				data: 'username='+
					encodeURIComponent(credentials.username)+'&password='+
					encodeURIComponent(credentials.password),

				//action
				url: 'https://api.parse.com/' + parseSettings.apiVersion + '/login',
				type: 'GET',

				//authentication
				headers: {
					"X-Parse-Application-Id": parseSettings.appId,
					"X-Parse-REST-API-Key": parseSettings.apiKey
				}
			})
			.success(function(data) {
				self.set(data);
				if(options.success) {
					options.success(self);
				}
			})
			.error(function(response) {
				if(options.error) {
					options.error(self, response);
				}
			});
		}
	};
	_.extend(Backbone.Model.prototype, ParseModel);

	Backbone.sync = function(method, model, options) {
		var objectId = model.models ? "" : model.id; //get id if it is not a Backbone Collection
		var className = model.__proto__[parseClassNameProperty];
		if(!className) {
			return ajaxSync(method, model, options) //It's a not a Parse-backed model, use default sync
		}

		var type = methodMap[method];
		options || (options = {});
		var baseUrl = "https://api.parse.com/" + parseSettings.apiVersion + "/classes";
		var url = baseUrl + "/" + className + "/";
		if (method != "create") {
			url += objectId;
		}

		//Setup data
		var data = null;
		if (!options.data && model && (method == 'create' || method == 'update')) {
			data = JSON.stringify(model.toJSON());
		}
		else if (options.query && method == "read") { //query for Parse.com objects
			data = encodeURI("where=" + JSON.stringify(options.query));
		}

		var request = {
			//data
			contentType: "application/json",
			processData: false,
			dataType: 'json',
			data: data,

			//action
			url: url,
			type: type,

			//authentication
			headers: {
				"X-Parse-Application-Id": parseSettings.appId,
				"X-Parse-REST-API-Key": parseSettings.apiKey
			}
		};

		return $.ajax(_.extend(options, request));
	};

	return Backbone;
};