// src/app/services/post.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// IMPORT do environment
import { environment } from '../../environments/environment';

export interface Post {
  id?: number;
  titulo: string;
  conteudo: string;
  autor: string;
  data?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // monta a URL base vindo do environment
  private apiUrl = `${environment.apiUrl}/api/posts`;

  constructor(private http: HttpClient) {}

  // GET: lista todas as postagens
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl);
  }

  // POST: cria nova postagem
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  // PUT: atualiza postagem existente
  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  // DELETE: exclui postagem
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
