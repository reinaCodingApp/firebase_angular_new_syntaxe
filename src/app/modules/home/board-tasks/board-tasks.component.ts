import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AuthService } from "app/core/auth/auth.service";
import moment from "moment";
import { Subject, takeUntil } from "rxjs";
import { HomeService } from "../home.service";
import { AddCardTaskDialogComponent } from "./dialogs/add-card-task-dialog/add-card-task-dialog.component";
import { BoardTask } from "./models/board-tast";

@Component({
  selector: "app-board-tasks",
  templateUrl: "./board-tasks.component.html",
  styleUrls: ["./board-tasks.component.scss"],
})
export class BoardTasksComponent implements OnInit {
  tasks: BoardTask[];
  statusList: any[];
  private dialogRef: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder,
    private _fuseConfirmationService: FuseConfirmationService,
    private homeService: HomeService,
    public _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.statusList = [...this.homeService.boardStatusList];
    this.tasks = [...this.homeService.tasks];
    // temporary, you need to dispatch task on the service side
    this.statusList[0].tasks = this.tasks.filter((t) => t.status === "toDo");
    this.statusList[1].tasks = this.tasks.filter(
      (t) => t.status === "inProgress"
    );
    this.statusList[2].tasks = this.tasks.filter((t) => t.status === "done");
    
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  addBoardTask(): void {
    this.dialogRef = this._matDialog.open(AddCardTaskDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "add",
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  updateBoardTask(row: BoardTask): void {
    console.log('## row bt' , row);
    
    const currentBoardTask = JSON.parse(JSON.stringify(row));
    this.dialogRef = this._matDialog.open(AddCardTaskDialogComponent, {
      panelClass: "mail-compose-dialog",
      data: {
        mode: "edit",
        broadTask: currentBoardTask,
      },
    });
    this.dialogRef.afterClosed().subscribe(() => {});
  }

  renameList(listTitleInput: HTMLElement): void {
    // Use timeout so it can wait for menu to close
    setTimeout(() => {
      listTitleInput.focus();
    });
  }



  addList(title: string): void {}

  updateListTitle(event: any, list: any): void {}
  deleteList(id): void {}

  addCard(list: any, title: string): void {}

  listDropped(event: CdkDragDrop<any[]>): void {}

  cardDropped(event: CdkDragDrop<any[]>): void {}

  /**
   * Check if the given ISO_8601 date string is overdue
   *
   * @param date
   */
  isOverdue(date: string): boolean {
    return moment(date, moment.ISO_8601).isBefore(moment(), "days");
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
