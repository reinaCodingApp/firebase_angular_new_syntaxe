import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validate-audit-dialog',
  templateUrl: './validate-audit-dialog.component.html',
  styleUrls: ['./validate-audit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidateAuditDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ValidateAuditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log('not checked points', data);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
