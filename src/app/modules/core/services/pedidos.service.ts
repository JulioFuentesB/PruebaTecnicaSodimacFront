import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private apiUrl = environment.apiUrl + 'pedidos';
  constructor(public http: HttpClient) { }

  getPedidosPaginados(page: number, pageSize: number, searchTerm: string, estado: string) {
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      searchTerm,
      estado
    };

    return this.http.get<any>(`${this.apiUrl}`, { params });
  }

  //crear pedido
  crearPedido(pedido: any) {
    return this.http.post<any>(`${this.apiUrl}`, pedido);
  }

  //editar pedido
  editarPedido(id: number, pedido: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pedido);
  }

  obtenerPedidoPorId(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  actualizarPedido(id: number, pedidoData: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, pedidoData);
  }
  getPedidosPendientes() {
    return this.http.get(`${this.apiUrl}/pendientes`);
  }

  asignarRutas(pedidosIds: number[]) {
    return this.http.post(`${this.apiUrl}/asignar-rutas`, pedidosIds);
  }

}
