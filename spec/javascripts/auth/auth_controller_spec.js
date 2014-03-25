//= require spec_helper

describe('AuthController', function () {
    var authController, dataStore;

    beforeEach(function () {
        authController = testing().controller('auth');
        dataStore = testing().dataStore();

        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    afterEach(function () {
        this.xhr.restore();
    });

    describe('login', function () {
        it('sets loggedIn to true', function () {
            authController.set('loggedIn', false);

            authController.login(null);

            expect(authController.get('loggedIn')).to.be.true;
        });

        it('stores the sessionToken in the application dataStore', function () {
            sinon.spy(dataStore, 'setItem');

            authController.login('testing123');

            expect(dataStore.setItem).to.have.been.calledWith('sessionToken', 'testing123');
        });
    });

    describe('logout', function () {
        it('sets loggedIn to false', function () {
            authController.set('loggedIn', true);

            authController.logout();

            expect(authController.get('loggedIn')).to.be.false;
        });

        it('removes the session token from store', function () {
            sinon.spy(dataStore, 'removeItem');

            authController.logout();

            expect(dataStore.removeItem).to.be.calledWith('sessionToken');
        });

        it('sends a delete request with the token to the server', function () {
            sinon.stub(dataStore, 'getItem').withArgs('sessionToken').returns('testing123');

            authController.logout();

            expect(this.requests[0].method).to.equal('DELETE');
            expect(this.requests[0].requestBody).to.equal('token=testing123');
        });
    });
});
