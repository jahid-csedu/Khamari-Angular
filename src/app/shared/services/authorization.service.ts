import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor() { }

  isAuthorized(allowedRoles: string[]): boolean {
    // check if the list of allowed roles is empty, if empty, authorize the user to access the page
    if (allowedRoles == null || allowedRoles.length === 0) {
      return true;
    }
  
  // check if the user roles is in the list of allowed roles, return true if allowed and false if not allowed
    return allowedRoles.includes(sessionStorage.getItem('loggedInUserRole'));
  }

}
