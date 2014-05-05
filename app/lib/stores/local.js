/* globals localStorage */

import Base from './base';

export default Base.extend({
    getItem: function(key) {
        return localStorage.getItem(key);
    },

    setItem: function(key, value) {
        localStorage.setItem(key, value);
    },

    removeItem: function(key) {
        localStorage.removeItem(key);
    }
});
