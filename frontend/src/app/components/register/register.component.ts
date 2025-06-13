import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;
    const { username, password } = this.registerForm.value;
    this.http.post<any>('/api/auth/register', { username, password })
      .subscribe({
        next: res => {
          this.successMessage = 'Registrierung erfolgreich! Du kannst dich jetzt einloggen.';
          this.errorMessage = '';
          this.registerForm.reset();
        },
        error: err => {
          this.errorMessage = err.error?.error || 'Registrierung fehlgeschlagen';
          this.successMessage = '';
        }
      });
  }
}
