import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts = signal<ToastMessage[]>([]);
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {
    console.log('[ToastComponent] Initialized');
  }

  ngOnInit() {
    this.subscription = this.toastService.toastState.subscribe(toast => {
      console.log('[ToastComponent] Received toast:', toast);
      this.toasts.update(current => [...current, toast]);
      setTimeout(() => this.removeToast(toast), 3000);
    });
  }

  removeToast(toast: ToastMessage) {
    console.log('[ToastComponent] Removing toast:', toast);
    this.toasts.update(current => current.filter(t => t !== toast));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
