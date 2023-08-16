import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // register(user: any) {
  //   return this.http.post(environment.apiUrl + 'User Registeration', user);
  // }

  registerUser(registerDto: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(environment.apiUrl + 'Registeration', registerDto, { headers });
  }
  
  login(credentials: any) {
    return this.http.post(environment.apiUrl + 'Login', credentials);
  }
}
