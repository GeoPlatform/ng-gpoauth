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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJhbmd1bGFyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFJQSxPQUFPLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUd0RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBSTlCLE1BQU07SUFHRjtRQUNJLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztLQUNqQzs7OztJQUVELEdBQUc7UUFDQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7OztJQUVELFNBQVMsQ0FBQyxJQUFpQixFQUFFLElBQXFCO1FBQzlDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUE7S0FDOUI7Ozs7OztJQUVELEVBQUUsQ0FBQyxJQUFpQixFQUFFLElBQThDO1FBQ2hFLElBQUksQ0FBQyxHQUFHO2FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUM7YUFDaEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtLQUM3RDtDQUNKOzs7Ozs7Ozs7Ozs7Ozs7QUFXRCxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDekY7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRm9yIEFuZ2x1YXIgMisgKFR5cGVTY3JpcHQpXG4gKi9cbmltcG9ydCB7IE1TRywgbmdNZXNzZW5nZXIsIEF1dGhDb25maWcsIGF1dGhNZXNzYWdlIH0gZnJvbSAnLi4vYXV0aFR5cGVzJ1xuaW1wb3J0IHsgQXV0aFNlcnZpY2UsIERlZmF1bHRBdXRoQ29uZiB9IGZyb20gJy4uL2F1dGgnXG5pbXBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5cbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJ1xuXG4vLyBTZXR1cCBtZXNzYWdlUHJvdmlkZXJcblxuZXhwb3J0IGNsYXNzIG1zZ1Byb3ZpZGVyIGltcGxlbWVudHMgbmdNZXNzZW5nZXI8U3ViamVjdDxNU0c+PiB7XG4gICAgc3ViOiBTdWJqZWN0PE1TRz5cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc3ViID0gbmV3IFN1YmplY3Q8TVNHPigpO1xuICAgIH1cblxuICAgIHJhdygpe1xuICAgICAgICByZXR1cm4gdGhpcy5zdWI7XG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWU6IGF1dGhNZXNzYWdlLCB1c2VyOiBHZW9QbGF0Zm9ybVVzZXIpe1xuICAgICAgICB0aGlzLnN1Yi5uZXh0KHtuYW1lLCB1c2VyfSlcbiAgICB9XG5cbiAgICBvbihuYW1lOiBhdXRoTWVzc2FnZSwgZnVuYzogKGU6IEV2ZW50LCBkYXRhOiBHZW9QbGF0Zm9ybVVzZXIpID0+IGFueSl7XG4gICAgICAgIHRoaXMuc3ViXG4gICAgICAgICAgICAuZmlsdGVyKG1zZyA9PiBtc2cubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUobXNnID0+IGZ1bmMobmV3IEV2ZW50KG1zZy5uYW1lKSwgbXNnLnVzZXIpKVxuICAgIH1cbn1cblxuXG4vKipcbiAqIEV4cG9zZSB0aGUgY2xhc3MgdGhhdCBjYW4gYmUgbG9hZGVkIGluIEFuZ3VsYXJcbiAqXG4gKiBUT0RPOiBhbGxvdyBkaWZmZXJudCB0eXBlcyBoZXJlOlxuICogIC0gT2JzZXJ2aWJsZVxuICogIC0gUHJvbWlzZVxuICogIC0gT2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZ0dwb2F1dGhGYWN0b3J5KGNvbmZpZz86IEF1dGhDb25maWcpOiBBdXRoU2VydmljZSB7XG4gICAgcmV0dXJuIG5ldyBBdXRoU2VydmljZShPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0QXV0aENvbmYsIGNvbmZpZyksICBuZXcgbXNnUHJvdmlkZXIoKSlcbn1cblxuLy8gRXhwb3NlIGludGVybmFsIHR5cGVzXG5leHBvcnQgeyBBdXRoU2VydmljZSB9IGZyb20gJy4uL2F1dGgnXG5leHBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuLi9HZW9QbGF0Zm9ybVVzZXInXG5leHBvcnQgeyBBdXRoQ29uZmlnIH0gZnJvbSAnLi4vYXV0aFR5cGVzJyJdfQ==