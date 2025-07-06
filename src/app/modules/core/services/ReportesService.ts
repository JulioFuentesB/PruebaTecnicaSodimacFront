import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ReporteEntregas } from '../interfaces/ReporteEntregas.model';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private apiUrl = environment.apiUrl + 'Reportes';
  constructor(public http: HttpClient) { }

obtenerReporteEntregas(desde: string, hasta: string): Observable<ReporteEntregas> {
    const params = new HttpParams()
      .set('desde', desde)
      .set('hasta', hasta);

    return this.http.get<ReporteEntregas>(`${this.apiUrl}/entregas`, { params });
  }

}
