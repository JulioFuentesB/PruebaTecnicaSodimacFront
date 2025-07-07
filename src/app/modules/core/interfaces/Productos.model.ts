export interface Producto {
  idProducto: number;
  nombre: string;
  sku: string;
  descripcion?: string;
  precio: number;
}

export interface SkuDisponibleResponse {
  disponible: boolean;
  sku?: string;
  mensaje?: string;
}