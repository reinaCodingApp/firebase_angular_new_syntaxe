import { AuditsService } from './../audit.service';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Audit } from 'app/main/audit/models/audit';
import { AuditMenu } from 'app/main/audit/models/audit-menu';
import { AuditItem } from 'app/main/audit/models/audit-item';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
    selector     : 'audit-detail',
    templateUrl  : './audit-detail.component.html',
    styleUrls    : ['./audit-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuditDetailComponent implements OnInit, OnDestroy, AfterViewInit
{
    animationDirection: 'left' | 'right' | 'none';
    currentStep: number;
    currentAudit: Audit = null;
    currentMenu: AuditMenu = new AuditMenu();
    totalMenusCount = 0;
    habilitation: Habilitation = new Habilitation(0);

    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    // Private
    private unsubscribeAll: Subject<any>;
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseSidebarService: FuseSidebarService,
        private auditsService: AuditsService
    )
    {
        this.animationDirection = 'none';
        this.currentStep = 0;
        this.unsubscribeAll = new Subject();
        this.currentAudit = null;
        this.totalMenusCount = 0;
        this.currentMenu = null;
    }
    loadMenuSections(menu: AuditMenu, step: number) {
      this.currentMenu = menu;
      this.auditsService.getAuditSectionsAndItems(menu.id);
      this.animationDirection = this.currentStep < step ? 'left' : 'right';
      this._changeDetectorRef.detectChanges();
      this.currentStep = step;
    }
    updateEffectiveValue(item: AuditItem, value: string) {
      if (this.habilitation.canEdit() === true) {
        this.auditsService.updateEffectiveValue(item, value).then(result => {
          console.log('updated', result);
        });
      }
    }
    updateAuditPrperties() {
      const auditProperties = {...this.currentAudit};
      auditProperties.menus = [];
      this.auditsService.updateAuditPrperties(auditProperties).then(() => {
        console.log('audit updated');
      });
    }
    gotoNextStep(): void
    {
        if ( this.currentStep === this.totalMenusCount - 1 )
        {
            return;
        }
        const step = this.currentStep + 1;
        this.loadMenuSections(this.currentAudit.menus[step], step);
    }
    gotoPreviousStep(): void
    {
        if ( this.currentStep === 0 )
        {
            return;
        }
        const step = this.currentStep - 1;
        this.loadMenuSections(this.currentAudit.menus[step], step);
    }
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    ngOnInit(): void
    {
      this.auditsService.onCurrentAuditChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(current => {
          this.currentAudit = current;
          if (this.currentAudit && this.currentAudit.menus && this.currentAudit.menus.length > 0) {
            this.currentMenu = this.currentAudit.menus[0];
            this.auditsService.getAuditSectionsAndItems(this.currentMenu.id);
            this.currentAudit.menus.push({id: '', title: 'Rapport'} as AuditMenu);
            this.totalMenusCount = this.currentAudit.menus.length;
          }
        });
      this.auditsService.onSectionsChanged.subscribe(sections => {
            if (sections) {
              this.currentMenu.sections = sections;
            }
        });
      this.auditsService.onHabilitationLoaded
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(habilitationResult => {
        this.habilitation = habilitationResult;
      });
    }

    ngAfterViewInit(): void
    {

    }

    ngOnDestroy(): void
    {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
