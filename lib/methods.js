'use strict';

function ownsDoc (userId, doc) {
	return doc && doc.userId === userId;
}

function findDuration (id) {
	var dur = Hours.Durations.findOne(id);
	if (! dur) {
		throw new Meteor.Error('bad-request', 'Duration not found');
	}

	return dur;
}

function checkOneAffected(affectedDocs) {
	if (affectedDocs !== 1) {
		throw new Meteor.Error('bad-request', affectedDocs + ' documents affected, should have been 1');
	}	
}

function ensureUser(func) {
	return function() {
		check(Meteor.userId(), NonEmptyString);
		func.apply(this, arguments);
	}
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
	'startDuration': ensureUser(function(taskName) {
		check(taskName, NonEmptyString);

		// ensure task exists
		var userId = Meteor.userId(),
			taskAttrs = {name: taskName, userId: userId},
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
	}),
	'endDuration': ensureUser(function(durationId) {
		check(durationId, NonEmptyString);

		var dur = findDuration(durationId);

		var end = Date.now();
		var time = end - dur.start;

		Hours.Durations.update(durationId, {$set: {
			end: end,
			duration: time
		}});
		
		// recalc total time spent on that task
		checkOneAffected(Hours.Tasks.update({_id: dur.taskId, userId: Meteor.userId()}, {
			$inc: {duration: time}
		}));
	}),
	'removeDuration': ensureUser(function(durationId) {
		// get it so we have the taskId
		var dur = findDuration(durationId);
		Hours.Durations.remove(durationId);
		

		// now recalculate the durations, aggregate only available on the server side
		if (Meteor.isServer) {
			var result = Hours.Durations.aggregate([
				{$match: {taskId: dur.taskId}},
				{$group: {_id: 'total', totalDuration: {$sum: "$duration"}}}
			]);

			var taskDuration = (result.length === 0) ? 0 : result[0].totalDuration;

			Hours.Tasks.update(dur.taskId, {
				$set: {duration: taskDuration}
			});
		}
	}),
	'removeTask': ensureUser(function(taskId) {
		checkOneAffected(Hours.Tasks.remove(taskId));
		Hours.Durations.remove({taskId: taskId});
	}),
	'setUserYearlySalary': ensureUser(function(amount) {
		check(amount, Number);

		Meteor.users.update(Meteor.userId(), {$set: {'profile.yearlySalary': amount}});
	})
});
