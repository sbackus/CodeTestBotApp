//= require spec_helper

describe('Users Index Integration', function() {
    beforeEach(function() {
        CodeTestBotApp.reset();
        testing().dataStore().removeItem('attemptedTransition');
        visit('/auth/complete?token=test_token');

        testing().mockAjaxResponse('GET', '/users', { users: [
            { id: 1, name: 'User1', editable: true },
            { id: 2, name: 'User2', editable: false },
        ]});

        visit('/users');
    });

    it('displays a list of users', function() {
        andThen(function() {
            var names = [];
            find('td.name').each(function() { names.push($(this).text()); });

            expect(names).to.deep.eq(['User1', 'User2']);
        });
    });

    it('can transition to user edit', function() {
        click('.button[href="/users/1/edit"]');
        andThen(function() {
            expect(currentRouteName()).to.eq('user.edit');
            expect(currentURL()).to.eq('/users/1/edit');
        });
    });

    describe('edit button', function() {
        it('is enabled for editable users', function() {
            andThen(function() {
                var button = find('a.button[href="/users/1/edit"]');
                expect(button.hasClass('disabled')).to.be.false;
            });
        });

        it('is disabled for uneditable users', function() {
            andThen(function() {
                var button = find('a.button[href="/users/2/edit"]');
                expect(button.hasClass('disabled')).to.be.true;
            });
        });
    });
});
