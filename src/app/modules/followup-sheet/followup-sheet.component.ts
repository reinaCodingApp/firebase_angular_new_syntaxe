import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FollowupSheetService } from './followup-sheet.service';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { EmbeddedDatabase } from 'app/data/embeddedDatabase';
import { AddSimpletaskDialogComponent } from './dialogs/add-simpletask-dialog/add-simpletask-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Attachment } from 'app/common/models/attachment';
import { CommonService } from 'app/common/services/common.service';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppService } from 'app/app.service';
import { CustomConfirmDialogComponent } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.component';
import { MainTools } from 'app/common/tools/main-tools';
import { EmployeeLevel } from './models/employeeLevel';
import { Habilitation } from '../access-rights/models/habilitation';
import { Deadline } from './models/deadline';
import { Folder } from './models/folder';
import { Point } from './models/point';
import { Pole } from './models/pole';
import { RequestParameter } from './models/requestParameter';
import { Section } from './models/section';
import { Sheet } from './models/sheet';

@Component({
  selector: 'followup-sheet',
  templateUrl: './followup-sheet.component.html'
})
export class FollowupSheetComponent implements OnInit {
  
  ngOnInit(): void {
    console.log('## on init')
  }
}

