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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmctZ3BvYXV0aC8iLCJzb3VyY2VzIjpbInNyYy9HZW9QbGF0Zm9ybVVzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFPQSxNQUFNOzs7O0lBVUYsWUFBWSxJQUFTO1FBQ25CLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtRQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUE7UUFDN0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFBO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDNUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFBO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQTtRQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUE7S0FDcEI7Ozs7SUFFRCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVEO0lBQUEsQ0FBQzs7OztJQUVGLEtBQUs7UUFDSCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0tBQy9CO0lBQUEsQ0FBQzs7Ozs7SUFFRixPQUFPLENBQUMsR0FBUTtRQUNkLElBQUksR0FBRyxZQUFZLGVBQWUsRUFBRTtZQUNsQyxPQUFPLElBQUksQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQztTQUMzQjthQUFNLElBQUksT0FBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUNuQyxPQUFPLE9BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssV0FBVztnQkFDbkMsR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUFBLENBQUM7Ozs7O0lBRUYsWUFBWSxDQUFDLElBQVk7UUFDdkIsT0FBTyxJQUFJLENBQUMsTUFBTTtZQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTTtpQkFDSixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2lCQUNoQixNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO2lCQUN2QixNQUFNLENBQUM7S0FDekI7SUFBQSxDQUFDO0NBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBKV1QgfSBmcm9tICcuL2F1dGhUeXBlcydcblxuLyoqXG4gKiBDb252aWVuY2UgY2xhc3MgcmVwcmVzZW50aW5nIGEgc2ltcGxpZmllZCB1c2VyLlxuICpcbiAqIEBjbGFzcyBHZW9QbGF0Zm9ybVVzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb1BsYXRmb3JtVXNlciAge1xuICAgIGlkICAgICAgOiBzdHJpbmdcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgbmFtZSAgICA6IHN0cmluZ1xuICAgIGVtYWlsICAgOiBzdHJpbmdcbiAgICBvcmcgICAgIDogc3RyaW5nXG4gICAgcm9sZXMgICA6IHN0cmluZ1xuICAgIGdyb3VwcyAgOiBbe19pZDogc3RyaW5nLCBuYW1lOiBzdHJpbmd9XVxuICAgIGV4cCAgICAgOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKG9wdHM6IEpXVCkge1xuICAgICAgdGhpcy5pZCA9IG9wdHMuc3ViXG4gICAgICB0aGlzLnVzZXJuYW1lID0gb3B0cy51c2VybmFtZVxuICAgICAgdGhpcy5uYW1lID0gb3B0cy5uYW1lXG4gICAgICB0aGlzLmVtYWlsID0gb3B0cy5lbWFpbFxuICAgICAgdGhpcy5vcmcgPSBvcHRzLm9yZ3NbMF0gJiYgb3B0cy5vcmdzWzBdLm5hbWVcbiAgICAgIHRoaXMuZ3JvdXBzID0gb3B0cy5ncm91cHNcbiAgICAgIHRoaXMucm9sZXMgPSBvcHRzLnJvbGVzXG4gICAgICB0aGlzLmV4cCA9IG9wdHMuZXhwXG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcykpKTtcbiAgICB9O1xuXG4gICAgY2xvbmUoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcylcbiAgICB9O1xuXG4gICAgY29tcGFyZShhcmc6IGFueSkge1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEdlb1BsYXRmb3JtVXNlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5pZCA9PT0gYXJnLmlkO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZihhcmcuaWQpICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgIGFyZy5pZCA9PT0gdGhpcy5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgaXNBdXRob3JpemVkKHJvbGU6IHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzICYmXG4gICAgICAgICAgICAgICEhdGhpcy5ncm91cHNcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGcgPT4gZy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiBuID09PSByb2xlKVxuICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG4gICAgfTtcbiAgfSJdfQ==