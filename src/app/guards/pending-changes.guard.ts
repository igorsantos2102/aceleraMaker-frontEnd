// src/app/guards/pending-changes.guard.ts
import { Injectable } from '@angular/core';
import {
  CanDeactivate,
  RouterModule,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { PostFormComponent } from '../post-form/post-form.component';

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard
  implements CanDeactivate<PostFormComponent>
{
  constructor(private dialog: MatDialog) {}

  canDeactivate(
    component: PostFormComponent
  ): Observable<boolean> | boolean {
    // se não editou nada, libera
    if (!component.form.dirty) {
      return true;
    }
    // abre diálogo e retorna o Observable<boolean>
    return this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Descartar alterações?',
          message:
            'Você tem alterações não salvas. Deseja realmente sair?'
        }
      })
      .afterClosed();
  }
}
