import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';

import { CustomConfirmDialogComponent } from './custom-confirm-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';


@NgModule({
  declarations: [
    CustomConfirmDialogComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    SharedModule,
  ],
  exports: [
    CustomConfirmDialogComponent
  ],
  entryComponents: [
    CustomConfirmDialogComponent
  ]
})
export class CustomConfirmDialogModule {
}
