import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidosService } from '../../core/services/pedidos.service';
import { FormularioRegistroService } from '../../core/services/formulario-registro.service';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { Cliente } from '../../core/interfaces/Cliente.model';
import { Producto } from '../../core/interfaces/Productos.model';


@Component({
  selector: 'app-formulario-registro-pedidos',
  templateUrl: './formulario-registro-pedidos.component.html',
  styleUrls: ['./formulario-registro-pedidos.component.scss']
})
export class FormularioRegistroPedidosComponent implements OnInit {
  pedidoForm: FormGroup;
  clientes: Cliente[] = [];
  productosDisponibles: Producto[] = [];
  loading = false;
  minDate!: Date;
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;


  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private formularioRegistroService: FormularioRegistroService,
    private snackBar: MatSnackBar,
    private router: Router // Inyectar Router
  ) {
    this.pedidoForm = this.createForm();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1); // Fecha mínima: mañana
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProductos();
  }

  createForm(): FormGroup {
    return this.fb.group({
      clienteId: ['', Validators.required],
      fechaEntrega: ['', [Validators.required]],
      productos: this.fb.array([this.createProductoFormGroup()], Validators.minLength(1)),
      observaciones: ['']
    });
  }

  createProductoFormGroup(): FormGroup {
    return this.fb.group({
      productoId: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  get productosArray(): FormArray {
    return this.pedidoForm.get('productos') as FormArray;
  }

  loadClientes(): void {
    this.loading = true; 
    this.formularioRegistroService.getClientes().subscribe({
      next: (clientes: any) => {
        this.clientes = clientes;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showError('Error al cargar clientes');
      }
    });
    this.loading = false;
  }

  loadProductos(): void {
    this.loading = true;
    this.formularioRegistroService.getProductos().subscribe({
      next: (productos: any) => {
        this.productosDisponibles = productos;
      },
      error: () => {
        this.showError('Error al cargar productos');
      }
    });
  }

  addProducto(): void {
    this.productosArray.push(this.createProductoFormGroup());
  }

  removeProducto(index: number): void {
    if (this.productosArray.length > 1) {
      this.productosArray.removeAt(index);
    } else {
      this.showError('Debe haber al menos un producto');
    }
  }

  onSubmit(): void {
    if (this.pedidoForm.invalid) {
      this.pedidoForm.markAllAsTouched();
      this.showError('Por favor complete todos los campos requeridos');
      return;
    }

    this.loading = true;
    const pedidoData = this.preparePedidoData();

    this.pedidosService.crearPedido(pedidoData).subscribe({
      next: (response) => {
        this.showSuccess('Pedido registrado exitosamente');

        setTimeout(() => {
          this.router.navigate(['/vista-listado-pedidos']); // Cambia '/pedidos' por tu ruta real
          //  this.router.navigate(['/']); // Cambia '/pedidos' por tu ruta real
        }, 500);

      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.showError(error.error?.message || 'Error al registrar el pedido');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  preparePedidoData(): any {
    const formValue = this.pedidoForm.value;
    const clienteSeleccionado = this.clientes.find(c => c.idCliente === formValue.clienteId);

    return {
      idCliente: formValue.clienteId,
      cliente: clienteSeleccionado ? clienteSeleccionado.nombre : '',
      emailCliente: clienteSeleccionado ? clienteSeleccionado.email : '',
      direccionEntrega: clienteSeleccionado ? clienteSeleccionado.direccion : '',
      fechaEntrega: formValue.fechaEntrega,
      productos: formValue.productos.map((p: any) => {
        const producto = this.productosDisponibles.find(prod => prod.idProducto === p.productoId);
        return {
          idProducto: p.productoId,
          nombre: producto ? producto.nombre : '',
          sku: producto ? producto.sku : '',
          cantidad: p.cantidad,
          precioUnitario: producto ? producto.precio : 0
        };
      }),
      observaciones: formValue.observaciones,
      estado: 'PENDIENTE', // Estado inicial
      fechaCreacion: new Date().toISOString()
    };
  }

  resetForm(): void {
    this.pedidoForm.reset();
    this.productosArray.clear();
    this.productosArray.push(this.createProductoFormGroup());
    this.loading = false;
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  getClienteSeleccionado(): Cliente | undefined {
    const clienteId = this.pedidoForm.get('clienteId')?.value;
    return this.clientes.find(c => c.idCliente === clienteId);
  }

  getProductoNombre(productoId: number): string {
    const producto = this.productosDisponibles.find(p => p.idProducto === productoId);
    return producto ? `${producto.nombre} (${producto.sku})` : 'Producto no encontrado';
  }

  calcularTotal(): number {
    let total = 0;
    const productos = this.pedidoForm.get('productos')?.value;

    if (productos) {
      productos.forEach((item: any) => {
        const producto = this.productosDisponibles.find(p => p.idProducto === item.productoId);
        if (producto) {
          total += producto?.precio ?? 0 * item.cantidad;
        }
      });
    }

    return total;
  }

}