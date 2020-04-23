import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-holiday-dialog',
  templateUrl: './delete-holiday-dialog.component.html',
  styleUrls: ['./delete-holiday-dialog.component.scss']
})
export class DeleteHolidayDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteHolidayDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}

