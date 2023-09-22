import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private router: Router) {}



  ngOnInit(): void {

    this.authService.getUserProfile().subscribe(
      (data) => {
        // El servicio ha devuelto los datos del usuario
        this.user = data

        console.log(data);
      }, (error) => {
        console.error(error);
      });
  }

  logout(): void {
    this.authService.logout(); // Llama a la función de logout en el servicio de autenticación
    this.router.navigate(['login']); // Redirige al usuario a la página de inicio de sesión
  }
}
