//= require spec_helper

describe('Users Index Integration', function() {
    beforeEach(function() {
        CodeTestBotApp.reset();
        testing().dataStore().removeItem('attemptedTransition');
        visit('/auth/complete?token=test_token');
    });

    it('displays a list of users', function() {
        testing().mockAjaxResponse('GET', '/users', { users: [
            { id: 1, name: 'User1' },
            { id: 2, name: 'User2' },
        ]});

        visit('/users');
        andThen(function() {
            var names = [];
            find('td.name').each(function() { names.push($(this).text()); });

            expect(names).to.deep.eq(['User1', 'User2']);
        });
    });
});
