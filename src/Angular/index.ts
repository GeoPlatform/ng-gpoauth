/**
 * For Angluar 2+ (TypeScript)
 */
/// <reference path="../authTypes.d.ts" />
import { AuthService, GeoPlatformUser } from '../auth'

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';

import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

// Setup httpProvider
@Injectable()
class networkProvider implements httpProvider {
    constructor(private http: HttpClient){}

    get(url){
        return this.http.get(url)
                    .toPromise()
    }
}


// Setup messageProvider
type MSG = {
    name: string
    data: null | GeoPlatformUser
}
class msgProvider implements ngMessenger {
    sub: Subject<MSG>

    constructor(){
        this.sub = new Subject<MSG>();
    }

    get(){
        return this.sub;
    }

    broadcast(name, data){
        this.sub.next({name, data})
    }

    on(name, func){
        this.sub
            .pipe(filter((msg => msg.name === name)))
            .subscribe(msg => func(new Event(msg.name), msg.data))
    }
}


/**
 * Expose the class that can be loaded in Angular
 */
export class ngAuthService {
    constructor(config: AuthConfig){
        return new AuthService(config, networkProvider, new msgProvider())
    }
}