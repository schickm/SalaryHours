'use strict';

function methodErrorHandler (error) {
    if (error) {
        throw error;
    }
}

Template.createDuration.rendered = function() {
    Meteor.typeahead($('.typeahead'));
};

Template.createDuration.helpers({
    tasks: function() {
        return Hours.Tasks.find().map(function(doc) {    
            return doc.name;
        });
    }
});

Template.createDuration.events({
    'submit form': Validation.form(
        {taskName: [Validation.nonEmptyString, 'Please enter a task name']},
        function(form) {
            if (form.valid) {
                Meteor.call('startDuration', form.data.taskName, methodErrorHandler);    
                form.elements.taskName.typeahead('val', '');
            }                    
        }
    )
});

Template.openDurations.helpers({
    durations: function() {
        return Hours.Durations.find();
    }
});

Template.openDuration.events({
    'click button': function(e) {
        e.preventDefault();
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
        if (confirm('This will completely remove all hours for this task and readjust any totals...you sure?')) {
            Meteor.call('removeTask', this.task._id);
            Router.go('home');    
        }
        
    }
});



Template.settings.events({
    'submit form': Validation.form(
        {yearlySalary: [Validation.intOrNull, 'A salary must be provided']}, 
        function(form) {
            if (form.valid) {
                Meteor.call('setUserYearlySalary', form.data.yearlySalary);    
                Router.go('home');
            }   
        }
    )
});

var timePickerFormat = 'MM/DD/YYYY h:mm A';

Template.manualHoursEntry.events({
    'focus input': function(e) {
        e.target.select();
    },
    'submit form': Validation.form(
        {
            startInput: [Validation.timestampOrNull(timePickerFormat), 'Start time is required'],
            hoursInput: [Validation.intOrNull, 'required'],
            minutesInput: [Validation.intOrNull, 'required']
        },
        function(form) {
            if (form.valid) {
                Meteor.call('addDuration',this.task._id, form.data.startInput.valueOf(), form.data.hoursInput, form.data.minutesInput);  
            }
        }
    )
});

Template.manualHoursEntry.rendered = function() {
    $('.datetimepicker').datetimepicker({
        format: timePickerFormat
    });
};

Template.formSubmit.helpers({
    showText: function() {
        return this.text || 'Submit';
    }
});