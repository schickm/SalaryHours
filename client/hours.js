'use strict';


function methodErrorHandler (error) {
    if (error) {
        throw error;
    }
}

function setFormError(field, message) {
    var errors = Session.get('formErrors');
    errors[field] = message;
    Session.set('formErrors', errors);
}

Meteor.startup(function() {
    Session.set('formErrors', {});
});


Template.createDuration.rendered = function() {
    Meteor.typeahead.inject('.typeahead');
};

Template.createDuration.helpers({
    tasks: function() {
        return Hours.Tasks.find().map(function(doc) {    
            return doc.name;
        });
    }
});

Template.createDuration.events({
    'submit form': function(e) {
        e.preventDefault();
        var $task = $(e.target).find('[name=task]'),
            taskName = $task.val();
        
        setFormError('taskName', (! taskName ? 'Please enter a task name': null));

        if (taskName) {
            Meteor.call('startDuration', taskName, methodErrorHandler);    
        }        
            
        $task.val('');
    }
});

Template.openDurations.helpers({
    durations: function() {
        return Hours.Durations.find();
    }
});

Template.openDuration.events({
    'click button': function() {
        Meteor.call('endDuration', this._id, methodErrorHandler);
    }
});

Template.openDuration.helpers({
    'taskName': function() {
        return Hours.Tasks.findOne(this.taskId).name;
    }
});

Template.taskTotals.helpers({
    tasks: function() {
        return Hours.Tasks.find();
    }
});

Template.taskDetail.helpers({
    startDate: function() {
        return moment(this.start).format('M/D');
    }
});

Template.taskDetail.events({
    'click .delete-duration': function(e) {
        e.preventDefault();
        Meteor.call('removeDuration', this._id);
    },
    'click .delete-task': function(e) {
        e.preventDefault();
        Meteor.call('removeTask', this.task._id);
        Router.go('home');
    }
});