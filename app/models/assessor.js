import User from './user';

export default User.extend({
    toString: function() {
        return this.get('name') + ' <' + this.get('email') + '>';
    }
});
