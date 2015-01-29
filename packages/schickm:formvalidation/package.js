'use strict';

Package.describe({
    name: 'schickm:formvalidation',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'Form validation tools',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.1');
    api.use(['check', 'session', 'mrt:moment@2.8.1']);
    api.addFiles(['_namespaces.js', 'schickm:formvalidation.js'], 'client');
    api.export('Validation', 'client');
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('schickm:formvalidation');
    api.addFiles('schickm:formvalidation-tests.js');
});
