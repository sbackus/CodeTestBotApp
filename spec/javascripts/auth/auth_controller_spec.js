//= require spec_helper

describe('logout', function () {
    var authController;

    beforeEach(function () {
        authController = testing().controller('auth');

        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        this.xhr.onCreate = function (xhr) {
            requests.push(xhr);
        };
    });

    afterEach(function () {
        this.xhr.restore();
    });

    it('removes the session token from store', function () {
        var dataStore = testing().dataStore();
        sinon.spy(dataStore, 'removeItem');
        authController.logout()
        expect(dataStore.removeItem).to.be.calledWith('sessionToken');
    });

    it('sets loggedIn to false', function () {
        authController.set('loggedIn', true);
        authController.logout()
        expect(authController.get('loggedIn')).to.be.false;
    });

    it('sends a delete request with the token to the server', function () {
        var dataStore = testing().dataStore();
        sinon.stub(dataStore, 'getItem').withArgs('sessionToken').returns('testing123');

        authController.logout();

        expect(this.requests[0].method).to.equal('DELETE');
        expect(this.requests[0].requestBody).to.equal('token=testing123');
    });
});