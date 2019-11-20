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
export { TokenInterceptor } from './interceptor';
export { GeoPlatformUser } from '../GeoPlatformUser';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLE1BQU07SUFHRjtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELEdBQUc7UUFDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7OztJQUVELFNBQVMsQ0FBQyxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDOUI7Ozs7OztJQUVELEVBQUUsQ0FBQyxJQUFpQixFQUFFLElBQThDO1FBQ2hFLElBQUksQ0FBQyxHQUFHO2FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUM3RDtDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUFXRCxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDekY7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQTtBQUNoRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvciBBbmdsdWFyIDIrIChUeXBlU2NyaXB0KVxuICovXG5pbXBvcnQgeyBNU0csIEF1dGhDb25maWcsIGF1dGhNZXNzYWdlLCBNZXNzZW5nZXIgfSBmcm9tICcuLi9hdXRoVHlwZXMnXG5pbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnLi4vYXV0aCdcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcblxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnXG5cbi8vIFNldHVwIG1lc3NhZ2VQcm92aWRlclxuXG5leHBvcnQgY2xhc3MgbXNnUHJvdmlkZXIgaW1wbGVtZW50cyBNZXNzZW5nZXI8U3ViamVjdDxNU0c+PiB7XG4gICAgc3ViOiBTdWJqZWN0PE1TRz5cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3ViID0gbmV3IFN1YmplY3Q8TVNHPigpO1xuICAgIH1cblxuICAgIHJhdygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdWI7XG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWU6IGF1dGhNZXNzYWdlLCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpe1xuICAgICAgICB0aGlzLnN1Yi5uZXh0KHtuYW1lLCB1c2VyfSlcbiAgICB9XG5cbiAgICBvbihuYW1lOiBhdXRoTWVzc2FnZSwgZnVuYzogKGU6IEV2ZW50LCBkYXRhOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSl7XG4gICAgICAgIHRoaXMuc3ViXG4gICAgICAgICAgICAuZmlsdGVyKG1zZyA9PiBtc2cubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobXNnID0+IGZ1bmMobmV3IEV2ZW50KG1zZy5uYW1lKSwgbXNnLnVzZXIpKVxuICAgIH1cbn1cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgY2xhc3MgdGhhdCBjYW4gYmUgbG9hZGVkIGluIEFuZ3VsYXJcbiAqXG4gKiBUT0RPOiBhbGxvdyBkaWZmZXJudCB0eXBlcyBoZXJlOlxuICogIC0gT2JzZXJ2aWJsZVxuICogIC0gUHJvbWlzZVxuICogIC0gT2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZ0dwb2F1dGhGYWN0b3J5KGNvbmZpZz86IEF1dGhDb25maWcpOiBBdXRoU2VydmljZSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoU2VydmljZShPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0QXV0aENvbmYsIGNvbmZpZyksICBuZXcgbXNnUHJvdmlkZXIoKSlcbn1cblxuLy8gRXhwb3NlIGludGVybmFsIHR5cGVzXG5leHBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnXG5leHBvcnQgeyBUb2tlbkludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvcidcbmV4cG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcbmV4cG9ydCB7IEF1dGhDb25maWcgfSBmcm9tICcuLi9hdXRoVHlwZXMnIl19