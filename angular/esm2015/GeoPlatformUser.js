/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Convience class representing a simplified user.
 *
 * GeoPlatformUser
 */
export class GeoPlatformUser {
    /**
     * @param {?} opts
     */
    constructor(opts) {
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
    toJSON() {
        return JSON.parse(JSON.stringify(Object.assign({}, this)));
    }
    ;
    /**
     * @return {?}
     */
    clone() {
        return Object.assign({}, this);
    }
    ;
    /**
     * @param {?} arg
     * @return {?}
     */
    compare(arg) {
        if (arg instanceof GeoPlatformUser) {
            return this.id === arg.id;
        }
        else if (typeof (arg) === 'object') {
            return typeof (arg.id) !== 'undefined' &&
                arg.id === this.id;
        }
        return false;
    }
    ;
    /**
     * @param {?} role
     * @return {?}
     */
    isAuthorized(role) {
        return this.groups &&
            !!this.groups
                .map(g => g.name)
                .filter(n => n === role)
                .length;
    }
    ;
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGdlb3BsYXRmb3JtL29hdXRoLW5nLyIsInNvdXJjZXMiOlsiR2VvUGxhdGZvcm1Vc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQU9BLE1BQU07Ozs7SUFVRixZQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtLQUNwQjs7OztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFBQSxDQUFDOzs7O0lBRUYsS0FBSztRQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDL0I7SUFBQSxDQUFDOzs7OztJQUVGLE9BQU8sQ0FBQyxHQUFRO1FBQ2QsSUFBSSxHQUFHLFlBQVksZUFBZSxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxPQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ25DLE9BQU8sT0FBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxXQUFXO2dCQUNuQyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUEsQ0FBQzs7Ozs7SUFFRixZQUFZLENBQUMsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2lCQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7aUJBQ3ZCLE1BQU0sQ0FBQztLQUN6QjtJQUFBLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEpXVCB9IGZyb20gJy4vYXV0aFR5cGVzJ1xuXG4vKipcbiAqIENvbnZpZW5jZSBjbGFzcyByZXByZXNlbnRpbmcgYSBzaW1wbGlmaWVkIHVzZXIuXG4gKlxuICogR2VvUGxhdGZvcm1Vc2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9QbGF0Zm9ybVVzZXIgIHtcbiAgICBpZCAgICAgIDogc3RyaW5nXG4gICAgdXNlcm5hbWU6IHN0cmluZ1xuICAgIG5hbWUgICAgOiBzdHJpbmdcbiAgICBlbWFpbCAgIDogc3RyaW5nXG4gICAgb3JnICAgICA6IHN0cmluZ1xuICAgIHJvbGVzICAgOiBzdHJpbmdcbiAgICBncm91cHMgIDogW3tfaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nfV1cbiAgICBleHAgICAgIDogbnVtYmVyXG5cbiAgICBjb25zdHJ1Y3RvcihvcHRzOiBKV1QpIHtcbiAgICAgIHRoaXMuaWQgPSBvcHRzLnN1YlxuICAgICAgdGhpcy51c2VybmFtZSA9IG9wdHMudXNlcm5hbWVcbiAgICAgIHRoaXMubmFtZSA9IG9wdHMubmFtZVxuICAgICAgdGhpcy5lbWFpbCA9IG9wdHMuZW1haWxcbiAgICAgIHRoaXMub3JnID0gb3B0cy5vcmdzWzBdICYmIG9wdHMub3Jnc1swXS5uYW1lXG4gICAgICB0aGlzLmdyb3VwcyA9IG9wdHMuZ3JvdXBzXG4gICAgICB0aGlzLnJvbGVzID0gb3B0cy5yb2xlc1xuICAgICAgdGhpcy5leHAgPSBvcHRzLmV4cFxuICAgIH1cblxuICAgIHRvSlNPTigpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KE9iamVjdC5hc3NpZ24oe30sIHRoaXMpKSk7XG4gICAgfTtcblxuICAgIGNsb25lKCkge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHRoaXMpXG4gICAgfTtcblxuICAgIGNvbXBhcmUoYXJnOiBhbnkpIHtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBHZW9QbGF0Zm9ybVVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaWQgPT09IGFyZy5pZDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mKGFyZykgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YoYXJnLmlkKSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICBhcmcuaWQgPT09IHRoaXMuaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgIGlzQXV0aG9yaXplZChyb2xlOiBzdHJpbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmdyb3VwcyAmJlxuICAgICAgICAgICAgICAhIXRoaXMuZ3JvdXBzXG4gICAgICAgICAgICAgICAgICAgICAgLm1hcChnID0+IGcubmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG4gPT4gbiA9PT0gcm9sZSlcbiAgICAgICAgICAgICAgICAgICAgICAubGVuZ3RoO1xuICAgIH07XG4gIH0iXX0=