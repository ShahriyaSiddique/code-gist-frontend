import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Snippet } from '../../../core/interfaces/snippet.interfaces';
import { SnippetService } from '../../../core/services/snippet.service';
import { signal } from '@angular/core';
import { map } from 'rxjs';
import { SnippetCardComponent } from '../snippet-card/snippet-card.component';

@Component({
  selector: 'app-shared-snippets',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    SnippetCardComponent
  ],
  templateUrl: './shared-snippets.component.html',
  styleUrls: ['./shared-snippets.component.scss']
})
export class SharedSnippetsComponent implements OnInit {
  private router = inject(Router);
  private snippetService = inject(SnippetService);

  snippets = signal<Snippet[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadSharedSnippets();
  }

  private loadSharedSnippets(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.snippetService.getSharedSnippets()
      .pipe(map(res => res?.data))
      .subscribe({
        next: (snippets) => {
          this.snippets.set(snippets);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load shared snippets');
          this.isLoading.set(false);
        }
      });
  }

  onEdit(snippet: Snippet): void {
    if (snippet.id) {
      this.router.navigate(['/snippets', snippet.id, 'edit']);
    }
  }
} 