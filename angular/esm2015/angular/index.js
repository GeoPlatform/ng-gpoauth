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
export { TokenInterceptor } from './interceptor';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLE1BQU07SUFHRjtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELEdBQUc7UUFDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7OztJQUVELFNBQVMsQ0FBQyxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDOUI7Ozs7OztJQUVELEVBQUUsQ0FBQyxJQUFpQixFQUFFLElBQThDO1FBQ2hFLElBQUksQ0FBQyxHQUFHO2FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUM3RDtDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUFXRCxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDekY7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvciBBbmdsdWFyIDIrIChUeXBlU2NyaXB0KVxuICovXG5pbXBvcnQgeyBNU0csIG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBhdXRoTWVzc2FnZSB9IGZyb20gJy4uL2F1dGhUeXBlcydcbmltcG9ydCB7IEF1dGhTZXJ2aWNlLCBEZWZhdWx0QXV0aENvbmYgfSBmcm9tICcuLi9hdXRoJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcydcblxuLy8gU2V0dXAgbWVzc2FnZVByb3ZpZGVyXG5cbmV4cG9ydCBjbGFzcyBtc2dQcm92aWRlciBpbXBsZW1lbnRzIG5nTWVzc2VuZ2VyPFN1YmplY3Q8TVNHPj4ge1xuICAgIHN1YjogU3ViamVjdDxNU0c+XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBTdWJqZWN0PE1TRz4oKTtcbiAgICB9XG5cbiAgICByYXcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViO1xuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lOiBhdXRoTWVzc2FnZSwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKXtcbiAgICAgICAgdGhpcy5zdWIubmV4dCh7bmFtZSwgdXNlcn0pXG4gICAgfVxuXG4gICAgb24obmFtZTogYXV0aE1lc3NhZ2UsIGZ1bmM6IChlOiBFdmVudCwgZGF0YTogR2VvUGxhdGZvcm1Vc2VyKSA9PiBhbnkpe1xuICAgICAgICB0aGlzLnN1YlxuICAgICAgICAgICAgLmZpbHRlcihtc2cgPT4gbXNnLm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKG1zZyA9PiBmdW5jKG5ldyBFdmVudChtc2cubmFtZSksIG1zZy51c2VyKSlcbiAgICB9XG59XG5cblxuLyoqXG4gKiBFeHBvc2UgdGhlIGNsYXNzIHRoYXQgY2FuIGJlIGxvYWRlZCBpbiBBbmd1bGFyXG4gKlxuICogVE9ETzogYWxsb3cgZGlmZmVybnQgdHlwZXMgaGVyZTpcbiAqICAtIE9ic2VydmlibGVcbiAqICAtIFByb21pc2VcbiAqICAtIE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbmdHcG9hdXRoRmFjdG9yeShjb25maWc/OiBBdXRoQ29uZmlnKTogQXV0aFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgQXV0aFNlcnZpY2UoT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdEF1dGhDb25mLCBjb25maWcpLCAgbmV3IG1zZ1Byb3ZpZGVyKCkpXG59XG5cbi8vIEV4cG9zZSBpbnRlcm5hbCB0eXBlc1xuZXhwb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJ1xuZXhwb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuZXhwb3J0IHsgVG9rZW5JbnRlcmNlcHRvciB9IGZyb20gJy4vaW50ZXJjZXB0b3InXG5leHBvcnQgeyBBdXRoQ29uZmlnIH0gZnJvbSAnLi4vYXV0aFR5cGVzJyJdfQ==