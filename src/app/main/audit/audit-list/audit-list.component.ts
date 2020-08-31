import { AuditTemplate } from '../models/audit-template';
import { AddAuditDialogComponent } from './../dialogs/add-audit-dialog/add-audit-dialog.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AuditsService } from '../audit.service';
import { MatDialog } from '@angular/material/dialog';
import { Audit } from 'app/main/audit/models/audit';
import { SiteType } from 'app/main/sites/models/siteType';
import { AppService } from 'app/app.service';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { takeUntil } from 'rxjs/operators';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'academy-courses',
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.scss'],
  animations: fuseAnimations
})
export class AuditListComponent implements OnInit, OnDestroy {

  searchTerm: string;
  audits: Audit[] = [];
  auditsDrafts: any[] = [];
  filteredAudits: Audit[] = [];
  siteTypes: SiteType[] = [];
  currentSiteType: SiteType;
  dialogRef: any;
  template: AuditTemplate = null;
  poleId: string;
  habilitation: Habilitation = new Habilitation(0);
  private unsubscribeAll: Subject<any>;
  constructor(
    private auditsService: AuditsService,
    private appService: AppService,
    private matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.poleId = params.poleId;
    });
    this.searchTerm = '';
    this.unsubscribeAll = new Subject();

  }
  popup() {
    this.dialogRef = this.matDialog.open(AddAuditDialogComponent, {
      panelClass: 'add-audit-dialog',
      data: {
        action: 'new-audit',
      }
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (response) {
          const auditProperties = response.auditProperties as Audit;
          auditProperties.poleId = this.poleId;
          const template = response.template as AuditTemplate;
          this.auditsService.addAuditAsDraft(auditProperties, template);
        }
      });
  }
  ngOnInit(): void {
    this.auditsService.onAuditsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.audits = this.filteredAudits = data;
      });
    this.auditsService.onAuditsDraftsChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.auditsDrafts = data;
      });
    this.auditsService.onSiteTypesChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(data => {
        this.siteTypes = data;
      });
    this.auditsService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
        if (this.habilitation.isAdmin()) {
          this.appService.onShowConfigButtonChanged.next(true);
          this.appService.onConfigurationUrlChanged.next('/audits-administration/' + this.poleId);
        }
      });

  }
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
    this.appService.setConfigButtonParameters(false, null);
  }

  filterAuditsBySiteType(): void {
    if (this.currentSiteType.id === -1) {
      this.filteredAudits = this.audits;
    }
    else {
      const temp = this.audits.filter(audit => {
        let itMatchs = false;
        audit.site.types.forEach(t => {
          itMatchs = t.id === this.currentSiteType.id;
        });
        return itMatchs;
      });
      this.filteredAudits = [...temp];
    }
  }


  filterCoursesByTerm(): void {
    const searchTerm = this.searchTerm.toLowerCase();
  }
}
