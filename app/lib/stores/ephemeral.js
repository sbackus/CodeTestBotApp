import Base from './base';

export default Base.extend({
    data: {},

    getItem: function(key) {
        return this.data[key];
    },

    setItem: function(key, value) {
        this.data[key] = value;
    },

    removeItem: function(key) {
        delete this.data[key];
    }
});

