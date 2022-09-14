import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-forgot-password',
    templateUrl  : './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthForgotPasswordComponent implements OnInit
{
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
           .then(
                (response) => {

                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Réinitialisation du mot de passe envoyée ! Vous recevrez un e-mail si vous êtes inscrit sur notre système.'
                    };
                     // Re-enable the form
                     this.forgotPasswordForm.enable();

                     // Reset the form
                     this.forgotPasswordNgForm.resetForm();
 
                     // Show the alert
                     this.showAlert = true;
                },
                (err) => {

                    console.log(err);
                    
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: "L'e-mail n'est pas trouvé ! Êtes-vous sûr d'être déjà membre"
                    };
                     // Re-enable the form
                     this.forgotPasswordForm.enable();

                     // Reset the form
                     this.forgotPasswordNgForm.resetForm();
 
                     // Show the alert
                     this.showAlert = true;
                }
            );
    }
}
