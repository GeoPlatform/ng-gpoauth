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
export { TokenInterceptor } from './angular/interceptor';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBRXJELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQTs7Ozs7Ozs7Ozs7QUFVN0MsTUFBTSwyQkFBMkIsTUFBbUI7SUFDaEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLEVBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3pGO0FBR0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFFBQVEsQ0FBQTtBQUNwQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUE7QUFDbkQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sdUJBQXVCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnLi9hdXRoJ1xuaW1wb3J0IHsgQXV0aENvbmZpZyB9IGZyb20gJy4vYXV0aFR5cGVzJ1xuaW1wb3J0IHsgbXNnUHJvdmlkZXIgfSBmcm9tICcuL2FuZ3VsYXIvaW5kZXgnXG5cbi8qKlxuICogRXhwb3NlIHRoZSBjbGFzcyB0aGF0IGNhbiBiZSBsb2FkZWQgaW4gQW5ndWxhclxuICpcbiAqIFRPRE86IGFsbG93IGRpZmZlcm50IHR5cGVzIGhlcmU6XG4gKiAgLSBPYnNlcnZpYmxlXG4gKiAgLSBQcm9taXNlXG4gKiAgLSBPYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5nR3BvYXV0aEZhY3RvcnkoY29uZmlnPzogQXV0aENvbmZpZyk6IEF1dGhTZXJ2aWNlIHtcbiAgICByZXR1cm4gbmV3IEF1dGhTZXJ2aWNlKE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRBdXRoQ29uZiwgY29uZmlnKSwgIG5ldyBtc2dQcm92aWRlcigpKVxufVxuXG4vLyBFeHBvc2UgaW50ZXJuYWwgdHlwZXNcbmV4cG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi9hdXRoJ1xuZXhwb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi9HZW9QbGF0Zm9ybVVzZXInXG5leHBvcnQgeyBUb2tlbkludGVyY2VwdG9yIH0gZnJvbSAnLi9hbmd1bGFyL2ludGVyY2VwdG9yJyJdfQ==