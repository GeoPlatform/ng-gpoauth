/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AuthService, DefaultAuthConf } from '../auth';
import { Subject } from 'rxjs';
var msgProvider = /** @class */ (function () {
    function msgProvider() {
        this.sub = new Subject();
    }
    /**
     * @return {?}
     */
    msgProvider.prototype.raw = /**
     * @return {?}
     */
    function () {
        return this.sub;
    };
    /**
     * @param {?} name
     * @param {?} user
     * @return {?}
     */
    msgProvider.prototype.broadcast = /**
     * @param {?} name
     * @param {?} user
     * @return {?}
     */
    function (name, user) {
        this.sub.next({ name: name, user: user });
    };
    /**
     * @param {?} name
     * @param {?} func
     * @return {?}
     */
    msgProvider.prototype.on = /**
     * @param {?} name
     * @param {?} func
     * @return {?}
     */
    function (name, func) {
        this.sub
            .filter(function (msg) { return msg.name === name; })
            .subscribe(function (msg) { return func(new Event(msg.name), msg.user); });
    };
    return msgProvider;
}());
export { msgProvider };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLElBQUE7SUFHSTtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELHlCQUFHOzs7SUFBSDtRQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNuQjs7Ozs7O0lBRUQsK0JBQVM7Ozs7O0lBQVQsVUFBVSxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFBO0tBQzlCOzs7Ozs7SUFFRCx3QkFBRTs7Ozs7SUFBRixVQUFHLElBQWlCLEVBQUUsSUFBOEM7UUFDaEUsSUFBSSxDQUFDLEdBQUc7YUFDSCxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksRUFBakIsQ0FBaUIsQ0FBQzthQUNoQyxTQUFTLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFBO0tBQzdEO3NCQTlCTDtJQStCQyxDQUFBO0FBcEJELHVCQW9CQzs7Ozs7Ozs7Ozs7Ozs7O0FBV0QsTUFBTSwyQkFBMkIsTUFBbUI7SUFDaEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLEVBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3pGO0FBR0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvciBBbmdsdWFyIDIrIChUeXBlU2NyaXB0KVxuICovXG5pbXBvcnQgeyBNU0csIG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBhdXRoTWVzc2FnZSB9IGZyb20gJy4uL2F1dGhUeXBlcydcbmltcG9ydCB7IEF1dGhTZXJ2aWNlLCBEZWZhdWx0QXV0aENvbmYgfSBmcm9tICcuLi9hdXRoJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcydcblxuLy8gU2V0dXAgbWVzc2FnZVByb3ZpZGVyXG5cbmV4cG9ydCBjbGFzcyBtc2dQcm92aWRlciBpbXBsZW1lbnRzIG5nTWVzc2VuZ2VyPFN1YmplY3Q8TVNHPj4ge1xuICAgIHN1YjogU3ViamVjdDxNU0c+XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBTdWJqZWN0PE1TRz4oKTtcbiAgICB9XG5cbiAgICByYXcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViO1xuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lOiBhdXRoTWVzc2FnZSwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKXtcbiAgICAgICAgdGhpcy5zdWIubmV4dCh7bmFtZSwgdXNlcn0pXG4gICAgfVxuXG4gICAgb24obmFtZTogYXV0aE1lc3NhZ2UsIGZ1bmM6IChlOiBFdmVudCwgZGF0YTogR2VvUGxhdGZvcm1Vc2VyKSA9PiBhbnkpe1xuICAgICAgICB0aGlzLnN1YlxuICAgICAgICAgICAgLmZpbHRlcihtc2cgPT4gbXNnLm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKG1zZyA9PiBmdW5jKG5ldyBFdmVudChtc2cubmFtZSksIG1zZy51c2VyKSlcbiAgICB9XG59XG5cblxuLyoqXG4gKiBFeHBvc2UgdGhlIGNsYXNzIHRoYXQgY2FuIGJlIGxvYWRlZCBpbiBBbmd1bGFyXG4gKlxuICogVE9ETzogYWxsb3cgZGlmZmVybnQgdHlwZXMgaGVyZTpcbiAqICAtIE9ic2VydmlibGVcbiAqICAtIFByb21pc2VcbiAqICAtIE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbmdHcG9hdXRoRmFjdG9yeShjb25maWc/OiBBdXRoQ29uZmlnKTogQXV0aFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgQXV0aFNlcnZpY2UoT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdEF1dGhDb25mLCBjb25maWcpLCAgbmV3IG1zZ1Byb3ZpZGVyKCkpXG59XG5cbi8vIEV4cG9zZSBpbnRlcm5hbCB0eXBlc1xuZXhwb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuLi9hdXRoJ1xuZXhwb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuZXhwb3J0IHsgQXV0aENvbmZpZyB9IGZyb20gJy4uL2F1dGhUeXBlcyciXX0=