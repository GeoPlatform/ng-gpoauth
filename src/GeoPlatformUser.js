/**
 * Convience class representing a simplified user.
 *
 * GeoPlatformUser
 */
var GeoPlatformUser = /** @class */ (function () {
    function GeoPlatformUser(opts) {
        this.id = opts.sub;
        this.username = opts.username;
        this.name = opts.name;
        this.email = opts.email;
        this.org = opts.orgs[0] && opts.orgs[0].name;
        this.groups = opts.groups;
        this.roles = opts.roles;
        this.exp = opts.exp;
    }
    GeoPlatformUser.prototype.toJSON = function () {
        return JSON.parse(JSON.stringify(Object.assign({}, this)));
    };
    ;
    GeoPlatformUser.prototype.clone = function () {
        return Object.assign({}, this);
    };
    ;
    GeoPlatformUser.prototype.compare = function (arg) {
        if (arg instanceof GeoPlatformUser) {
            return this.id === arg.id;
        }
        else if (typeof (arg) === 'object') {
            return typeof (arg.id) !== 'undefined' &&
                arg.id === this.id;
        }
        return false;
    };
    ;
    GeoPlatformUser.prototype.isAuthorized = function (role) {
        return this.groups &&
            !!this.groups
                .map(function (g) { return g.name; })
                .filter(function (n) { return n === role; })
                .length;
    };
    ;
    return GeoPlatformUser;
}());
export { GeoPlatformUser };
