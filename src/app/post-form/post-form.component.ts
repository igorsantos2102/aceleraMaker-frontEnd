import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../services/auth.service';
import { PostService, Post } from '../services/post.service';

@Component({
  standalone: true,
  selector: 'app-post-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  postId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.form = this.fb.group({
      titulo: ['', Validators.required],
      conteudo: ['', Validators.required],
      autor: ['', Validators.required]
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit = true;
        this.postId = +id;
        this.postService.getAllPosts().subscribe(posts => {
          const post = posts.find(p => p.id === this.postId);
          if (post) {
            this.form.patchValue(post);
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const data = this.form.value as Post;
    const action =
      this.isEdit && this.postId != null
        ? this.postService.updatePost(this.postId, data)
        : this.postService.createPost(data);

    action.subscribe({
      next: () => {
        const msg = this.isEdit ? 'Post atualizado!' : 'Post criado!';
        this.snack.open(msg, 'Fechar', { duration: 2000 });

        // <<< Imprescindível: limpa o estado dirty
        this.form.markAsPristine();

        // navega sem disparar o PendingChangesGuard
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.snack.open('Erro ao salvar post', 'Fechar', { duration: 3000 });
      }
    });
  }
}
