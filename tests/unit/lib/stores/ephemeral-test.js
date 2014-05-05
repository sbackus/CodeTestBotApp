import { test } from 'ember-qunit';
import EphemeralStore from 'code-test-bot-app/lib/stores/ephemeral';

var testKey = 'test';

describe('EphemeralStore', function() {
    var store;
    before(function() {
        store = EphemeralStore.create();
    });

    describe('#getItem', function() {
        it('gets a saved value', function() {
            var data = {};
            data[testKey] = 'val';
            store.set('data', data);

            expect(store.getItem(testKey)).to.equal('val');
        });
    });

    describe('#setItem', function() {
        it('saves a value', function() {
            store.setItem(testKey, 'val');

            expect(store.getItem(testKey)).to.equal('val');
        });
    });

    describe('#removeItem', function() {
        it('removes a saved value', function() {
            store.setItem(testKey, 'val');
            store.removeItem(testKey);

            expect(store.getItem(testKey)).to.equal(undefined);
        });
    });
});