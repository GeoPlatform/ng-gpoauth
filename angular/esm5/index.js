/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AuthService, DefaultAuthConf } from './auth';
import { msgProvider } from './angular/index';
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
export { AuthService } from './auth';
export { GeoPlatformUser } from './GeoPlatformUser';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZ2VvcGxhdGZvcm0vb2F1dGgtbmcvIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxRQUFRLENBQUE7QUFFckQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlCQUFpQixDQUFBOzs7Ozs7Ozs7OztBQVU3QyxNQUFNLDJCQUEyQixNQUFtQjtJQUNoRCxPQUFPLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxNQUFNLENBQUMsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDekY7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBRXBDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1dGhTZXJ2aWNlLCBEZWZhdWx0QXV0aENvbmYgfSBmcm9tICcuL2F1dGgnXG5pbXBvcnQgeyBBdXRoQ29uZmlnIH0gZnJvbSAnLi9hdXRoVHlwZXMnXG5pbXBvcnQgeyBtc2dQcm92aWRlciB9IGZyb20gJy4vYW5ndWxhci9pbmRleCdcblxuLyoqXG4gKiBFeHBvc2UgdGhlIGNsYXNzIHRoYXQgY2FuIGJlIGxvYWRlZCBpbiBBbmd1bGFyXG4gKlxuICogVE9ETzogYWxsb3cgZGlmZmVybnQgdHlwZXMgaGVyZTpcbiAqICAtIE9ic2VydmlibGVcbiAqICAtIFByb21pc2VcbiAqICAtIE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbmdHcG9hdXRoRmFjdG9yeShjb25maWc/OiBBdXRoQ29uZmlnKTogQXV0aFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgQXV0aFNlcnZpY2UoT2JqZWN0LmFzc2lnbih7fSwgRGVmYXVsdEF1dGhDb25mLCBjb25maWcpLCAgbmV3IG1zZ1Byb3ZpZGVyKCkpXG59XG5cbi8vIEV4cG9zZSBpbnRlcm5hbCB0eXBlc1xuZXhwb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tICcuL2F1dGgnXG5leHBvcnQgeyBBdXRoQ29uZmlnIH0gZnJvbSAnLi9hdXRoVHlwZXMnXG5leHBvcnQgeyBHZW9QbGF0Zm9ybVVzZXIgfSBmcm9tICcuL0dlb1BsYXRmb3JtVXNlciciXX0=