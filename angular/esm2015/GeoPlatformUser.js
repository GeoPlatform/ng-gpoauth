/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Convience class representing a simplified user.
 *
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZ3BvYXV0aC8iLCJzb3VyY2VzIjpbIkdlb1BsYXRmb3JtVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU9BLE1BQU07Ozs7SUFVRixZQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtLQUNwQjs7OztJQUVELE1BQU07UUFDSixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDNUQ7SUFBQSxDQUFDOzs7O0lBRUYsS0FBSztRQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7S0FDL0I7SUFBQSxDQUFDOzs7OztJQUVGLE9BQU8sQ0FBQyxHQUFRO1FBQ2QsSUFBSSxHQUFHLFlBQVksZUFBZSxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDO1NBQzNCO2FBQU0sSUFBSSxPQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ25DLE9BQU8sT0FBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxXQUFXO2dCQUNuQyxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUM7U0FDdEI7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO0lBQUEsQ0FBQzs7Ozs7SUFFRixZQUFZLENBQUMsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2lCQUNKLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7aUJBQ2hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7aUJBQ3ZCLE1BQU0sQ0FBQztLQUN6QjtJQUFBLENBQUM7Q0FDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEpXVCB9IGZyb20gJy4vYXV0aFR5cGVzJ1xuXG4vKipcbiAqIENvbnZpZW5jZSBjbGFzcyByZXByZXNlbnRpbmcgYSBzaW1wbGlmaWVkIHVzZXIuXG4gKlxuICogQGNsYXNzIEdlb1BsYXRmb3JtVXNlclxuICovXG5leHBvcnQgY2xhc3MgR2VvUGxhdGZvcm1Vc2VyICB7XG4gICAgaWQgICAgICA6IHN0cmluZ1xuICAgIHVzZXJuYW1lOiBzdHJpbmdcbiAgICBuYW1lICAgIDogc3RyaW5nXG4gICAgZW1haWwgICA6IHN0cmluZ1xuICAgIG9yZyAgICAgOiBzdHJpbmdcbiAgICByb2xlcyAgIDogc3RyaW5nXG4gICAgZ3JvdXBzICA6IFt7X2lkOiBzdHJpbmcsIG5hbWU6IHN0cmluZ31dXG4gICAgZXhwICAgICA6IG51bWJlclxuXG4gICAgY29uc3RydWN0b3Iob3B0czogSldUKSB7XG4gICAgICB0aGlzLmlkID0gb3B0cy5zdWJcbiAgICAgIHRoaXMudXNlcm5hbWUgPSBvcHRzLnVzZXJuYW1lXG4gICAgICB0aGlzLm5hbWUgPSBvcHRzLm5hbWVcbiAgICAgIHRoaXMuZW1haWwgPSBvcHRzLmVtYWlsXG4gICAgICB0aGlzLm9yZyA9IG9wdHMub3Jnc1swXSAmJiBvcHRzLm9yZ3NbMF0ubmFtZVxuICAgICAgdGhpcy5ncm91cHMgPSBvcHRzLmdyb3Vwc1xuICAgICAgdGhpcy5yb2xlcyA9IG9wdHMucm9sZXNcbiAgICAgIHRoaXMuZXhwID0gb3B0cy5leHBcbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShPYmplY3QuYXNzaWduKHt9LCB0aGlzKSkpO1xuICAgIH07XG5cbiAgICBjbG9uZSgpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCB0aGlzKVxuICAgIH07XG5cbiAgICBjb21wYXJlKGFyZzogYW55KSB7XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgR2VvUGxhdGZvcm1Vc2VyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlkID09PSBhcmcuaWQ7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZihhcmcpID09PSAnb2JqZWN0Jykge1xuICAgICAgICByZXR1cm4gdHlwZW9mKGFyZy5pZCkgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgYXJnLmlkID09PSB0aGlzLmlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICBpc0F1dGhvcml6ZWQocm9sZTogc3RyaW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5ncm91cHMgJiZcbiAgICAgICAgICAgICAgISF0aGlzLmdyb3Vwc1xuICAgICAgICAgICAgICAgICAgICAgIC5tYXAoZyA9PiBnLm5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihuID0+IG4gPT09IHJvbGUpXG4gICAgICAgICAgICAgICAgICAgICAgLmxlbmd0aDtcbiAgICB9O1xuICB9Il19