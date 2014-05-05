import { test , moduleFor } from 'ember-qunit';
import WindowLocationHelper from 'code-test-bot-app/lib/window-location-helper';
import testFor from '../../../helpers/test-for';

describe('Auth Login Controller', testFor('controller:auth/login', function() {
    describe('login action', function() {
        it('redirects to the auth_uri from the model', function() {
            var uri = '/a/url';
            var model = Ember.Object.create({ auth_uri: uri });
            var controller = this.subject();

            Ember.run(function() {
                controller.set('model', model);
                controller.send('login');
            });

            expect(WindowLocationHelper.setLocation.calledWith(uri)).to.be.true();
        });
    });
}));