import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Module } from 'app/modules/access-rights/models/module';
import { Firestore, collection, orderBy, query, getDocs } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AuthService } from '../auth/auth.service';
import { FuseNavigationItem } from '@fuse/components/navigation';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    onNavigationMenuChanged: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _authService: AuthService,
                private firestore: Firestore)
    {
    }

    
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }
    
    loadNavigationMenu() {
        return of(this._authService.getCurrentUser().then(user => {
            if (!user) {
                console.log('### user is nil')
                this.onNavigationMenuChanged.next([]);
              } else {
                console.log('### user is not nil', user)
              const collectionRef = collection(this.firestore, firestoreCollections.modules);
              const finalQuery = query(collectionRef, orderBy('index', 'asc'));
              const snapShotQuery = getDocs(finalQuery);
              return snapShotQuery.then(data => {
                  if (data && data.size > 0) {
                      const modules = data.docs.map(d => ({ id: d.id, ...d.data() as object } as Module));
                      const userModules: Module[] = [];
                      const claims = user.customClaims;
                      modules.forEach((m) => {
                        if (m.type === 'collapsable' && m.children && m.children.length > 0) {
                          const parentMenu = { ...m };
                          parentMenu.children = [];
                          let includeParentMenu = false;
                          m.children.forEach((child) => {
                            if (claims[child.key] > 0 && child.displayInMenu) {
                              parentMenu.children.push({...child, type: 'basic', link: child.url});
                              includeParentMenu = true;
                            }
                          });
                          if (includeParentMenu) {
                            userModules.push(parentMenu);
                          }
          
                        } else if (m.type === 'item') {
                          if (claims[m.key] > 0 && m.displayInMenu) {
                            userModules.push({ ...m, type: 'basic' });
                          }
                        }
                      });
                      const builtModules = [{
                        id: 'applications',
                        title: 'APPLICATIONS',
                        type: 'group',
                        children: [...userModules]
                      }];
                      this.onNavigationMenuChanged.next(builtModules);
                      console.log('#### modules', builtModules);
                      let navigation = {compact   : null,
                                        default   : builtModules as FuseNavigationItem[],
                                        futuristic: null,
                                        horizontal: null };
                      this._navigation.next(navigation);

                    }
                  })
              }
        }));
      }
}
