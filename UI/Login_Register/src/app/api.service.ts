import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  register(user: any) {
    return this.http.post(environment.apiUrl + 'User Registeration', user);
  }

  login(credentials: any) {
    return this.http.post(environment.apiUrl + 'Login', credentials);
  }
}
