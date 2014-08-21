import DS from 'ember-data';

export default DS.Model.extend({
    token: DS.attr(),
    tokenExpiry: DS.attr(),
    user: DS.belongsTo('user')
});
