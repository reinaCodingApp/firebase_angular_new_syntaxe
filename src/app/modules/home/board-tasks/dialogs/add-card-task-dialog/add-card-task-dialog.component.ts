import { Component, Inject, OnInit,ChangeDetectorRef } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedNotificationService } from "app/common/services/shared-notification.service";
import { MainTools } from "app/common/tools/main-tools";
import { HomeService } from "app/modules/home/home.service";
import moment from "moment";
import { BoardTask } from "../../models/board-tast";
import { Label } from "../../models/Label";

@Component({
  selector: "app-add-card-task-dialog",
  templateUrl: "./add-card-task-dialog.component.html",
})
export class AddCardTaskDialogComponent implements OnInit {
  boardTask: BoardTask;
  labels: Label[];
  filteredLabels: Label[];
  
  constructor(
    public matDialogRef: MatDialogRef<AddCardTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _homeService: HomeService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _notificationService: SharedNotificationService
  ) {
    if (data.mode === "edit") {
      this.boardTask = data.BoardTask;
      console.log("data pop" );
      console.log(data);
    

    } else {
      this.boardTask = new BoardTask();
      this.boardTask.labels=[];
    }
  }

  ngOnInit(): void {
    this.labels = this.filteredLabels = [
      {
        id: "1",
        title: "Searching",
      },

      {
        id: "2",
        title: "Development",
      },
      {
        id: "3",
        title: "Bug",
      },
      {
        id: "4",
        title: "Wireframing",
      },
      {
        id: "5",
        title: "Ux design",
      },
    ];
  }

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
  /**
   * Filter labels
   *
   * @param event
   */
  filterLabels(event): void {
    // Get the value
    const value = event.target.value.toLowerCase();

    // Filter the labels
    this.filteredLabels = this.labels.filter((label) =>
      label.title.toLowerCase().includes(value)
    );
  }

  /**
   * Filter labels input key down event
   *
   * @param event
   */
  filterLabelsInputKeyDown(event): void {
    // Return if the pressed key is not 'Enter'
    if (event.key !== "Enter") {
      return;
    }

    // If there is no label available...
    if (this.filteredLabels.length === 0) {
      // Return
      return;
    }

    // If there is a label...
    const label = this.filteredLabels[0];
     const isLabelApplied = this.boardTask.labels.find(cardLabel => cardLabel.id === label.id);

     // If the found label is already applied to the card...
     if ( isLabelApplied )
     {
         // Remove the label from the card
         this.removeLabelFromCard(label);
     }
     else
     {
         // Otherwise add the label to the card
         this.addLabelToCard(label);
     }
  }

    /**
     * Toggle card label
     *
     * @param label
     * @param change
     */
     toggleProductTag(label: Label, change: MatCheckboxChange): void
     {
         if ( change.checked )
         {
             this.addLabelToCard(label);
         }
         else
         {
             this.removeLabelFromCard(label);
         }
     }
 
     /**
      * Add label to the card
      *
      * @param label
      */
     addLabelToCard(label: Label): void
     {
         // Add the label
         this.boardTask.labels.unshift(label);
 
         // Update the card form data
        //  this.cardForm.get('labels').patchValue(this.boardTask.labels);
 
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }
 
     /**
      * Remove label from the card
      *
      * @param label
      */
     removeLabelFromCard(label: Label): void
     {
         // Remove the label
         this.boardTask.labels.splice(this.boardTask.labels.findIndex(cardLabel => cardLabel.id === label.id), 1);
 
         // Update the card form data
        //  this.cardForm.get('labels').patchValue(this.card.labels);
 
         // Mark for check
         this._changeDetectorRef.markForCheck();
     }
   /**
     * Return whether the card has the given label
     *
     * @param label
     */
    hasLabel(label: Label): boolean
    {
        return !!this.boardTask.labels.find(cardLabel => cardLabel.id == label.id);
    }
  /**
   * Check if the given date is overdue
   */
  isOverdue(date: string): boolean {
    return moment(date, moment.ISO_8601).isBefore(moment(), "days");
  }
}
