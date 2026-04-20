import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast';
import { Policy } from '../../models/policy';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PolicyCardComponent } from '../../components/policy-card/policy-card';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AdminSidebarComponent, 
    NavbarComponent,
    PolicyCardComponent, 
    ConfirmationDialogComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  policies = signal<Policy[]>([]);
  loading = signal<boolean>(true);
  showFormModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  showLogoutConfirm = signal<boolean>(false);

  currentPolicy = signal<Partial<Policy>>({});
  benefitsInput = signal<string>('');
  policyToDelete = signal<Policy | null>(null);

  // Relationship factor: Coverage = Premium * Duration * 50
  private CALC_FACTOR = 50;

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPolicies();
  }

  loadPolicies() {
    this.loading.set(true);
    this.policyService.getPolicies().subscribe({
      next: (data) => {
        this.policies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        // Error handled by interceptor
        this.loading.set(false);
      }
    });
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentPolicy.set({
      policyName: '',
      premium: 0,
      coverageAmount: 0,
      duration: '1',
      eligibility: '',
      benefits: []
    });
    this.benefitsInput.set('');
    this.showFormModal.set(true);
  }

  openEditModal(policy: Policy) {
    this.isEditing.set(true);
    this.currentPolicy.set({ ...policy });
    this.benefitsInput.set(policy.benefits.join(', '));
    this.showFormModal.set(true);
  }

  // Reactive Logic: Only triggers when isEditing() is true
  onPremiumInput(val: number) {
    const policy = { ...this.currentPolicy(), premium: val };
    if (this.isEditing()) {
      const duration = parseInt(policy.duration || '1') || 1;
      policy.coverageAmount = val * duration * this.CALC_FACTOR;
    }
    this.currentPolicy.set(policy);
  }

  onCoverageInput(val: number) {
    const policy = { ...this.currentPolicy(), coverageAmount: val };
    if (this.isEditing()) {
      const duration = parseInt(policy.duration || '1') || 1;
      // Premium = Coverage / (Duration * Factor)
      policy.premium = Math.round(val / (duration * this.CALC_FACTOR));
    }
    this.currentPolicy.set(policy);
  }

  onDurationInput(val: string) {
    const policy = { ...this.currentPolicy(), duration: val };
    if (this.isEditing() && val) {
      const duration = parseInt(val) || 1;
      const premium = policy.premium || 0;
      // Update Coverage based on new Duration and existing Premium
      policy.coverageAmount = premium * duration * this.CALC_FACTOR;
    }
    this.currentPolicy.set(policy);
  }

  closeFormModal() {
    this.showFormModal.set(false);
  }

  savePolicy() {
    const policyData = {
      ...this.currentPolicy(),
      benefits: this.benefitsInput().split(',').map(b => b.trim()).filter(b => b !== '')
    } as Policy;

    if (this.isEditing() && policyData._id) {
      this.policyService.updatePolicy(policyData._id, policyData).subscribe({
        next: () => {
          this.toastService.success('Policy updated successfully');
          this.loadPolicies();
          this.closeFormModal();
        }
      });
    } else {
      this.policyService.createPolicy(policyData).subscribe({
        next: () => {
          this.toastService.success('Policy created successfully');
          this.loadPolicies();
          this.closeFormModal();
        }
      });
    }
  }

  confirmDelete(policy: Policy) {
    this.policyToDelete.set(policy);
    this.showDeleteConfirm.set(true);
  }

  onDeleteConfirmed() {
    const id = this.policyToDelete()?._id;
    if (id) {
      this.policyService.deletePolicy(id).subscribe({
        next: () => {
          this.toastService.success('Policy deleted');
          this.loadPolicies();
          this.showDeleteConfirm.set(false);
        }
      });
    }
  }

  onLogoutConfirmed() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.showLogoutConfirm.set(false);
  }
}
