import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { mobileNumber: '', password: '' };

  constructor(private apiService: ApiService) { }

  login() {
    this.apiService.login(this.credentials).subscribe(response => {
      console.log('Login successful:', response);
    }, error => {
      console.error('Login error:', error);
    });
  }
}
