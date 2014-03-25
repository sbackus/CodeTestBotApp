//= require spec_helper

describe('AuthCompleteController', function () {
    var applicationController;
    var store;
    var controller;

    beforeEach(function() {
        controller = testing().controller('auth.complete');
        applicationController = testing().controller('application');
        store = applicationController.get('dataStore');
        sinon.spy(store, 'setItem');
    });

    it('stores the session token', function () {
        controller.storeToken('1234');

        expect(store.setItem).to.have.been.calledWith('sessionToken', '1234');
    });
});