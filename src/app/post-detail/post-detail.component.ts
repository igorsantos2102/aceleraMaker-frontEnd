import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { PostService, Post } from '../services/post.service';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class PostDetailComponent implements OnInit {
  post: Post | undefined;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (isNaN(id)) {
      this.snackBar.open('ID de post inválido', 'Fechar', { duration: 3000 });
      this.router.navigate(['/posts']);
      return;
    }

    this.loading = true;
    this.postService.getAllPosts().subscribe({
      next: posts => {
        this.post = posts.find(p => p.id === id);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Erro ao carregar post', 'Fechar', { duration: 3000 });
        this.loading = false;
      }
    });
  }
}
