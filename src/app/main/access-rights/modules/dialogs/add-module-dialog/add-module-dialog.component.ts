import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Module } from 'app/main/access-rights/models/module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { AccessRightsService } from 'app/main/access-rights/access-rights.service';

@Component({
  selector: 'app-add-module-dialog',
  templateUrl: './add-module-dialog.component.html',
  styleUrls: ['./add-module-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddModuleDialogComponent implements OnInit {
  uniqueKeys: string[];
  availableKeys: string[];
  module: Module;
  parentModule: Module;
  childModule: Module;
  moduleType: string; // child, parent

  constructor(
    public matDialogRef: MatDialogRef<AddModuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private angularFirestore: AngularFirestore,
    private accessRightsService: AccessRightsService
  ) {
    this.parentModule = data.parentModule;
    this.childModule = data.childModule;
    if (data.mode === 'edit') {
      if (this.parentModule && this.childModule) {
        this.moduleType = 'childModule';
        this.module = this.childModule;
      }
      if (this.parentModule && !this.childModule) {
        this.moduleType = 'parentModule';
        this.module = this.parentModule;
      }
    } else {
      if (this.parentModule && !this.childModule) {
        this.moduleType = 'childModule';
      }
      if (!this.parentModule && !this.childModule) {
        this.moduleType = 'parentModule';
      }
      this.module = new Module();
    }
  }

  ngOnInit(): void {
    this.accessRightsService.getAvailableKeys();
    this.accessRightsService.onAvailableKeysChanged.subscribe((availableKeys) => {
      this.availableKeys = availableKeys;
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === 'edit') {
        this.updateModule();
      } else {
        this.addNewModule();
      }
    }
  }

  addNewModule(): void {
    if (this.moduleType === 'parentModule') {
      this.accessRightsService.addParentModule(this.module);
    } else {
      this.accessRightsService.addChildModule(this.module, this.parentModule);
    }
  }

  updateModule(): void {
    if (this.moduleType === 'parentModule') {
      this.accessRightsService.updateParentModule(this.module);
    } else {
      this.accessRightsService.updateChildModule(this.module, this.parentModule);
    }
  }


}
