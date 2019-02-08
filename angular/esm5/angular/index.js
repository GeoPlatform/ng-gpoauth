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
export { TokenInterceptor } from './interceptor';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFHdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUk5QixJQUFBO0lBR0k7UUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7S0FDakM7Ozs7SUFFRCx5QkFBRzs7O0lBQUg7UUFDSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7OztJQUVELCtCQUFTOzs7OztJQUFULFVBQVUsSUFBaUIsRUFBRSxJQUFxQjtRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksTUFBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUMsQ0FBQTtLQUM5Qjs7Ozs7O0lBRUQsd0JBQUU7Ozs7O0lBQUYsVUFBRyxJQUFpQixFQUFFLElBQThDO1FBQ2hFLElBQUksQ0FBQyxHQUFHO2FBQ0gsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWpCLENBQWlCLENBQUM7YUFDaEMsU0FBUyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQW5DLENBQW1DLENBQUMsQ0FBQTtLQUM3RDtzQkE5Qkw7SUErQkMsQ0FBQTtBQXBCRCx1QkFvQkM7Ozs7Ozs7Ozs7Ozs7OztBQVdELE1BQU0sMkJBQTJCLE1BQW1CO0lBQ2hELE9BQU8sSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxFQUFHLElBQUksV0FBVyxFQUFFLENBQUMsQ0FBQTtDQUN6RjtBQUdELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFDckMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFBO0FBQ3BELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRm9yIEFuZ2x1YXIgMisgKFR5cGVTY3JpcHQpXG4gKi9cbmltcG9ydCB7IE1TRywgbmdNZXNzZW5nZXIsIEF1dGhDb25maWcsIGF1dGhNZXNzYWdlIH0gZnJvbSAnLi4vYXV0aFR5cGVzJ1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UsIERlZmF1bHRBdXRoQ29uZiB9IGZyb20gJy4uL2F1dGgnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5cbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJ1xuXG4vLyBTZXR1cCBtZXNzYWdlUHJvdmlkZXJcblxuZXhwb3J0IGNsYXNzIG1zZ1Byb3ZpZGVyIGltcGxlbWVudHMgbmdNZXNzZW5nZXI8U3ViamVjdDxNU0c+PiB7XG4gICAgc3ViOiBTdWJqZWN0PE1TRz5cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3ViID0gbmV3IFN1YmplY3Q8TVNHPigpO1xuICAgIH1cblxuICAgIHJhdygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdWI7XG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWU6IGF1dGhNZXNzYWdlLCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpe1xuICAgICAgICB0aGlzLnN1Yi5uZXh0KHtuYW1lLCB1c2VyfSlcbiAgICB9XG5cbiAgICBvbihuYW1lOiBhdXRoTWVzc2FnZSwgZnVuYzogKGU6IEV2ZW50LCBkYXRhOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSl7XG4gICAgICAgIHRoaXMuc3ViXG4gICAgICAgICAgICAuZmlsdGVyKG1zZyA9PiBtc2cubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobXNnID0+IGZ1bmMobmV3IEV2ZW50KG1zZy5uYW1lKSwgbXNnLnVzZXIpKVxuICAgIH1cbn1cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgY2xhc3MgdGhhdCBjYW4gYmUgbG9hZGVkIGluIEFuZ3VsYXJcbiAqXG4gKiBUT0RPOiBhbGxvdyBkaWZmZXJudCB0eXBlcyBoZXJlOlxuICogIC0gT2JzZXJ2aWJsZVxuICogIC0gUHJvbWlzZVxuICogIC0gT2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZ0dwb2F1dGhGYWN0b3J5KGNvbmZpZz86IEF1dGhDb25maWcpOiBBdXRoU2VydmljZSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoU2VydmljZShPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0QXV0aENvbmYsIGNvbmZpZyksICBuZXcgbXNnUHJvdmlkZXIoKSlcbn1cblxuLy8gRXhwb3NlIGludGVybmFsIHR5cGVzXG5leHBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnXG5leHBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5leHBvcnQgeyBUb2tlbkludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvciciXX0=