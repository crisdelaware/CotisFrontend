import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private authToken: string | null = null;  // Variable para almacenar el token

  constructor(private http: HttpClient) { }


  // Funcion para obtener token actual
  getToken(): string | null {
    if(!this.authToken) {
      // Intenta obtener el token desde el servicio si no esta almacenado en la variable
      this.authToken = localStorage.getItem('token');
    }
    return this.authToken;
  }

  // Funcion para agregar el token a las solicitudes HTTP
  addTokenToHeaders(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if(token) {
      return headers.set('x-auth-token', token);
    }
    return headers;
  }

  // Funcion para obtener los datos del usuario autenticado
  getUserProfile(): Observable<any> {
    // Crear encabezados que incluyan el token
    const headers = new HttpHeaders();
    const headersWithToken = this.addTokenToHeaders(headers);

    // Realizar la solicitud HTTP con los encabezados a la ruta correcta
    return this.http.get(`${this.apiUrl}/users/profile`, { headers: headersWithToken });
  }

  // Función para realizar la solicitud de inicio de sesión al servidor
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      // Manejar la respuesta del servidor para obtener el token
      tap((response: any) => {
        if (response.token) {
          this.authToken = response.token;
          // Almacenar el token en el Local Storage para persistencia
          localStorage.setItem('token', this.authToken || '');
        }
      })
    );
  }

  logout(): void {
    // Elimina el token almacenado en el Local Storage
    localStorage.removeItem('token');

    // Realiza cualquier otra limpieza necesaria, como limpiar el estado del usuario
  }


}
