'use strict';

function rowsAffected(rows) {
	console.log(rows + ' rows affected');
}

Migrations.add({
	version: 1,
	name: 'Add hourlyRate to Tasks',
	up: function() {
		rowsAffected(Hours.Tasks.update({}, {$set: {hourlyRate: 0}}, {multi:true}));
	},
	down: function() {
		rowsAffected(Hours.Tasks.update({}, {$unset: {hourlyRate: null}}, {multi: true}));
	}
});