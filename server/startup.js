'use strict';

Meteor.startup(function() {
	Migrations.migrateTo(1);

	Hours.Tasks._ensureIndex({name: 1}, {unique: true});
});