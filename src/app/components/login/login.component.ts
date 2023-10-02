import { Component } from '@angular/core';
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
  loginForm: FormGroup;
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
        this.handleLoginSuccess(response);
      } catch (error) {
        this.handleLoginError(error);
      }
    }
  }

  private handleLoginSuccess(response: any): void {
    console.log(response);
    this.router.navigate(['/profile']);
  }

  private handleLoginError(error: any): void {
    // Depuración para ver el objeto de error
    console.log(error);

    const errorWithMessage = error as { error: { message: string } } | undefined;

    if (errorWithMessage && errorWithMessage.error && errorWithMessage.error.message) {
      this.showErrorPopup(errorWithMessage.error.message);
    } else {
      this.showErrorPopup('Error desconocido del servidor');
    }
  }

  private showErrorPopup(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: this.errorMessage = message
    });
  }
}


