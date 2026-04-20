import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PolicyCardComponent } from '../../components/policy-card/policy-card';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast';
import { Policy } from '../../models/policy';

@Component({
  selector: 'app-user-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, PolicyCardComponent],
  templateUrl: './user-portal.component.html',
  styleUrl: './user-portal.component.css'
})
export class UserPortalComponent implements OnInit {
  policies = signal<Policy[]>([]);
  loading = signal<boolean>(true);
  
  // Login Modal State
  showLoginModal = signal<boolean>(false);
  username = signal<string>('');
  password = signal<string>('');
  showPassword = signal<boolean>(false);
  loginLoading = signal<boolean>(false);

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        this.policies.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onLogin() {
    this.loginLoading.set(true);
    this.authService.login({ username: this.username(), password: this.password() }).subscribe({
      next: () => {
        this.loginLoading.set(false);
        this.showLoginModal.set(false);
        this.toastService.success('Login successful!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.loginLoading.set(false);
        // Error is handled globally by the interceptor
      }
    });
  }

  closeLogin() {
    this.showLoginModal.set(false);
    this.username.set('');
    this.password.set('');
    this.showPassword.set(false);
  }
}
