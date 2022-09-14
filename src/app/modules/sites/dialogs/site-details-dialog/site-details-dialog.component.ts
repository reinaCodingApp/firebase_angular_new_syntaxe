import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompleteRestaurant } from '../../models/completeRestaurant';
import { CompleteSite } from '../../models/completeSite';

@Component({
  selector: 'app-site-details-dialog',
  templateUrl: './site-details-dialog.component.html'
})
export class SiteDetailsDialogComponent implements OnInit {
  site: CompleteRestaurant;
  constructor(
    public matDialogRef: MatDialogRef<SiteDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.site = data.site;
  }

  ngOnInit(): void {
  }

  openGoogleMaps(): void {
    const googleMapsLink = `https://maps.google.com/?q=${this.site.latitude},${this.site.longitude}`;
    window.open(googleMapsLink, '_blank');
  }

  showRestaurantExtra(site: CompleteSite | CompleteRestaurant): boolean {
    return (site.siteTypes.findIndex(t => t.id === 2) !== -1);
  }

}



