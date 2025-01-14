import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root', // Makes the guard available across the app
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('user'); // Check if user is logged in
    if (!isLoggedIn) {
      this.router.navigate(['/login']); // Redirect to login if not logged in
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  }
}
