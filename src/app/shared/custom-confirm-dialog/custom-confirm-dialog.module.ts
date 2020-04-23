import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';
import { CustomConfirmDialogComponent } from './custom-confirm-dialog.component';
import { MatToolbarModule } from '@angular/material';


@NgModule({
  declarations: [
    CustomConfirmDialogComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    FuseSidebarModule,
    FuseSharedModule,
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
