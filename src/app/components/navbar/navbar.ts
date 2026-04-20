import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="logo">INSURE+ Portal</div>
        <div class="nav-actions">
          @if (showLogin()) {
            <button (click)="openLogin.emit()" class="login-link-btn">Admin Login</button>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      height: 60px;
      background-color: #1e88e5;
      color: white;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 2000;
      width: 100%;
    }
    .container {
      width: 100%;
      padding: 0 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .login-link-btn {
      color: #333;
      font-size: 0.9rem;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      padding: 10px 25px; /* Same padding as edit/delete buttons */
      border-radius: 25px; /* Balanced rounding */
      transition: all 0.3s ease;
    }
    .login-link-btn:hover {
      background-color: rgba(0, 0, 0, 0.08); /* Light black/transparent background */
      text-decoration: none;
    }
  `]
})
export class NavbarComponent {
  showLogin = input<boolean>(true);
  openLogin = output<void>();
}
