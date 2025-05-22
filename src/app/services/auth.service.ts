import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface UserLogin {
  usuario: string;
  senha?: string; // Senha é opcional no retorno, mas necessária no envio
  token?: string;
  nome?: string;
  foto?: string;
  tipo?: string;
  id?: number; // Adicionado para compatibilidade
}

export interface UserProfile {
  username: string;
  email?: string | null;
  avatar?: string | null;
  token?: string | null;
  nome?: string | null;
  tipo?: string | null;
  id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this._isLoggedIn.asObservable();

  private _userProfile = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this._userProfile.asObservable();

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken(): void {
    const token = localStorage.getItem('AUTH_TOKEN');
    const userStored = localStorage.getItem('USER_PROFILE');
    if (token && userStored) {
      // Idealmente, validar o token aqui ou obter perfil do backend
      const userProfile: UserProfile = JSON.parse(userStored);
      this._userProfile.next({...userProfile, token: token});
      this._isLoggedIn.next(true);
      // Atualiza o environment global com o token
      environment.token = token;
    } else {
      this.clearLocalStorage();
    }
  }

  register(user: UserLogin): Observable<UserLogin> {
    // O backend parece esperar um objeto Usuario completo para cadastro
    // Adaptar conforme a API /api/usuarios/cadastrar espera
    // Assumindo que o backend espera um objeto com nome, usuario, senha, foto
    const registerPayload = {
      nome: user.nome || user.usuario, // Usar nome ou usuário como fallback
      usuario: user.usuario,
      senha: user.senha,
      foto: user.foto || '' // Foto opcional
    };
    return this.http.post<UserLogin>(`${this.apiUrl}/api/usuarios/cadastrar`, registerPayload).pipe(
      tap(registeredUser => {
        // A API de cadastro pode ou não retornar o usuário com token.
        // Se retornar, podemos logar o usuário diretamente.
        // Se não, o usuário precisará fazer login separadamente.
        console.log('Usuário registrado:', registeredUser);
      }),
      catchError(this.handleError)
    );
  }

  login(user: UserLogin): Observable<boolean> {
    const loginPayload = {
      usuario: user.usuario,
      senha: user.senha
    };
    return this.http.post<UserLogin>(`${this.apiUrl}/api/auth/login`, loginPayload).pipe(
      map(response => {
        if (response && response.token) {
          const userProfile: UserProfile = {
            username: response.usuario,
            token: response.token,
            nome: response.nome,
            avatar: response.foto,
            tipo: response.tipo,
            id: response.id
          };
          localStorage.setItem('AUTH_TOKEN', response.token);
          localStorage.setItem('USER_PROFILE', JSON.stringify(userProfile));
          this._userProfile.next(userProfile);
          this._isLoggedIn.next(true);
          // Atualiza o environment global com o token
          environment.token = response.token;
          return true;
        }
        return false;
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.clearLocalStorage();
    this._isLoggedIn.next(false);
    this._userProfile.next(null);
    environment.token = ''; // Limpa o token do environment
    // Opcional: Chamar endpoint de logout no backend se existir
  }

  private clearLocalStorage(): void {
      localStorage.removeItem('AUTH_TOKEN');
      localStorage.removeItem('USER_PROFILE');
  }

  isAuthenticated(): boolean {
    return this._isLoggedIn.value;
  }

  getToken(): string | null {
    return localStorage.getItem('AUTH_TOKEN');
  }

  getUserProfile(): UserProfile | null {
    return this._userProfile.value;
  }

  // Simplificado - Atualização de perfil deve ser feita via backend
  // updateProfile(email: string | null, avatarBase64: string | null): void { ... }

  getUsername(): string | null {
    return this._userProfile.value?.username ?? null;
  }

  private handleError(error: any): Observable<never> {
    console.error('Erro na chamada da API:', error);
    // Melhorar tratamento de erro conforme necessário
    return throwError(() => new Error('Falha na operação. Tente novamente mais tarde.'));
  }
}

// Adicionar token ao environment para fácil acesso global
// É preciso definir a propriedade token em environment.ts e environment.prod.ts
declare module '../../environments/environment' {
  export interface Environment {
    token?: string;
  }
}
