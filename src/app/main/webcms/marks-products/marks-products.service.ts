import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Habilitation } from 'app/main/access-rights/models/habilitation';
import { ModuleIdentifiers } from 'app/data/moduleIdentifiers';
import { AppService } from 'app/app.service';
import { Mark } from './models/mark';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestoreCollections } from 'app/data/firestoreCollections';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class MarksProductsService implements Resolve<any>
{
  private basePath = 'marks';
  private productsBasePath = 'products';

  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.marksProducts;

  constructor(
    private angularFirestore: AngularFirestore,
    private router: Router,
    private appService: AppService,
    private angualrFireStorage: AngularFireStorage
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
                resolve();
              } else {
                this.onHabilitationLoaded.next(habilitation);
                resolve();
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

  getMarks(): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webMarks, query => query.orderBy('displayOrder')).snapshotChanges();
  }

  addMark(mark: Mark, file: File) {
    const newMark =
      {
        name: mark.name,
        webSite: mark.webSite,
        displayOrder: mark.displayOrder
      } as Mark;
    if (file != null) {
      const filePath = `${this.basePath}/${file.name}`;
      const storageRef = this.angualrFireStorage.ref(filePath);
      const uploadTask = this.angualrFireStorage.upload(filePath, file);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            console.log('File available at', downloadURL);
            newMark.src = downloadURL;
            this.angularFirestore.collection(firestoreCollections.webMarks).add(newMark);
          });
        })
      ).subscribe();
      return uploadTask.percentageChanges();
    } else {
      this.angularFirestore.collection(firestoreCollections.webMarks).add(newMark);
    }
  }

  updateMark(mark: Mark): Promise<any> {
    const updatedMark =
      {
        name: mark.name,
        webSite: mark.webSite,
        src: mark.src
      } as Mark;
    const markDocument = this.angularFirestore.collection(firestoreCollections.webMarks).doc(mark.uid).ref;
    return markDocument.update(updatedMark);
  }

  uploadFile(mark: Mark, file: File) {
    const filePath = `${this.basePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          mark.src = downloadURL;
          console.log('mark to update', mark);
          this.updateMark(mark);
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

  // Products

  getProducts(searchInput: string = null): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webProducts, query => {
      if (searchInput && searchInput.length > 0) {
        return query.orderBy('name')
                    .startAt(searchInput)
                    .endAt(searchInput + '\uf8ff');
      } else {
        return query;
      }
    }).snapshotChanges();
  }

  addProduct(product: Product) {
    const newProduct =
      {
        name: product.name,
        description: product.description,
        details: product.details,
        distributionPlaces: product.distributionPlaces,
        images: product.images,
        mark: product.mark
      } as Product;

    return this.angularFirestore.collection(firestoreCollections.webProducts).add(newProduct);
  }

  updateProduct(product: Product) {
    const updatedProduct =
      {
        name: product.name,
        description: product.description,
        details: product.details,
        distributionPlaces: product.distributionPlaces,
        images: product.images,
        mark: product.mark
      } as Product;
    const productDocument = this.angularFirestore.collection(firestoreCollections.webProducts).doc(product.uid).ref;
    return productDocument.update(updatedProduct);
  }

  getProduct(uid: string): Observable<any> {
    return this.angularFirestore.collection(firestoreCollections.webProducts).doc(uid).get();
  }

  uploadImageForProduct(product: Product, file: File) {
    const filePath = `${this.productsBasePath}/${file.name}`;
    const storageRef = this.angualrFireStorage.ref(filePath);
    const uploadTask = this.angualrFireStorage.upload(filePath, file);
    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          product.images.push(downloadURL);
          if (product.uid) {
            this.updateProduct(product);
          }
        });
      })
    ).subscribe();
    return uploadTask.percentageChanges();
  }

}
