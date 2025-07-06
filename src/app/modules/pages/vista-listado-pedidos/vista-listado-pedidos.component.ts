import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PedidosService } from '../../core/services/pedidos.service';
import { Pedido } from '../../core/interfaces/listado-pedidos.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-listado-pedidos',
  templateUrl: './vista-listado-pedidos.component.html',
  styleUrls: ['./vista-listado-pedidos.component.scss']
})
export class VistaListadoPedidosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['idPedido', 'cliente', 'productos', 'fechaEntrega', 'estado', 'rutas', 'acciones'];
  estadosDisponibles = ['Pendiente', 'Asignado', 'EnTránsito', 'Entregado', 'Cancelado'];
  dataSource!: MatTableDataSource<Pedido>;
  loading = true;

  searchControl = new FormControl();
  estadoFilter = new FormControl('todos');

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private pedidoService: PedidosService,
    private dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.loadPedidos();
    this.setupFilters();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  private setupFilters(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(filterValue => {
        this.applyFilter();
      });

    this.estadoFilter.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  private applyFilter(): void {
    const filterValue = this.searchControl.value?.toLowerCase() || '';
    const estadoValue = this.estadoFilter.value;
    
    this.dataSource.filterPredicate = (data: Pedido, filter: string) => {
      const matchesSearch = 
        data.idPedido.toString().includes(filterValue) ||
        data.cliente.nombre.toLowerCase().includes(filterValue) ||
        data.cliente.email.toLowerCase().includes(filterValue) ||
        data.cliente.direccion.toLowerCase().includes(filterValue) ||
        data.productos.some(p => p.nombre.toLowerCase().includes(filterValue));
      
      const matchesEstado = estadoValue === 'todos' || 
                          data.estado.toLowerCase() === estadoValue!.toLowerCase();
      
      return matchesSearch && matchesEstado;
    };
    
    this.dataSource.filter = 'trigger filter';
  }

  loadPedidos(): void {
    this.loading = true;       
 
       this.pedidoService.getPedidosPaginados(1, 1000, '', '').subscribe({
      next: (response: Pedido[]) => {
        const sortedData = response.sort((a, b) => b.idPedido - a.idPedido);
        this.dataSource = new MatTableDataSource(sortedData);
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar los pedidos', error);
        this.loading = false;
      }
    });
    
  } 

  getEstadoColor(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'Pendiente'.toLocaleUpperCase(): return 'estado-pendiente';
      case 'Asignado'.toLocaleUpperCase(): return 'estado-asignado';
      case 'EnTránsito'.toLocaleUpperCase(): return 'estado-transito';
      case 'Entregado'.toLocaleUpperCase(): return 'estado-entregado';
      case 'Cancelado'.toLocaleUpperCase(): return 'estado-cancelado';
      default: return '';
    }
  }

  getRutaColor(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'EnTránsito'.toUpperCase(): return 'ruta-transito';
      case 'Reportado'.toUpperCase(): return 'ruta-reportado';
      case 'Novedad'.toUpperCase(): return 'ruta-novedad';
      case 'Entregado'.toUpperCase(): return 'ruta-entregado';
      default: return '';
    }
  }

  calcularTotal(pedido: Pedido): number {
    return pedido.productos.reduce((total, producto) =>
      total + (producto.precio * producto.cantidad), 0);
  }

  editarPedido(id: number): void {
    this.router.navigate(['/editar-pedido', id]);
  }

  formatFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}