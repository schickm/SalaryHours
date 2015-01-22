'use strict';


if ( Meteor.users.find().count() === 0 ) {
    var userId = Accounts.createUser({
        username: 'matt',
        email: 'm@m.com',
        password: 'aoeuaoeu',
        profile: {
                name: 'Matt'
        }
    });

    var taskId = Hours.Tasks.insert({
        name: 'Programming',
        userId: userId,
        duration: 12 * 60 * 60 * 1000 // 12 hours to milliseconds
    });

    var end = moment().valueOf();
    var makeDuration = function(hours) {
        hours.forEach(function(hoursBack) {
            var start = moment().subtract(hoursBack, 'hours').valueOf();
            Hours.Durations.insert({
                taskId: taskId,
                userId: userId,
                start: start,
                end: end,
                duration: end - start
            });        
        });
    };

    makeDuration([5, 2, 3, 2]);
}
