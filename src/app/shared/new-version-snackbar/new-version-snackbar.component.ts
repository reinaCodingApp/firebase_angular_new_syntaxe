import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-version-snackbar',
  templateUrl: './new-version-snackbar.component.html',
  styleUrls: ['./new-version-snackbar.component.scss']
})
export class NewVersionSnackbarComponent implements OnInit {

  constructor(
    public snackBarRef: MatSnackBarRef<NewVersionSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private router: Router) { }

  ngOnInit() {
  }

  refreshPage(): void {
    window.location.reload();
    this.snackBarRef.dismiss();
  }

  redirectToChangeLogPage(): void {
    this.router.navigate(['changelog']);
  }

}
