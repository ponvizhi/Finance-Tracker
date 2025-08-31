import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm : FormGroup;
  submitted = false;
  errorMessage ='';

  constructor( private fb : FormBuilder ,private authService : AuthService, private router : Router){
    this.loginForm = this.fb.group({
        email : ['', [Validators.required, Validators.email]],
        password : ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.authService.login(email, password)
        .then(() => {
          console.log("Login Success");
          this.errorMessage = ''; // Clear any previous error
          localStorage.setItem('isLoggedIn', 'true')
          this.router.navigate(['/dashboard']);
        })
        .catch((error) => {
          console.error("Login Error:", error);
          this.errorMessage = "Login failed! The username or password is incorrect.";
        });
  
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  
  
  
}
