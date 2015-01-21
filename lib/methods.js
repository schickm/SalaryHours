'use strict';

function ownsDoc (userId, doc) {
	return doc && doc.userId === userId;
}

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

Hours.Tasks.allow({
	update: function(userId, doc, fieldNames) {
		return ownsDoc(userId, doc) && (_.without(fieldNames, 'hourlyRate').length > 0);
	}
});

Meteor.methods({
	'startDuration': function(taskName) {
		var userId = Meteor.userId();
		check(userId, NonEmptyString);
		check(taskName, NonEmptyString);

		// ensure task exists
		var taskAttrs = {name: taskName, userId: Meteor.userId()},
			taskId,
			task = Hours.Tasks.findOne(taskAttrs);
		if (! task) {
			taskId = Hours.Tasks.insert(_.extend(taskAttrs, {duration: 0}));
		} else {
			taskId = task._id;
		}

		return Hours.Durations.insert({
			taskId: taskId,
			userId: userId,
			start: Date.now()
		});
		
	},
	'endDuration': function(durationId) {
		var userId = Meteor.userId();
		check(userId, NonEmptyString);
		check(durationId, NonEmptyString);

		var dur = Hours.Durations.findOne(durationId);
		if (! dur) {
			throw new Meteor.Error('bad-request');
		}

		var end = Date.now();
		Hours.Durations.update(durationId, {$set: {end: end}});
		
		// recalc total time spent on that task
		var time = end - dur.start;
		Hours.Tasks.update({name: dur.taskId, userId: userId}, {
			$inc: {duration: time}
		});
	}
});