'use strict';

Template.registerHelper('taskInterval', function(millis) {
    var mom = moment.duration(millis),
        hours = mom.as('hours');

    return (hours > 1 ? hours.toFixed() : hours.toFixed(2));
});

Template.registerHelper('errorMessage', function(field) {
    return Session.get('formErrors')[field];
});

var fromNowDep = new Deps.Dependency();
var fromNowInterval;

Template.registerHelper('fromNow', function(millis) {
    fromNowDep.depend();

    if (! fromNowInterval) {
        fromNowInterval = setInterval(function() {
            console.log('updating fromNowDep');
            fromNowDep.changed();
        }, 60000);
    }
    return moment(millis).fromNow();
});

Template.registerHelper('errorClass', function(field) {
    return !!Session.get('formErrors')[field] ? 'has-error' : '';
});