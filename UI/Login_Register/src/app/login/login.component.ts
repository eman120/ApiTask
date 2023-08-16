import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { userName: '', password: '' };

  constructor(private apiService: ApiService,
    private toastr: ToastrService) { }

  login() {
    this.apiService.login(this.credentials).subscribe(response => {
      console.log('Login successful:', response);
      this.toastr.success('Login successful', 'Success');
    }, error => {
      console.error('Login error:', error);
      if (error.error && error.error.error) {
        this.toastr.error(error.error.error); // Display the specific error message from the server
      } else {
        this.toastr.error('An error occurred. Please try again later.');
      }
    });
  }
}
