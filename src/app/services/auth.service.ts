import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem('adminToken', res.token);
          localStorage.setItem('isAdmin', 'true');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
  }

  getToken() {
    return localStorage.getItem('adminToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
