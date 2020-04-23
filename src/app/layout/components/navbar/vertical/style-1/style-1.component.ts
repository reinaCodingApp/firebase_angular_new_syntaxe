import { AppService } from 'app/app.service';
import { User } from '../../../../../main/settings/models/user';
import { LoginService } from './../../../../../main/login/login.service';
import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

@Component({
    selector     : 'navbar-vertical-style-1',
    templateUrl  : './style-1.component.html',
    styleUrls    : ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy
{
    fuseConfig: any;
    navigation: any;
    currentUser: User;
    // Private
    private _fusePerfectScrollbar: FusePerfectScrollbarDirective;
    private unsubscribeAll: Subject<any>;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _router: Router,
        private loginService: LoginService,
        private appService: AppService
    )
    {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    profilePhotoPicked(fileInput) {
      if (fileInput.target.files && fileInput.target.files[0]) {
          const file = fileInput.target.files[0];
          this.loginService.uploadProfilePicture(file)
          .pipe(takeUntil(this.unsubscribeAll))
          .subscribe(pourcentage => {
              if (pourcentage === 100) {
              }

          });
      }
    }
    removeProfilPicutre() {
      const profilData = { photoURL: null };
      this.loginService.updateProfile(profilData).then(() => {
        this.currentUser.photoURL = null;
      });
    }


    // Directive
    @ViewChild(FusePerfectScrollbarDirective, {static: true})
    set directive(theDirective: FusePerfectScrollbarDirective)
    {
        if ( !theDirective )
        {
            return;
        }

        this._fusePerfectScrollbar = theDirective;

        // Update the scrollbar on collapsable item toggle
        this._fuseNavigationService.onItemCollapseToggled
            .pipe(
                delay(500),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(() => {
                this._fusePerfectScrollbar.update();
            });

        // Scroll to the active item position
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                    setTimeout(() => {
                        this._fusePerfectScrollbar.scrollToElement('navbar .nav-link.active', -120);
                    });
                }
            );
    }
    ngOnInit(): void
    {
        this.appService.getCurrentUser().subscribe(data => {
          if (data) {
            this.currentUser = data;
          }          
        });        
        this.loginService.onProfilePictureUploaded
        .pipe(takeUntil(this.unsubscribeAll))
        .subscribe( response => {
            if (response) {                                
                const profilData = { photoURL: response.url };
                this.loginService.updateProfile(profilData).then(() => {
                  this.currentUser.photoURL = response.url;
                });
            }
        });
        this._router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(() => {
                    if ( this._fuseSidebarService.getSidebar('navbar') )
                    {
                        this._fuseSidebarService.getSidebar('navbar').close();
                    }
                }
            );

        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });

        // Get current navigation
        this._fuseNavigationService.onNavigationChanged
            .pipe(
                filter(value => value !== null),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(() => {
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar opened status
     */
    toggleSidebarOpened(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleOpen();
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 250);
    }

    /**
     * Toggle sidebar folded status
     */
    toggleSidebarFolded(): void
    {
        this._fuseSidebarService.getSidebar('navbar').toggleFold();
        setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 250);
    }
}
