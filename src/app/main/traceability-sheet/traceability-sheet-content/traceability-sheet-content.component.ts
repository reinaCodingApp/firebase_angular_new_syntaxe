import { MainTools } from 'app/common/tools/main-tools';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TraceabilitySheetService } from '../traceability-sheet.service';
import { TraceabilitySheet } from 'app/main/traceability-sheet/models/traceabilitySheet';
import { TraceabilityColor } from 'app/main/traceability-sheet/models/traceabilityColor';
import { SheetItem } from 'app/main/traceability-sheet/models/sheetItem';
import { NgForm } from '@angular/forms';
import { Employee } from 'app/common/models/employee';
import { SheetRequestParameter } from 'app/main/traceability-sheet/models/sheetRequestParameter';
import { Attachment } from 'app/common/models/attachment';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { CommonService } from 'app/common/services/common.service';
import { AddSheetItemDialogComponent } from '../add-sheet-item-dialog/add-sheet-item-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Habilitation } from 'app/main/access-rights/models/habilitation';

@Component({
  selector: 'traceability-sheet-content',
  templateUrl: './traceability-sheet-content.component.html',
  styleUrls: ['./traceability-sheet-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TraceabilitySheetContentComponent implements OnInit {
  traceabilitySheet: TraceabilitySheet;
  sheetItem: SheetItem;
  colors: TraceabilityColor[];
  employees: Employee[];
  year: number;
  selectedMaterialType: any;
  selectedSheetItem: SheetItem;
  editionMode: boolean;
  materialTypes = [
    {
      id: 7,
      imgSrc: 'assets/traceabilitySheet/stick.png'
    },
    {
      id: 5,
      imgSrc: 'assets/traceabilitySheet/colson.png'
    },
    {
      id: 6,
      imgSrc: 'assets/traceabilitySheet/feuillard.png'
    },
    {
      id: 1,
      imgSrc: 'assets/traceabilitySheet/scotch.png'
    },
    {
      id: 2,
      imgSrc: 'assets/traceabilitySheet/pic.png'
    }

  ];
  displayedColumns1 = ['iconSrc', 'reference', 'numberStart', 'numberEnd', 'actions'];
  displayedColumns2 = ['iconSrc', 'reference', 'quantity', 'actions'];
  displayedColumns3 = ['iconSrc', 'quantity', 'actions'];
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);

  constructor(
    private _traceabilitySheetService: TraceabilitySheetService,
    private _notificationService: SharedNotificationService,
    private _commonService: CommonService,
    private _matDialog: MatDialog
  ) {
    this.sheetItem = new SheetItem();
    this.selectedMaterialType = this.materialTypes[0];
  }

  ngOnInit(): void {
    this._traceabilitySheetService.onColorsChanged.subscribe((colors) => {
      this.colors = colors;
    });
    this._traceabilitySheetService.onEmployeesChanged.subscribe((employees) => {
      this.employees = employees;
    });
    this._traceabilitySheetService.onCurrentYearChanged.subscribe((year) => {
      this.year = year;
    });
    this._traceabilitySheetService.onCurrentTraceabilitySheet.subscribe((traceabilitySheet) => {
      this.traceabilitySheet = traceabilitySheet;
    });
    this._traceabilitySheetService.onHabilitationLoaded.subscribe(habilitationResult => {
      this.habilitation = habilitationResult;
    });
  }

  addSheetItem(): void {
    this.dialogRef = this._matDialog.open(AddSheetItemDialogComponent, {
      panelClass: 'mail-compose-dialog',
      data: {
        traceabilitySheet: this.traceabilitySheet
      }
    });
    this.dialogRef.afterClosed()
      .subscribe((response) => {
        if (response) {
          if (response.success) {
            this.refreshSheetItems(response.createdSheetItem, 'add');
          }
        }
      });
  }

  addTraceabilitySheet(): void {
    const sheetRequestParameter: SheetRequestParameter = {
      sheet: this.traceabilitySheet,
      year: this.year
    };
    this._traceabilitySheetService.addTraceabilitySheet(sheetRequestParameter)
      .subscribe((createdTraceabilitySheet) => {
        this.traceabilitySheet = createdTraceabilitySheet;
        this.refreshTraceabilitySheet();
      }, (err) => {
        console.log(err);
      });
  }

  updateTraceabilitySheetItem(): void {
    if (
      this.selectedSheetItem.materialTypeId === 7 ||
      this.selectedSheetItem.materialTypeId === 5) {
      if (this.selectedSheetItem.numberStart >= this.selectedSheetItem.numberEnd) {
        this._notificationService.showWarning('Numéro de fin doit être supérieur à numéro de début');;
        return;
      }
    }
    this._traceabilitySheetService.updateTraceabilitySheetItem(this.selectedSheetItem)
      .subscribe((response) => {
        if (response) {
          this.refreshSheetItems(this.selectedSheetItem, 'update');
          this.disableUpdateSheetItemMode();
        }
      }, (err) => {
        console.log(err);
      });
  }

  enableUpdateSheetItemMode(sheetItem: SheetItem): void {
    this.editionMode = true;
    this.selectedSheetItem = JSON.parse(JSON.stringify(sheetItem));
  }

  disableUpdateSheetItemMode(): void {
    this.editionMode = false;
    this.selectedSheetItem = null;
  }

  checkEditionMode(sheetItem: SheetItem): boolean {
    if (this.selectedSheetItem !== null && this.editionMode) {
      if (this.selectedSheetItem.id === sheetItem.id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  deleteTraceabilitySheetItem(sheetItem: SheetItem): void {
    this._traceabilitySheetService.deleteTraceabilitySheetItem(sheetItem)
      .subscribe((response) => {
        if (response) {
          this.refreshSheetItems(sheetItem, 'delete');
        }
      }, (err) => {
        console.log(err);
      });
  }

  refreshSheetItems(item: SheetItem, action: string): void {
    switch (item.materialTypeId) {
      case 7:
        this.refreshItems(this.traceabilitySheet.sticks, item, action);
        break;
      case 5:
        this.refreshItems(this.traceabilitySheet.colsons, item, action);
        break;
      case 6:
        this.refreshItems(this.traceabilitySheet.feuillards, item, action);
        break;
      case 1:
        this.refreshItems(this.traceabilitySheet.scotchs, item, action);
        break;
      case 2:
        this.refreshItems(this.traceabilitySheet.pics, item, action);
        break;
      default:
        break;
    }
  }

  refreshItems(sheetItems: SheetItem[], item: SheetItem, action: string): void {
    if (action === 'add') {
      sheetItems.push(item);
    } else if (action === 'update') {
      const sheetItemIndex = sheetItems.findIndex(s => s.id === item.id);
      sheetItems[sheetItemIndex] = item;
    } else {
      this.removeSheetItem(sheetItems, item);
    }
    this.refreshTraceabilitySheet();
  }

  removeSheetItem(sheetItems: SheetItem[], item: SheetItem): void {
    const sheetItemIndex = sheetItems.findIndex(s => s.id === item.id);
    if (sheetItemIndex >= 0) {
      sheetItems.splice(sheetItemIndex, 1);
    }
  }

  updateResponsible(selectedEmployee): void {
    if (this.habilitation.canEdit()) {
      this.traceabilitySheet.responsible = selectedEmployee.value;
      this._traceabilitySheetService.updateResponsible(this.traceabilitySheet)
        .subscribe(() => {
        }, (err) => {
          console.log(err);
        });
    }
  }

  removeResponsible(): void {
    if (this.habilitation.canEdit()) {
      this.traceabilitySheet.responsible.id = 0;
      this._traceabilitySheetService.updateResponsible(this.traceabilitySheet)
        .subscribe((response) => {
          if (response) {
            if (this.traceabilitySheet.responsible.id === 0) {
              this.traceabilitySheet.responsible = null;
            }
            this.refreshTraceabilitySheet();
          }
        }, (err) => {
          console.log(err);
        });
    }
  }

  updateQuantityOfSacrifices(): void {
    if (this.habilitation.canEdit()) {
      this._traceabilitySheetService.updateQuantityOfSacrifices(this.traceabilitySheet)
        .subscribe(() => {
        }, (err) => {
          console.log(err);
        });
    }
  }

  updateMelCode(): void {
    if (this.habilitation.canEdit()) {
      this._traceabilitySheetService.updateMelCode(this.traceabilitySheet)
        .subscribe(() => {
        }, (err) => {
          console.log(err);
        });
    }
  }

  updateTamponCode(): void {
    if (this.habilitation.canEdit()) {
      this._traceabilitySheetService.updateTamponCode(this.traceabilitySheet)
        .subscribe(() => {
        }, (err) => {
          console.log(err);
        });
    }
  }

  updateSheetDays(index: number): void {
    if (this.habilitation.canEdit()) {
      this.traceabilitySheet.days[index] = !this.traceabilitySheet.days[index];
      this._traceabilitySheetService.updateSheetDays(this.traceabilitySheet)
        .subscribe((response) => {
          if (response) {
            this.refreshTraceabilitySheet();
          } else {
            this.traceabilitySheet.days[index] = !this.traceabilitySheet.days[index];
          }
        }, (err) => {
          this.traceabilitySheet.days[index] = !this.traceabilitySheet.days[index];
          console.log(err);
        });
    }
  }

  addTeamMember(selectedEmployee): void {
    if (this.habilitation.canEdit()) {
      if (this.memberAlreadyExist(selectedEmployee.value)) {
        return;
      }
      const sheetRequestParameter: SheetRequestParameter = {
        sheet: this.traceabilitySheet,
        employee: selectedEmployee.value
      };
      this._traceabilitySheetService.addTeamMember(sheetRequestParameter)
        .subscribe((team) => {
          this.traceabilitySheet.team = team;
          this.refreshTraceabilitySheet();
        }, (err) => {
          console.log(err);
        });
    }
  }

  deleteTeamMember(selectedEmployee: Employee): void {
    if (this.habilitation.canEdit()) {
      const sheetRequestParameter: SheetRequestParameter = {
        sheet: this.traceabilitySheet,
        employee: selectedEmployee
      };
      this._traceabilitySheetService.deleteTeamMember(sheetRequestParameter)
        .subscribe((response) => {
          this.traceabilitySheet.team = this.traceabilitySheet.team.filter(m => m.id !== selectedEmployee.id);
          this.refreshTraceabilitySheet();
        }, (err) => {
          console.log(err);
        });
    }
  }

  uploadAttachments(files): void {
    if (files.length === 0) {
      return;
    }
    if (files.length > 10) {
      this._notificationService.showWarning(`Il n'est pas possible de joindre plus de 10 fichier`);
      return;
    }
    const attachmentsToUpload = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file.size / 1024 > this._traceabilitySheetService.maxFileSize) {
        this._notificationService.showWarning(`La taille du fichier ne doit pas dépasser (${this._traceabilitySheetService.maxFileSize / 1024}) Mo`);
        continue;
      }
      if (attachmentsToUpload.length >= 10) {
        this._notificationService.showWarning(`Il est possible de joindre 10 fichiers maximum par demande, vous dépassez cette limite`);
        return;
      }
      attachmentsToUpload.push(file);
    }
    this.traceabilitySheet.attachments = attachmentsToUpload;
    this._traceabilitySheetService.uploadAttachments(this.traceabilitySheet.id, attachmentsToUpload)
      .subscribe((traceabilitySheet) => {
        this.traceabilitySheet.hasAttachments = traceabilitySheet.hasAttachments;
        this.traceabilitySheet.attachments = traceabilitySheet.attachments;
        this.refreshTraceabilitySheet();
      });
  }

  getAttachments(): void {
    this._traceabilitySheetService.getAttachments(this.traceabilitySheet)
      .subscribe((traceabilitySheet) => {
        this.traceabilitySheet.attachments = traceabilitySheet.attachments;
        this.refreshTraceabilitySheet();
      }, (err) => {
        console.log(err);
      });

  }

  downloadAttachment(attachment: Attachment): void {
    this._traceabilitySheetService.downloadAttachment(attachment)
      .subscribe(data => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  removeAttachment(attachment: Attachment): void {
    const sheetRequestParameter: SheetRequestParameter = {
      sheet: this.traceabilitySheet,
      attachment: attachment
    };
    this._traceabilitySheetService.removeAttachment(sheetRequestParameter)
      .subscribe((response) => {
        if (response) {
          this.traceabilitySheet.attachments = this.traceabilitySheet.attachments
            .filter(a => a.id !== attachment.id);
          this.refreshTraceabilitySheet();
        }
      }, (err) => {
        console.log(err);
      });
  }

  refreshTraceabilitySheet(): void {
    const traceabilitySheet = JSON.parse(JSON.stringify(this.traceabilitySheet));
    this._traceabilitySheetService.onCurrentTraceabilitySheet.next(traceabilitySheet);
  }

  getDayString(index: number): string {
    let day: string;
    switch (index) {
      case 0:
        day = 'L';
        break;
      case 1:
        day = 'M';
        break;
      case 2:
        day = 'M';
        break;
      case 3:
        day = 'J';
        break;
      case 4:
        day = 'V';
        break;
      case 5:
        day = 'S';
        break;
      case 6:
        day = 'D';
        break;
    }
    return day;
  }

  memberAlreadyExist(selectedEmployee): boolean {
    let result = false;
    for (const member of this.traceabilitySheet.team) {
      if (member.id === selectedEmployee.id) {
        result = true;
        break;
      }
    }
    return result;
  }

}
