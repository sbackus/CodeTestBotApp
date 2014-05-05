export default DS.Model.extend({
    name: DS.attr(),
    email: DS.attr(),

    level: DS.belongsTo('level'),
    submissions: DS.hasMany('submission'),

    display: function() {
        return this.get('name') + ' <' + this.get('email') + '>';
    }.property('name', 'email')
});

