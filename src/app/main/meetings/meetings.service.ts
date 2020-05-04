import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BASE_URL } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { CodirMeetingViewModel } from 'app/main/meetings/models/codirMeetingViewModel';
import { CodirComment } from 'app/main/meetings/models/codirComment';
import { Decision } from 'app/main/meetings/models/decision';
import { MeetingSector } from 'app/main/meetings/models/meetingSector';
import { EmployeeLevel } from 'app/main/followup-sheet/models/employeeLevel';
import { RequestParameter } from 'app/main/meetings/models/requestParameter';
import { MeetInstance } from 'app/main/meetings/models/meetInstance';
import { FilterParameter } from 'app/main/meetings/models/filterParameter';
import { SimpleTaskItem } from 'app/main/meetings/models/simpleTaskItem';
import { LogRequest } from 'app/main/meetings/models/logRequest';
import { GeneratedTask } from 'app/main/meetings/models/generatedTask';
import { GeneratedTaskComment } from 'app/main/meetings/models/generatedTaskComment';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { CommonService } from 'app/common/services/common.service';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingsService implements Resolve<any>{
  private GET_MEETINGS_VIEWMODEL_URI = 'meetings/index';
  private ADD_COMMENT_URI = 'meetings/add_comment';
  private CLOSE_TASKITEM_URI = 'meetings/close_item';

  private GET_DECISIONS_URI = 'meetings/get_decisions';
  private ADD_DECISION_URI = 'meetings/add_decision';

  private GENERATE_TASK_URI = 'meetings/generate_task';
  private CHANGE_POINT_INSTANCE_URI = 'meetings/change_point_instance';
  private FIND_TASK_ITEMS_URI = 'meetings/find_task_items';
  private GET_COMMENTS_TASKITEM_URI = 'meetings/get_comments_taskItem';

  private FIND_GENERATED_TASKS_URI = 'meetings/find_generated_tasks';
  private DISPLAY_CLOSED_TASKS_URI = 'meetings/display_closed_tasks';
  private DISPLAY_NOT_CLOSED_TASKS_URI = 'meetings/display_not_closed_tasks';
  private GET_OUTDATED_TASKS_URI = 'meetings/get_outdated_tasks';
  private GET_RECENTLY_OUTDATED_TASKS_URI = 'meetings/get_recently_outdated_tasks';

  private REAFFECT_GENERATED_TASK_URI = 'meetings/reaffect_generated_task';
  private CHANGE_TASK_INSTANCE_URI = 'meetings/change_task_instance';
  private UPDATE_GENERATED_TASK_DEADLINE_URI = 'meetings/update_generated_task_deadline';
  private ADD_GENERATED_TASK_COMMENT_URI = 'meetings/add_generated_task_comment';
  private CLOSE_GENERATED_TASK_URI = 'meetings/close_generated_task';

  private GET_LOGS_URI = 'meetings/get_logs';

  meetingsViewModel: BehaviorSubject<CodirMeetingViewModel>;
  onSectorsChanged: BehaviorSubject<MeetingSector[]>;
  onEmployeesChanged: BehaviorSubject<EmployeeLevel[]>;
  onInstancesChanged: BehaviorSubject<MeetInstance[]>;

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private readonly meetingsCodir = ModuleIdentifiers.meetingsCodir;
  private readonly meetingsCA = ModuleIdentifiers.meetingsCA;
  private readonly meetingsMGT = ModuleIdentifiers.meetingsMGT;
  private moduleIdentifier: string;

  constructor(
    private _httpClient: HttpClient,
    private appService: AppService,
    private router: Router) {
    this.meetingsViewModel = new BehaviorSubject(null);
    this.onSectorsChanged = new BehaviorSubject([]);
    this.onEmployeesChanged = new BehaviorSubject([]);
    this.onInstancesChanged = new BehaviorSubject([]);
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(route: ActivatedRouteSnapshot): Observable<any> | Promise<any> | any {
    const instanceId = route.params.instanceId;
    console.log('instanceId', instanceId);
    if (instanceId == 1) {
      this.moduleIdentifier = this.meetingsCodir;
    } else if (instanceId == 2) {
      this.moduleIdentifier = this.meetingsCA;
    } else if (instanceId == 3) {
      this.moduleIdentifier = this.meetingsMGT;
    } else {
      this.router.navigateByUrl('/home');
    }
    return new Promise((resolve, reject) => {
      this.appService.getCurrentUser().subscribe(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve();
              } else {
                this.getMeetingsViewModel(instanceId).then(() => {
                  this.onHabilitationLoaded.next(habilitation);
                  resolve();
                }, (err) => {
                  reject(err);
                });
              }
            }, (err) => {
              reject(err);
            });
        } else {
          this.router.navigate(['login']);
          resolve();
        }
      }, (err) => {
        reject(err);
      });
    });
  }

  getMeetingsViewModel(instanceId: number): Promise<CodirMeetingViewModel> {
    return new Promise((resolve, reject) => {
      const url = `${BASE_URL}${this.GET_MEETINGS_VIEWMODEL_URI}?instanceId=${instanceId}`;
      this._httpClient.get<CodirMeetingViewModel>(url)
        .subscribe((meetingsViewModel) => {
          this.meetingsViewModel.next(meetingsViewModel);
          this.onSectorsChanged.next(meetingsViewModel.sectors);
          this.onEmployeesChanged.next(meetingsViewModel.codirEmployees);
          this.onInstancesChanged.next(meetingsViewModel.instances);
          resolve(meetingsViewModel);
        }, reject);
    });
  }

  addComment(codirComment: CodirComment): Observable<CodirComment> {
    const url = `${BASE_URL}${this.ADD_COMMENT_URI}`;
    return this._httpClient.post<CodirComment>(url, codirComment);
  }

  closeItem(taskItem: SimpleTaskItem): Observable<boolean> {
    const url = `${BASE_URL}${this.CLOSE_TASKITEM_URI}`;
    return this._httpClient.post<boolean>(url, taskItem);
  }

  getDecisions(filterParameter: FilterParameter): Observable<Decision[]> {
    const url = `${BASE_URL}${this.GET_DECISIONS_URI}`;
    return this._httpClient.post<Decision[]>(url, filterParameter);
  }

  addDecision(decision: Decision): Observable<Decision> {
    const url = `${BASE_URL}${this.ADD_DECISION_URI}`;
    return this._httpClient.post<Decision>(url, decision);
  }

  generateTask(requestParameter: RequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.GENERATE_TASK_URI}`;
    return this._httpClient.post<any>(url, requestParameter);
  }

  changePointInstance(requestParameter: RequestParameter): Observable<boolean> {
    const url = `${BASE_URL}${this.CHANGE_POINT_INSTANCE_URI}`;
    return this._httpClient.post<boolean>(url, requestParameter);
  }

  findTaskItems(filterParameter: FilterParameter): Observable<SimpleTaskItem[]> {
    const url = `${BASE_URL}${this.FIND_TASK_ITEMS_URI}`;
    return this._httpClient.post<SimpleTaskItem[]>(url, filterParameter);
  }

  getCommentsTaskItem(itemId: number): Observable<any> {
    const url = `${BASE_URL}${this.GET_COMMENTS_TASKITEM_URI}`;
    return this._httpClient.post<any>(url, itemId);
  }

  findGeneratedTasks(filterParameter: FilterParameter): Observable<GeneratedTask[]> {
    const url = `${BASE_URL}${this.FIND_GENERATED_TASKS_URI}`;
    return this._httpClient.post<GeneratedTask[]>(url, filterParameter);
  }

  displayClosedGeneratedTasks(currentInstance: MeetInstance): Observable<GeneratedTask[]> {
    const url = `${BASE_URL}${this.DISPLAY_CLOSED_TASKS_URI}`;
    return this._httpClient.post<GeneratedTask[]>(url, currentInstance);
  }

  displayNotClosedGeneratedTasks(currentInstance: MeetInstance): Observable<GeneratedTask[]> {
    const url = `${BASE_URL}${this.DISPLAY_NOT_CLOSED_TASKS_URI}`;
    return this._httpClient.post<GeneratedTask[]>(url, currentInstance);
  }

  getOutdatedTasks(currentInstance: MeetInstance): Observable<GeneratedTask[]> {
    const url = `${BASE_URL}${this.GET_OUTDATED_TASKS_URI}`;
    return this._httpClient.post<GeneratedTask[]>(url, currentInstance);
  }

  getRecentlyOutdatedTasks(currentInstance: MeetInstance): Observable<GeneratedTask[]> {
    const url = `${BASE_URL}${this.GET_RECENTLY_OUTDATED_TASKS_URI}`;
    return this._httpClient.post<GeneratedTask[]>(url, currentInstance);
  }

  addGeneratedTaskComment(requestParameter: RequestParameter): Observable<GeneratedTaskComment> {
    const url = `${BASE_URL}${this.ADD_GENERATED_TASK_COMMENT_URI}`;
    return this._httpClient.post<GeneratedTaskComment>(url, requestParameter);
  }

  closeGeneratedTask(task: GeneratedTask): Observable<boolean> {
    const url = `${BASE_URL}${this.CLOSE_GENERATED_TASK_URI}`;
    return this._httpClient.post<boolean>(url, task);
  }

  reaffectGeneratedTask(requestParameter: RequestParameter): Observable<boolean> {
    const url = `${BASE_URL}${this.REAFFECT_GENERATED_TASK_URI}`;
    return this._httpClient.post<boolean>(url, requestParameter);
  }

  changeTaskInstance(requestParameter: RequestParameter): Observable<boolean> {
    const url = `${BASE_URL}${this.CHANGE_TASK_INSTANCE_URI}`;
    return this._httpClient.post<boolean>(url, requestParameter);
  }

  updateGeneratedTaskDeadline(requestParameter: RequestParameter): Observable<any> {
    const url = `${BASE_URL}${this.UPDATE_GENERATED_TASK_DEADLINE_URI}`;
    return this._httpClient.post<any>(url, requestParameter);
  }

  getLogs(): Observable<LogRequest[]> {
    const url = `${BASE_URL}${this.GET_LOGS_URI}`;
    return this._httpClient.get<LogRequest[]>(url);
  }

}


