import { AppVersion } from './main/changelog/models/app-version';
import { Component, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';
import { AppService } from './app.service';
import { FcmMessagingService } from './common/services/fcm-messaging.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './main/settings/models/user';
import { Router } from '@angular/router';


@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  fuseConfig: any;
  navigation: any;
  showConfigButton;
  configurationUrl = '';
  currentAppVersion: AppVersion = null;  

  private _unsubscribeAll: Subject<any>;
  constructor(
    @Inject(DOCUMENT) private document: any,
    private _fuseConfigService: FuseConfigService,
    private _fuseNavigationService: FuseNavigationService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseSplashScreenService: FuseSplashScreenService,
    private _fuseTranslationLoaderService: FuseTranslationLoaderService,
    private _translateService: TranslateService,
    private _platform: Platform,
    private appService: AppService,
    private cdRef: ChangeDetectorRef,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private fcmMessagingService: FcmMessagingService
  ) {
    // Add languages
    this._translateService.addLangs(['en', 'tr']);
    // Set the default language
    this._translateService.setDefaultLang('en');
    // Set the navigation translations
    this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);
    // Use a language
    this._translateService.use('en');
    if (this._platform.ANDROID || this._platform.IOS) {
      this.document.body.classList.add('is-mobile');
    }
    this._unsubscribeAll = new Subject();
    this.appService.getConnectedUser().then(user => {
      if (user) {
        this.appService.onCurentUserChanged.next(user);
        this.appService.loadNavigationMenu(user);
      } else {
        this.appService.loadNavigationMenu(null);
      }
    }, err => console.log(err));
    this.appService.onCurentUserChanged.subscribe(currentUser => {
      this.appService.currentUser = currentUser;
    });
    this.appService.getLastAppVersion().subscribe( result => {
      if (result && result.length > 0) {
        const lastVersion = result.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() } as AppVersion))[0];
        if (!this.currentAppVersion) {
          this.currentAppVersion = lastVersion;
          this.appService.latestKnownAppVersion = lastVersion;
        } else {
          if (lastVersion.versionCode > this.currentAppVersion.versionCode) {
            this.router.navigate(['changelog']);
          }
        }
        this.appService.onAppVersionChanged.next(lastVersion);
      }
    });    
  }

  ngOnInit(): void {
    // this.fcmMessagingService.requestPermission();
    this.appService.onNavigationMenuChanged.subscribe(response => {
      console.log('menus', response);
      if (response && response.length > 0) {
        this.navigation = response;
        if (this._fuseNavigationService.alreadyRegistred('main')) {
          this._fuseNavigationService.unregister('main');
        }
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.setCurrentNavigation('main');
      }
    });
    // Subscribe to config changes
    this._fuseConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.fuseConfig = config;
        // Boxed
        if (this.fuseConfig.layout.width === 'boxed') {
          this.document.body.classList.add('boxed');
        }
        else {
          this.document.body.classList.remove('boxed');
        }
        // Color theme - Use normal for loop for IE11 compatibility
        for (let i = 0; i < this.document.body.classList.length; i++) {
          const className = this.document.body.classList[i];
          if (className.startsWith('theme-')) {
            this.document.body.classList.remove(className);
          }
        }
        this.document.body.classList.add(this.fuseConfig.colorTheme);
      });

    // Config Button subscriptions (visibility and URL)
    this.appService.onShowConfigButtonChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(value => {
      this.showConfigButton = value;
      this.cdRef.detectChanges();
    });
    this.appService.onConfigurationUrlChanged
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(url => {
      this.configurationUrl = url;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
}
