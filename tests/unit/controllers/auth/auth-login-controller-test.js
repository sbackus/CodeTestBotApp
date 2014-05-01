import { test , moduleFor } from 'ember-qunit';
import WindowLocationHelper from 'code-test-bot-app/lib/window-location-helper';

moduleFor('controller:auth/login', 'Auth Login Controller');

test('login action: redirects to auth_uri from the model', function() {
    var model = Ember.Object.create({ auth_uri: '/a/url' });
    var controller = this.subject();

    Ember.run(function() {
        controller.set('model', model);
        controller.send('login');
    });

    ok(WindowLocationHelper.setLocation.calledOnce);
    equal(WindowLocationHelper.setLocation.getCall(0).args[0], '/a/url');
});