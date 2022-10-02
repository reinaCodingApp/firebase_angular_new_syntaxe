import { Component, Inject, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedNotificationService } from "app/common/services/shared-notification.service";
import { MainTools } from "app/common/tools/main-tools";
import { HomeService } from "app/modules/home/home.service";
import { BoardTask } from "../../models/board-tast";

@Component({
  selector: "app-add-card-task-dialog",
  templateUrl: "./add-card-task-dialog.component.html",
})
export class AddCardTaskDialogComponent implements OnInit {
  boardTask: BoardTask;

  constructor(
    public matDialogRef: MatDialogRef<AddCardTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _homeService: HomeService,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === "edit") {
      this.boardTask = data.BoardTask;
    } else {
      this.boardTask = new BoardTask();
    }
  }

  ngOnInit(): void {}

  onSubmit(form: NgForm): void {
    if (form.valid) {
      if (this.data.mode === "edit") {
        this.updateBoardTask();
      } else {
        this.addBoardTask();
      }
    }
  }

  addBoardTask(): void {
    const boardTask = JSON.parse(JSON.stringify(this.boardTask));

    this._homeService.addBoardTask(boardTask).then(
      () => {
        this.matDialogRef.close();
        this._notificationService.showSuccess("Task board crée avec succés");
        // this._homeService.refreshData();
      },
      (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      }
    );
  }

  updateBoardTask(): void {
    const boardTask = JSON.parse(JSON.stringify(this.boardTask));
    this._homeService.editBoardTask(boardTask).then(
      () => {
        this.matDialogRef.close();
        this._notificationService.showSuccess(
          "Task board modifiée avec succés"
        );
        // this._homeService.refreshData();
      },
      (err) => {
        console.log(err);
        this._notificationService.showStandarError();
      }
    );
  }
}
