import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';            // <- IMPORTANTE
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService, UserLogin } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,            // <- ADICIONADO AQUI
    MatSnackBarModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hide = true;                    // <- PROPRIEDADE PARA TOGGLE DE SENHA
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    const { username, password } = this.loginForm.value!;
    const loginData: UserLogin = { usuario: username, senha: password };
    this.auth.login(loginData).subscribe(success => {
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Usuário ou senha inválidos';
        this.snack.open(this.error, 'Fechar', { duration: 3000 });
      }
    });
  }
}
