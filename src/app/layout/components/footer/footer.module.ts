import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';

import { FooterComponent } from 'app/layout/components/footer/footer.component';
import { MatMenuModule, MatTooltipModule, MatBadgeModule } from '@angular/material';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    FuseSharedModule,
    MatBadgeModule
  ],
  exports: [
    FooterComponent
  ],
})
export class FooterModule {
}
