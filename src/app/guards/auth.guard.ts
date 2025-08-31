import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isLoggedIn = !!localStorage.getItem('isLoggedIn');

    const blockIfLoggedIn = route.data['blockIfLoggedIn'] === true;

    if (isLoggedIn && blockIfLoggedIn) {
      this.router.navigate(['/dashboard']);
      return false;
    }

    // ✅ If route is protected & user is NOT logged in → redirect to login
    if (!isLoggedIn && !blockIfLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
