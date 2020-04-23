import { Component, OnInit, OnDestroy } from '@angular/core';
import { Module } from 'app/main/access-rights/models/module';
import { AccessRightsService } from '../access-rights.service';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddModuleDialogComponent } from './dialogs/add-module-dialog/add-module-dialog.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss'],
  animations : fuseAnimations
})
export class ModulesComponent implements OnInit, OnDestroy {

  modules: Module[] = [];
  dialogRef: any;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private accessRightsService: AccessRightsService,
    private _matDialog: MatDialog) { }

  ngOnInit() {
    this.accessRightsService.onModulesChanged
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(modules => {
      if (modules) {
        this.modules = modules;
      }
    });
  }

  addOrUpdateModule(parentModule: Module, childModule: Module, mode: string): void{
    this.dialogRef = this._matDialog.open(AddModuleDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        mode: mode,
        parentModule: parentModule,
        childModule: childModule
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

}
