import { ChangelogService } from './../../changelog.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AppVersion, VersionDetail } from '../../models/app-version';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-version-dialog',
  templateUrl: './add-version-dialog.component.html',
  styleUrls: ['./add-version-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddVersionDialogComponent implements OnInit {
  new = '';
  improvments = '';
  fixes = '';
  versionType: 'major' | 'minor' | 'patch' = 'minor';
  constructor(private changelogService: ChangelogService,
              public matDialogRef: MatDialogRef<AddVersionDialogComponent>) { }

  ngOnInit() {
  }

  validate(): void {
    console.log('new', this.new);
    if (this.new.trim().length === 0 && this.improvments.trim().length === 0 && this.fixes.trim().length === 0) {
      return;
    }
    const newVersion = {} as AppVersion;
    newVersion.details = {} as VersionDetail;
    newVersion.details.new = this.new.trim().length > 0 ? this.new.trim().split(/\r?\n/) : [];
    newVersion.details.improved = this.improvments.trim().length > 0 ? this.improvments.trim().split(/\r?\n/) : [];
    newVersion.details.fixed = this.fixes.trim().length > 0 ? this.fixes.trim().split(/\r?\n/) : [];
    this.changelogService.addVersion(this.versionType, newVersion.details);
    this.matDialogRef.close();
  }

}
