import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { AuditTemplate } from 'app/main/audit/models/audit-template';
import { AuditMenu } from 'app/main/audit/models/audit-menu';
import { AuditsService } from '../audit.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AuditSection } from 'app/main/audit/models/audit-section';
import { AuditItem } from 'app/main/audit/models/audit-item';
import { PossibleValue } from 'app/main/audit/models/possible-value';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-audit-edit-template',
  templateUrl: './audit-edit-template.component.html',
  styleUrls: ['./audit-edit-template.component.scss'],
  animations: fuseAnimations
})
export class AuditEditTemplateComponent implements OnInit, OnDestroy {

  currentTemplate: AuditTemplate;
  currentStep: number;
  totalMenusCount = 0;
  currentMenu: AuditMenu;
  possibleValues: PossibleValue[] = [];
  animationDirection: 'left' | 'right' | 'none';
  templateProperties: AuditTemplate;
  latestAffectedValue: PossibleValue = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private auditsService: AuditsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseSidebarService: FuseSidebarService) {
    this.animationDirection = 'none';
  }
  setCurrentMenu(menu: AuditMenu, step: number): void {
    this.currentMenu = menu;
    this.animationDirection = this.currentStep < step ? 'left' : 'right';
    this._changeDetectorRef.detectChanges();
    this.currentStep = step;
    if (this.currentMenu.sections) {
      this.currentMenu.sections.forEach(s => {
        if (s.items) {
          s.items.forEach(i => {
            const foundIndex = this.possibleValues.findIndex(p => p.id === i.possibleValues.id);
            if (foundIndex > -1) {
              i.possibleValues = this.possibleValues[foundIndex];
            } else {
              i.possibleValues = this.possibleValues[0];
            }
          });
        }
      });
    }
  }
  pushMenu(): void {
    if (!this.currentTemplate.menus) {
      this.currentTemplate.menus = [];
    }
    const displayOrder = this.currentTemplate.menus.length;
    const menu: AuditMenu = { title: '', displayOrder: displayOrder } as AuditMenu;
    this.currentTemplate.menus.push(menu);
    this.totalMenusCount += 1;
  }
  pushSection(): void {
    if (!this.currentMenu.sections) {
      this.currentMenu.sections = [];
    }
    const displayOrder = this.currentMenu.sections.length;
    const section: AuditSection = { title: '', displayOrder: displayOrder } as AuditSection;
    this.currentMenu.sections.push(section);
  }
  pushItem(section: AuditSection): void {
    if (!section.items) {
      section.items = [];
    }
    if (!this.latestAffectedValue) {
      this.latestAffectedValue = this.possibleValues[0];
    }
    const displayOrder = section.items.length;
    const item: AuditItem = { title: '', displayOrder: displayOrder, possibleValues: this.latestAffectedValue } as AuditItem;
    section.items.push(item);
  }
  possibleValueChanged(values): void {
    console.log(values);
    this.latestAffectedValue = values;
    this.updateTemplateDetails();
  }
  updateTemplateDetails(): void {    
    const newStatus = this.getTemplateStatus();
    if (this.templateProperties.status !== newStatus ) {
      this.templateProperties.status = newStatus;
      this.auditsService.updateTemplateProperties(this.templateProperties);      
    }
    this.auditsService.updateTemplateDetails(this.currentTemplate).then(() => {
      console.log('updated');
    });
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  removeItem(menuIndex, sectionIndex, itemIndex): void {
    this.currentTemplate.menus[menuIndex].sections[sectionIndex].items.splice(itemIndex, 1);
    this.updateTemplateDetails();
  }

  removeSection(menuIndex, sectionIndex): void {
    this.currentTemplate.menus[menuIndex].sections.splice(sectionIndex, 1);
    this.updateTemplateDetails();
  }

  removeMenu(menuIndex): void {
    this.currentTemplate.menus.splice(menuIndex, 1);
    this.updateTemplateDetails();
  }

  checkSectionsTitle(sections: AuditSection[]): boolean {
    let result = false;
    if (!sections || sections.length === 0) {
      return result;
    }
    for (const section of sections) {
      if (section.title.trim() === '') {
        result = true;
        break;
      }
    }
    return result;
  }

  checkSectionsItems(sections: AuditSection[]): boolean {
    let result = false;
    if (!sections || sections.length === 0) {
      return result;
    }
    for (const section of sections) {
      if (!section.items || section.items.length === 0) {
        result = true;
        break;
      }
    }
    return result;
  }

  checkItemsTitle(sections: AuditSection[]): boolean {
    let result = false;
    if (!sections || sections.length === 0) {
      return result;
    }
    for (const section of sections) {
      if (section.items && section.items.length > 0) {
        for (const item of section.items) {
          if (item.title.trim() === '') {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  }

  private getTemplateStatus(): any  {
    if (!this.currentTemplate || !this.currentTemplate.menus || this.currentTemplate.menus.length === 0) {
      return 'invalid';
    }
    let valid = true;
    for (const m of this.currentTemplate.menus) {
      if (!m.title || m.title.trim().length === 0 || !m.sections || m.sections.length === 0) {
        valid = false;
        break;
      }
      for (const s of m.sections) {
        if (!s.title || s.title.trim().length === 0 || !s.items || s.items.length === 0) {
          valid = false;
          break;
        }
        for (const i of s.items) {
          if (!i.title || i.title.trim().length === 0 ) {
            valid = false;
            break;
          }
        }
      }
    }
    return valid ? 'valid' : 'invalid';
  }

  ngOnInit() {
    this.auditsService.onCurrentTemplateChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        this.currentTemplate = data;
        if (this.currentTemplate && this.currentTemplate.menus && this.currentTemplate.menus.length > 0) {
          this.setCurrentMenu(this.currentTemplate.menus[0], 0);
          this.totalMenusCount = this.currentTemplate.menus.length;
        }
        if (this.currentTemplate && this.currentTemplate.id) {
          this.auditsService.getAuditTemplate(this.currentTemplate.id)
            .get()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(result => {
              if (result.exists) {
                this.templateProperties =  {id: result.id, ...result.data()} as AuditTemplate;
              }
            });
        }

      });

    this.auditsService.onPossibleValuesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(values => {
        this.possibleValues = values;
        if (this.possibleValues && this.possibleValues.length > 0) {
          if (!this.latestAffectedValue) {
            this.latestAffectedValue = this.possibleValues[0];
          }
        }
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
