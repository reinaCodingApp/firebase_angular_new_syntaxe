import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { Department } from 'app/common/models/department';
import { SitesService } from '../sites.service';
import { Site } from 'app/common/models/site';
import { AddSiteDialogComponent } from '../dialogs/add-site-dialog/add-site-dialog.component';
import { SiteDetailsDialogComponent } from '../dialogs/site-details-dialog/site-details-dialog.component';
import { FcmMessagingService } from 'app/common/services/fcm-messaging.service';
import { take } from 'rxjs/operators';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { SiteFilter } from '../models/siteFilter';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';
import { CompleteSite } from '../models/completeSite';
import { SitesComponent } from '../sites.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'sites-content',
  templateUrl: './sites-content.component.html'
})
export class SitesContentComponent implements OnInit {
  @ViewChild(MatSort , {static:true}) sort: MatSort;

  sites: Site[] = [];
  selectedDepartment: Department;
  siteFilter: SiteFilter;
  pageIndex: number;
  pageSize: number;
  length: number;
  displayedColumns = ['name', 'city', 'zipCode', 'actions'];

  private dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  dataSource: MatTableDataSource<any>;


  constructor(
    public _matDialog: MatDialog,
    public sitesComponent: SitesComponent,
    private _sitesService: SitesService,
    private _notificationsService: SharedNotificationService) { }

  ngOnInit(): void {
    this._sitesService.onFiltredSitesChanged.subscribe((result) => {
      this.sites = result.data;
      this.length = result.count;
      console.log(result);
      
      this.dataSource = new MatTableDataSource(result.data);
      this.dataSource.sort = this.sort;

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
    this.siteFilter.startIndex = nextPage;
    this._sitesService.onSiteFilterChanged.next(this.siteFilter);
    this._sitesService.getFiltredSites(this.siteFilter)
      .subscribe((filtredSites) => {
        this._sitesService.onFiltredSitesChanged.next(filtredSites);
      }, (err) => {
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

  addSite(): void {
        this.dialogRef = this._matDialog.open(AddSiteDialogComponent, {
          panelClass: 'mail-compose-dialog',
          data: {
            mode: 'new', 
          }
        });
        this.dialogRef.afterClosed()
          .subscribe((data) => {
             
            
          });
  }

  updateSite(site: CompleteSite): void {
    this._sitesService.getSiteDetails(site.id)
      .pipe(take(1)).toPromise().then((result) => {
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
    this._sitesService.getSiteDetails(site.id)
      .pipe(take(1)).toPromise().then((result) => {
        this.dialogRef = this._matDialog.open(SiteDetailsDialogComponent, {
          panelClass: 'mail-compose-dialog',
          data: {
            site: result.completSite
          }
        });
      });
  }

  setActivityMealBonus(site: CompleteSite): void {
    const isActivityMealBag = !site.isActivityMealBag;
    const mealBagId = isActivityMealBag ? 1 : 0;
    this._sitesService.setActivityMealBonus(site.id, mealBagId)
      .subscribe((response) => {
        if (response) {
          site.isActivityMealBag = !site.isActivityMealBag;
        }
      }, (err) => {
        console.log(err);
        this._notificationsService.showStandarError();
      });
  }

  setRestaurantVoucher(site: CompleteSite): void {
    const isRestaurantVoucher = !site.isRestaurantVoucher;
    this._sitesService.setRestaurantVoucher(site.id, isRestaurantVoucher)
      .subscribe((response) => {
        if (response) {
          site.isRestaurantVoucher = !site.isRestaurantVoucher;
        }
      }, (err) => {
        console.log(err);
        this._notificationsService.showStandarError();
      });
  }

  setIncludedInTraceability(site: CompleteSite): void {
    const isIncludedInTraceability = !site.isIncludedInTraceability;
    this._sitesService.setIncludedInTraceability(site.id, isIncludedInTraceability)
      .subscribe((response) => {
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
          if (site.active) {
            this._sitesService.disableSite(site.id)
              .subscribe((result) => {
                if (result) {
                  site.active = false;
                  const notification = {
                    notification: {
                      title: 'Site Désactivé',
                      body: `le site ${site.name} a été désactivé !`
                    },
                    to: '/topics/allDevices'
                  };
                }
              }, (err) => {
                console.log(err);
                this._notificationsService.showStandarError();
              });
          } else {
            this._sitesService.enableSite(site.id)
              .subscribe((response) => {
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
