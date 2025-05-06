import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="dashboard-container">
      <h1>Dashboard</h1>
      @if (authService.user()) {
        <div class="user-info">
          <p>Welcome, {{ authService.user()?.name }}!</p>
          <button mat-raised-button color="warn" (click)="logout()">Logout</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      background-color: #0f172a;
      min-height: 100vh;
      
      h1 {
        color: #f8fafc;
        margin-bottom: 1rem;
      }

      .user-info {
        background-color: #1e293b;
        padding: 1.5rem;
        border-radius: 8px;
        margin-top: 1rem;

        p {
          color: #94a3b8;
          margin-bottom: 1rem;
        }
      }
    }
  `]
})
export class DashboardComponent {
  protected authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}