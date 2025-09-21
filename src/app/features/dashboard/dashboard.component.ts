import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Snippet } from '../../core/interfaces/snippet.interfaces';
import { AuthService } from '../../core/services/auth.service';
import { SnippetService } from '../../core/services/snippet.service';
import { SnippetCardComponent } from '../snippets/snippet-card/snippet-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterLink,
    SnippetCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  protected authService = inject(AuthService);
  private snippetService = inject(SnippetService);

  snippets = signal<Snippet[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSnippets();
  }

  loadSnippets(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.snippetService.getSnippets()
      .pipe(map(res => res?.data))
      .subscribe({
        next: (snippets) => {
          this.snippets.set(snippets?.slice(0, 3) || []);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load snippets');
          this.isLoading.set(false);
        }
      });
  }

  onEdit(snippet: Snippet): void {
    if (snippet.id) {
      this.router.navigate(['/snippets', snippet.id, 'edit']);
    }
  }

  logout() {
    this.authService.logout();
  }
}