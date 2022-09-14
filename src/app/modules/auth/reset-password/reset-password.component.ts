import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { finalize, Subject, takeUntil } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { FuseValidators } from "@fuse/validators";
import { FuseAlertType } from "@fuse/components/alert";
import { AuthService } from "app/core/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FirebaseErrors } from "app/common/tools/firebase-errors";

@Component({
  selector: "auth-reset-password",
  templateUrl: "./reset-password.component.html",
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
  @ViewChild("resetPasswordNgForm") resetPasswordNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  resetPasswordForm: UntypedFormGroup;
  showAlert: boolean = false;

  ngUnsubscribe: Subject<any> = new Subject<any>();

  // The user management actoin to be completed
  mode: string;
  // Just a code Firebase uses to prove that
  // this is a real password reset.
  actionCode: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  actionCodeChecked: boolean;

  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        // if we didn't receive any parameters,
        // we can't do anything
        if (!params) this.router.navigate(["/home"]);

        this.mode = params["mode"];
        this.actionCode = params["oobCode"];

        switch (params["mode"]) {
          case "resetPassword":
            {
              // Verify the password reset code is valid.
              this._authService
                .verifyOobCode(this.actionCode)
                .then((res) => {
                  this.actionCodeChecked = true;
                  console.log(" ok actionCode");
                })
                .catch((e) => {
                  // Invalid or expired action code. Ask user to try to reset the password
                  // again.
                  alert(e);
                  this.router.navigate(["/auth/login"]);
                });
            }
            break;

          default: {
            console.log("query parameters are missing");
            this.router.navigate(["/auth/login"]);
          }
        }
      });
  }

  ngOnDestroy() { 
    this.ngUnsubscribe.complete();
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.resetPasswordForm = this._formBuilder.group(
      {
        password: ["", Validators.required],
        passwordConfirm: ["", Validators.required],
      },
      {
        validators: FuseValidators.mustMatch("password", "passwordConfirm"),
      }
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset password
   */
  resetPassword(): void {
    // Return if the form is invalid
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // Disable the form
    this.resetPasswordForm.disable();

    // Hide the alert
    this.showAlert = false;

    var pwd = this.resetPasswordForm.get("password").value.toString();

    this._authService.resetPassword(this.actionCode, pwd).then(
      () => {
        // Set the alert
        this.alert = {
          type: "success",
          message: "Votre mot de passe a été réinitialisé.",
        };
        this.resetPasswordForm.enable();
        this.resetPasswordForm.reset();
        this.showAlert = true;
      },
      (err) => {
        // Set the alert
        this.alert = {
          type: "error",
          message: FirebaseErrors.Parse(err.code),
        };
        this.resetPasswordForm.enable();
        this.resetPasswordForm.reset();

        this.showAlert = true;
      }
    );
  }
}
