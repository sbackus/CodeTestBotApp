import testFor from '../../../helpers/test-for';
import { randomElement } from '../../../helpers/utils';
import { injectFakeStore } from '../../../helpers/data';

describe('User Edit Controller', testFor('controller:user/edit', function() {
    var controller;
    var model, role, new_role, user, store;

    before(function() {
        controller = this.subject();
        store = injectFakeStore(controller);

        role = Ember.Object.create({
            id: 1,
            name: 'Administrator'
        });

        new_role = Ember.Object.create({
            id: 2,
            name: 'Assessor'
        });

        user = Ember.Object.create({
            id: 1,
            name: 'Bob',
            email: 'bob@bob.com',
            role: role
        });

        controller.set('content', user);
        controller.set('selectedRole', new_role);
    });

    describe('#changeRole', function() {

        context('when role is selected', function() {
            before(function() {
                var find = sinon.stub(store, 'find');
                find.withArgs('user').returns(user);
                user.reopen({
                    save: sinon.spy()
                });
            });

            it('should have updated role for user', function() {
                equal(user.get('role'), role);
                Ember.run(function() {
                    controller.send('changeRole');
                });
                equal(user.get('role'), new_role);
                equal(user.save.callCount, 1);
            });
        });
    });
}));
