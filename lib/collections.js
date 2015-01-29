'use strict';

Hours.Durations = new Mongo.Collection('durations');

Hours.Tasks = new Mongo.Collection('tasks');

Hours.validators.tasks = function(task) {
	var errors = {};

	if (!task.name) {
		errors.name = 'A name is required';
	}

	return errors;
};