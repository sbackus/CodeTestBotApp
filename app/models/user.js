import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),
    imageUrl: DS.attr(),
    editable: DS.attr(),
    role: DS.belongsTo('role'),
    session: DS.hasMany('session')
});
