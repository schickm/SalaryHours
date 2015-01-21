'use strict';

Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
});

Router.route('/tasks/:_id', {
	name: 'taskDetail',
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

Router.route('/', {
	name: 'home',
	waitOn: function() {
		return ['tasks', 'openDurations'].map(function(v) { return Meteor.subscribe(v); });
	}
});