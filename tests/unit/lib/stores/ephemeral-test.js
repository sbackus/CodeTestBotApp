import { test } from 'ember-qunit';
import EphemeralStore from 'code-test-bot-app/lib/stores/ephemeral';

var testKey = 'test';
var store;

module('EphemeralStore', {
    setup: function() {
        store = EphemeralStore.create();
    }
});

test('getItem: gets a saved value', function() {
    var data = {};
    data[testKey] = 'val';
    store.set('data', data);

    equal(store.getItem(testKey), 'val');
});

test('setItem: saves a value', function() {
    store.setItem(testKey, 'val');

    equal(store.getItem(testKey), 'val');
});

test('removeItem: removes a saved value', function() {
    store.setItem(testKey, 'val');
    store.removeItem(testKey);
    equal(store.getItem(testKey), null);
});
