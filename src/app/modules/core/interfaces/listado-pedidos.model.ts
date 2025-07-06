export interface Cliente {
  idCliente: number;
  nombre: string;
  email: string;
  direccion: string;
}

export interface ProductoPedido {
  idProducto: number;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Ruta {
  idRuta: number;
  estado: 'EnTránsito' | 'Reportado' | 'Novedad' | 'Entregado';
  fechaAsignacion: string;
  fechaEstimadaEntrega: string | null;
}

export interface Pedido {
  idPedido: number;
  cliente: Cliente;
  fechaCreacion: string;
  fechaEntrega: string;
  estado: 'Pendiente' | 'Asignado' | 'EnTránsito' | 'Entregado' | 'Cancelado';
  productos: ProductoPedido[];
  rutas: Ruta[];
}