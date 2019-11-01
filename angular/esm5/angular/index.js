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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLElBQUE7SUFHSTtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELHlCQUFHOzs7SUFBSDtRQUNJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNuQjs7Ozs7O0lBRUQsK0JBQVM7Ozs7O0lBQVQsVUFBVSxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUUsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFBO0tBQzlCOzs7Ozs7SUFFRCx3QkFBRTs7Ozs7SUFBRixVQUFHLElBQWlCLEVBQUUsSUFBOEM7UUFDaEUsSUFBSSxDQUFDLEdBQUc7YUFDSCxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksRUFBakIsQ0FBaUIsQ0FBQzthQUNoQyxTQUFTLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUFBO0tBQzdEO3NCQTlCTDtJQStCQyxDQUFBO0FBcEJELHVCQW9CQzs7Ozs7Ozs7Ozs7Ozs7O0FBV0QsTUFBTSwyQkFBMkIsTUFBbUI7SUFDaEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLEVBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3pGO0FBR0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvciBBbmdsdWFyIDIrIChUeXBlU2NyaXB0KVxuICovXG5pbXBvcnQgeyBNU0csIEF1dGhDb25maWcsIGF1dGhNZXNzYWdlLCBNZXNzZW5nZXIgfSBmcm9tICcuLi9hdXRoVHlwZXMnXG5pbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnLi4vYXV0aCdcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcblxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnXG5cbi8vIFNldHVwIG1lc3NhZ2VQcm92aWRlclxuXG5leHBvcnQgY2xhc3MgbXNnUHJvdmlkZXIgaW1wbGVtZW50cyBNZXNzZW5nZXI8U3ViamVjdDxNU0c+PiB7XG4gICAgc3ViOiBTdWJqZWN0PE1TRz5cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3ViID0gbmV3IFN1YmplY3Q8TVNHPigpO1xuICAgIH1cblxuICAgIHJhdygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdWI7XG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWU6IGF1dGhNZXNzYWdlLCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpe1xuICAgICAgICB0aGlzLnN1Yi5uZXh0KHtuYW1lLCB1c2VyfSlcbiAgICB9XG5cbiAgICBvbihuYW1lOiBhdXRoTWVzc2FnZSwgZnVuYzogKGU6IEV2ZW50LCBkYXRhOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSl7XG4gICAgICAgIHRoaXMuc3ViXG4gICAgICAgICAgICAuZmlsdGVyKG1zZyA9PiBtc2cubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobXNnID0+IGZ1bmMobmV3IEV2ZW50KG1zZy5uYW1lKSwgbXNnLnVzZXIpKVxuICAgIH1cbn1cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgY2xhc3MgdGhhdCBjYW4gYmUgbG9hZGVkIGluIEFuZ3VsYXJcbiAqXG4gKiBUT0RPOiBhbGxvdyBkaWZmZXJudCB0eXBlcyBoZXJlOlxuICogIC0gT2JzZXJ2aWJsZVxuICogIC0gUHJvbWlzZVxuICogIC0gT2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZ0dwb2F1dGhGYWN0b3J5KGNvbmZpZz86IEF1dGhDb25maWcpOiBBdXRoU2VydmljZSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoU2VydmljZShPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0QXV0aENvbmYsIGNvbmZpZyksICBuZXcgbXNnUHJvdmlkZXIoKSlcbn1cblxuLy8gRXhwb3NlIGludGVybmFsIHR5cGVzXG5leHBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnXG5leHBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5leHBvcnQgeyBBdXRoQ29uZmlnIH0gZnJvbSAnLi4vYXV0aFR5cGVzJyJdfQ==