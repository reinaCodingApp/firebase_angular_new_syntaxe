import { BehaviorSubject } from 'rxjs';
import { AppService } from 'app/app.service';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppVersion, VersionDetail } from './models/app-version';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChangelogService implements Resolve<any> {
  currentVersion: AppVersion;
  appVersions: AppVersion[] = null;
  onAppVersionsChanged: BehaviorSubject<AppVersion[]>;
  constructor(private angularFirestore: AngularFirestore, private appService: AppService) {
    this.appService.onAppVersionChanged.subscribe(response => {
      if (response) {
        this.currentVersion = response;
      }
    });
    this.onAppVersionsChanged = new BehaviorSubject(null);
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.loadVersions();
  }

  loadVersions(): Promise<AppVersion[]> {
    return new Promise((resolve, reject) => {
      this.angularFirestore.collection(firestoreCollections.appVersions,
        query => query.orderBy('versionCode', 'desc')).snapshotChanges()
      .subscribe(response => {
        this.appVersions = response.map(i => (i.payload.doc.data() as AppVersion));
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
}
