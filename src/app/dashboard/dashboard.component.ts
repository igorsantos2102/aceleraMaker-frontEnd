import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { PostService, Post } from '../services/post.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    NgxChartsModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loading = false;
  totalPosts = 0;
  postsByAuthor: { name: string; value: number }[] = [];
  recentPosts: Post[] = [];
  view: [number, number] = [500, 240];

  // Paleta original do projeto
  colorScheme: Color = {
    name: 'blogCustom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#3f51b5', '#e91e63', '#009688', '#ff9800', '#9c27b0']
  };

  constructor(
    private auth: AuthService,
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) return;

    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: posts => {
        this.totalPosts = posts.length;

        // Agrupa postagens por autor
        const counts = posts.reduce((acc, p) => {
          acc[p.autor] = (acc[p.autor] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        this.postsByAuthor = Object.entries(counts)
          .map(([name, value]) => ({ name, value }));

        // 5 últimas postagens
        this.recentPosts = posts
          .sort((a, b) => new Date(b.data!).getTime() - new Date(a.data!).getTime())
          .slice(0, 5);

        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Erro ao carregar dashboard', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
