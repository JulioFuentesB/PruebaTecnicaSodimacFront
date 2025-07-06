export interface ReporteEntregas {
  periodo: string;
  totales: EstadoTotales;
}

export interface EstadoTotales {
  Asignado: EstadoDetalle;
  Cancelado: EstadoDetalle;
  EnTránsito: EstadoDetalle;
  Entregado: EstadoDetalle;
  Pendiente: EstadoDetalle;
}

export interface EstadoDetalle {
  cantidad: number;
  porcentaje: number;
}
