import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.redirectToLogin();
    } else {
      this.loadUserProfile();
    }
  }

  private redirectToLogin(): void {
    this.router.navigate(['login']);
  }

  private loadUserProfile(): void {
    this.authService.getUserProfile().subscribe(
      (data) => {
        this.user = data;
        console.log('User data:', data);
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  logout(): void {
    this.showLogoutConfirmation().then((result) => {
      if (result.isConfirmed) {
        this.performLogout();
      }
    });
  }

  private showLogoutConfirmation(): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: 'Deseas cerrar sesión?',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });
  }

  private performLogout(): void {
    Swal.fire('Hasta pronto!', '', 'success');
    this.authService.logout();
    this.redirectToLogin();
  }
}
