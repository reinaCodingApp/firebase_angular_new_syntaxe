import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'custom-confirm-dialog',
  templateUrl: './custom-confirm-dialog.component.html',
  styleUrls: ['./custom-confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CustomConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
