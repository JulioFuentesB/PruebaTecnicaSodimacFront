import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularioRegistroService {

  constructor(private http: HttpClient) { }

  getClientes() {
    return this.http.get<any>(`${environment.apiUrl}clientes`);
  }

  getProductos() {
    return this.http.get<any>(`${environment.apiUrl}productos`);
  }

  crearPedido(pedido: any) {
    return this.http.post<any>(`${environment.apiUrl}pedidos`, pedido);
  }
}
