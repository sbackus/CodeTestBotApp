function injectFakeStore(target) {
    var store = { createRecord: function() {}, find: function() {} };
    target.store = store;
    return store;
}

export { injectFakeStore };
