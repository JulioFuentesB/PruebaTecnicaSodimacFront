import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/formulario.model';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {
    
  private apiUrl = `${environment.apiUrl}Clientes`;

  constructor(private http: HttpClient) { }

 getClientes() {
    return this.http.get<any>(`${environment.apiUrl}clientes`);
  }

  // getClientes(): Observable<Cliente[]> {
  //   return this.http.get<Cliente[]>(this.apiUrl);
  // }

  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  createCliente(cliente: Omit<Cliente, 'idCliente'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  updateCliente(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }
}