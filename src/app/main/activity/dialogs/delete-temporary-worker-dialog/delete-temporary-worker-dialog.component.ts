import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-temporary-worker-dialog',
  templateUrl: './delete-temporary-worker-dialog.component.html',
  styleUrls: ['./delete-temporary-worker-dialog.component.scss']
})
export class DeleteTemporaryWorkerDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteTemporaryWorkerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

}
