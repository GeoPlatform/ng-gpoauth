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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZ3BvYXV0aC8iLCJzb3VyY2VzIjpbInNyYy9HZW9QbGF0Zm9ybVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFPQTs7OztBQUFBO0lBVUkseUJBQVksSUFBUztRQUNuQixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7UUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQzVDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQTtRQUN6QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUE7UUFDdkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO0tBQ3BCOzs7O0lBRUQsZ0NBQU07OztJQUFOO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBQUEsQ0FBQzs7OztJQUVGLCtCQUFLOzs7SUFBTDtRQUNFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDL0I7SUFBQSxDQUFDOzs7OztJQUVGLGlDQUFPOzs7O0lBQVAsVUFBUSxHQUFRO1FBQ2QsSUFBSSxHQUFHLFlBQVksZUFBZSxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxPQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ25DLE9BQU8sT0FBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxXQUFXO2dCQUNuQyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUEsQ0FBQzs7Ozs7SUFFRixzQ0FBWTs7OztJQUFaLFVBQWEsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2lCQUNKLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDO2lCQUNoQixNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQztpQkFDdkIsTUFBTSxDQUFDO0tBQ3pCO0lBQUEsQ0FBQzswQkFwRE47SUFxREcsQ0FBQTs7Ozs7QUE5Q0gsMkJBOENHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSldUIH0gZnJvbSAnLi9hdXRoVHlwZXMnXG5cbi8qKlxuICogQ29udmllbmNlIGNsYXNzIHJlcHJlc2VudGluZyBhIHNpbXBsaWZpZWQgdXNlci5cbiAqXG4gKiBAY2xhc3MgR2VvUGxhdGZvcm1Vc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9QbGF0Zm9ybVVzZXIgIHtcbiAgICBpZCAgICAgIDogc3RyaW5nXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICAgIG5hbWUgICAgOiBzdHJpbmdcbiAgICBlbWFpbCAgIDogc3RyaW5nXG4gICAgb3JnICAgICA6IHN0cmluZ1xuICAgIHJvbGVzICAgOiBzdHJpbmdcbiAgICBncm91cHMgIDogW3tfaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nfV1cbiAgICBleHAgICAgIDogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzOiBKV1QpIHtcbiAgICAgIHRoaXMuaWQgPSBvcHRzLnN1YlxuICAgICAgdGhpcy51c2VybmFtZSA9IG9wdHMudXNlcm5hbWVcbiAgICAgIHRoaXMubmFtZSA9IG9wdHMubmFtZVxuICAgICAgdGhpcy5lbWFpbCA9IG9wdHMuZW1haWxcbiAgICAgIHRoaXMub3JnID0gb3B0cy5vcmdzWzBdICYmIG9wdHMub3Jnc1swXS5uYW1lXG4gICAgICB0aGlzLmdyb3VwcyA9IG9wdHMuZ3JvdXBzXG4gICAgICB0aGlzLnJvbGVzID0gb3B0cy5yb2xlc1xuICAgICAgdGhpcy5leHAgPSBvcHRzLmV4cFxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIHRoaXMpKSk7XG4gICAgfTtcblxuICAgIGNsb25lKCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMpXG4gICAgfTtcblxuICAgIGNvbXBhcmUoYXJnOiBhbnkpIHtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBHZW9QbGF0Zm9ybVVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgPT09IGFyZy5pZDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGFyZykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YoYXJnLmlkKSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICBhcmcuaWQgPT09IHRoaXMuaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlzQXV0aG9yaXplZChyb2xlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwcyAmJlxuICAgICAgICAgICAgICAhIXRoaXMuZ3JvdXBzXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChnID0+IGcubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG4gPT4gbiA9PT0gcm9sZSlcbiAgICAgICAgICAgICAgICAgICAgICAubGVuZ3RoO1xuICAgIH07XG4gIH0iXX0=