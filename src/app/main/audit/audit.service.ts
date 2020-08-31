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
import { take, finalize } from 'rxjs/operators';
import { CommonService } from 'app/common/services/common.service';
import { SiteWithTypes } from 'app/common/models/siteWithTypes';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AccessRightsService } from '../access-rights/access-rights.service';
import { AppService } from 'app/app.service';
import { AuditPole } from './models/audit-pole';
import { MainTools } from 'app/common/tools/main-tools';
import { AngularFireStorage } from '@angular/fire/storage';
import { Attachment } from 'app/common/models/attachment';
import { Department } from 'app/common/models/department';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuditsService implements Resolve<any>
{
  private GENERATE_AUDIT_PDF_URI = 'audit/generate_pdf';

  onTemplatesChanged: BehaviorSubject<AuditTemplate[]>;
  onAuditPolesChanged: BehaviorSubject<AuditPole[]>;
  onCurrentTemplateChanged: BehaviorSubject<AuditTemplate>;
  onAuditsChanged: BehaviorSubject<Audit[]>;
  onAuditsDraftsChanged: BehaviorSubject<Audit[]>;
  onCurrentAuditChanged: BehaviorSubject<Audit>;
  onSitesChanged: BehaviorSubject<SiteWithTypes[]>;
  onDepartmentsChanged: BehaviorSubject<Department[]>;
  onSiteTypesChanged: BehaviorSubject<SiteType[]>;
  onPossibleValuesChanged: BehaviorSubject<PossibleValue[]>;
  onSectionsChanged: BehaviorSubject<AuditSection[]>;
  onAttachmentUploaded: BehaviorSubject<Attachment>;
  currentAudit: Audit;
  sites: SiteWithTypes[] = [];
  sitesTypes: SiteType[] = [];
  connectedUser: any;
  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.audits;

  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private commonService: CommonService,
    private appService: AppService,
    private httpClient: HttpClient,
    private accessRightsService: AccessRightsService) {
    this.onTemplatesChanged = new BehaviorSubject([]);
    this.onAuditPolesChanged = new BehaviorSubject([]);
    this.onCurrentTemplateChanged = new BehaviorSubject(null);
    this.onAuditsChanged = new BehaviorSubject([]);
    this.onAuditsDraftsChanged = new BehaviorSubject([]);
    this.onCurrentAuditChanged = new BehaviorSubject(null);
    this.onSiteTypesChanged = new BehaviorSubject([]);
    this.onSitesChanged = new BehaviorSubject([]);
    this.onDepartmentsChanged = new BehaviorSubject([]);
    this.onSectionsChanged = new BehaviorSubject(null);
    this.onPossibleValuesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onAttachmentUploaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.connectedUser = user;
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                if (route.params.auditId) {
                  let isDraft = false;
                  if (route.queryParams.isDraft) {
                    isDraft = route.queryParams.isDraft === 'true' ? true : false;
                  }
                  this.getAuditMenus(route.params.auditId, isDraft);
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                } else if (route.params.templateId) {
                  if (!habilitation.isAdmin()) {
                    this.router.navigateByUrl('/home');
                    resolve();
                  }
                  this.getPossibleValues();
                  this.getTemplateDetails(route.params.templateId);
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                } else {
                  const routeURL = route.url.toString();
                  if (routeURL.indexOf('audits-administration') !== -1) {
                    if (!habilitation.isAdmin()) {
                      this.router.navigateByUrl('/home');
                      resolve();
                    }
                    this.getPossibleValues();
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }
                  if (routeURL.indexOf('audit-poles') !== -1) {
                    this.getAuditPoles(habilitation);
                    this.onHabilitationLoaded.next(habilitation);
                    resolve();
                  }

                  if (routeURL.indexOf('audits') !== -1) {
                    if (route.params.poleId) {
                      this.getTemplates(route.params.poleId);
                      this.getAudits(route.params.poleId);
                      this.getAuditsDrafts(route.params.poleId);
                      this.getSites();
                      this.getDepartments();
                      this.getPossibleValues();
                      this.onHabilitationLoaded.next(habilitation);
                      resolve();
                    }
                  }
                  resolve();
                }
              }
            }, (err) => {
              reject(err);
            });
        } else {
          this.router.navigate(['login']);
          resolve();
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getAudits(poleId: string) {
    this.angularFirestore.collection(firestoreCollections.audits,
      query => query.where('poleId', '==', poleId)
        .orderBy('date', 'desc'))
      .snapshotChanges().subscribe(data => {
        const audits = data.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data()  as {}} as Audit));
        this.onAuditsChanged.next(audits);
      });
  }
  getAuditsDrafts(poleId: string) {
    console.log('poleId', poleId);
    console.log('uid', this.connectedUser.uid);
    this.angularFirestore.collection(firestoreCollections.auditsDrafts,
      query => query.where('ownerId', '==', this.connectedUser.uid)
        .where('poleId', '==', poleId))
      .snapshotChanges()
      .subscribe(data => {
        const audits = data.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() as {} } as Audit));
        this.onAuditsDraftsChanged.next(audits);
      });
  }
  getAuditTemplate(uid: string) {
    return this.angularFirestore.collection(firestoreCollections.auditTemplates).doc(uid);
  }
  getAuditMenus(auditId: string, isDraft = false) {
    const auditsCollection = isDraft ? firestoreCollections.auditsDrafts : firestoreCollections.audits;
    this.angularFirestore.collection(auditsCollection).doc(auditId)
      .get()
      .toPromise()
      .then(audit => {
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
        } else {
          this.router.navigateByUrl('/audit-poles');
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

  updateNonConformComment(item: AuditItem) {
    return this.angularFirestore.collection(firestoreCollections.auditItems).doc(item.id).set(item);
  }

  getSites() {
    this.commonService.getSites().then(sites => {
      this.sites = sites;
      this.onSitesChanged.next(sites);
    });
  }

  getDepartments() {
    this.commonService.getDepartments(true).then(departments => {
      this.onDepartmentsChanged.next(departments);
    });
  }

  getPossibleValues() {
    this.angularFirestore.collection(firestoreCollections.auditPossibleValues)
      .get()
      .subscribe(data => {
        const values = data.docs.map(item => ({ id: item.id, ...item.data() } as PossibleValue));
        this.onPossibleValuesChanged.next(values);
      });
  }

  getTemplates(poleId: string) {
    this.angularFirestore.collection(firestoreCollections.auditTemplates, query => query.where('poleId', '==', poleId)).snapshotChanges().subscribe(templates => {
      const auditTemplates: AuditTemplate[] = templates.map(t => ({ id: t.payload.doc.id, ...t.payload.doc.data() as {} } as AuditTemplate));
      this.onTemplatesChanged.next(auditTemplates);
    });
  }
  getTemplateDetails(templateId: string) {
    let poleId: string;
    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(templateId)
      .get().subscribe(async data => {
        if (data.exists) {
          await this.angularFirestore.collection(firestoreCollections.auditTemplates).doc(templateId)
            .get().subscribe(dataTemplates => {
              if (dataTemplates.exists) {
                const auditTemplates = dataTemplates.data() as AuditTemplate;
                poleId = auditTemplates.poleId;
                const template = data.data() as AuditTemplate;
                template.id = templateId;
                template.poleId = poleId;
                this.onCurrentTemplateChanged.next(template);
              } else {
                this.onCurrentTemplateChanged.next(null);
              }
            });
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
          newAudit.responsible = {
            displayName: this.connectedUser.displayName,
            email: this.connectedUser.email,
            uid: this.connectedUser.uid
          };
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
    return this.angularFirestore.collection(firestoreCollections.auditsDrafts).doc(auditProperties.id).set(auditProperties);
  }

  updateAudit(audit: Audit) {
    const auditToUpdate = { date: audit.date, department: audit.department, site: audit.site };
    return this.angularFirestore.collection(firestoreCollections.auditsDrafts).doc(audit.id).update(auditToUpdate);
  }

  updateAuditMenu(auditMenu: AuditMenu) {
    const auditMenuToUpdate = { report: auditMenu.report };
    return this.angularFirestore.collection(firestoreCollections.auditMenus).doc(auditMenu.id).update(auditMenuToUpdate);
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

  getAuditPoles(habilitation: Habilitation): void {
    this.angularFirestore.collection(firestoreCollections.auditPoles)
      .get()
      .subscribe(data => {
        const poles = data.docs.map(item => ({ uid: item.id, ...item.data() } as AuditPole));
        if (habilitation.isSuperAdmin()) {
          this.onAuditPolesChanged.next(poles);
        } else {
          const polesToDisplay = poles.filter(p => p.members.some(member => member.uid === this.connectedUser.uid));
          this.onAuditPolesChanged.next(polesToDisplay);
        }
      });
  }

  addAuditAsDraft(auditProperties: Audit, template: AuditTemplate): any {
    return this.angularFirestore.collection(firestoreCollections.auditTemplateDetails).doc(template.id)
      .get().subscribe(data => {
        console.log('data', data);
        if (data.exists) {
          const templateDetails = data.data() as AuditTemplate;
          const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
          const newAudit: Audit = {} as Audit;
          newAudit.date = auditProperties.date;
          newAudit.title = auditProperties.title;
          newAudit.site = auditProperties.site;
          newAudit.department = auditProperties.department;
          newAudit.isSealed = false,
            newAudit.templateId = template.id,
            newAudit.report = '';
          newAudit.responsible = {
            displayName: this.connectedUser.displayName,
            email: this.connectedUser.email,
            uid: this.connectedUser.uid
          };
          newAudit.poleId = auditProperties.poleId;
          newAudit.ownerId = this.connectedUser.uid;
          newAudit.attachments = auditProperties.attachments;
          newAudit.globalAppreciation = auditProperties.globalAppreciation;
          const auditDocument = this.angularFirestore.collection(firestoreCollections.auditsDrafts).ref.doc();
          console.log(auditDocument);
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

  saveAudit(audit: Audit) {
    return this.angularFirestore.collection(firestoreCollections.auditsDrafts).doc(audit.id)
      .get().subscribe(data => {
        if (data.exists) {
          const auditToAdd = data.data() as Audit;
          const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
          const doc = this.angularFirestore.collection(firestoreCollections.auditsDrafts).doc(audit.id);
          writeBatch.delete(doc.ref);
          const auditDocument = this.angularFirestore.collection(firestoreCollections.audits).ref.doc(audit.id);
          writeBatch.set(auditDocument, auditToAdd);
          writeBatch.commit();
          this.router.navigateByUrl(`/audits/${audit.poleId}`);
        }
      });

  }

  deleteAudit(audit: Audit) {
    const writeBatch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
    const auditDocument = this.angularFirestore.collection(firestoreCollections.auditsDrafts).doc(audit.id);
    writeBatch.delete(auditDocument.ref);
    this.deleteFromCollection(audit, firestoreCollections.auditMenus);
    this.deleteFromCollection(audit, firestoreCollections.auditItems);
    this.deleteFromCollection(audit, firestoreCollections.auditSections);
    return writeBatch.commit();
  }

  storeAttachment(file: File): Observable<number> {
    const filePath = file.name;
    const size = MainTools.getFileSizeToString(file.size);
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          const attachemnt = { url: downloadURL, fileName: file.name, size: size } as Attachment;
          this.onAttachmentUploaded.next(attachemnt);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  async getFullAudit(auditId: string, isDraft: boolean = false): Promise<Audit> {
    const auditsCollection = isDraft ? firestoreCollections.auditsDrafts : firestoreCollections.audits;
    const getAudit = (): Promise<Audit> => new Promise((resolve, reject) => {
      this.angularFirestore.collection(auditsCollection).doc(auditId)
        .get()
        .toPromise()
        .then(audit => {
          if (audit.exists) {
            this.currentAudit = { id: audit.id, ...audit.data() } as Audit;
          }
          resolve(this.currentAudit);
        });
    });
    const getAuditMenus = (): Promise<AuditMenu[]> => new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.auditMenus, query => query.where('auditId', '==', this.currentAudit.id))
        .get()
        .toPromise()
        .then(result => {
          const auditMenus = result.docs.map(d => ({ id: d.id, ...d.data() } as AuditMenu))
            .sort((a, b) => a.displayOrder - b.displayOrder);
          resolve(auditMenus);
        }).catch((err) => {
          reject(err);
        });
    });
    const getAuditSections = (menuId: string): Promise<AuditSection[]> => new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.auditSections, query => query.where('menuId', '==', menuId))
        .get()
        .subscribe(result => {
          const sections = result.docs.map(d => ({ id: d.id, ...d.data() } as AuditSection))
            .sort((a, b) => a.displayOrder - b.displayOrder);
          resolve(sections);
        }, err => {
          reject();
          console.log(err);
        });
    });
    const getAuditItems = (menuId: string): Promise<AuditItem[]> => new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.auditItems, query => query.where('menuId', '==', menuId))
        .get()
        .subscribe(items => {
          const menuItems = items.docs.map(d => ({ id: d.id, ...d.data() } as AuditItem));
          resolve(menuItems);
        });
    });
    const audit = await getAudit();
    const menus = await getAuditMenus();
    audit.menus = menus;
    for await (const menu of audit.menus) {
      const sections = await getAuditSections(menu.id);
      const menuItems = await getAuditItems(menu.id);
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
      menu.sections = sections;
    }
    return audit;
  }

  updateAuditPoleMembers(pole: AuditPole) {
    const updatedPole = { members: pole.members } as AuditPole;
    return this.angularFirestore.collection(firestoreCollections.auditPoles).doc(pole.uid).update(updatedPole);
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

  generateAuditPDF(auditToPrint: any): any {
    const url = `${BASE_URL}${this.GENERATE_AUDIT_PDF_URI}`;
    return this.httpClient.post<any>(url, auditToPrint, { responseType: 'blob' as 'json' });
  }

  getAuditItems(aduitId: string): Promise<AuditItem[]> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.auditItems, query => query.where('auditId', '==', aduitId))
        .get()
        .subscribe(items => {
          const menuItems = items.docs.map(d => ({ id: d.id, ...d.data() } as AuditItem));
          resolve(menuItems);
        });
    });
  }

  private deleteFromCollection(audit: Audit, collectionName: string) {
    this.angularFirestore.collection(collectionName, query => query.where('auditId', '==', audit.id))
      .get().toPromise()
      .then((querySnapshot) => {
        const batch: firebase.firestore.WriteBatch = this.angularFirestore.firestore.batch();
        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });
        return batch.commit();
      }).then(() => {
        console.log(`delete completed for ${collectionName}`);
      });
  }
}
