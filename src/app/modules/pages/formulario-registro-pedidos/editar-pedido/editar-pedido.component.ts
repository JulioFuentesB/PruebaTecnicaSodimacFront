import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente, Pedido } from 'src/app/modules/core/interfaces/listado-pedidos.model';
import { Producto } from 'src/app/modules/core/interfaces/Productos.model';
import { FormularioRegistroService } from 'src/app/modules/core/services/formulario-registro.service';
import { PedidosService } from 'src/app/modules/core/services/pedidos.service';


@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.scss']
})
export class EditarPedidoComponent implements OnInit {
  pedidoForm: FormGroup;
  clientes: Cliente[] = [];
  productosDisponibles: Producto[] = [];
  loading = false;
  minDate!: Date;
  pedidoId!: number;
  pedidoOriginal!: Pedido;

  constructor(
    private fb: FormBuilder,
    private pedidosService: PedidosService,
    private formularioRegistroService: FormularioRegistroService,
    private snackBar: MatSnackBar,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.pedidoForm = this.createForm();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 1);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pedidoId = +params['id'];
      this.loadPedidoData();
    });

    this.loadClientes();
    this.loadProductos();
  }

  createForm(): FormGroup {
    return this.fb.group({
      clienteId: ['', Validators.required],
      fechaEntrega: ['', [Validators.required]],
      productos: this.fb.array([], Validators.minLength(1)),
      observaciones: ['']
    });
  }

  createProductoFormGroup(producto?: any): FormGroup {
    return this.fb.group({
      productoId: [producto?.idProducto || '', Validators.required],
      cantidad: [producto?.cantidad || 1, [Validators.required, Validators.min(1)]]
    });
  }

  get productosArray(): FormArray {
    return this.pedidoForm.get('productos') as FormArray;
  }

  loadPedidoData(): void {
    this.loading = true;
    this.pedidosService.obtenerPedidoPorId(this.pedidoId).subscribe({
      next: (pedido: Pedido) => {
        this.pedidoOriginal = pedido;

        // AQUÍ VA EL CÓDIGO PARA BLOQUEAR SI ESTÁ ENTREGADO
        if (this.pedidoOriginal.estado.toUpperCase() === 'ENTREGADO') {
          this.pedidoForm.disable();
          this.showError('No se puede editar un pedido ya entregado');

        }

        this.patchFormValues(pedido);
        this.loading = false;
      },
      error: () => {
        this.showError('Error al cargar el pedido');
        this.loading = false;
        this.router.navigate(['/home']);
      }
    });
  }

  patchFormValues(pedido: Pedido): void {
    // Limpiar el array de productos
    while (this.productosArray.length !== 0) {
      this.productosArray.removeAt(0);
    }

    // Establecer valores básicos
    this.pedidoForm.patchValue({
      clienteId: pedido.cliente.idCliente,
      fechaEntrega: new Date(pedido.fechaEntrega),
      observaciones: '',// pedido.cliente.observaciones
    });

    // Agregar productos al FormArray
    pedido.productos.forEach(producto => {
      this.productosArray.push(this.createProductoFormGroup(producto));
    });
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
  }

  loadProductos(): void {
    this.loading = true;
    this.formularioRegistroService.getProductos().subscribe({
      next: (productos: any) => {
        this.productosDisponibles = productos;
        this.loading = false;
      },
      error: () => {
        this.showError('Error al cargar productos');
        this.loading = false;
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

    this.pedidosService.actualizarPedido(this.pedidoId, pedidoData).subscribe({
      next: () => {
        this.showSuccess('Pedido actualizado exitosamente');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 500);
      },
      error: (error: { error: { message: any; }; }) => {
        console.error('Error updating order:', error);
        this.showError(error.error?.message || 'Error al actualizar el pedido');
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
      estado: this.pedidoOriginal.estado, // Mantener el estado original
      fechaCreacion: this.pedidoOriginal.fechaCreacion // Mantener fecha creación original
    };
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