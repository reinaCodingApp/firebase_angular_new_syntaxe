import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, takeUntil, take } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from 'app/app.service';
import { TicketService } from 'app/modules/ticket/ticket.service';
import { AddTicketDialogComponent } from 'app/modules/ticket/dialogs/add-ticket-dialog/add-ticket-dialog.component';

@Component({
    selector     : 'classic-layout',
    templateUrl  : './classic.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ClassicLayoutComponent implements OnInit, OnDestroy
{
    private dialogRef: any;
    isBackofficeMember: boolean;
    allUnreadTicketsAndCommentsCount: number;
    versionName = '';
    private moduleIdentifier = ModuleIdentifiers.ticket;
    promptEvent: any;
    isInStandaloneMode = false;
    isAlreadyInstalled = true;
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private matDialog: MatDialog,
        private ticketService: TicketService,
        private appService: AppService,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

            // Check if the screen is small
            this.isScreenSmall = !matchingAliases.includes('md');
        });
        this.appService.onCurentUserChanged.subscribe(user => {
            if (user) {
                this.appService.getHabilitation(user, this.moduleIdentifier).then(habilitation => {
                this.isBackofficeMember = habilitation.isAdmin();
                this.getAllUnreadTicketsAndCommentsCount(this.isBackofficeMember);
                });
            }
            });
            this.appService.onAppVersionChanged.subscribe(response => {
            if (response) {
                this.versionName = response.versionName;
            }
            });
            window.addEventListener('beforeinstallprompt', event => {      
            this.isAlreadyInstalled = false;
            this.promptEvent = event;
            });
            window.addEventListener('appinstalled', (evt) => {      
            this.isAlreadyInstalled = true;
            });
            window.addEventListener('load', () => {
            const iOSInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
            if (iOSInStandaloneMode) {        
                this.isInStandaloneMode = true;
            } else if (matchMedia('(display-mode: standalone)').matches) {        
                this.isInStandaloneMode = true;
            } else {        
                this.isInStandaloneMode = false;
            }
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    installApp(): void {    
        if (this.promptEvent) {
          this.promptEvent.prompt();    
          this.promptEvent.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Uses accepted to install the  app');
          } else {
            console.log('User dismissed the install prompt');
          }
        });
        }    
      }
    addTicket(): void {
        this.dialogRef = this.matDialog.open(AddTicketDialogComponent, {
          panelClass: 'mail-compose-dialog'
        });
        this.dialogRef.afterClosed()
          .subscribe(response => {
            if (!response) {
              return;
            }
          });
      }
    
      getAllUnreadTicketsAndCommentsCount(isBackofficeMember: boolean): void {
        this.ticketService.getAllUnreadTicketsAndCommentsCount(isBackofficeMember)
          .pipe(take(1))
          .subscribe((result) => {
            this.allUnreadTicketsAndCommentsCount = result;
          }, err => {
            console.log(err);
          });
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
