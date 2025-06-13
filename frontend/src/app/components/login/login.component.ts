import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>('/api/auth/login', { username: this.username, password: this.password })
      .subscribe({
        next: res => {
          sessionStorage.setItem('userId', res.userId);
          sessionStorage.setItem('username', this.username);
          this.router.navigateByUrl('/');
        },
        error: err => {
          this.error = err.error?.error || 'Login fehlgeschlagen';
        }
      });
  }

  gotoRegister() {
    this.router.navigateByUrl('/register');
  }
}
