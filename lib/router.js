'use strict';

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

var AuthController = RouteController.extend({
	before: function() {
		if (! Meteor.userId()) {
			Router.go('home');
		} else {
			this.next();
		}

	}
});

Router.route('/tasks/:_id', {
	name: 'taskDetail',
	controller: AuthController,
	data: function() {
		return {
			task: Hours.Tasks.findOne(this.params._id),
			durations: Hours.Durations.find()
		};
	},
	waitOn: function() {
		return ['singleTask', 'durations'].map(function(v) { 
			return Meteor.subscribe(v, this.params._id); 
		}.bind(this));
	}
});

Router.route('/settings', {
	name: 'settings',
	controller: AuthController
});

Router.route('/', {
	name: 'home',
	waitOn: function() {
		return ['tasks', 'openDurations'].map(function(v) { return Meteor.subscribe(v); });
	}
});