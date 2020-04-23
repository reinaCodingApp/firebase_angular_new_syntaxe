import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';

import { FuseSharedModule } from '@fuse/shared.module';

import { QuickPanelComponent } from 'app/layout/components/quick-panel/quick-panel.component';

@NgModule({
  declarations: [
    QuickPanelComponent
  ],
  imports: [
    RouterModule,
    MatDividerModule,
    MatListModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,

    FuseSharedModule,
  ],
  exports: [
    QuickPanelComponent
  ]
})
export class QuickPanelModule {
}
