import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { LoginService } from '../login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FirebaseErrors } from 'app/common/tools/firebase-errors';



@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ResetPasswordFormComponent implements OnInit {

  password: string;
  passwordConfirmation: string;
  passwordsDontMacth = false;
  mode: string;
  oobCode: string;

  private unsubscribeAll: Subject<any> = new Subject();

  constructor(private fuseConfigService: FuseConfigService,
              private loginService: LoginService,
              private router: Router,
              private notificationService: SharedNotificationService,
              private activatedRoute: ActivatedRoute) {
    this.fuseConfigService.config = {
        layout: {navbar   : {hidden: true},
            toolbar  : {hidden: true},
            footer   : {hidden: true},
            sidepanel: {hidden: true}
        }
    };
  }
  confirmPasswordReset() {
      if (this.password !== this.passwordConfirmation) {
        this.notificationService.showError('La confirmation du mot de passe est erronée');
        return;
      }
      const pwd = this.password.trim();
      if (pwd.length < 6) {
        this.notificationService.showError('Le mot de passe doit avoir être composé de 6 caractères au minimum');
        return;
      }

      this.loginService.confirmPasswordReset(this.oobCode, pwd).then(
          () => {
              this.router.navigate(['login', 'reset-password-confirm']);
          },
          err => {
            const errMessage = FirebaseErrors.Parse(err.code);
            this.notificationService.showError(errMessage); }
      );
  }
  ngOnInit() {
    this.password = '';
    this.passwordConfirmation = '';
    this.activatedRoute.queryParams
    .pipe(takeUntil(this.unsubscribeAll))
    .subscribe(params => {
      this.mode = params['mode'];
      this.oobCode = params['oobCode'];
      if ( !this.mode || !this.oobCode) {
        this.router.navigateByUrl('/login');
      }
      console.log(this.mode);
      console.log(this.oobCode);
    });
  }

}
