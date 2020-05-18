import { ChangelogService } from './../../changelog.service';
import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { AppVersion, VersionDetail } from '../../models/app-version';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
  versionType: 'major' | 'minor' | 'patch' = null;
  mode: string;
  constructor(
    private changelogService: ChangelogService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<AddVersionDialogComponent>) {
    this.mode = data.mode;
    if (this.mode === 'edit') {
      this.new = this.generateFullText(data.version.details.new);
      this.improvments = this.generateFullText(data.version.details.improved);
      this.fixes = this.generateFullText(data.version.details.fixed);
    }
  }

  ngOnInit() {
  }

  validate(): void {
    console.log('new', this.new);
    if (this.new.trim().length === 0 && this.improvments.trim().length === 0 && this.fixes.trim().length === 0) {
      return;
    }
    if (!this.versionType) {
      return;
    }
    const newVersion = {} as AppVersion;
    newVersion.details = {} as VersionDetail;
    newVersion.details.new = this.new.trim().length > 0 ? this.new.trim().split(/\r?\n/) : [];
    newVersion.details.improved = this.improvments.trim().length > 0 ? this.improvments.trim().split(/\r?\n/) : [];
    newVersion.details.fixed = this.fixes.trim().length > 0 ? this.fixes.trim().split(/\r?\n/) : [];
    newVersion.published = false;
    this.changelogService.addVersion(this.versionType, newVersion.details);
    this.matDialogRef.close();
  }

  update(): void {
    if (this.new.trim().length === 0 && this.improvments.trim().length === 0 && this.fixes.trim().length === 0) {
      return;
    }
    const details = {} as VersionDetail;
    details.new = this.new.trim().length > 0 ? this.new.trim().split(/\r?\n/) : [];
    details.improved = this.improvments.trim().length > 0 ? this.improvments.trim().split(/\r?\n/) : [];
    details.fixed = this.fixes.trim().length > 0 ? this.fixes.trim().split(/\r?\n/) : [];
    this.changelogService.updateVersion(this.data.version.id, details);
    this.matDialogRef.close();
  }

  save(): void {
    if (this.mode === 'edit') {
      this.update();
    } else {
      this.validate();
    }
  }

  generateFullText(list: string[]): string {    
    return  list.join('\n').toString();    
  }

}
