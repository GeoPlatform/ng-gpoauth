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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsiYW5ndWxhci9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsTUFBTSxTQUFTLENBQUE7QUFHdEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQTtBQUk5QixNQUFNO0lBR0Y7UUFDSSxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksT0FBTyxFQUFPLENBQUM7S0FDakM7Ozs7SUFFRCxHQUFHO1FBQ0MsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ25COzs7Ozs7SUFFRCxTQUFTLENBQUMsSUFBaUIsRUFBRSxJQUFxQjtRQUM5QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFBO0tBQzlCOzs7Ozs7SUFFRCxFQUFFLENBQUMsSUFBaUIsRUFBRSxJQUE4QztRQUNoRSxJQUFJLENBQUMsR0FBRzthQUNILE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7S0FDN0Q7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7O0FBV0QsTUFBTSwyQkFBMkIsTUFBbUI7SUFDaEQsT0FBTyxJQUFJLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLEVBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0NBQ3pGO0FBR0QsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNyQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUE7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBGb3IgQW5nbHVhciAyKyAoVHlwZVNjcmlwdClcbiAqL1xuaW1wb3J0IHsgTVNHLCBuZ01lc3NlbmdlciwgQXV0aENvbmZpZywgYXV0aE1lc3NhZ2UgfSBmcm9tICcuLi9hdXRoVHlwZXMnXG5pbXBvcnQgeyBBdXRoU2VydmljZSwgRGVmYXVsdEF1dGhDb25mIH0gZnJvbSAnLi4vYXV0aCdcbmltcG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcblxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnXG5cbi8vIFNldHVwIG1lc3NhZ2VQcm92aWRlclxuXG5leHBvcnQgY2xhc3MgbXNnUHJvdmlkZXIgaW1wbGVtZW50cyBuZ01lc3NlbmdlcjxTdWJqZWN0PE1TRz4+IHtcbiAgICBzdWI6IFN1YmplY3Q8TVNHPlxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5zdWIgPSBuZXcgU3ViamVjdDxNU0c+KCk7XG4gICAgfVxuXG4gICAgcmF3KCl7XG4gICAgICAgIHJldHVybiB0aGlzLnN1YjtcbiAgICB9XG5cbiAgICBicm9hZGNhc3QobmFtZTogYXV0aE1lc3NhZ2UsIHVzZXI6IEdlb1BsYXRmb3JtVXNlcil7XG4gICAgICAgIHRoaXMuc3ViLm5leHQoe25hbWUsIHVzZXJ9KVxuICAgIH1cblxuICAgIG9uKG5hbWU6IGF1dGhNZXNzYWdlLCBmdW5jOiAoZTogRXZlbnQsIGRhdGE6IEdlb1BsYXRmb3JtVXNlcikgPT4gYW55KXtcbiAgICAgICAgdGhpcy5zdWJcbiAgICAgICAgICAgIC5maWx0ZXIobXNnID0+IG1zZy5uYW1lID09PSBuYW1lKVxuICAgICAgICAgICAgLnN1YnNjcmliZShtc2cgPT4gZnVuYyhuZXcgRXZlbnQobXNnLm5hbWUpLCBtc2cudXNlcikpXG4gICAgfVxufVxuXG5cbi8qKlxuICogRXhwb3NlIHRoZSBjbGFzcyB0aGF0IGNhbiBiZSBsb2FkZWQgaW4gQW5ndWxhclxuICpcbiAqIFRPRE86IGFsbG93IGRpZmZlcm50IHR5cGVzIGhlcmU6XG4gKiAgLSBPYnNlcnZpYmxlXG4gKiAgLSBQcm9taXNlXG4gKiAgLSBPYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5nR3BvYXV0aEZhY3RvcnkoY29uZmlnPzogQXV0aENvbmZpZyk6IEF1dGhTZXJ2aWNlIHtcbiAgICByZXR1cm4gbmV3IEF1dGhTZXJ2aWNlKE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRBdXRoQ29uZiwgY29uZmlnKSwgIG5ldyBtc2dQcm92aWRlcigpKVxufVxuXG4vLyBFeHBvc2UgaW50ZXJuYWwgdHlwZXNcbmV4cG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCdcbmV4cG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcbmV4cG9ydCB7IFRva2VuSW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9yJyJdfQ==