import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';

import { User, UserCredentials } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  private basic = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {
  }

  isTokenValid(token: string): boolean {
    try {
      const decodedToken: { id: number, sub: string, exp: number } = jwt_decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        return false;
      }

      this.user$.next({ id: decodedToken.id });
      return true;
    } catch (error) {
      return false;
    }
  }

  signIn({ username, password }: { username: string, password: string }): Observable<UserCredentials> {
    return this.http.post<UserCredentials>(this.basic + '/sign-in', {username, password});
  }

  signUp({ username, password }: { username: string, password: string }): Observable<UserCredentials> {
    return this.http.post<UserCredentials>(this.basic + '/sign-up', {username, password});
  }

  saveUserPhoto(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);

    // TODO: infer correct endpoint name
    return this.http.post('', formData)
  }
}
