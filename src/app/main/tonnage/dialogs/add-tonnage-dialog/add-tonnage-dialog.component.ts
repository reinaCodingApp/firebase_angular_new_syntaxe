import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { Tonnage } from 'app/main/tonnage/models/tonnage';
import { TonnageService } from '../../tonnage.service';
import { Site } from 'app/common/models/site';
import { Client } from 'app/main/tonnage/models/client';
import * as moment from 'moment';

@Component({
  selector: 'app-add-tonnage-dialog',
  templateUrl: './add-tonnage-dialog.component.html',
  styleUrls: ['./add-tonnage-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddTonnageDialogComponent implements OnInit {
  tonnage: Tonnage;
  sites: Site[];
  filtredSites: Site[];
  partners: Client[];
  partnersForSelectedSite: Client[];

  constructor(
    public matDialogRef: MatDialogRef<AddTonnageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _loaderService: NgxUiLoaderService,
    private _tonnageService: TonnageService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService
  ) {
    if (data.mode === 'edit') {
      this.tonnage = data.tonnage;
    } else {
      this.tonnage = new Tonnage();
    }

  }

  ngOnInit(): void {
    this._tonnageService.onSitesChanged.subscribe((sites) => {
      this.sites = sites;
      this.filtredSites = sites;
    });
    this._tonnageService.onPartnersChanged.subscribe((partners) => {
      this.partners = partners;
      if (this.data.mode === 'edit') {
        this.getPartnersForSite();
        this.tonnage.client.id = this.tonnage.client.id;
      }
    });
  }

  getPartnersForSite(): void {
    const filteredPartners = this.partners.filter((x) => {
      return x.sites.filter((y) => y.id === this.tonnage.site.id).length > 0;
    });
    this.partnersForSelectedSite = filteredPartners;
  }

  addTonnage(): void {
    this._loaderService.start();
    this.tonnage.date = moment(this.tonnage.date).format('YYYY-MM-DD');
    this._tonnageService.addTonnage(this.tonnage).subscribe((response) => {
      if (response) {
        this._tonnageService.refreshData();
        this.matDialogRef.close();
        this._notificationService.showSuccess('Tonnage crée avec succés');
      } else {
        this._notificationService.showStandarError();
      }
    }, (err) => {
      console.log(err);
      this._loaderService.stop();
      this._notificationService.showStandarError();
    });
  }

  updateTonnage(): void {
    this._loaderService.start();
    this.tonnage.date = moment(this.tonnage.date).format('YYYY-MM-DD');
    this._tonnageService.updateTonnage(this.tonnage).subscribe((response) => {
      if (response) {
        this._tonnageService.refreshData();
        this.matDialogRef.close();
        this._notificationService.showSuccess('Tonnage modifié avec succés');
      } else {
        this._notificationService.showStandarError();
      }
    }, (err) => {
      console.log(err);
      this._loaderService.stop();
      this._notificationService.showStandarError();
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateTonnage();
      } else {
        this.addTonnage();
      }
    }
  }

  searchSite(searchInput): void {
    if (!this.sites) {
      return;
    }
    searchInput = searchInput.toLowerCase();
    this.filtredSites = this.sites.filter(s => s.name.toLowerCase().indexOf(searchInput) > -1);
  }

}


