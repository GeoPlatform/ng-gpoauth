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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR2VvUGxhdGZvcm1Vc2VyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGdlb3BsYXRmb3JtL29hdXRoLW5nLyIsInNvdXJjZXMiOlsiR2VvUGxhdGZvcm1Vc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBOzs7O0dBSUc7QUFDSDtJQVVJLHlCQUFZLElBQVM7UUFDbkIsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUE7UUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUM1QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQTtJQUNyQixDQUFDO0lBRUQsZ0NBQU0sR0FBTjtRQUNFLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBQUEsQ0FBQztJQUVGLCtCQUFLLEdBQUw7UUFDRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ2hDLENBQUM7SUFBQSxDQUFDO0lBRUYsaUNBQU8sR0FBUCxVQUFRLEdBQVE7UUFDZCxJQUFJLEdBQUcsWUFBWSxlQUFlLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDbkMsT0FBTyxPQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFdBQVc7Z0JBQ25DLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsQ0FBQztTQUN0QjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUFBLENBQUM7SUFFRixzQ0FBWSxHQUFaLFVBQWEsSUFBWTtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNO1lBQ1YsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNO2lCQUNKLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxJQUFJLEVBQU4sQ0FBTSxDQUFDO2lCQUNoQixNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssSUFBSSxFQUFWLENBQVUsQ0FBQztpQkFDdkIsTUFBTSxDQUFDO0lBQzFCLENBQUM7SUFBQSxDQUFDO0lBQ0osc0JBQUM7QUFBRCxDQUFDLEFBOUNILElBOENHIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSldUIH0gZnJvbSAnLi9hdXRoVHlwZXMnXG5cbi8qKlxuICogQ29udmllbmNlIGNsYXNzIHJlcHJlc2VudGluZyBhIHNpbXBsaWZpZWQgdXNlci5cbiAqXG4gKiBHZW9QbGF0Zm9ybVVzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb1BsYXRmb3JtVXNlciAge1xuICAgIGlkICAgICAgOiBzdHJpbmdcbiAgICB1c2VybmFtZTogc3RyaW5nXG4gICAgbmFtZSAgICA6IHN0cmluZ1xuICAgIGVtYWlsICAgOiBzdHJpbmdcbiAgICBvcmcgICAgIDogc3RyaW5nXG4gICAgcm9sZXMgICA6IHN0cmluZ1xuICAgIGdyb3VwcyAgOiBbe19pZDogc3RyaW5nLCBuYW1lOiBzdHJpbmd9XVxuICAgIGV4cCAgICAgOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKG9wdHM6IEpXVCkge1xuICAgICAgdGhpcy5pZCA9IG9wdHMuc3ViXG4gICAgICB0aGlzLnVzZXJuYW1lID0gb3B0cy51c2VybmFtZVxuICAgICAgdGhpcy5uYW1lID0gb3B0cy5uYW1lXG4gICAgICB0aGlzLmVtYWlsID0gb3B0cy5lbWFpbFxuICAgICAgdGhpcy5vcmcgPSBvcHRzLm9yZ3NbMF0gJiYgb3B0cy5vcmdzWzBdLm5hbWVcbiAgICAgIHRoaXMuZ3JvdXBzID0gb3B0cy5ncm91cHNcbiAgICAgIHRoaXMucm9sZXMgPSBvcHRzLnJvbGVzXG4gICAgICB0aGlzLmV4cCA9IG9wdHMuZXhwXG4gICAgfVxuXG4gICAgdG9KU09OKCkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmFzc2lnbih7fSwgdGhpcykpKTtcbiAgICB9O1xuXG4gICAgY2xvbmUoKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgdGhpcylcbiAgICB9O1xuXG4gICAgY29tcGFyZShhcmc6IGFueSkge1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEdlb1BsYXRmb3JtVXNlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5pZCA9PT0gYXJnLmlkO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YoYXJnKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZihhcmcuaWQpICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgIGFyZy5pZCA9PT0gdGhpcy5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuXG4gICAgaXNBdXRob3JpemVkKHJvbGU6IHN0cmluZykge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JvdXBzICYmXG4gICAgICAgICAgICAgICEhdGhpcy5ncm91cHNcbiAgICAgICAgICAgICAgICAgICAgICAubWFwKGcgPT4gZy5uYW1lKVxuICAgICAgICAgICAgICAgICAgICAgIC5maWx0ZXIobiA9PiBuID09PSByb2xlKVxuICAgICAgICAgICAgICAgICAgICAgIC5sZW5ndGg7XG4gICAgfTtcbiAgfSJdfQ==