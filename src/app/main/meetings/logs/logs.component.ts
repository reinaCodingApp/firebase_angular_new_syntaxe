import { Component, OnInit } from '@angular/core';
import { MeetingsService } from '../meetings.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LogRequest } from 'app/main/meetings/models/logRequest';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';

@Component({
  selector: 'meetings-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  logs: LogRequest[] = [];
  displayedColumns = ['employeeName', 'date', 'action', 'ip', 'url'];

  constructor(
    private _meetingsService: MeetingsService,
    private _loaderService: NgxUiLoaderService,
    private _notificationService: SharedNotificationService,
  ) { }

  ngOnInit(): void {
    if (this.logs.length === 0) {
      this.getLogs();
    }
  }

  getLogs(): void {
    this._loaderService.start();
    this._meetingsService.getLogs()
      .subscribe((logs) => {
        this._loaderService.stop();
        this.logs = logs;
      }, (err) => {
        console.log(err);
        this._loaderService.stop();
        this._notificationService.showStandarError();
      });
  }

}
