import { BehaviorSubject } from 'rxjs';
import { AppService } from 'app/app.service';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppVersion, VersionDetail } from './models/app-version';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService implements Resolve<any> {
  currentVersion: AppVersion;
  isRoot: boolean;
  appVersions: AppVersion[] = null;
  onAppVersionsChanged: BehaviorSubject<AppVersion[]>;
  constructor(
    private angularFirestore: AngularFirestore,
    private appService: AppService,
    private router: Router) {
    this.appService.onAppVersionChanged.subscribe(response => {
      if (response) {
        this.currentVersion = response;
      }
    });
    this.onAppVersionsChanged = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.isRoot = user.customClaims.isRoot;
          this.loadVersions().then(() => {
            resolve();
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

  loadVersions(): Promise<AppVersion[]> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.appVersions,
        query => {
          if (this.isRoot) {
            return query.orderBy('versionCode', 'desc');
          } else {
            return query.where('published', '==', true)
                        .orderBy('versionCode', 'desc');
          }
        }).snapshotChanges()
        .subscribe(response => {
          this.appVersions = response.map(i => ({ id: i.payload.doc.id, ...i.payload.doc.data() as {} } as AppVersion));
          this.onAppVersionsChanged.next(this.appVersions);
          resolve(this.appVersions);
        }, reject);
    });

  }
  addVersion(type: 'major' | 'minor' | 'patch', details: VersionDetail): Promise<any> {
    const newVersion = this.generateNewVersion(type, this.currentVersion);
    newVersion.details = details;
    return this.angularFirestore.collection(firestoreCollections.appVersions).add(newVersion);
  }

  updateVersion(versionId: string, details: VersionDetail): Promise<any> {
    const updatedVersion = { details: details } as AppVersion;
    const versionDocument = this.angularFirestore.collection(firestoreCollections.appVersions).doc(versionId).ref;
    return versionDocument.update(updatedVersion);
  }

  generateNewVersion(type: 'major' | 'minor' | 'patch', baseVersion): AppVersion {
    const newVersion: AppVersion = {} as AppVersion;
    newVersion.date = new Date().getTime();
    newVersion.versionCode = baseVersion.versionCode + 1;
    if (type === 'major') {
      newVersion.major = baseVersion.major + 1;
      newVersion.minor = 0;
      newVersion.patch = 0;
    } else if (type === 'minor') {
      newVersion.major = baseVersion.major;
      newVersion.minor = baseVersion.minor + 1;
      newVersion.patch = 0;
    } else if (type === 'patch') {
      newVersion.major = baseVersion.major;
      newVersion.minor = baseVersion.minor;
      newVersion.patch = baseVersion.patch + 1;
    }
    newVersion.versionName = 'Version ' + newVersion.major + '.' + newVersion.minor + '.' + newVersion.patch;
    newVersion.vName = 'v' + newVersion.major + '.' + newVersion.minor + '.' + newVersion.patch;
    return newVersion;
  }

  publishVersion(version: AppVersion): Promise<any> {
    const publishedVersion = { published: true } as AppVersion;
    const versionDocument = this.angularFirestore.collection(firestoreCollections.appVersions).doc(version.id).ref;
    return versionDocument.update(publishedVersion);
  }
}
