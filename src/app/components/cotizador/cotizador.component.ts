import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


// Define el tipo de rendimiento por tipo de unidad
interface TipoUnidadRendimiento {
  '3.5 TON': number;
  'RABON': number;
  'CAJA 53 FT': number;
  'PLATAFORMA 48 FT': number;
}

@Component({
  selector: 'app-cotizador',
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css']
})
export class CotizadorComponent {
  cotizadorForm: FormGroup;
  rendimientoPorTipoUnidad: TipoUnidadRendimiento = {
    '3.5 TON': 4.5,
    'RABON': 4,
    'CAJA 53 FT': 3,
    'PLATAFORMA 48 FT': 3
  };

  mostrarGuardarBoton = false;


  constructor(private formBuilder: FormBuilder, ) {
    // Crear el formulario reactivo
    this.cotizadorForm = this.formBuilder.group({
      cliente: ['', Validators.required],
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      tipoUnidad: ['', Validators.required],
      kms: [null, Validators.required],
      rendimiento: [null, Validators.required],
      ltsConsumidos: [null, Validators.required],
      precioOficial: [null, Validators.required],
      costoBase: [null, Validators.required], // Establece un valor inicial en 0
      costoDiesel: [null, Validators.required], // Establece un valor inicial en 0
      costoCasetas: [null, Validators.required],
      stops: [null, Validators.required],
      tipoMovimiento: ['', Validators.required], // Establece un valor inicial
      costoPeaje: [null, Validators.required],
      correoUsuario: [''],
      subtotal: [null, Validators.required] // Establece un valor inicial en 0
    });
  }


  formatCurrency(value: number): string {
    const formatter = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
    return formatter.format(value);
  }



  // Método para calcular el rendimiento cuando cambia el tipo de unidad
  onTipoUnidadChange() {
    const tipoUnidad = this.cotizadorForm.get('tipoUnidad')?.value;
    if (tipoUnidad) {
      const rendimiento = this.rendimientoPorTipoUnidad[tipoUnidad as keyof TipoUnidadRendimiento];
      this.cotizadorForm.get('rendimiento')?.setValue(rendimiento);

      // Llama a calcularLitrosConsumidos() cuando cambia la unidad
      this.calcularLitrosConsumidos();
    }
  }

    // Método para calcular los litros consumidos
    calcularLitrosConsumidos() {
      const kms = this.cotizadorForm.get('kms')?.value;
      const rendimiento = this.cotizadorForm.get('rendimiento')?.value;
      if (kms && rendimiento) {
        this.cotizadorForm.get('ltsConsumidos')?.setValue(kms / rendimiento);
        this.calcularCostoCombustible();
      }
    }

    // Método para calcular el costo de combustible
    calcularCostoCombustible() {
      const ltsConsumidos = this.cotizadorForm.get('ltsConsumidos')?.value;
      const precioOficial = this.cotizadorForm.get('precioOficial')?.value;
    if (ltsConsumidos && precioOficial) {
      this.cotizadorForm.get('costoDiesel')?.setValue(ltsConsumidos * precioOficial);
      // Calcular el subtotal
      this.calcularSubtotal();

    }
  }

    // Método para calcular el subtotal
    calcularSubtotal() {
      const costoBase = this.cotizadorForm.get('costoBase')?.value;
      const costoCombustible = this.cotizadorForm.get('costoDiesel')?.value;
      const costoPeaje = this.cotizadorForm.get('costoPeaje')?.value;

      if (costoBase && costoCombustible) {
        // Calcula la suma del costo base y el costo de combustible
        const subtotal = costoBase + costoCombustible;
        console.log('subtotal:', subtotal);

        // Actualiza el campo "Subtotal" en el formulario
        this.cotizadorForm.get('subtotal')?.setValue(subtotal);
        // Muestra el botón "Guardar Cotización"
        this.mostrarGuardarBoton = true;
      }
    }
  }

