/**
 * For Angluar 2+ (TypeScript)
 */
import { MSG, AuthConfig, authMessage, Messenger } from '../authTypes';
import { AuthService } from '../auth';
import { GeoPlatformUser } from '../GeoPlatformUser';
import { Subject } from 'rxjs';
export declare class msgProvider implements Messenger<Subject<MSG>> {
    sub: Subject<MSG>;
    constructor();
    raw(): Subject<MSG>;
    broadcast(name: authMessage, user: GeoPlatformUser): void;
    on(name: authMessage, func: (e: Event, data: GeoPlatformUser) => any): void;
}
/**
 * Expose the class that can be loaded in Angular
 *
 * TODO: allow differnt types here:
 *  - Observible
 *  - Promise
 *  - Object
 */
export declare function ngGpoauthFactory(config?: AuthConfig): AuthService;
export { AuthService } from '../auth';
export { TokenInterceptor } from './interceptor';
export { GeoPlatformUser } from '../GeoPlatformUser';
export { AuthConfig } from '../authTypes';
