import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Post } from 'app/models/post';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class PostService implements Resolve<any> {

  onPostChanged: BehaviorSubject<Post>;
  constructor() {
    this.onPostChanged = new BehaviorSubject(null);
   }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const uid = route.params.uid;
    const promise = new Promise((resolve, reject) => {
      Promise.all([
        this.getPost(uid)
      ]).then(() => {
        resolve();
      }, reject);
    });
    return promise;
  }
  getPost(uid: string){
    if (uid === 'new'){
      this.onPostChanged.next(null);
    } else {
      // get post from server
      const p = new Post();
      p.id = uid;
      p.title = 'Mon titre';
      p.content = 'mon contenu du serveur';
      this.onPostChanged.next(p);
    }
  }


}
