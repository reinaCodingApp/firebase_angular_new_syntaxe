import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { SitesService } from '../../sites.service';
import { Department } from 'app/common/models/department';
import { CompleteRestaurant, RestaurantType, RestaurantOption, RestaurantSpeciality } from '../../models/completeRestaurant';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SiteType } from '../../models/siteType';
import { CompleteSite } from '../../models/completeSite';

@Component({
  selector: 'app-add-site-dialog',
  templateUrl: './add-site-dialog.component.html'
})
export class AddSiteDialogComponent implements OnInit, OnDestroy {
  site: CompleteRestaurant;
  siteTypes: SiteType[];
  departments: Department[];

  restaurantTypes: RestaurantType[];
  restaurantSpecialies: RestaurantSpeciality[];
  restaurantOptions: RestaurantOption[];
  private unsubscribeAll: Subject<any>;

  constructor(
    public matDialogRef: MatDialogRef<AddSiteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sitesService: SitesService,
    private _notificationService: SharedNotificationService
  ) {
    this.unsubscribeAll = new Subject();
    if (data.mode === 'edit') {
      this.site = data.site;
      this.restaurantTypes = data.restaurantTypes;
      this.restaurantSpecialies = data.restaurantSpecialies;
      this.restaurantOptions = data.restaurantOptions;
    } else {
      this.site = new CompleteSite();
    }
  }

  ngOnInit(): void {
    this._sitesService.onSiteTypesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((siteTypes) => {
        this.siteTypes = siteTypes;
      });
    this._sitesService.onDepartmentsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((departments) => {
        this.departments = departments;
      });
  }

  generateAgreementNumber(): void {
    this._sitesService.generateAgreementNumber(this.site.zipCode)
      .subscribe((agreementNumber) => {
        this.site.agreementNumber = agreementNumber;
      }, (err) => {
        console.log(err);
      });
  }

  getCoordinateFromAddress(): void {
    const completeAdress = `${this.site.address} ${this.site.zipCode} ${this.site.city}, ${this.site.country}`;
    const addressParam = `&address=${completeAdress}`;
    this._sitesService.getCoordinateFromAdress(addressParam)
      .subscribe((response) => {
        if (response.status === 'OK') {
          this.site.latitude = response.results[0].geometry.location.lat;
          this.site.longitude = response.results[0].geometry.location.lng;
        }
      }, (err) => {
        console.log(err);
      });
  }

  openGoogleMaps(): void {
    const googleMapsLink = `https://maps.google.com/?q=${this.site.latitude},${this.site.longitude}`;
    window.open(googleMapsLink, '_blank');
  }

  addSite(): void {
    this._sitesService.addSite(this.site).subscribe((response) => {
      this.matDialogRef.close();
      this._notificationService.showSuccess('Site crée avec succés');
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  updateSite(): void {
    this._sitesService.updateSite(this.site).subscribe((response) => {
      if (response) {
        this.matDialogRef.close({ updatedSite: this.site });
        this._notificationService.showSuccess('Site modifié avec succés');
      }
    }, (err) => {
      console.log(err);
      this._notificationService.showStandarError();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateSite();
      } else {
        this.addSite();
      }
    }
  }

  showRestaurantExtra(site: CompleteSite | CompleteRestaurant): boolean {
    return (site.siteTypes.findIndex(t => t.id === 2) !== -1);
  }

  updateRestaurantInformation(form: NgForm): void {
    if (form.valid) {
      this.checkRestaurantInfos(this.site),
        this._sitesService.updateRestaurantInformation(this.site)
          .subscribe((response) => {
            this.matDialogRef.close();
            this._notificationService.showSuccess('Restaurant modifié avec succés');
          }, (err) => {
            console.log(err);
            this._notificationService.showStandarError();
          });
    }
  }

  checkRestaurantInfos(site: CompleteRestaurant): void {
    if (site.restaurantTypes === null) {
      site.restaurantTypes = [];
    }
    if (site.restaurantSpecialies === null) {
      site.restaurantSpecialies = [];
    }
    if (site.restaurantOptions === null) {
      site.restaurantOptions = [];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

}


