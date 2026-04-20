import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast';
import { Policy } from '../../models/policy';
import { AdminSidebarComponent } from '../../components/admin-sidebar/admin-sidebar';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog';
import { ToastComponent } from '../../components/toast/toast';
import { PolicyCardComponent } from '../../components/policy-card/policy-card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    AdminSidebarComponent, 
    ConfirmationDialogComponent, 
    ToastComponent,
    PolicyCardComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  policies = signal<Policy[]>([]);
  currentPolicy = signal<Policy>(this.getEmptyPolicy());
  benefitsInput = signal<string>('');
  
  isEditing = signal<boolean>(false);
  showFormModal = signal<boolean>(false);
  showDeleteConfirm = signal<boolean>(false);
  showLogoutConfirm = signal<boolean>(false);
  policyToDelete = signal<Policy | null>(null);

  constructor(
    private policyService: PolicyService, 
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadPolicies();
  }

  checkAuth() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/admin/login']);
    }
  }

  loadPolicies() {
    this.policyService.getPolicies().subscribe({
      next: (data) => this.policies.set(data),
      error: () => {}
    });
  }

  getEmptyPolicy(): Policy {
    return {
      policyName: '',
      premium: 0,
      coverageAmount: 0,
      duration: '',
      eligibility: '',
      benefits: []
    };
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentPolicy.set(this.getEmptyPolicy());
    this.benefitsInput.set('');
    this.showFormModal.set(true);
  }

  openEditModal(policy: Policy) {
    this.isEditing.set(true);
    this.currentPolicy.set({ ...policy });
    this.benefitsInput.set(policy.benefits.join(', '));
    this.showFormModal.set(true);
  }

  closeFormModal() {
    this.showFormModal.set(false);
  }

  savePolicy() {
    const policyData = { ...this.currentPolicy() };
    policyData.benefits = this.benefitsInput().split(',').map(b => b.trim()).filter(b => b !== '');
    
    if (this.isEditing() && policyData._id) {
      this.policyService.updatePolicy(policyData._id, policyData).subscribe({
        next: () => {
          this.toastService.success('Policy updated successfully');
          this.loadPolicies();
          this.closeFormModal();
        },
        error: () => {}
      });
    } else {
      this.policyService.createPolicy(policyData).subscribe({
        next: () => {
          this.toastService.success('Policy created successfully');
          this.loadPolicies();
          this.closeFormModal();
        },
        error: () => {}
      });
    }
  }

  confirmDelete(policy: Policy) {
    this.policyToDelete.set(policy);
    this.showDeleteConfirm.set(true);
  }

  onDeleteConfirmed() {
    const policy = this.policyToDelete();
    if (policy?._id) {
      this.policyService.deletePolicy(policy._id).subscribe({
        next: () => {
          this.toastService.success('Policy deleted successfully');
          this.loadPolicies();
          this.showDeleteConfirm.set(false);
          this.policyToDelete.set(null);
        },
        error: () => {
          this.showDeleteConfirm.set(false);
        }
      });
    }
  }

  onLogoutConfirmed() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
