'use strict';

function setFormError(field, message) {
    var errors = Session.get('formErrors');
    errors[field] = message;
    Session.set('formErrors', errors);
}

function clearFormError(field) {
    var errors = Session.get('formErrors');
    delete errors[field];
    Session.set('formErrors', errors);   
}

Meteor.startup(function() {
    Session.set('formErrors', {});
});


/* validation logic for forms */
function getFormElement(event, name) {
    return $(event.target).find('[name=' + name + ']');
}

Validation.intOrNull = function (input) {
    var value = parseInt(input);
    return isNaN(value) ? null : value;
};

Validation.nonEmptyString = function(input) {
	input = input.trim();
	return input !== '' ? input : null;
};

Validation.timestampOrNull = function(format) {
	return function (input) {
	    return Validation.nonEmptyString(input) ? moment(input, format) : null;
	};
};

Validation.form = function (formSpec, func) {
    return function(e) {
        e.preventDefault();
        
        var form = {
            data: {},
            elements: {},
            valid: true
        };

        // get each value and run validator
        _.each(_.keys(formSpec), function(key) {
            var fieldSpec = formSpec[key],
            	message, validator;

            if (Match.test(fieldSpec, Function)) {
            	validator = fieldSpec;
            } else if (Match.test(fieldSpec, [Match.Any])) {
            	validator = fieldSpec[0];
				message = fieldSpec[1];
            } else {
            	throw '\'' + fieldSpec.toString() + '\'is an invalid field spec.  Must be either a function or [function, \'error message\'].';
            }

            var element = getFormElement(event, key),
            	value = validator.call(null, element.val());

            form.elements[key] = element;

            if (value === null) {
                form.valid = false;
                setFormError(key, message);
            } else {
                form.data[key] = value;
                clearFormError(key);
            }
        });

        func.call(this, form, e);
    };
};
