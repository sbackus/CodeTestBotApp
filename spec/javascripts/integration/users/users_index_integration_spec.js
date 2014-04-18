//= require spec_helper

describe('Users Index Integration', function() {
    beforeEach(function() {
        CodeTestBotApp.reset();
        testing().dataStore().removeItem('attemptedTransition');
        visit('/auth/complete?token=test_token');

        testing().mockAjaxResponse('GET', '/users', { users: [
            { id: 1, name: 'User1' },
            { id: 2, name: 'User2' },
        ]});
    });

    it('displays a list of users', function() {
        visit('/users');
        andThen(function() {
            var names = [];
            find('td.name').each(function() { names.push($(this).text()); });

            expect(names).to.deep.eq(['User1', 'User2']);
        });
    });

    it('can transition to user edit', function() {
        visit('/users');
        click('.button[href="/users/1/edit"]');
        andThen(function() {
            expect(currentRouteName()).to.eq('user.edit');
            expect(currentURL()).to.eq('/users/1/edit');
        });
    });
});
