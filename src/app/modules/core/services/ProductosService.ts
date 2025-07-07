import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Producto, SkuDisponibleResponse } from '../interfaces/Productos.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUrl = `${environment.apiUrl}Productos`;

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  createProducto(producto: Omit<Producto, 'idProducto'>): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  verificarSkuUnico(sku: string, idProducto: number = 0): Observable<SkuDisponibleResponse> {
    return this.http.get<SkuDisponibleResponse>(
      `${this.apiUrl}/verificar-sku?sku=${encodeURIComponent(sku)}&idProducto=${idProducto}`
    ).pipe(
      catchError(() => of({ disponible: false, mensaje: 'Error al verificar SKU' }))
    );
  }

  // Método para validación reactiva
  checkSkuDisponible(sku: string, idProducto: number = 0): Observable<boolean> {
    if (!sku || sku.length < 3) {
      return of(true);
    }
    
    return this.verificarSkuUnico(sku, idProducto).pipe(
      map(response => response.disponible),
      catchError(() => of(true)) // En caso de error, permitir continuar
    );
  }
}