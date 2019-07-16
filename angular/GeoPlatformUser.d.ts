import { JWT } from './authTypes';
/**
 * Convience class representing a simplified user.
 *
 * GeoPlatformUser
 */
export declare class GeoPlatformUser {
    id: string;
    username: string;
    name: string;
    email: string;
    org: string;
    roles: string;
    groups: [{
        _id: string;
        name: string;
    }];
    exp: number;
    constructor(opts: JWT);
    toJSON(): any;
    clone(): this & {};
    compare(arg: any): boolean;
    isAuthorized(role: string): boolean;
}
