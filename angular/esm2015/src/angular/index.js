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
    return new AuthService(config || DefaultAuthConf, new msgProvider());
}
export { AuthService } from '../auth';
export { GeoPlatformUser } from '../GeoPlatformUser';
export { TokenInterceptor } from './interceptor';

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1ncG9hdXRoLyIsInNvdXJjZXMiOlsic3JjL2FuZ3VsYXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBR3RELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUE7QUFJOUIsTUFBTTtJQUdGO1FBQ0ksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO0tBQ2pDOzs7O0lBRUQsR0FBRztRQUNDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNuQjs7Ozs7O0lBRUQsU0FBUyxDQUFDLElBQWlCLEVBQUUsSUFBcUI7UUFDOUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQTtLQUM5Qjs7Ozs7O0lBRUQsRUFBRSxDQUFDLElBQWlCLEVBQUUsSUFBOEM7UUFDaEUsSUFBSSxDQUFDLEdBQUc7YUFDSCxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQzthQUNoQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0tBQzdEO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQVdELE1BQU0sMkJBQTJCLE1BQW1CO0lBQ2hELE9BQU8sSUFBSSxXQUFXLENBQUMsTUFBTSxJQUFJLGVBQWUsRUFBRyxJQUFJLFdBQVcsRUFBRSxDQUFDLENBQUE7Q0FDeEU7QUFHRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUyxDQUFBO0FBQ3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQTtBQUNwRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxlQUFlLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEZvciBBbmdsdWFyIDIrIChUeXBlU2NyaXB0KVxuICovXG5pbXBvcnQgeyBNU0csIG5nTWVzc2VuZ2VyLCBBdXRoQ29uZmlnLCBhdXRoTWVzc2FnZSB9IGZyb20gJy4uL2F1dGhUeXBlcydcbmltcG9ydCB7IEF1dGhTZXJ2aWNlLCBEZWZhdWx0QXV0aENvbmYgfSBmcm9tICcuLi9hdXRoJ1xuaW1wb3J0IHsgR2VvUGxhdGZvcm1Vc2VyIH0gZnJvbSAnLi4vR2VvUGxhdGZvcm1Vc2VyJ1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcydcblxuLy8gU2V0dXAgbWVzc2FnZVByb3ZpZGVyXG5cbmV4cG9ydCBjbGFzcyBtc2dQcm92aWRlciBpbXBsZW1lbnRzIG5nTWVzc2VuZ2VyPFN1YmplY3Q8TVNHPj4ge1xuICAgIHN1YjogU3ViamVjdDxNU0c+XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnN1YiA9IG5ldyBTdWJqZWN0PE1TRz4oKTtcbiAgICB9XG5cbiAgICByYXcoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViO1xuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lOiBhdXRoTWVzc2FnZSwgdXNlcjogR2VvUGxhdGZvcm1Vc2VyKXtcbiAgICAgICAgdGhpcy5zdWIubmV4dCh7bmFtZSwgdXNlcn0pXG4gICAgfVxuXG4gICAgb24obmFtZTogYXV0aE1lc3NhZ2UsIGZ1bmM6IChlOiBFdmVudCwgZGF0YTogR2VvUGxhdGZvcm1Vc2VyKSA9PiBhbnkpe1xuICAgICAgICB0aGlzLnN1YlxuICAgICAgICAgICAgLmZpbHRlcihtc2cgPT4gbXNnLm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgICAuc3Vic2NyaWJlKG1zZyA9PiBmdW5jKG5ldyBFdmVudChtc2cubmFtZSksIG1zZy51c2VyKSlcbiAgICB9XG59XG5cblxuLyoqXG4gKiBFeHBvc2UgdGhlIGNsYXNzIHRoYXQgY2FuIGJlIGxvYWRlZCBpbiBBbmd1bGFyXG4gKlxuICogVE9ETzogYWxsb3cgZGlmZmVybnQgdHlwZXMgaGVyZTpcbiAqICAtIE9ic2VydmlibGVcbiAqICAtIFByb21pc2VcbiAqICAtIE9iamVjdFxuICovXG5leHBvcnQgZnVuY3Rpb24gbmdHcG9hdXRoRmFjdG9yeShjb25maWc/OiBBdXRoQ29uZmlnKTogQXV0aFNlcnZpY2Uge1xuICAgIHJldHVybiBuZXcgQXV0aFNlcnZpY2UoY29uZmlnIHx8IERlZmF1bHRBdXRoQ29uZiwgIG5ldyBtc2dQcm92aWRlcigpKVxufVxuXG4vLyBFeHBvc2UgaW50ZXJuYWwgdHlwZXNcbmV4cG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnLi4vYXV0aCdcbmV4cG9ydCB7IEdlb1BsYXRmb3JtVXNlciB9IGZyb20gJy4uL0dlb1BsYXRmb3JtVXNlcidcbmV4cG9ydCB7IFRva2VuSW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9yJyJdfQ==