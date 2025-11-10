import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root', 
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // When running server-side (SSR) there is no `window`/`localStorage`.
    // Allow activation during SSR to avoid crashes; client navigation will enforce auth.
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return true;
    }

    const isLoggedIn = !!localStorage.getItem('user');
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
