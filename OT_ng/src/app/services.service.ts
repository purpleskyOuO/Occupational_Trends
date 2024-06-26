import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private httpClient: HttpClient) { }

  postBusinessName(data: any): Observable<any> {
    return this.httpClient.post<any>('http://127.0.0.1:8000/businessName/', data);
  }

  postTrendName(data: any): Observable<any> {
    return this.httpClient.post<any>('http://127.0.0.1:8000/trendName/', data);
  }

  postRaceName(data: any): Observable<any> {
    return this.httpClient.post<any>('http://127.0.0.1:8000/raceName/', data);
  }

  postRaceTrend(data: any): Observable<any> {
    return this.httpClient.post<any>('http://127.0.0.1:8000/raceTrend/', data);
  }

  postGraduateTypeName(data: any): Observable<any> {
    return this.httpClient.post<any>('http://127.0.0.1:8000/graduateTypeName/', data);
  }

  // get number of occupation
  getOccupationNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/businessNum/', { responseType: 'text' });
  }

  getEstablishNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/establishNum/', { responseType: 'text' });
  }

  getDismissNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/dismissNum/', { responseType: 'text' });
  }

  getRaceNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/raceNum/', { responseType: 'text' });
  }

  getGraduateNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/graduateNum/', { responseType: 'text' });
  }

  getBusinessCategory(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/businessCategory/', { responseType: 'text' });
  }

  getDepartments(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/departments/', { responseType: 'text' });
  }
}
