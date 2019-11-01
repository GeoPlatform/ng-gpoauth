/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AuthService, DefaultAuthConf } from '../auth';
import { Subject } from 'rxjs';
export class msgProvider {
    constructor() {
        this.sub = new Subject();
    }
    /**
     * @return {?}
     */
    raw() {
        return this.sub;
    }
    /**
     * @param {?} name
     * @param {?} user
     * @return {?}
     */
    broadcast(name, user) {
        this.sub.next({ name, user });
    }
    /**
     * @param {?} name
     * @param {?} func
     * @return {?}
     */
    on(name, func) {
        this.sub
            .filter(msg => msg.name === name)
            .subscribe(msg => func(new Event(msg.name), msg.user));
    }
}
if (false) {
    /** @type {?} */
    msgProvider.prototype.sub;
}
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 * @param {?=} config
 * @return {?}
 */
export function ngGpoauthFactory(config) {
    return new AuthService(Object.assign({}, DefaultAuthConf, config), new msgProvider());
}
export { AuthService } from '../auth';
export { GeoPlatformUser } from '../GeoPlatformUser';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLE1BQU07SUFHRjtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELEdBQUc7UUFDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7OztJQUVELFNBQVMsQ0FBQyxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDOUI7Ozs7OztJQUVELEVBQUUsQ0FBQyxJQUFpQixFQUFFLElBQThDO1FBQ2hFLElBQUksQ0FBQyxHQUFHO2FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUM3RDtDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUFXRCxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDekY7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRm9yIEFuZ2x1YXIgMisgKFR5cGVTY3JpcHQpXG4gKi9cbmltcG9ydCB7IE1TRywgQXV0aENvbmZpZywgYXV0aE1lc3NhZ2UsIE1lc3NlbmdlciB9IGZyb20gJy4uL2F1dGhUeXBlcydcbmltcG9ydCB7IEF1dGhTZXJ2aWNlLCBEZWZhdWx0QXV0aENvbmYgfSBmcm9tICcuLi9hdXRoJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcydcblxuLy8gU2V0dXAgbWVzc2FnZVByb3ZpZGVyXG5cbmV4cG9ydCBjbGFzcyBtc2dQcm92aWRlciBpbXBsZW1lbnRzIE1lc3NlbmdlcjxTdWJqZWN0PE1TRz4+IHtcbiAgICBzdWI6IFN1YmplY3Q8TVNHPlxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zdWIgPSBuZXcgU3ViamVjdDxNU0c+KCk7XG4gICAgfVxuXG4gICAgcmF3KCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YjtcbiAgICB9XG5cbiAgICBicm9hZGNhc3QobmFtZTogYXV0aE1lc3NhZ2UsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcil7XG4gICAgICAgIHRoaXMuc3ViLm5leHQoe25hbWUsIHVzZXJ9KVxuICAgIH1cblxuICAgIG9uKG5hbWU6IGF1dGhNZXNzYWdlLCBmdW5jOiAoZTogRXZlbnQsIGRhdGE6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KXtcbiAgICAgICAgdGhpcy5zdWJcbiAgICAgICAgICAgIC5maWx0ZXIobXNnID0+IG1zZy5uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgLnN1YnNjcmliZShtc2cgPT4gZnVuYyhuZXcgRXZlbnQobXNnLm5hbWUpLCBtc2cudXNlcikpXG4gICAgfVxufVxuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBjbGFzcyB0aGF0IGNhbiBiZSBsb2FkZWQgaW4gQW5ndWxhclxuICpcbiAqIFRPRE86IGFsbG93IGRpZmZlcm50IHR5cGVzIGhlcmU6XG4gKiAgLSBPYnNlcnZpYmxlXG4gKiAgLSBQcm9taXNlXG4gKiAgLSBPYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5nR3BvYXV0aEZhY3RvcnkoY29uZmlnPzogQXV0aENvbmZpZyk6IEF1dGhTZXJ2aWNlIHtcbiAgICByZXR1cm4gbmV3IEF1dGhTZXJ2aWNlKE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRBdXRoQ29uZiwgY29uZmlnKSwgIG5ldyBtc2dQcm92aWRlcigpKVxufVxuXG4vLyBFeHBvc2UgaW50ZXJuYWwgdHlwZXNcbmV4cG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCdcbmV4cG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcbmV4cG9ydCB7IEF1dGhDb25maWcgfSBmcm9tICcuLi9hdXRoVHlwZXMnIl19