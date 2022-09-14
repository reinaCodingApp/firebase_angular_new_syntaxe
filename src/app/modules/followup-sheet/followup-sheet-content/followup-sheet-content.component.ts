import { Component, OnInit, ViewEncapsulation, OnDestroy } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";

import { SharedNotificationService } from "app/common/services/shared-notification.service";
import { EmbeddedDatabase } from "app/data/embeddedDatabase";

import { MatDialog } from "@angular/material/dialog";
import { Attachment } from "app/common/models/attachment";
import { CommonService } from "app/common/services/common.service";
import { takeUntil, take } from "rxjs/operators";
import { Subject } from "rxjs";
import { AppService } from "app/app.service";
import { CustomConfirmDialogComponent } from "app/shared/custom-confirm-dialog/custom-confirm-dialog.component";
import { MainTools } from "app/common/tools/main-tools";
import { Habilitation } from "app/modules/access-rights/models/habilitation";
import { AddSimpletaskDialogComponent } from "../dialogs/add-simpletask-dialog/add-simpletask-dialog.component";
import { FollowupSheetService } from "../followup-sheet.service";
import { Deadline } from "../models/deadline";
import { EmployeeLevel } from "../models/employeeLevel";
import { Folder } from "../models/folder";
import { Point } from "../models/point";
import { Pole } from "../models/pole";
import { RequestParameter } from "../models/requestParameter";
import { Section } from "../models/section";
import { Sheet } from "../models/sheet";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";

@Component({
  selector: "app-followup-sheet-content",
  templateUrl: "./followup-sheet-content.component.html",
})
export class FollowupSheetContentComponent implements OnInit, OnDestroy {
  hierarchyLevel: number;
  employeeLevelId: number;
  connectedEmployeeLevel: EmployeeLevel;
  canEdit: boolean;
  currentSection: Section;
  sheet: Sheet;
  deadlines: Deadline[];
  poles: Pole[];
  sheetsHistory: Sheet[];
  selectedSheetId: number;
  notes = EmbeddedDatabase.notes;
  selectedNote: any;
  selectedSector: any;
  dialogRef: any;
  habilitation: Habilitation = new Habilitation(0);
  private _unsubscribeAll: Subject<any>;
  drawerMode: "over" | "side" = "side";
  drawerOpened: boolean = true;
  disableClose: boolean = true;
  constructor(
    private _followupSheetService: FollowupSheetService,
    private _matDialog: MatDialog,
    private _notificationService: SharedNotificationService,
    public commonService: CommonService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private appService: AppService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._followupSheetService.followupSheetViewModel.subscribe(
      (followupSheetViewModel) => {
        this.employeeLevelId = followupSheetViewModel.connectedEmployeeLevel.id;
        this.hierarchyLevel =
          followupSheetViewModel.connectedEmployeeLevel.hierarchyLevel;
        this.connectedEmployeeLevel =
          followupSheetViewModel.connectedEmployeeLevel;
        if (this.isLimitedPole(this.connectedEmployeeLevel.pole)) {
          this.notes = EmbeddedDatabase.notes.filter(
            (n) => n.noteValue === 3 || n.noteValue === 6
          );
        }
        this.poles = followupSheetViewModel.poles;
        this.canEdit = followupSheetViewModel.canEdit;
        this.sheet = followupSheetViewModel.sheet;
        this.sheetsHistory = followupSheetViewModel.sheetsHistory;
        this.selectedSheetId = this.sheet.id;
        if (this.hierarchyLevel !== 3) {
          this.currentSection = this.sheet.sections[0];
        }
      }
    );
    this._followupSheetService.deadlines.subscribe((deadlines) => {
      this.deadlines = deadlines;
    });
    this._followupSheetService.onHabilitationLoaded
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((habilitationResult) => {
        this.habilitation = habilitationResult;
        if (this.habilitation.isSuperAdmin()) {
          this.appService.onShowConfigButtonChanged.next(true);
          this.appService.onConfigurationUrlChanged.next(
            "/followupSheet/followupSheet-configuration"
          );
        }
      });

    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        if (matchingAliases.includes("md")) {
          this.drawerMode = "side";
          this.drawerOpened = true;
          this.disableClose = true;
        } else {
          this.drawerMode = "over";
          this.drawerOpened = false;
          this.disableClose = false;
        }
      });
  }
  private isLimitedPole(pole: Pole): boolean {
    return pole.id === 5 || pole.id === 7;
  }

  addSimpleTask(currentSection: Section): void {
    this.dialogRef = this._matDialog.open(AddSimpletaskDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "new",
        currentSection: currentSection,
      },
    });
    this.dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (response.success) {
          this.currentSection.folders.push(response.folder);
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
    });
  }

  renameSimpleTask(folder: Folder, folderIndex: number): void {
    folder.title = folder.title.trim();
    if (folder.title.length > 0) {
      this._followupSheetService
        .renameSimpleTask(folder)
        .pipe(take(1))
        .subscribe(
          (response) => {
            if (response) {
              this.currentSection.folders[folderIndex].title =
                folder.title.toUpperCase();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  deleteSimpleTask(folder: Folder, folderIndex: number): void {
    // check if it is the last folder
    if (this.currentSection.folders.length > 1) {
      // check folder have points
      if (!this.checkFolderPoints(folder)) {
        this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
          panelClass: "confirm-dialog",
          data: {
            title: "Supprimer Dossier",
            message: "Confirmez-vous la suppression de ce dossier ?",
          },
        });
        this.dialogRef.afterClosed().subscribe((response) => {
          if (response) {
            this._followupSheetService.deleteSimpleTask(folder).subscribe(
              (result) => {
                if (result) {
                  this.currentSection.folders.splice(folderIndex, 1);
                }
              },
              (err) => {
                this._notificationService.showStandarError();
                console.log(err);
              }
            );
          }
        });
      } else {
        this._notificationService.showWarning(
          `Le dossier doit être vide pour pouvoir le supprimer`
        );
      }
    } else {
      this._notificationService.showWarning(
        `La fiche de suivi doit contenir au moins un dossier`
      );
    }
  }

  getFollowupSheet(): void {
    this._followupSheetService.getFollowupSheet(this.selectedSheetId).subscribe(
      (result) => {
        this.canEdit = result.canEdit;
        this.sheet = result.sheet;
        this.currentSection = this.sheet.sections[0];
      },
      (err) => {
        this._notificationService.showStandarError();
        console.log(err);
        console.log(err);
      }
    );
  }

  getSectionsForAdmin(responsibleId: number): void {
    this.selectedSector = responsibleId;
    const requestParameter: RequestParameter = {
      employeeLevelId: responsibleId,
      sheetId: this.sheet.id,
    };
    this._followupSheetService.getSectionsForAdmin(requestParameter).subscribe(
      (sections) => {
        this.sheet.sections = sections;
        this.currentSection = this.sheet.sections[0];
        this.commonService.closeSidebar("poles-sidebar");
      },
      (err) => {
        this._notificationService.showStandarError();
        this.commonService.closeSidebar("poles-sidebar");
        console.log(err);
      }
    );
  }

  submitOrCloseSheet(): void {
    const type =
      this.hierarchyLevel === 3 &&
      this.connectedEmployeeLevel.responsible.id ===
        this.connectedEmployeeLevel.employee.id
        ? "close"
        : "submit";
    let data;
    if (type === "submit") {
      data = {
        title: "Finaliser la fiche",
        message:
          "Êtes-vous sûr de vouloir envoyer votre fiche à votre responsable ?",
      };
    } else {
      data = {
        title: "Clôturer la fiche",
        message:
          "Êtes-vous sûr de vouloir clôturer la fiche envoyer la synthèse aux différents responsables ?",
      };
    }
    this.dialogRef = this._matDialog.open(CustomConfirmDialogComponent, {
      panelClass: "confirm-dialog",
      data: data,
    });
    this.dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        if (type === "submit") {
          this.submitFollowupSheet();
        } else {
          this.closeFollowupSheet();
        }
      }
    });
  }

  createNewPoint(folder: Folder): void {
    const point: Point = {
      id: 0,
      note: this.notes[0].noteValue,
      content: "",
      ownerId: folder.ownerId,
      folderId: folder.id,
    };
    folder.points.push(point);
  }

  addPoint(point: Point, folderIndex: number, pointIndex: number): void {
    point.content = point.content.trim();
    if (point.content.length > 0) {
      this._followupSheetService
        .addPoint(point)
        .pipe(take(1))
        .subscribe(
          (createdPoint) => {
            if (createdPoint) {
              this.currentSection.folders[folderIndex].points[pointIndex].id =
                createdPoint.id;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  updatePoint(point: Point): void {
    point.content = point.content.trim();
    if (point.content.length > 0) {
      this._followupSheetService
        .updatePoint(point)
        .pipe(take(1))
        .subscribe(
          (response) => {},
          (err) => {
            console.log(err);
          }
        );
    }
  }

  addOrUpdatePoint(
    point: Point,
    folderIndex: number,
    pointIndex: number
  ): void {
    if (point.id === 0) {
      this.addPoint(point, folderIndex, pointIndex);
    } else {
      this.updatePoint(point);
    }
  }

  deletePoint(pointId: number, pointIndex: number, folder: Folder): void {
    if (pointId > 0) {
      this._followupSheetService
        .deletePoint(pointId)
        .pipe(take(1))
        .subscribe(
          (response) => {
            if (response) {
              if (folder.points.length === 1) {
                folder.points[pointIndex].id = 0;
                folder.points[pointIndex].content = "";
              } else {
                folder.points.splice(pointIndex, 1);
              }
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      if (folder.points.length === 1) {
        folder.points[pointIndex].content = "";
      } else {
        folder.points.splice(pointIndex, 1);
      }
    }
  }

  getNoteTitle(noteValue: number): string {
    for (let i = 0; i < this.notes.length; i++) {
      if (this.notes[i].noteValue === noteValue) {
        return this.notes[i].title;
      }
    }
  }

  uploadAttachments(files: any, folder: Folder, folderIndex: number): void {
    if (files.length === 0) {
      return;
    }
    if (files.length > 10) {
      this._notificationService.showWarning(
        `Il n'est pas possible de joindre plus de 10 fichier`
      );
      return;
    }
    const attachmentsToUpload = [];
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (file.size / 1024 > this._followupSheetService.maxFileSize) {
        this._notificationService.showWarning(
          `La taille du fichier ne doit pas dépasser (${
            this._followupSheetService.maxFileSize / 1024
          }) Mo`
        );
        continue;
      }
      if (attachmentsToUpload.length >= 10) {
        this._notificationService.showWarning(
          `Il est possible de joindre 10 fichiers maximum par demande, vous dépassez cette limite`
        );
        return;
      }
      attachmentsToUpload.push(file);
    }

    this._followupSheetService
      .uploadAttachments(folder.id, attachmentsToUpload)
      .subscribe((result) => {
        this.currentSection.folders[folderIndex].attachments =
          result.attachments;
      });
  }

  downloadAttachment(attachment: Attachment): void {
    this._followupSheetService
      .downloadAttachment(attachment.id)
      .subscribe((data) => {
        MainTools.downloadAttachment(attachment, data);
      });
  }

  removeAttachment(
    attachment: Attachment,
    folder: Folder,
    attachmentIndex: number
  ): void {
    const requestParameter: RequestParameter = {
      folder: folder,
      attachment: attachment,
    };
    this._followupSheetService.removeAttachment(requestParameter).subscribe(
      (response) => {
        if (response) {
          folder.attachments.splice(attachmentIndex, 1);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateSheetSection(currentSection: Section): void {
    const sectionIndex = this.sheet.sections.findIndex(
      (s) => s.id === currentSection.id
    );
    this.sheet.sections[sectionIndex] = currentSection;
  }

  submitFollowupSheet(): void {
    this._followupSheetService.submitFollowupSheet(this.sheet).subscribe(
      (response) => {
        if (response) {
          this.canEdit = false;
        }
      },
      (err) => {
        this._notificationService.showStandarError();
        console.log(err);
      }
    );
  }

  closeFollowupSheet(): void {
    this._followupSheetService.closeFollowupSheet(this.sheet).subscribe(
      (response) => {
        if (response) {
          this.sheet.isClosed = true;
          this.canEdit = false;
        }
      },
      (err) => {
        this._notificationService.showStandarError();
        console.log(err);
      }
    );
  }

  displayPrecedentWeekForAdmin(): void {
    this.sheet = this.sheetsHistory[1];
    this.canEdit = false;
    this.currentSection = null;
    this.selectedSector = null;
  }

  getCurrentSction(section: Section): void {
    if (this.currentSection.id !== section.id) {
      this._followupSheetService
        .getSection(this.employeeLevelId, section.id)
        .pipe(take(1))
        .subscribe(
          (currentSection) => {
            this.currentSection = currentSection;
          },
          (err) => {
            console.log(err);
            this._notificationService.showStandarError();
          }
        );
    }
  }

  checkFolderPoints(folder: Folder): boolean {
    let result = false;
    for (const point of folder.points) {
      if (point.id > 0) {
        result = true;
        break;
      }
    }
    return result;
  }

  ngOnDestroy(): void {
    console.log("### ngOnDestroy");
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
    this.appService.setConfigButtonParameters(false, null);
  }
}
