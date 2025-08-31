import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router : Router) {
    // ✅ Initialize the form with validation
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter for easy access to form controls in template
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  onSignup() {
    this.submitted = true
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signUp(email, password)
        .then(() => {
          console.log("Signup successful!");
          this.errorMessage = ''; // Clear any previous error
          this.router.navigate(['/dashboard']);
        })
        .catch(error => {
          console.error("Signup failed:", error);
          this.errorMessage = "SignUp failed! The username or password is incorrect.";
        });
    } else {
      this.signupForm.markAllAsTouched(); // ✅ Mark all fields as touched for validation messages
    }
  }
}
