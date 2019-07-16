import { JWT } from './authTypes'

/**
 * Convience class representing a simplified user.
 *
 * GeoPlatformUser
 */
export class GeoPlatformUser  {
    id      : string
    username: string
    name    : string
    email   : string
    org     : string
    roles   : string
    groups  : [{_id: string, name: string}]
    exp     : number

    constructor(opts: JWT) {
      this.id = opts.sub
      this.username = opts.username
      this.name = opts.name
      this.email = opts.email
      this.org = opts.orgs[0] && opts.orgs[0].name
      this.groups = opts.groups
      this.roles = opts.roles
      this.exp = opts.exp
    }

    toJSON() {
      return JSON.parse(JSON.stringify(Object.assign({}, this)));
    };

    clone() {
      return Object.assign({}, this)
    };

    compare(arg: any) {
      if (arg instanceof GeoPlatformUser) {
        return this.id === arg.id;
      } else if (typeof(arg) === 'object') {
        return typeof(arg.id) !== 'undefined' &&
          arg.id === this.id;
      }
      return false;
    };

    isAuthorized(role: string) {
      return this.groups &&
              !!this.groups
                      .map(g => g.name)
                      .filter(n => n === role)
                      .length;
    };
  }