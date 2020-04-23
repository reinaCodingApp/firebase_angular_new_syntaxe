import { AuditMenu } from './models/audit-menu';
import { AuditItem } from './models/audit-item';
import { AuditTemplate } from './models/audit-template';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { firestoreCollections } from 'app/data/firestoreCollections';

import { SiteType } from 'app/main/sites/models/siteType';
import { Audit } from 'app/main/audit/models/audit';
import { AuditSection } from 'app/main/audit/models/audit-section';
import { AngularFireAuth } from '@angular/fire/auth';
import { PossibleValue } from 'app/main/audit/models/possible-value';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { take } from 'rxjs/operators';
import { CommonService } from 'app/common/services/common.service';
import { SiteWithTypes } from 'app/common/models/siteWithTypes';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AccessRightsService } from '../access-rights/access-rights.service';
import { AppService } from 'app/app.service';

@Injectable()
export class AuditsService implements Resolve<any>
{
  onTemplatesChanged: BehaviorSubject<AuditTemplate[]>;
  onCurrentTemplateChanged: BehaviorSubject<AuditTemplate>;
  onAuditsChanged: BehaviorSubject<Audit[]>;
  onCurrentAuditChanged: BehaviorSubject<Audit>;
  onSitesChanged: BehaviorSubject<SiteWithTypes[]>;
  onSiteTypesChanged: BehaviorSubject<SiteType[]>;
  onPossibleValuesChanged: BehaviorSubject<PossibleValue[]>;
  onSectionsChanged: BehaviorSubject<AuditSection[]>;
  currentAudit: Audit;
  sites: SiteWithTypes[] = [];
  sitesTypes: SiteType[] = [];
  connectedUser: any;
  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.audits;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private commonService: CommonService,
    private appService: AppService,
    private accessRightsService: AccessRightsService) {
    this.onTemplatesChanged = new BehaviorSubject([]);
    this.onCurrentTemplateChanged = new BehaviorSubject(null);
    this.onAuditsChanged = new BehaviorSubject([]);
    this.onCurrentAuditChanged = new BehaviorSubject(null);
    this.onSiteTypesChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onSectionsChanged = new BehaviorSubject(null);
    this.onPossibleValuesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                if (route.params.auditId) {
                  this.getAuditMenus(route.params.auditId);
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                } else if (route.params.templateId) {
                  if (!habilitation.isAdmin()) {
                    this.router.navigateByUrl('/home');
                    resolve();
                  }
                  this.getSiteTypes();
                  this.getPossibleValues();
                  this.getTemplateDetails(route.params.templateId);
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                } else {
                  const routeURL = route.url.toString();
                  if (routeURL.indexOf('administration') !== -1) {
                    if (!habilitation.isAdmin()) {
                      this.router.navigateByUrl('/home');
                      resolve();
                    }
                    this.getSiteTypes();
                    this.getPossibleValues();
                    this.getTemplates();
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }
                }
                this.getAudits();
                this.getSiteTypes();
                this.getSites();
                this.getTemplates();
                this.getPossibleValues();
                this.onHabilitationLoaded.next(habilitation);
                resolve();
              }
            }, (err) => {
              reject(err);
            });
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getAudits() {
    this.angularFirestore.collection(firestoreCollections.audits).snapshotChanges().subscribe(data => {
      const audits = data.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() } as Audit));
      this.onAuditsChanged.next(audits);
    });
  }
  getAuditTemplate(uid: string) {
    return this.angularFirestore.collection(firestoreCollections.auditTemplates).doc(uid);
  }
  getAuditMenus(auditId: string) {
    this.angularFirestore.collection(firestoreCollections.audits).doc(auditId)
      .get()
      .toPromise()
      .then(audit => {
        console.log('audit ', audit);
        if (audit.exists) {
          this.currentAudit = { id: audit.id, ...audit.data() } as Audit;
          this.angularFirestore.collection(firestoreCollections.auditMenus, query => query.where('auditId', '==', this.currentAudit.id))
            .get()
            .toPromise()
            .then(menus => {
              this.currentAudit.menus = menus.docs.map(d => ({ id: d.id, ...d.data() } as AuditMenu))
                .sort((a, b) => a.displayOrder - b.displayOrder);
              console.log('menus', this.currentAudit.menus);
              this.onCurrentAuditChanged.next(this.currentAudit);
            });
        }
      });
  }
  getAuditSectionsAndItems(menuId: string) {
    this.angularFirestore.collection(firestoreCollections.auditSections, query => query.where('menuId', '==', menuId))
      .get()
      .subscribe(result => {
        const sections = result.docs.map(d => ({ id: d.id, ...d.data() } as AuditSection))
          .sort((a, b) => a.displayOrder - b.displayOrder);
        this.angularFirestore.collection(firestoreCollections.auditItems, query => query.where('menuId', '==', menuId))
          .get()
          .subscribe(items => {
            const menuItems = items.docs.map(d => ({ id: d.id, ...d.data() } as AuditItem));
            sections.forEach(s => {
              menuItems.forEach(i => {
                if (s.id === i.sectionId) {
                  if (!s.items) {
                    s.items = [];
                  }
                  s.items.push(i);
                }
              });
              s.items = s.items.sort((a, b) => a.displayOrder - b.displayOrder);
            });
            this.onSectionsChanged.next(sections);
            console.log('sections', sections);
          });

      });
  }
  updateEffectiveValue(item: AuditItem, value: string) {
    item.effectiveValue = value;
    return this.angularFirestore.collection(firestoreCollections.auditItems).doc(item.id).set(item);
  }
  getSiteTypes() {
    this.commonService.getSiteTypes().then(sitesTypes => {
      this.sitesTypes = sitesTypes;
      this.onSiteTypesChanged.next(sitesTypes);
    });
  }
  getSites() {
    this.commonService.getSites().then(sites => {
      this.sites = sites;
      this.onSitesChanged.next(sites);
    });
    this.onSitesChanged.next(this.sites);
  }

  getPossibleValues() {
    this.angularFirestore.collection(firestoreCollections.auditPossibleValues)
      .get()
      .subscribe(data => {
        const values = data.docs.map(item => ({ id: item.id, ...item.data() } as PossibleValue));
        this.onPossibleValuesChanged.next(values);
      });
  }

  getTemplates() {
    this.angularFirestore.collection(firestoreCollections.auditTemplates).snapshotChanges().subscribe(templates => {
      const auditTemplates: AuditTemplate[] = templates.map(t => ({ id: t.payload.doc.id, ...t.payload.doc.data() } as AuditTemplate));
      this.onTemplatesChanged.next(auditTemplates);
    });
  }
  getTemplateDetails(templateId: string) {
    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(templateId)
      .get().subscribe(data => {
        if (data.exists) {
          const template = data.data() as AuditTemplate;
          template.id = templateId;
          this.onCurrentTemplateChanged.next(template);
        } else {
          this.onCurrentTemplateChanged.next(null);
        }

      });
  }
  addAudit(auditProperties: Audit, template: AuditTemplate) {

    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(template.id)
      .get().subscribe(data => {
        if (data.exists) {
          const templateDetails = data.data() as AuditTemplate;
          const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
          const newAudit: Audit = {} as Audit;
          newAudit.date = auditProperties.date;
          newAudit.title = auditProperties.title;
          newAudit.site = auditProperties.site;
          newAudit.isSealed = false,
            newAudit.templateId = template.id,
            newAudit.report = '';
          newAudit.responsible = this.connectedUser;
          const auditDocument = this.angularFirestore.collection(firestoreCollections.audits).ref.doc();
          writeBatch.set(auditDocument, newAudit);
          templateDetails.menus.forEach(m => {
            const newMenu = { title: m.title, auditId: auditDocument.id, displayOrder: m.displayOrder };
            const menuDoc = this.angularFirestore.collection(firestoreCollections.auditMenus).ref.doc();
            writeBatch.set(menuDoc, newMenu);
            m.sections.forEach(s => {
              const newSection = { title: s.title, menuId: menuDoc.id, auditId: auditDocument.id, displayOrder: s.displayOrder };
              const sectionDoc = this.angularFirestore.collection(firestoreCollections.auditSections).ref.doc();
              writeBatch.set(sectionDoc, newSection);
              if (s.items) {
                s.items.forEach(i => {
                  // effectiveValue not set
                  const newItem = {
                    title: i.title, displayOrder: i.displayOrder, sectionId: sectionDoc.id,
                    auditId: auditDocument.id, menuId: menuDoc.id, possibleValues: i.possibleValues
                  };
                  const itemDocument = this.angularFirestore.collection(firestoreCollections.auditItems).ref.doc();
                  writeBatch.set(itemDocument, newItem);
                });
              }
            });
          });
          writeBatch.commit();

        }
      });
  }
  updateAuditPrperties(auditProperties: Audit) {
    return this.angularFirestore.collection(firestoreCollections.audits).doc(auditProperties.id).set(auditProperties);
  }
  addTemplate(template: AuditTemplate): Promise<void> {
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const templateDocument = this.angularFirestore.collection(firestoreCollections.auditTemplates).ref.doc();
    template.status = 'invalid';
    writeBatch.set(templateDocument, template);
    const templateDetailsDocument = this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(templateDocument.id);
    writeBatch.set(templateDetailsDocument.ref, {});
    return writeBatch.commit();
  }
  updateTemplateDetails(template: AuditTemplate): Promise<void> {
    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(template.id).set(template);
  }
  updateTemplateProperties(template: AuditTemplate): Promise<void> {
    return this.angularFirestore.collection(firestoreCollections.auditTemplates).doc(template.id).set(template);
  }
  deleteTemplate(template: AuditTemplate): Promise<void> {
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const templateDocument = this.angularFirestore.collection(firestoreCollections.auditTemplates).doc(template.id);
    writeBatch.delete(templateDocument.ref);
    const templateDetailsDocument = this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(template.id);
    writeBatch.delete(templateDetailsDocument.ref);
    return writeBatch.commit();
  }

  getTemplateMenu(template: AuditTemplate): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(template.id).get();
  }

  // possible values

  deletePossibleValue(possibleValue: PossibleValue): Promise<any> {
    return this.angularFirestore.collection(firestoreCollections.auditPossibleValues).doc(possibleValue.id).delete();
  }

  updatePossibleValue(possibleValue: PossibleValue): void {
    const newPossibleValue = { name: possibleValue.name, index: possibleValue.index, values: possibleValue.values } as PossibleValue;
    this.angularFirestore.collection(firestoreCollections.auditPossibleValues).doc(possibleValue.id).set(newPossibleValue);
  }

  addPossibleValue(possibleValue: PossibleValue): Promise<any> {
    const newPossibleValue = { name: possibleValue.name, index: possibleValue.index, values: possibleValue.values } as PossibleValue;
    return this.angularFirestore.collection(firestoreCollections.auditPossibleValues).add(newPossibleValue);
  }

}
