import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, map, catchError, tap, delay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../core/interfaces/Productos.model';
import { ProductosService } from '../../core/services/ProductosService';

@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  styleUrls: ['./gestion-productos.component.scss']
})
export class GestionProductosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idProducto', 'nombre', 'sku', 'precio', 'acciones'];
  dataSource!: MatTableDataSource<Producto>;
  loading = true;
  isEditing = false;
  currentProductoId: number | null = null;
  showForm = false;
  skuChecking = false;

  productoForm: FormGroup;
  searchControl = new FormControl();
  private skuCheckSubject = new Subject<string>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private productosService: ProductosService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      sku: ['', 
        [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9\-]+$/)],
        [this.skuValidator()]
      ],
      descripcion: ['', [Validators.maxLength(250)]],
      precio: ['', [Validators.required, Validators.min(0.01)]]
    });

    this.setupSkuCheck();
  }

  ngOnInit(): void {
    this.loadProductos();
    this.setupSearch();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(filterValue => {
        this.applyFilter(filterValue);
      });
  }

  private setupSkuCheck(): void {
    this.skuCheckSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.skuChecking = true),
      switchMap(sku => this.productosService.checkSkuDisponible(sku, this.currentProductoId || 0))
    ).subscribe(disponible => {
      this.skuChecking = false;
      if (!disponible && this.sku?.value) {
        this.sku?.setErrors({ skuDuplicado: true });
      }
    });
  }

  private applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadProductos(): void {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.dataSource = new MatTableDataSource(productos);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
        this.showError('Error al cargar productos');
        this.loading = false;
      }
    });
  }

  createFilter(): (data: Producto, filter: string) => boolean {
    return (data: Producto, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return (
        data.nombre.toLowerCase().includes(searchStr) ||
        (data.sku && data.sku.toLowerCase().includes(searchStr)) ||
        (data.descripcion && data.descripcion.toLowerCase().includes(searchStr)) ||
        data.idProducto.toString().includes(searchStr) ||
        data.precio.toString().includes(searchStr)
      );
    };
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm && this.isEditing) {
      this.cancelarEdicion();
    } else if (this.showForm && this.isEditing) {
      setTimeout(() => {
        document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  onSubmit(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      this.showError('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    const productoData = this.productoForm.value;

    if (this.isEditing && this.currentProductoId !== null) {
      this.productosService.updateProducto(this.currentProductoId, productoData).subscribe({
        next: () => {
          this.showSuccess('Producto actualizado correctamente');
          this.resetAndReload();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error al actualizar producto', error);
          this.handleSkuError(error);
        }
      });
    } else {
      this.productosService.createProducto(productoData).subscribe({
        next: () => {
          this.showSuccess('Producto creado correctamente');
          this.resetAndReload();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Error al crear producto', error);
          this.handleSkuError(error);
        }
      });
    }
  }

  private handleSkuError(error: any): void {
    if (error.status === 400 && error.error.includes('SKU')) {
      this.sku?.setErrors({ notUnique: true });
      this.showError('El SKU ingresado ya existe');
    } else {
      this.showError('Ocurrió un error al procesar la solicitud');
    }
  }

  private resetAndReload(): void {
    this.resetForm();
    this.loadProductos();
  }

  editarProducto(producto: Producto): void {
    if (!this.showForm) {
      this.showForm = true;
    }
    this.isEditing = true;
    this.currentProductoId = producto.idProducto;
    this.productoForm.patchValue({
      nombre: producto.nombre,
      sku: producto.sku,
      descripcion: producto.descripcion || '',
      precio: producto.precio
    });
    setTimeout(() => {
      document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  verProducto(producto: Producto): void {
    this.editarProducto(producto);
    this.productoForm.disable();
  }

  cancelarEdicion(): void {
    this.resetForm();
    if (this.showForm && this.dataSource.data.length > 0) {
      this.showForm = false;
    }
  }

  resetForm(): void {
    this.productoForm.reset();
    this.productoForm.enable();
    this.isEditing = false;
    this.currentProductoId = null;
    this.skuChecking = false;
  }

  formatPrecio(event: any): void {
    let value = event.target.value.replace(/[^0-9.]/g, '');
    const decimalCount = value.split('.')[1]?.length || 0;
    
    if (decimalCount > 2) {
      value = value.substring(0, value.length - (decimalCount - 2));
    }
    
    this.productoForm.get('precio')?.setValue(value, { emitEvent: false });
  }

  onSkuInput(): void {
    if (this.sku?.value && this.sku.valid) {
      this.skuCheckSubject.next(this.sku.value);
    }
  }

  private skuValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (!control.value || control.value.length < 3) {
        return of(null);
      }

      if (this.isEditing && this.currentProductoId) {
        const currentProduct = this.dataSource.data.find(p => p.idProducto === this.currentProductoId);
        if (currentProduct && currentProduct.sku === control.value) {
          return of(null);
        }
      }

      return this.productosService.verificarSkuUnico(control.value, this.currentProductoId || 0).pipe(
        map(res => res.disponible ? null : { skuDuplicado: true }),
        catchError(() => of(null))
      );
    };
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  get nombre() { return this.productoForm.get('nombre'); }
  get sku() { return this.productoForm.get('sku'); }
  get descripcion() { return this.productoForm.get('descripcion'); }
  get precio() { return this.productoForm.get('precio'); }
}