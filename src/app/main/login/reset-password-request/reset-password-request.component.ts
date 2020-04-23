import { LoginService } from 'app/main/login/login.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { FirebaseErrors } from 'app/common/tools/firebase-errors';

@Component({
  selector: 'reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['./reset-password-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ResetPasswordRequestComponent implements OnInit {

  emailParameter: string;

  constructor(private fuseConfigService: FuseConfigService,
              private router: Router,
              private notificationService: SharedNotificationService,
              private loginService: LoginService) {

    this.fuseConfigService.config = {
        layout: {navbar   : {hidden: true},
            toolbar  : {hidden: true},
            footer   : {hidden: true},
            sidepanel: {hidden: true}
        }
    };
  }
  sendPasswordResetEmail() {
    this.loginService.sendPasswordResetEmail(this.emailParameter).then(
        () => {
            this.router.navigateByUrl('/login/reset-password-confirm?email=' + this.emailParameter);
        },
        err => {
            const errMessage = FirebaseErrors.Parse(err.code);
            this.notificationService.showError(errMessage);
        });
  }
  ngOnInit() {
    this.emailParameter = '';
  }

}
