//= require spec_helper
//= require local_store

describe('LocalStore', function() {
    var store = LocalStore.create();
    beforeEach(function() {
       localStorage.removeItem('test');
    });

    it('gets a value from localStorage', function () {
        localStorage.setItem('test', 'val');

        expect(store.getItem('test')).to.equal('val');
    });

    it('sets a value to localStorage', function () {
        store.setItem('test', 'val');

        expect(store.getItem('test')).to.equal('val');
    });

    it('removes a value from localStorage', function () {
        store.setItem('test', 'val');

        store.removeItem('test');
        expect(store.getItem('test')).to.be.null;
    });
});