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

  // get number of occupation
  getOccupationNum(): Observable<any> {
    return this.httpClient.get('http://127.0.0.1:8000/businessNum/', { responseType: 'text' });
  }
}