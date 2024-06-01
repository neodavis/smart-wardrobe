import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(): boolean {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      const isTokenValid = this.authService.isTokenValid(token);

      if (isTokenValid) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
