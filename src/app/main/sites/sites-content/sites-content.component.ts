import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Department } from 'app/common/models/department';
import { SitesService } from '../sites.service';
import { Site } from 'app/common/models/site';
import { SiteFilter } from 'app/main/sites/models/siteFilter';
import { AddSiteDialogComponent } from '../dialogs/add-site-dialog/add-site-dialog.component';
import { CompleteSite } from 'app/main/sites/models/completeSite';
import { SiteDetailsDialogComponent } from '../dialogs/site-details-dialog/site-details-dialog.component';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { FcmMessagingService } from 'app/common/services/fcm-messaging.service';
import { take } from 'rxjs/operators';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';

@Component({
  selector: 'sites-content',
  templateUrl: './sites-content.component.html',
  styleUrls: ['./sites-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SitesContentComponent implements OnInit {
  sites: Site[] = [];
  selectedDepartment: Department;
  siteFilter: SiteFilter;
  pageIndex: number;
  pageSize: number;
  length: number;
  displayedColumns = ['name', 'city', 'zipCode', 'actions'];

  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    public _matDialog: MatDialog,
    private _sitesService: SitesService,
    private _loaderService: NgxUiLoaderService,
    private _notificationsService: SharedNotificationService,
    private fcmMessagingService: FcmMessagingService) { }

  ngOnInit(): void {
    this._sitesService.onFiltredSitesChanged.subscribe((result) => {
      this.sites = result.data;
      this.length = result.count;
    });
    this._sitesService.onSiteFilterChanged.subscribe((siteFilter) => {
      this.siteFilter = siteFilter;
      this.pageIndex = this.siteFilter.startIndex;
      this.pageSize = this.siteFilter.length;
    });
    this._sitesService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  getFiltredSites(nextPage: number = 0): void {
    this._loaderService.start();
    this.siteFilter.startIndex = nextPage;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter)
      .subscribe((filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
        this._loaderService.stop();
      }, (err) => {
        this._loaderService.stop();
        console.log(err);
      });
  }

  pageChanged(event): void {
    if (event.pageIndex !== this.siteFilter.startIndex) {
      this.siteFilter.startIndex = event.pageIndex;
      this.getFiltredSites(this.siteFilter.startIndex);
      return;
    } else {
      this.siteFilter.length = event.pageSize;
      this.getFiltredSites(this.siteFilter.startIndex);
    }
  }

  updateSite(site: CompleteSite): void {
    this._loaderService.start();
    this._sitesService.getSiteDetails(site.id)
      .pipe(take(1)).toPromise().then((result) => {
        this._loaderService.stop();
        this.dialogRef = this._matDialog.open(AddSiteDialogComponent, {
          panelClass: 'mail-compose-dialog',
          data: {
            mode: 'edit',
            site: result.completSite,
            restaurantTypes: result.restaurantTypes,
            restaurantSpecialies: result.restaurantSpecialies,
            restaurantOptions: result.restaurantOptions
          }
        });
        this.dialogRef.afterClosed()
          .subscribe((data) => {
            if (data) {
              const siteIndex = this.sites.findIndex(c => c.id === data.updatedSite.id);
              if (siteIndex >= 0) {
                this.sites[siteIndex] = data.updatedSite;
                const count = this._sitesService.onFiltredSitesChanged.getValue().count;
                this._sitesService.onFiltredSitesChanged.next({ data: [...this.sites], count: count });
              }
            }
          });
      });
  }

  getSiteDetails(site: CompleteSite): void {
    this._loaderService.start();
    this._sitesService.getSiteDetails(site.id)
      .pipe(take(1)).toPromise().then((result) => {
        this._loaderService.stop();
        this.dialogRef = this._matDialog.open(SiteDetailsDialogComponent, {
          panelClass: 'mail-compose-dialog',
          data: {
            site: result.completSite
          }
        });
      });
  }

  setActivityMealBonus(site: CompleteSite): void {
    this._loaderService.start();
    const isActivityMealBag = !site.isActivityMealBag;
    const mealBagId = isActivityMealBag ? 1 : 0;
    this._sitesService.setActivityMealBonus(site.id, mealBagId)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          site.isActivityMealBag = !site.isActivityMealBag;
        }
      }, (err) => {
        console.log(err);
        this._notificationsService.showStandarError();
      });
  }

  setRestaurantVoucher(site: CompleteSite): void {
    this._loaderService.start();
    const isRestaurantVoucher = !site.isRestaurantVoucher;
    this._sitesService.setRestaurantVoucher(site.id, isRestaurantVoucher)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          site.isRestaurantVoucher = !site.isRestaurantVoucher;
        }
      }, (err) => {
        console.log(err);
        this._notificationsService.showStandarError();
      });
  }

  setIncludedInTraceability(site: CompleteSite): void {
    this._loaderService.start();
    const isIncludedInTraceability = !site.isIncludedInTraceability;
    this._sitesService.setIncludedInTraceability(site.id, isIncludedInTraceability)
      .subscribe((response) => {
        this._loaderService.stop();
        if (response) {
          site.isIncludedInTraceability = !site.isIncludedInTraceability;
        }
      }, (err) => {
        console.log(err);
        this._notificationsService.showStandarError();
      });
  }

  enableOrDisableSite(site: CompleteSite): void {
    let data;
    if (site.active) {
      data = {
        title: 'Désactiver un site',
        message: 'Voulez-vous vraiment désactiver ce site ?'
      };
    } else {
      data = {
        title: 'Réactiver un site',
        message: 'Voulez-vous vraiment réactiver ce site ?'
      };
    }
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: 'confirm-dialog',
      data: data
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          this._loaderService.start();
          if (site.active) {
            this._sitesService.disableSite(site.id)
              .subscribe((result) => {
                this._loaderService.stop();
                if (result) {
                  site.active = false;
                  const notification = {
                    notification: {
                      title: 'Site Désactivé',
                      body: `le site ${site.name} a été désactivé !`
                    },
                    to: '/topics/allDevices'
                  };
                  // this.fcmMessagingService.sendNotification(notification).subscribe(result => {
                  //   console.log('sent notificion', result);
                  // }, err => {
                  //   console.log(err);
                  // });
                }
              }, (err) => {
                console.log(err);
                this._notificationsService.showStandarError();
              });
          } else {
            this._sitesService.enableSite(site.id)
              .subscribe((response) => {
                this._loaderService.stop();
                if (response) {
                  site.active = true;
                }
              }, (err) => {
                console.log(err);
                this._notificationsService.showStandarError();
              });
          }

        }
      });
  }

}
