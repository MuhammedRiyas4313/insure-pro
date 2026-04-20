import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { PolicyCardComponent } from '../../components/policy-card/policy-card';
import { ToastComponent } from '../../components/toast/toast';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../models/policy';

@Component({
  selector: 'app-user-portal',
  standalone: true,
  imports: [CommonModule, NavbarComponent, PolicyCardComponent, ToastComponent],
  templateUrl: './user-portal.component.html',
  styleUrl: './user-portal.component.css'
})
export class UserPortalComponent implements OnInit {
  policies = signal<Policy[]>([]);
  loading = signal<boolean>(true);

  constructor(private policyService: PolicyService) {}

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
}
