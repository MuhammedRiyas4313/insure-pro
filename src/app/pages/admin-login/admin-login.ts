import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastComponent } from '../../components/toast/toast';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  email = signal<string>('');
  password = signal<string>('');
  loading = signal<boolean>(false);

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  onSubmit() {
    this.loading.set(true);
    this.authService.login({ email: this.email(), password: this.password() }).subscribe({
      next: () => {
        this.loading.set(false);
        this.toastService.success('Login successful!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
