import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireFunctionsModule } from '@angular/fire/compat/functions';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppService } from './app.service';
import {AngularFireModule} from '@angular/fire/compat';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './core/auth/auth.service';
import { HomeService } from './modules/home/home.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedPipesModule } from './pipes/shared-pipes.module';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),
        MatSelectModule,
        MatChipsModule,
        SharedPipesModule,
        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        AngularFireFunctionsModule,
        AngularFireAuthModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
         provideFirebaseApp(() => initializeApp(environment.firebase)),
         provideAuth(() => getAuth()),
         provideFirestore(() => getFirestore()),
         AngularFireModule.initializeApp(environment.firebase),
         MatSnackBarModule,
         MatDatepickerModule,
         MatNativeDateModule,
         SharedPipesModule
    ],
    providers:[
        AppService,
        AuthService,
        HomeService,
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
