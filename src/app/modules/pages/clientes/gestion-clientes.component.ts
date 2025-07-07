import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Cliente } from '../../core/interfaces/formulario.model';
import { ClientesService } from '../../core/services/Clientes.Service';

@Component({
  selector: 'app-gestion-clientes',
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.scss']
})
export class GestionClientesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idCliente', 'nombre', 'email', 'direccion', 'telefono', 'acciones'];
  dataSource!: MatTableDataSource<Cliente>;
  loading = true;
  isEditing = false;
  currentClienteId: number | null = null;
  showForm = false;

  clienteForm: FormGroup;
  searchControl = new FormControl();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clientesService: ClientesService,
    private fb: FormBuilder
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [
        Validators.required,
        Validators.maxLength(20),
        Validators.pattern(/^[0-9+()\-\s]+$/) // Validación para formato de teléfono
      ]]
    });
  }

  ngOnInit(): void {
    this.loadClientes();
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

  private applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadClientes(): void {
    this.loading = true;
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.dataSource = new MatTableDataSource(clientes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.createFilter();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
        this.loading = false;
      }
    });
  }

  createFilter(): (data: Cliente, filter: string) => boolean {
    return (data: Cliente, filter: string): boolean => {
      const searchStr = filter.toLowerCase();
      return (
        data.nombre.toLowerCase().includes(searchStr) ||
        data.email.toLowerCase().includes(searchStr) ||
        data.direccion.toLowerCase().includes(searchStr) ||
        (data.telefono && data.telefono.toLowerCase().includes(searchStr)) ||
        data.idCliente.toString().includes(searchStr)
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
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const clienteData = this.clienteForm.value;

    if (this.isEditing && this.currentClienteId !== null) {
      this.clientesService.updateCliente(this.currentClienteId, clienteData).subscribe({
        next: () => {
          this.resetAndReload();
          this.showForm = false;
        },
        error: (error) => console.error('Error al actualizar cliente', error)
      });
    } else {
      this.clientesService.createCliente(clienteData).subscribe({
        next: () => {
          this.resetAndReload();
          this.showForm = false;
        },
        error: (error) => console.error('Error al crear cliente', error)
      });
    }
  }

  private resetAndReload(): void {
    this.resetForm();
    this.loadClientes();
  }

  editarCliente(cliente: Cliente): void {
    if (!this.showForm) {
      this.showForm = true;
    }
    this.isEditing = true;
    this.currentClienteId = cliente.idCliente;
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      email: cliente.email,
      telefono: cliente.telefono || ''
    });
    setTimeout(() => {
      document.querySelector('.form-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  verCliente(cliente: Cliente): void {
    this.editarCliente(cliente);
    this.clienteForm.disable();
  }

  cancelarEdicion(): void {
    this.resetForm();
    if (this.showForm && this.dataSource.data.length > 0) {
      this.showForm = false;
    }
  }

  resetForm(): void {
    this.clienteForm.reset();
    this.clienteForm.enable();
    this.isEditing = false;
    this.currentClienteId = null;
  }

  formatTelefono(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    
    // Aplicar formato básico (ajustar según necesidades)
    if (value.length > 3 && value.length <= 6) {
      value = value.replace(/(\d{3})(\d{1,3})/, '$1-$2');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{1,})/, '$1-$2-$3');
    }
    
    this.clienteForm.get('telefono')?.setValue(value, { emitEvent: false });
  }

  get nombre() { return this.clienteForm.get('nombre'); }
  get direccion() { return this.clienteForm.get('direccion'); }
  get email() { return this.clienteForm.get('email'); }
  get telefono() { return this.clienteForm.get('telefono'); }
}