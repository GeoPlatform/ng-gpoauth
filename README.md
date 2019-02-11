# ng-gpoauth

## Overview
`ng-gpoauth` is a client side (brower hosted) framework agnostic (to some degree) implementation for client
side code that works together with [node-gpoauth](https://github.com/GeoPlatform/node-gpoauth) server side Oauth2 integration. `ng-gpoauth` does the following things in the broswer:

- Checks for and Validates Oauth2 tokens sent from server.
- Stores up-to-date access tokens in the browser
- Facilitates initiating auth actions in browser (initiate login, initiate logout)
- Emits messages for auth related events (login, logout, etc.)

There are two major types of authentication:

#### Token (implicit)
Token or implicit type authentication does not require or use a back end service for authentication. The entire authentication process will be handled between the Oauth provider and front end application hosting `ng-gpoauth`.

#### Grant
Grant type authentication require a back end service (like node-gpoauth) to handle receiving JWT and related tokens from the OAuth provider.


> **NOTE**:
> For security reasons the JWT stored in local storage is scrambled. Passing the encoded value in the Authorization header will not validate server side.

<!-- FUTURE: add back in at some point -->
<!-- ### IFRAME Authentication
Apps have the ability to allow for authentication via iframe and keep the user from having to redirect to the Oauth page for authentication. In the event that an app allows for iframe authentication it will need to implement handlers for login events. These events are fired from $rootScope for the application. -->

---

## Installation:
> npm install http://github.com/GeoPlatform/ng-gpoauth.git

---

## Usage

See the [Configuration](https://github.com/GeoPlatform/ng-gpoauth#configuration) section for options.


### Angular (Angular 2+)
`ng-gpoauth` exposes a service that can be utilized thought out Angular 2+ application.


You will first need to register a provider for using `AuthService` with Dependency Injection.
> **NOTE:**
> The import is `ng-gpoauth/angular` for Angular 2+

```javascript
// app.module.ts

import { ngGpoauthFactory, AuthService } from 'ng-gpoauth/angular';
import { TokenInterceptor } from 'ng-gpoauth/angular'

import { authConfig } from './myConfig';

// Pass settings in : get Auth Service back
const authService = ngGpoauthFactory(authConfig);

// ...

@NgModule({
  declarations: [...],
  imports: [...],
  providers: [
      // Use the service we created `authService` as `AuthService` when injecting
      {
        provide: AuthService,
        useValue: authService
      },
      // Setup handler for sending and receiving tokens from backend service
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }
      ...
  ],
  bootstrap: [AppComponent]
})
```

Using in a component:
```javascript
// app.component.ts

import { AuthService, GeoPlatformUser } from 'ng-gpoauth/angular'

@Component({...})
export class AppComponent {

    constructor(private authService : AuthService) {
        authService.getUser().then( user => {
            // I have the user!
        })
    }
}
```
> Developer Notes:
>
> `ng serve` will force reloads when SSO is enabled. When running locally with
> ng serve make sure to set `ALLOW_SSO_LOGIN` to `false`.


### AngularJS (Angular 1)

> Comming soon!

---

## Messages
All versions of `ng-gpoauth` have messages associated with authentication events. Each implementation provides its on messaging system for subscribing to these events. This is an example of how the Event Messenger can be obtained and used:

```javascript
const authMsg = authService.getMessenger()

authMsg.on('userAuthenticated', (evt, user) => {
    // TODO: react to user authenticated even here
})

authMsg.on('userSignOut', (evt) => {
    // TODO: react to user sign out event here
})

```

The Angular (2+) can use the `raw()` method to obtain the raw `rxjs` Subscription related to auth events:
```javascript
import { Subject } from 'rxjs'

// AuthService init code ...

const sub = authService
            .getMessenger()
            .raw()

// Subscribe to all messages
sub.subscribe(msg => {
    switch(msg.name){
        case 'userAuthenticated':
            // do something..
            let user = msg.user;
            break;
        case 'userSignOut':
            // do something else
            break;
    }
})

// --- or ---

// Break out specific message
const authenticated = sub.pipe(filter(msg => msg.name === 'userAuthenticated'))

authenticated.subscribe(msg => {
    let user = msg.user;
})
```

### **Authentication Events:**

| name | description | args |
|---|---|---|
| auth:requireLogin | This event is used internally by `ng-gpoauth`. It will trigger the login event (either iframe login or redirect based on confuguration).| **event**: the event|
| userAuthenticated | Is called when a user has authenticated and the iframe authentication window is closed, or user has signed out. In the later case null will be passed for the user argument. | **event**: the event **user**: User object (or null) |
| userSignOut | Is called when user is signed out. This can happen when the user triggers the logout action, or when an expired JWT is detected that is not able to be refreshed. | **event**: the event |
| auth:iframeLoginShow | This event will be called when the login iframe is triggered. Use this event to inform your appliction that the login iframe is present. | **event**: the event |
| auth:iframeLoginHide | This event is called when the loggin iframe is hidden. Use this event to inform your appliction that the login iframe has been hidden (NOTE: this will always fire when the login iframe is removed but the 'userAuthenticated' event will only fire is the user successfully logs in. If this event fires and the 'userAuthenticated' event does not it means the user canceled the login challenge). | **event**: the event |


<!-- Angular JS example (old) -->
<!-- **Example:**
```javascript
    angular.module('myModule', [])

    .run(function ($rootScope) {
        $rootScope.$on('userAuthenticated', (event, user) => {
          $rootScope.user = user
          // - or -
          window.location.reload();
        })
    });
``` -->

---

## Configuration
The following are property that sould be found at the top level of the GeoPlatorm namespace:

| property | required | description | type | default
|---|---|---|---|---|
| IDP_BASE_URL | yes | URL of the Oauth serice. | string | N/A |
| APP_BASE_URL | no | Allows for settings a URL prefix checking `node-gpoauth` endpoints like `/checktoken`. Can be either an absolute or relative path to prefix to reqeusts: Example: '/authendpoints' | string | "" |
| AUTH_TYPE | no | Type of token to request from gpoauth.  | token, grant | grant |
| ALLOW_SSO_LOGIN | no | If enabled `ng-gpoauth` will create an invisible background iframe for logging in. | boolean | true |
| ALLOW_IFRAME_LOGIN | no | Allow `ng-gpoauth` to use an ifame instead of redirect for authenticating a user. This will allow users to retain their in-memory edits while authenticating. | boolean | false |
| FORCE_LOGIN | no | Should user be forced to redirct or show login screen when its detected that they are unauthenticated | boolean | false |
| APP_ID | yes* | Id (client_id) of appliction registerd with the Oauth service provider. | string | N/A |
| CALLBACK | no | URL to call back when re-directed from oauth authentication loop. | string | /login |
| LOGIN_URL | no | URL to redirect browser to when auth type is 'token'. | string | /login |
| LOGOUT_URL | no | Url to redirec user to when they preform the logout action. | string | |

\* only required configuration when authorization is type 'token'.
