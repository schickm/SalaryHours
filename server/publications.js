'use strict';

Meteor.publish('tasks', function() {
	return Hours.Tasks.find({userId: this.userId});
});

Meteor.publish('singleTask', function(id) {
	return Hours.Tasks.find(id);
});

Meteor.publish('durations', function(taskId) {
	return Hours.Durations.find({
		userId: this.userId,
		taskId: taskId
	});
});

Meteor.publish('openDurations', function() {
	return Hours.Durations.find({
		userId: this.userId,
		end: {$exists: false}
	});
});

Meteor.publish('closedDurations', function() {
	return Hours.Durations.find({
		userId: this.userId,
		end: {$exists: true}
	});
});