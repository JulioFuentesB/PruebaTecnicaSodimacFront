import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../core/services/ReportesService';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-reporte-entregas',
  templateUrl: './reporte-entregas.component.html',
  styleUrls: ['./reporte-entregas.component.scss']
})
export class ReporteEntregasComponent implements OnInit {
  loading = false;
  reporteData: any;
  dateForm: FormGroup;
  hasError = false;
  
  // Colores para cada estado
  colorMap: { [key: string]: string } = {
    'Pendiente': '#FF9800',     // Naranja
    'Asignado': '#2196F3',      // Azul
    'EnTránsito': '#673AB7',    // Morado
    'Entregado': '#4CAF50',     // Verde
    'Cancelado': '#F44336'      // Rojo
  };

  constructor(
    private reporteService: ReportesService,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    // Configurar formato de fecha
    this.dateAdapter.setLocale('es'); // Opcional: para usar localización en español
    
    // Establecer fechas por defecto (últimos 30 días)
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    this.dateForm = this.fb.group({
      fechaInicio: [defaultStartDate, Validators.required],
      fechaFin: [new Date(), Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReporteData();
  }

  loadReporteData(): void {
    if (this.dateForm.invalid) return;

    this.loading = true;
    this.hasError = false;
    
    // Formatear fechas a DD/MM/YYYY
    const fechaInicio = this.formatDate(this.dateForm.value.fechaInicio);
    const fechaFin = this.formatDate(this.dateForm.value.fechaFin);

    this.reporteService.obtenerReporteEntregas(fechaInicio, fechaFin).subscribe({
      next: (data) => {
        this.reporteData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reporte', err);
        this.reporteData = null;
        this.loading = false;
        this.hasError = true;
      }
    });
  }

  // Función para formatear fecha a DD/MM/YYYY
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Función para obtener las claves de un objeto
  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getCantidadByEstado(estado: string): number {
    return this.reporteData?.totales[estado]?.cantidad || 0;
  }

  getTotalPedidos(): number {
    if (!this.reporteData?.totales) return 0;
    return Object.values(this.reporteData.totales)
      .reduce((total: number, item: any) => total + item.cantidad, 0);
  }

  // Método para el ancho de las barras de porcentaje
  getPercentageWidth(porcentaje: number): string {
    return `${porcentaje}%`;
  }
}