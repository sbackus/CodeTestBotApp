/* globals localStorage, equal */

import { test } from 'ember-qunit';
import LocalStore from 'code-test-bot-app/lib/stores/local';

module('LocalStore');

var testKey = 'test';
var store = LocalStore.create();

test('getItem: gets a value from localStorage', function() {
    localStorage.setItem(testKey, 'val');

    equal(store.getItem(testKey), 'val');

    cleanup();
});

test('setItem: sets a value to localStorage', function() {
    store.setItem(testKey, 'val');

    equal(localStorage.getItem(testKey), 'val');

    cleanup();
});

test('removeItem: removes a value from localStorage', function() {
    store.setItem(testKey, 'val');
    store.removeItem(testKey);
    equal(store.getItem(testKey), null);

    cleanup();
});

function cleanup() {
    localStorage.removeItem(testKey);
}
