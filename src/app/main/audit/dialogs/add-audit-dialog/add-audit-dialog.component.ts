import { Employee } from '../../../../common/models/employee';
import { AuditsService } from './../../audit.service';
import { AuditTemplate } from '../../models/audit-template';
import { Site } from 'app/common/models/site';
import { Audit } from '../../models/audit';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteType } from 'app/main/sites/models/siteType';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Department } from 'app/common/models/department';
import { ReplaySubject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'add-audit-dialog',
  templateUrl: './add-audit-dialog.component.html',
  styleUrls: ['./add-audit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddAuditDialogComponent implements OnInit {
  audit: Audit = new Audit();
  sites: Site[] = [];
  dateParam: any;
  templates: AuditTemplate[] = [];
  filtredTemplates: AuditTemplate[] = [];
  selectedTemplate: AuditTemplate = null;
  action = '';
  departments: Department[] = [];
  smallScreen: boolean;

  public placeGroupsCtrl: FormControl = new FormControl();
  public placeGroupsFilterCtrl: FormControl = new FormControl();

  private placeGroups: any[] = [];
  public filteredPlaceGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  selectedPlace: Department | Site;

  constructor(
    private sharedNotificationService: SharedNotificationService,
    private breakpointObserver: BreakpointObserver,
    public matDialogRef: MatDialogRef<AddAuditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditsService: AuditsService) {
    this.auditsService.onSitesChanged.subscribe(sites => {
      this.sites = sites;
    });
    this.auditsService.onDepartmentsChanged.subscribe(departments => {
      this.departments = departments;
    });

    this.placeGroups = [
      {
        name: 'Départements',
        places: this.departments
      },
      {
        name: 'Établissements',
        places: this.sites
      }
    ];
    this.filteredPlaceGroups.next(this.copyPlaceGroups(this.placeGroups));
    if (data && data.action) {
      this.action = data.action;
    }
    if (this.action === 'new-template') {
      this.selectedTemplate = {} as AuditTemplate;
    }
    if (this.action === 'edit-audit') {
      this.audit = data.audit as Audit;
      this.selectedPlace = this.audit.site ? this.audit.site : this.audit.department;
      this.dateParam = moment(this.audit.date);
    }
    this.placeGroupsFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterPlaceGroups();
      });
  }

  submitNewAudit() {
    if (!this.selectedPlace) {
      this.sharedNotificationService.showError('Veuillez sélectionner le site ou departement à auditer');
      return;
    }
    if (!this.dateParam) {
      this.sharedNotificationService.showError('Veuillez indiquer la date de l\'audit');

      return;
    }
    if (!this.selectedTemplate) {
      this.sharedNotificationService.showError('Veuillez choisir un modèle d\'audit dans la liste');
      return;
    }
    const time = moment(this.dateParam).toDate().getTime();
    this.audit.date = time;
    this.audit.title = this.selectedTemplate.name;
    this.audit.report = '';
    this.audit.globalAppreciation = false;
    const department = this.departments.find(d => d.id === this.selectedPlace.id);
    if (department) {
      this.audit.department = this.selectedPlace;
      this.audit.site = null;
    } else {
      this.audit.site = this.selectedPlace;
      this.audit.department = null;
    }
    this.matDialogRef.close({ auditProperties: this.audit, template: this.selectedTemplate });
  }
  submitNewTemplate() {
    if (!this.selectedTemplate || !this.selectedTemplate.name || this.selectedTemplate.name.length < 3) {
      this.sharedNotificationService.showError('Veuillez saisir le nom du template');
      return;
    }
    this.matDialogRef.close({ template: this.selectedTemplate });
  }
  ngOnInit() {
    this.auditsService.onTemplatesChanged.subscribe(data => {
      this.templates = data.filter(t => t.status === 'valid');
    });
    this.breakpointObserver
      .observe(['(min-width: 600px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.smallScreen = false;
        } else {
          this.smallScreen = true;
        }
      });
  }

  filterPlaceGroups() {
    if (!this.placeGroups) {
      return;
    }
    let search = this.placeGroupsFilterCtrl.value;
    const placeGroupsCopy = this.copyPlaceGroups(this.placeGroups);
    if (!search) {
      this.filteredPlaceGroups.next(placeGroupsCopy);
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredPlaceGroups.next(
      placeGroupsCopy.filter(placeGroup => {
        const showPlaceGroup = placeGroup.name.toLowerCase().indexOf(search) > -1;
        if (!showPlaceGroup) {
          placeGroup.places = placeGroup.places.filter(p => p.name.toLowerCase().indexOf(search) > -1);
        }
        return placeGroup.places.length > 0;
      })
    );
  }

  copyPlaceGroups(placeGroups: any[]) {
    const placeGroupsCopy = [];
    placeGroups.forEach(placeGroup => {
      placeGroupsCopy.push({
        name: placeGroup.name,
        places: placeGroup.places.slice()
      });
    });
    return placeGroupsCopy;
  }

  compareFn(value1: any, value2: any): any {
    return value1 && value2 ?
      value1.id === value2.id :
      value1 === value2;
  }

  updateAudit() {
    if (!this.selectedPlace) {
      this.sharedNotificationService.showError('Veuillez sélectionner le site ou departement à auditer');
      return;
    }
    if (!this.dateParam) {
      this.sharedNotificationService.showError('Veuillez indiquer la date de l\'audit');
      return;
    }
    const time = moment(this.dateParam).toDate().getTime();
    this.audit.date = time;
    const department = this.departments.find(d => d.id === this.selectedPlace.id);
    if (department) {
      this.audit.department = this.selectedPlace;
      this.audit.site = null;
    } else {
      this.audit.site = this.selectedPlace;
      this.audit.department = null;
    }
    const auditUpdated = { ...this.audit };
    this.auditsService.updateAudit(auditUpdated).then(() => {
      this.matDialogRef.close();
    });
  }
}
