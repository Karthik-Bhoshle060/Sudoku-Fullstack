import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIFactoryService {
  apiPath: string = 'http://localhost:3100/';
  constructor(private http: HttpClient) {}
  loginUser(payload: any): Observable<any> {
    return this.http.post(this.apiPath + 'login', payload);
  }
  registerUser(payload: any): Observable<any> {
    return this.http.post(this.apiPath + 'register', payload);
  }
  storeRecord(payload: any): Observable<any> {
    return this.http.post(this.apiPath + 'store_record', payload);
  }
  userBestScore(payload: any): Observable<any> {
    return this.http.post(this.apiPath + 'user_best_score', payload);
  }
}
