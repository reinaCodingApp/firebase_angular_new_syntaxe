import { Employee } from '../../../../common/models/employee';
import { AuditsService } from './../../audit.service';
import { AuditTemplate } from '../../models/audit-template';
import { Site } from 'app/common/models/site';
import { Audit } from '../../models/audit';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SiteType } from 'app/main/sites/models/siteType';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';

@Component({
  selector: 'add-audit-dialog',
  templateUrl: './add-audit-dialog.component.html',
  styleUrls: ['./add-audit-dialog.component.scss']
})
export class AddAuditDialogComponent implements OnInit {
  audit: Audit = new Audit();
  sites: Site[] = [];
  dateParam: any;
  templates: AuditTemplate[] = [];
  filtredTemplates: AuditTemplate[] = [];
  selectedTemplate: AuditTemplate = null;
  action = '';
  siteTypes: SiteType[] = [];
  constructor(private sharedNotificationService: SharedNotificationService,
    public matDialogRef: MatDialogRef<AddAuditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auditsService: AuditsService) {
    if (data && data.action) {
      this.action = data.action;
    }
    if (this.action === 'new-template') {
      this.selectedTemplate = {} as AuditTemplate;
    }

  }

  submitNewAudit() {
    if (!this.audit.site) {
      this.sharedNotificationService.showError('Veuillez sélectionner le site à auditer');
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
    this.matDialogRef.close({ auditProperties: this.audit, template: this.selectedTemplate });
  }
  submitNewTemplate() {
    if (!this.selectedTemplate || !this.selectedTemplate.name || this.selectedTemplate.name.length < 3) {
      this.sharedNotificationService.showError('Veuillez saisir le nom du template');
      return;
    }
    if (!this.selectedTemplate.siteTypes || this.selectedTemplate.siteTypes.length === 0) {
      this.sharedNotificationService.showError('Veuillez choisir un ou plusieur type de sites');
      return;
    }
    this.matDialogRef.close({ template: this.selectedTemplate });
  }
  ngOnInit() {
    this.auditsService.onTemplatesChanged.subscribe(data => {
      this.templates = data.filter(t => t.status === 'valid');
    });
    this.auditsService.onSitesChanged.subscribe(data => {
      this.sites = data;
    });
    this.auditsService.onSiteTypesChanged.subscribe(data => {
      this.siteTypes = data;
    });
  }

  checkTempaltesToDispaly(selectedSite): void {
    const filtredTemplates: AuditTemplate[] = [];
    this.templates.forEach(template => {
      template.siteTypes.forEach(siteType => {
        for (const selectedSiteType of selectedSite.value.types) {
          if (selectedSiteType.id === siteType.id) {
            filtredTemplates.push(template);
          }
        }
      });
    });
    this.filtredTemplates = filtredTemplates;
  }

}
