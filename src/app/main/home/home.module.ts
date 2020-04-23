import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FuseSharedModule } from '@fuse/shared.module';
import { HomeService } from './home.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatDividerModule, MatMenuModule, MatSelectModule, MatTableModule, MatTabsModule, MatTooltipModule, MatExpansionModule, MatDialogModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatStepperModule, MatRippleModule, MatSlideToggleModule } from '@angular/material';
import { FuseSidebarModule, FuseWidgetModule } from '@fuse/components';
import { TimelineComponent } from './timeline/timeline.component';
import { NewsDetailDialogComponent } from './timeline/dialogs/news-detail-dialog/news-detail-dialog.component';
import { AddNewsDialogComponent } from './timeline/dialogs/add-news-dialog/add-news-dialog.component';

const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  { path: 'home', component: HomeComponent, ...canActivate(redirectUnauthorizedToLoginPage), resolve: { source: HomeService } }
];

@NgModule({
  declarations: [HomeComponent, TimelineComponent, NewsDetailDialogComponent, AddNewsDialogComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    NgxChartsModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseWidgetModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatStepperModule,
    MatRippleModule,
    MatSlideToggleModule

  ],
  exports: [HomeComponent],
  providers: [HomeService],
  entryComponents: [
    NewsDetailDialogComponent,
    AddNewsDialogComponent
  ]
})
export class HomeModule { }
