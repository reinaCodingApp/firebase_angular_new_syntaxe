import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Injectable()
export class HomeService implements Resolve<any> {

  constructor(private auth: Auth) { 
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
  }
  hi() {
    console.log('### hi');
  }
}
