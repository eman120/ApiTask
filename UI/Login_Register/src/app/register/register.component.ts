// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from '../api.service';

// @Component({
//   selector: 'app-register', // Add the selector for the component
//   templateUrl: './register.component.html', // Specify the template URL
//   styleUrls: ['./register.component.css'] // Specify the styles URL
// })
// export class RegisterComponent implements OnInit {
//   registrationForm!: FormGroup;

//   constructor(private fb: FormBuilder, private userService: ApiService) {}

//   ngOnInit(): void {
//     this.registrationForm = this.fb.group({
//       UserName: ['', Validators.required],
//       Email: ['', [Validators.required, Validators.email]],
//       Password: ['', [Validators.required, Validators.minLength(6)]],
//       MobileNumber: ['', Validators.required],
//       Address: ['', Validators.required],
//       Age: ['', Validators.required]
//     });
//   }

//   onSubmit(): void {
//     if (this.registrationForm.valid) {
//       const registerDto = this.registrationForm.value;
//       this.userService.registerUser(registerDto).subscribe(
//         (response: any) => {
//           // Handle the binary response (image) directly
//           const blob = new Blob([response], { type: 'image/png' });
//           const imageUrl = URL.createObjectURL(blob);

//           // Display the image in an <img> element
//           const imgElement = document.createElement('img');
//           imgElement.src = imageUrl;
//           document.body.appendChild(imgElement);
//         },
//         (error) => {
//           console.error('Error:', error);
//           // Handle the error, e.g., show an error message
//         }
//       );
//     }
//   }
// }


// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ApiService } from '../api.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-register',
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class RegisterComponent implements OnInit {
//   registrationForm!: FormGroup;
//   qrcodeImage: string | undefined;

//   constructor(private fb: FormBuilder, private userService: ApiService,
//     private toastr: ToastrService
//     ) {}

//   ngOnInit(): void {
//     this.registrationForm = this.fb.group({
//       UserName: ['', Validators.required],
//       Email: ['', [Validators.required, Validators.email]],
//       Password: ['', [Validators.required, Validators.minLength(6)]],
//       MobileNumber: ['', Validators.required],
//       Address: ['', Validators.required],
//       Age: ['', Validators.required]
//     });
//   }

//   onSubmit(): void {
//     if (this.registrationForm.valid) {
//       const registerDto = this.registrationForm.value;
//       this.userService.registerUser(registerDto).subscribe(
//         (response: any) => {
//           // Handle the binary response (image) directly
//           const blob = new Blob([response], { type: 'image/png' });
//           this.qrcodeImage = URL.createObjectURL(blob);
//         },
//         (error) => {
//           console.error('Error:', error);
//           // Display error as a toast notification
//           // this.toastr.error('An error occurred. Please try again later.');
//           this.toastr.error(error.error);
//           // Handle the error, e.g., show an error message
//         }
//       );
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm!: FormGroup;
  qrcodeImage: SafeUrl | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: ApiService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      MobileNumber: ['', Validators.required],
      Address: ['', Validators.required],
      Age: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const registerDto = this.registrationForm.value;
      this.userService.registerUser(registerDto).subscribe(
        (response: any) => {
          // Create an <img> element and set the source
          const imgElement = document.createElement('img');
          imgElement.src = URL.createObjectURL(response);

          // Append the image to a container in the HTML
          const imgContainer = document.getElementById('imgContainer');
          if (imgContainer) {
            imgContainer.innerHTML = '';
            imgContainer.appendChild(imgElement);
          }

          // Display success message using Toastr
          this.toastr.success('Registration successful', 'Success');
        },
        (error) => {
          console.error('Error:', error);

          // Display error message using Toastr
          // this.toastr.error('Registration failed', 'Error');

          // Display error message using Toastr
          if (error.error && error.error.error) {
            this.toastr.error(error.error.error); // Display the specific error message from the server
          } else {
            this.toastr.error('An error occurred. Please try again later.');
          }
        }
      );
    }
  }
}

