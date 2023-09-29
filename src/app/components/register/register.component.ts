import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email]],
      fullName: ['', [Validators.required, Validators.minLength(10)]],
      shippingAddress: ['', [Validators.required, Validators.minLength(10)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { username, email, fullName, shippingAddress, phoneNumber, password } = this.registerForm.value;
        const response = await this.authService.register(username, email, fullName, shippingAddress, phoneNumber, password).toPromise();
         // Muestra una alerta de éxito
        Swal.fire('Éxito', 'Usuario registrado correctamente', 'success');
        console.log(response);
        this.router.navigate(['/login']);
      } catch (error) {
        // Depuración: muestra el objeto de error completo
        console.log(error);

        if (error instanceof HttpErrorResponse) {
          // Si es un error HTTP, verifica si contiene el mensaje de error
          Swal.fire('Error', error.error.error || 'Error desconocido del servidor', 'error');
        } else {
          Swal.fire('Error', 'Error desconocido del servidor', 'error');
        }

        this.registerForm.reset();
      }
    }
  }
}
