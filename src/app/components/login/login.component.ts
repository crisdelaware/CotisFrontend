import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup
  errorMessage: string | null = null;


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        const response = await this.authService.login(email, password).toPromise();
        console.log(response);
        this.router.navigate(['/profile']);
      } catch (error) {

        // Depuracion ver objeto de error
        console.log(error);

        // Afirmación de tipo para 'error' (asegúrate de que coincida con la estructura esperada)
        const errorWithMessage = error as { error: { message: string } } | undefined;

        if (errorWithMessage && errorWithMessage.error && errorWithMessage.error.message) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: this.errorMessage = errorWithMessage.error.message
          });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: this.errorMessage = 'Error desconocido del servidor'
            });
        }
      }
    }
  }
}

