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
    return new AuthService(config || DefaultAuthConf, new msgProvider());
}
export { AuthService } from '../auth';
export { GeoPlatformUser } from '../GeoPlatformUser';
export { TokenInterceptor } from './interceptor';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsic3JjL2FuZ3VsYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBR3RELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFJOUIsSUFBQTtJQUdJO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0tBQ2pDOzs7O0lBRUQseUJBQUc7OztJQUFIO1FBQ0ksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ25COzs7Ozs7SUFFRCwrQkFBUzs7Ozs7SUFBVCxVQUFVLElBQWlCLEVBQUUsSUFBcUI7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDLENBQUE7S0FDOUI7Ozs7OztJQUVELHdCQUFFOzs7OztJQUFGLFVBQUcsSUFBaUIsRUFBRSxJQUE4QztRQUNoRSxJQUFJLENBQUMsR0FBRzthQUNILE1BQU0sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUFqQixDQUFpQixDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFuQyxDQUFtQyxDQUFDLENBQUE7S0FDN0Q7c0JBOUJMO0lBK0JDLENBQUE7QUFwQkQsdUJBb0JDOzs7Ozs7Ozs7Ozs7Ozs7QUFXRCxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxlQUFlLEVBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3hFO0FBR0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGb3IgQW5nbHVhciAyKyAoVHlwZVNjcmlwdClcbiAqL1xuaW1wb3J0IHsgTVNHLCBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgYXV0aE1lc3NhZ2UgfSBmcm9tICcuLi9hdXRoVHlwZXMnXG5pbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnLi4vYXV0aCdcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcblxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnXG5cbi8vIFNldHVwIG1lc3NhZ2VQcm92aWRlclxuXG5leHBvcnQgY2xhc3MgbXNnUHJvdmlkZXIgaW1wbGVtZW50cyBuZ01lc3NlbmdlcjxTdWJqZWN0PE1TRz4+IHtcbiAgICBzdWI6IFN1YmplY3Q8TVNHPlxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zdWIgPSBuZXcgU3ViamVjdDxNU0c+KCk7XG4gICAgfVxuXG4gICAgcmF3KCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YjtcbiAgICB9XG5cbiAgICBicm9hZGNhc3QobmFtZTogYXV0aE1lc3NhZ2UsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcil7XG4gICAgICAgIHRoaXMuc3ViLm5leHQoe25hbWUsIHVzZXJ9KVxuICAgIH1cblxuICAgIG9uKG5hbWU6IGF1dGhNZXNzYWdlLCBmdW5jOiAoZTogRXZlbnQsIGRhdGE6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KXtcbiAgICAgICAgdGhpcy5zdWJcbiAgICAgICAgICAgIC5maWx0ZXIobXNnID0+IG1zZy5uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgLnN1YnNjcmliZShtc2cgPT4gZnVuYyhuZXcgRXZlbnQobXNnLm5hbWUpLCBtc2cudXNlcikpXG4gICAgfVxufVxuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBjbGFzcyB0aGF0IGNhbiBiZSBsb2FkZWQgaW4gQW5ndWxhclxuICpcbiAqIFRPRE86IGFsbG93IGRpZmZlcm50IHR5cGVzIGhlcmU6XG4gKiAgLSBPYnNlcnZpYmxlXG4gKiAgLSBQcm9taXNlXG4gKiAgLSBPYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5nR3BvYXV0aEZhY3RvcnkoY29uZmlnPzogQXV0aENvbmZpZyk6IEF1dGhTZXJ2aWNlIHtcbiAgICByZXR1cm4gbmV3IEF1dGhTZXJ2aWNlKGNvbmZpZyB8fCBEZWZhdWx0QXV0aENvbmYsICBuZXcgbXNnUHJvdmlkZXIoKSlcbn1cblxuLy8gRXhwb3NlIGludGVybmFsIHR5cGVzXG5leHBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnXG5leHBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5leHBvcnQgeyBUb2tlbkludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvciciXX0=