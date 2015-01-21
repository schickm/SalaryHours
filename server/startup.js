'use strict';

Meteor.startup(function() {
	Hours.Tasks._ensureIndex({name: 1}, {unique: true});
});