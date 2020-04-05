import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../services/authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivateChild {
  constructor(private authorizationService: AuthorizationService, private router: Router){}
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const allowedRoles = next.data.allowedRoles;
      const isAuthorized = this.authorizationService.isAuthorized(allowedRoles);
  
      if (!isAuthorized) {
        // if not authorized, show access denied message
        this.router.navigate(['/404']);
      }
  
      return isAuthorized;
  
  }
  
}
