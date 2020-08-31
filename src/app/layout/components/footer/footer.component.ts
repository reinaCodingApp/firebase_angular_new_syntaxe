import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddTicketDialogComponent } from 'app/main/ticket/dialogs/add-ticket-dialog/add-ticket-dialog.component';
import { TicketService } from 'app/main/ticket/ticket.service';
import { take } from 'rxjs/operators';
import { AppService } from 'app/app.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent {
  private dialogRef: any;
  isBackofficeMember: boolean;
  allUnreadTicketsAndCommentsCount: number;
  versionName = '';
  private moduleIdentifier = ModuleIdentifiers.ticket;
  promptEvent: any;
  isInStandaloneMode = false;
  isAlreadyInstalled = true;

  constructor(
    private matDialog: MatDialog,
    private ticketService: TicketService,
    private appService: AppService
  ) {
    this.appService.onCurentUserChanged.subscribe(user => {
      if (user) {
        this.appService.getHabilitation(user, this.moduleIdentifier).then(habilitation => {
          this.isBackofficeMember = habilitation.isAdmin();
          this.getAllUnreadTicketsAndCommentsCount(this.isBackofficeMember);
        });
      }
    });
    this.appService.onAppVersionChanged.subscribe(response => {
      if (response) {
        this.versionName = response.versionName;
      }
    });
    window.addEventListener('beforeinstallprompt', event => {      
      this.isAlreadyInstalled = false;
      this.promptEvent = event;
    });
    window.addEventListener('appinstalled', (evt) => {      
      this.isAlreadyInstalled = true;
    });
    window.addEventListener('load', () => {
      const iOSInStandaloneMode = ('standalone' in window.navigator) && (window.navigator['standalone']);
      if (iOSInStandaloneMode) {        
        this.isInStandaloneMode = true;
      } else if (matchMedia('(display-mode: standalone)').matches) {        
        this.isInStandaloneMode = true;
      } else {        
        this.isInStandaloneMode = false;
      }
    });
  }
  installApp(): void {    
    if (this.promptEvent) {
      this.promptEvent.prompt();    
      this.promptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Uses accepted to install the  app');
      } else {
        console.log('User dismissed the install prompt');
      }
    });
    }    
  }

  addTicket(): void {
    this.dialogRef = this.matDialog.open(AddTicketDialogComponent, {
      panelClass: 'mail-compose-dialog'
    });
    this.dialogRef.afterClosed()
      .subscribe(response => {
        if (!response) {
          return;
        }
      });
  }

  getAllUnreadTicketsAndCommentsCount(isBackofficeMember: boolean): void {
    this.ticketService.getAllUnreadTicketsAndCommentsCount(isBackofficeMember)
      .pipe(take(1))
      .subscribe((result) => {
        this.allUnreadTicketsAndCommentsCount = result;
      }, err => {
        console.log(err);
      });
  }

}
