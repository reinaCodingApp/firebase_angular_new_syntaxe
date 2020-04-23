import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SharedNotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this._snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  showWarning(message: string): void {
    this._snackBar.open(message, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['warning-snackbar']
    });
  }

  showError(message: string): void {
    this._snackBar.open(message, 'OK', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }

  showStandarError(): void {
    this._snackBar.open(`une erreur s'est produite veuillez réessayer ultérieurement`, '', {
      duration: 4000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar']
    });
  }
}
