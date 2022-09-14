import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { Department } from 'app/common/models/department';
import { AppService } from 'app/app.service';
import { Habilitation } from 'app/modules/access-rights/models/habilitation';


@Injectable({
  providedIn: 'root'
})
export class WebsiteService implements Resolve<any>
{
  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.posts;
  departments: Department[] = null;

  constructor(
    private _httpClient: HttpClient,
    private router: Router,
    private appService: AppService,
  ) {
    this.onHabilitationLoaded = new BehaviorSubject(null);
  }

  resolve(): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.appService.getConnectedUser().then(user => {
        if (user) {
          this.appService.getHabilitation(user, this.moduleIdentifier)
            .then(habilitation => {
         
              
              if (habilitation.unauthorized()) {
                this.router.navigate(['home']);
                resolve(null);
              } else {
                
                this.onHabilitationLoaded.next(habilitation);
                resolve(null);
              }
            }, (err) => {
              reject(err);
            });
        }
      }, (err) => {
        reject(err);
      });
    });
  }
}
