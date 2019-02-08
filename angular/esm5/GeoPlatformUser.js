/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Convience class representing a simplified user.
 *
 */
var /**
 * Convience class representing a simplified user.
 *
 */
GeoPlatformUser = /** @class */ (function () {
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
    /**
     * @return {?}
     */
    GeoPlatformUser.prototype.toJSON = /**
     * @return {?}
     */
    function () {
        return JSON.parse(JSON.stringify(Object.assign({}, this)));
    };
    ;
    /**
     * @return {?}
     */
    GeoPlatformUser.prototype.clone = /**
     * @return {?}
     */
    function () {
        return Object.assign({}, this);
    };
    ;
    /**
     * @param {?} arg
     * @return {?}
     */
    GeoPlatformUser.prototype.compare = /**
     * @param {?} arg
     * @return {?}
     */
    function (arg) {
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
    /**
     * @param {?} role
     * @return {?}
     */
    GeoPlatformUser.prototype.isAuthorized = /**
     * @param {?} role
     * @return {?}
     */
    function (role) {
        return this.groups &&
            !!this.groups
                .map(function (g) { return g.name; })
                .filter(function (n) { return n === role; })
                .length;
    };
    ;
    return GeoPlatformUser;
}());
/**
 * Convience class representing a simplified user.
 *
 */
export { GeoPlatformUser };
if (false) {
    /** @type {?} */
    GeoPlatformUser.prototype.id;
    /** @type {?} */
    GeoPlatformUser.prototype.username;
    /** @type {?} */
    GeoPlatformUser.prototype.name;
    /** @type {?} */
    GeoPlatformUser.prototype.email;
    /** @type {?} */
    GeoPlatformUser.prototype.org;
    /** @type {?} */
    GeoPlatformUser.prototype.roles;
    /** @type {?} */
    GeoPlatformUser.prototype.groups;
    /** @type {?} */
    GeoPlatformUser.prototype.exp;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZ3BvYXV0aC8iLCJzb3VyY2VzIjpbIkdlb1BsYXRmb3JtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU9BOzs7O0FBQUE7SUFVSSx5QkFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7S0FDcEI7Ozs7SUFFRCxnQ0FBTTs7O0lBQU47UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFBQSxDQUFDOzs7O0lBRUYsK0JBQUs7OztJQUFMO1FBQ0UsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQTtLQUMvQjtJQUFBLENBQUM7Ozs7O0lBRUYsaUNBQU87Ozs7SUFBUCxVQUFRLEdBQVE7UUFDZCxJQUFJLEdBQUcsWUFBWSxlQUFlLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDbkMsT0FBTyxPQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFdBQVc7Z0JBQ25DLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUN0QjtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFBQSxDQUFDOzs7OztJQUVGLHNDQUFZOzs7O0lBQVosVUFBYSxJQUFZO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU07WUFDVixDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU07aUJBQ0osR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsS0FBSyxJQUFJLEVBQVYsQ0FBVSxDQUFDO2lCQUN2QixNQUFNLENBQUM7S0FDekI7SUFBQSxDQUFDOzBCQXBETjtJQXFERyxDQUFBOzs7OztBQTlDSCwyQkE4Q0ciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKV1QgfSBmcm9tICcuL2F1dGhUeXBlcydcblxuLyoqXG4gKiBDb252aWVuY2UgY2xhc3MgcmVwcmVzZW50aW5nIGEgc2ltcGxpZmllZCB1c2VyLlxuICpcbiAqIEBjbGFzcyBHZW9QbGF0Zm9ybVVzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb1BsYXRmb3JtVXNlciAge1xuICAgIGlkICAgICAgOiBzdHJpbmdcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgbmFtZSAgICA6IHN0cmluZ1xuICAgIGVtYWlsICAgOiBzdHJpbmdcbiAgICBvcmcgICAgIDogc3RyaW5nXG4gICAgcm9sZXMgICA6IHN0cmluZ1xuICAgIGdyb3VwcyAgOiBbe19pZDogc3RyaW5nLCBuYW1lOiBzdHJpbmd9XVxuICAgIGV4cCAgICAgOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKG9wdHM6IEpXVCkge1xuICAgICAgdGhpcy5pZCA9IG9wdHMuc3ViXG4gICAgICB0aGlzLnVzZXJuYW1lID0gb3B0cy51c2VybmFtZVxuICAgICAgdGhpcy5uYW1lID0gb3B0cy5uYW1lXG4gICAgICB0aGlzLmVtYWlsID0gb3B0cy5lbWFpbFxuICAgICAgdGhpcy5vcmcgPSBvcHRzLm9yZ3NbMF0gJiYgb3B0cy5vcmdzWzBdLm5hbWVcbiAgICAgIHRoaXMuZ3JvdXBzID0gb3B0cy5ncm91cHNcbiAgICAgIHRoaXMucm9sZXMgPSBvcHRzLnJvbGVzXG4gICAgICB0aGlzLmV4cCA9IG9wdHMuZXhwXG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcykpKTtcbiAgICB9O1xuXG4gICAgY2xvbmUoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcylcbiAgICB9O1xuXG4gICAgY29tcGFyZShhcmc6IGFueSkge1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEdlb1BsYXRmb3JtVXNlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5pZCA9PT0gYXJnLmlkO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZihhcmcuaWQpICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgIGFyZy5pZCA9PT0gdGhpcy5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgaXNBdXRob3JpemVkKHJvbGU6IHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzICYmXG4gICAgICAgICAgICAgICEhdGhpcy5ncm91cHNcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGcgPT4gZy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiBuID09PSByb2xlKVxuICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG4gICAgfTtcbiAgfSJdfQ==