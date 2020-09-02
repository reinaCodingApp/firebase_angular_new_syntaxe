import { ChangelogModule } from './main/changelog/changelog.module';
import { LoginService } from './main/login/login.service';
import { AppService } from './app.service';
import { LoginModule } from './main/login/login.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'moment/locale/fr';

import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';

import { firebaseConfig } from 'environments/environment';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { HomeModule } from './main/home/home.module';
import { FormsModule } from '@angular/forms';
import { WebMessagesModule } from './main/webcms/web-messages/web-messages.module';
import { AdvanceSalaryModule } from './main/advance-salary/advance-salary.module';
import { TicketModule } from './main/ticket/ticket.module';
import { RecapActivityModule } from './main/recap-activity/recap-activity.module';
import { MissionOrderModule } from './main/mission-order/mission-order.module';
import { TourSheetModule } from './main/tour-sheet/tour-sheet.module';
import { ForeignMissionModule } from './main/foreign-mission/foreign-mission.module';
import { ActivityAbsenceModule } from './main/activity-absence/activity-absence.module';
import { ActivityModule } from './main/activity/activity.module';
import { SettingsModule } from './main/settings/settings.module';
import { TonnageModule } from './main/tonnage/tonnage.module';
import { ActivityStatisticsModule } from './main/activity-statistics/activity-statistics.module';
import { ActivityParametersModule } from './main/activity-parameters/activity-parameters.module';
import { TechnicalSheetModule } from './main/technical-sheet/technical-sheet.module';
import { SitesModule } from './main/sites/sites.module';
import { ClientsModule } from './main/clients/clients.module';
import { TraceabilitySheetModule } from './main/traceability-sheet/traceability-sheet.module';
import { ManageTraceabilityCodesModule } from './main/manage-traceability-codes/manage-traceability-codes.module';
import { TraceabilityModule } from './main/traceability/traceability.module';
import { AuditModule } from './main/audit/audit.module';
import { FollowupSheetModule } from './main/followup-sheet/followup-sheet.module';
import { AccessRightsModule } from './main/access-rights/access-rights.module';
import { MeetingsModule } from './main/meetings/meetings.module';
import { MonthlyMeetingModule } from './main/monthly-meeting/monthly-meeting.module';
import { ActivityTemporaryWorkerModule } from './main/activity-temporary-workers/activity-temporary-workers.module';
import { WebSiteModule } from './main/webcms/website/website.module';

import { TokenInterceptor } from './main/login/token.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MarksProductsModule } from './main/webcms/marks-products/marks-products.module';
import { NewVersionSnackbarComponent } from './shared/new-version-snackbar/new-version-snackbar.component';

const appRoutes: Routes = [
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    NewVersionSnackbarComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,

    TranslateModule.forRoot(),

    // firebase
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,

    // Material moment date module
    MatMomentDateModule,

    // Material
    MatButtonModule,
    MatIconModule,

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    // App modules
    AccessRightsModule,
    LayoutModule,
    LoginModule,
    HomeModule,
    WebMessagesModule,
    AdvanceSalaryModule,
    TicketModule,
    RecapActivityModule,
    MissionOrderModule,
    TourSheetModule,
    ForeignMissionModule,
    ActivityAbsenceModule,
    ActivityModule,
    SettingsModule,
    TonnageModule,
    ActivityStatisticsModule,
    ActivityParametersModule,
    TechnicalSheetModule,
    SitesModule,
    ClientsModule,
    TraceabilitySheetModule,
    ManageTraceabilityCodesModule,
    AuditModule,
    TraceabilityModule,
    FollowupSheetModule,
    MeetingsModule,
    MonthlyMeetingModule,
    ChangelogModule,
    ActivityTemporaryWorkerModule,
    WebSiteModule,
    MarksProductsModule,

    // 3rd party modules
    NgxUiLoaderModule,

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [
    LoginService,
    AngularFireAuthGuard,
    AppService,
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'fr-FR'
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [NewVersionSnackbarComponent]
})
export class AppModule {
}
