import './user';

export default DS.Model.extend({
    token: DS.attr(),
    tokenExpiry: DS.attr(),
    user: DS.belongsTo('user')
});
