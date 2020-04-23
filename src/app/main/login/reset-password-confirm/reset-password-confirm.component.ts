import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ResetPasswordConfirmComponent implements OnInit {

  email: string = null;
  constructor(private fuseConfigService: FuseConfigService,
              private activatedRout: ActivatedRoute) { 
    this.fuseConfigService.config = {
        layout: {navbar   : {hidden: true},
            toolbar  : {hidden: true},
            footer   : {hidden: true},
            sidepanel: {hidden: true}
        }
    };
  }

  ngOnInit() {
      this.activatedRout.queryParams.subscribe(paramas => {
        this.email = paramas.email;
      });
  }

}
