import { AppService } from './../../../app/app.service';
import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { ShortcutsService } from './shortcuts.service';

const SHORTCUTS_MAX_LENGTH = 7;

@Component({
    selector   : 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls  : ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, AfterViewInit, OnDestroy
{
    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;
    userUid: string;


    @Input()
    navigation: any;

    @ViewChild('searchInput', {static: false})
    searchInputField;

    @ViewChild('shortcuts', {static: false})
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _mediaObserver: MediaObserver,
        private _renderer: Renderer2,
        private appService: AppService,
        private shortcutsService: ShortcutsService
    )
    {
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void
    {
        this.appService.onNavigationMenuChanged.subscribe(response => {
          if (response) {
            const flatResponse = this._fuseNavigationService.getFlatNavigation(response);
            this.filteredNavigationItems = flatResponse;
            this.navigationItems = flatResponse;
          }

        });
        this.appService.onCurentUserChanged
        .subscribe(user => {
          if (user) {
            this.userUid = user.uid;
            this.shortcutsService.getShortcuts(this.userUid).subscribe(response => {
              if (response) {
                this.shortcutItems = (response as any).items;
              }
            }, err => {
              console.log('you have not shortcuts yet : ', err.code);
            });
          }
        });


    }

    ngAfterViewInit(): void
    {
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if ( this._mediaObserver.isActive('gt-sm') )
                {
                    this.hideMobileShortcutsPanel();
                }
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    search(event): void
    {
        const value = event.target.value.toLowerCase();
        if ( value === '' )
        {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;
            return;
        }
        this.searching = true;
        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }
    toggleShortcut(event, itemToToggle): void
    {
        event.stopPropagation();
        for ( let i = 0; i < this.shortcutItems.length; i++ )
        {
            if ( this.shortcutItems[i].url === itemToToggle.url )
            {
                this.shortcutItems.splice(i, 1);
                this.shortcutsService.setShortcuts(this.userUid, this.shortcutItems).then(() => {
                });
                return;
            }
        }
        if (this.shortcutItems.length < SHORTCUTS_MAX_LENGTH) {
          this.shortcutItems.push(itemToToggle);
          this.shortcutsService.setShortcuts(this.userUid, this.shortcutItems).then(() => {
          });
        }

    }
    isInShortcuts(navigationItem): any
    {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }

    onMenuOpen(): void
    {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }

    showMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }

    hideMobileShortcutsPanel(): void
    {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }
}
