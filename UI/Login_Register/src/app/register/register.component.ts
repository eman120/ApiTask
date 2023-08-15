import { Component } from '@angular/core';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { mobileNumber: '', address: '', age: 0 };

  constructor(private apiService: ApiService) { }

  register() {
    this.apiService.register(this.user).subscribe(response => {
      console.log('Registration successful:', response);
    }, error => {
      console.error('Registration error:', error);
    });
  }
}
