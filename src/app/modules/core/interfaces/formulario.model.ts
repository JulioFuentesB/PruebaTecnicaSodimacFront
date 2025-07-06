export interface Cliente {
  idCliente: number;
  nombre: string;
  email: string;
  direccion?: string;
  telefono?: string;
}

export interface Producto {
  idProducto?: number;
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  categoria?: string;
  sku?: string;
}