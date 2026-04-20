import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <h2 class="sidebar-title">Admin Dashboard</h2>
      
      <nav class="sidebar-nav">
        <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item">
          Policies
        </a>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" (click)="logout.emit()">Logout</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      background-color: #1a365d;
      color: white;
      height: calc(100vh - 60px); /* Adjust for navbar height */
      padding: 40px 15px;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 60px; /* Start below the navbar */
      z-index: 1000;
      border-right: 1px solid rgba(255,255,255,0.05);
    }

    .sidebar-title {
      font-size: 18px;
      font-weight: 700;
      color: white;
      padding: 0 10px;
      margin-bottom: 40px;
      text-align: center;
    }

    .sidebar-nav {
      flex: 1;
    }

    .nav-item {
      display: block;
      padding: 12px 20px;
      color: white;
      text-decoration: none;
      font-size: 16px;
      margin: 0 0 10px 0;
      border-radius: 8px;
      background-color: #1a365d;
      text-align: center;
      transition: background 0.2s;
    }

    .nav-item.active {
      background-color: #3b5a9a; 
    }

    .sidebar-footer {
      padding: 20px 10px;
    }

    .logout-btn {
      width: 100%;
      padding: 12px;
      background-color: #f25c54;
      color: white;
      border: none;
      border-radius: 25px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .logout-btn:hover {
      background-color: #e54e46;
    }
  `]
})
export class AdminSidebarComponent {
  logout = output<void>();
}
