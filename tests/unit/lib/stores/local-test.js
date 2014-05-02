/* globals localStorage */

import { test } from 'ember-qunit';
import LocalStore from 'code-test-bot-app/lib/stores/local';

var testKey = 'test';
describe('LocalStore', function() {
    var store;
    before(function() {
        store = LocalStore.create();
    });

    after(function() {
        localStorage.removeItem(testKey);
    });

    describe('#getItem', function() {
        it('gets a value from localStorage', function() {
            localStorage.setItem(testKey, 'val');

            expect(store.getItem(testKey)).to.equal('val');
        });
    });

    describe('#setItem', function() {
        it('saves a value to localStorage', function() {
            store.setItem(testKey, 'val');

            expect(localStorage.getItem(testKey)).to.equal('val');
        });
    });

    describe('#removeItem', function() {
        it('removes a value from localStorage', function() {
            store.setItem(testKey, 'val');
            store.removeItem(testKey);
            expect(store.getItem(testKey)).to.equal(null);
        });
    });
});