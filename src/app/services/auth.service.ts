import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private authToken: string | null = null;  // Variable para almacenar el token
  private isAuthenticated = false;

  constructor(private http: HttpClient) {
    this.loadTokenFromLocalStorage();
  }

  private loadTokenFromLocalStorage(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.authToken = token;
      this.isAuthenticated = true;
    }
  }

  public getToken(): string | null {
    return this.authToken;
  }

  public setToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('token', token);
    this.isAuthenticated = true;
  }

  public addTokenToHeaders(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return headers.set('x-auth-token', token);
    }
    return headers;
  }

  public getUserProfile(): Observable<any> {
    const headers = new HttpHeaders();
    const headersWithToken = this.addTokenToHeaders(headers);

    return this.http.get(`${this.apiUrl}/users/profile`, { headers: headersWithToken });
  }

  public login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response: any) => {
        if (response.token) {
          this.setToken(response.token);
        }
      })
    );
  }

  public register(username: string, email: string, fullName: string, shippingAddress: string, phoneNumber: number, password: string): Observable<any> {
    const body = { username, email, fullName, shippingAddress, phoneNumber, password };
    return this.http.post(`${this.apiUrl}/users/create`, body);
  }

  public isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.authToken = null;
    this.isAuthenticated = false;
  }
}
