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
import { resizeImage } from 'app/common/tools/main-tools';
import { MatSnackBar } from '@angular/material';

const MARKS_IMAGE_SIZE = { width: 300, height: 200 };
const PRODUCTS_IMAGE_SIZE = { width: 1366, height: 905 };
const MARKS_STORAGE_PATH = 'marks';
const PRODUCTS_STORAGE_PATH = 'products';
@Injectable()
export class MarksProductsService implements Resolve<any>
{
  onHabilitationLoaded: BehaviorSubject<Habilitation>;
  private moduleIdentifier = ModuleIdentifiers.marksProducts;
  onMarkPictureChanged: BehaviorSubject<string>;

  constructor(
    private angularFirestore: AngularFirestore,
    private router: Router,
    private appService: AppService,
    private angularFireStorage: AngularFireStorage,
    private matSnackBar: MatSnackBar
  ) {
    this.onHabilitationLoaded = new BehaviorSubject(null);
    this.onMarkPictureChanged = new BehaviorSubject(null);
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

  addMark(mark: Mark) {
    const newMark =
      {
        name: mark.name,
        webSite: mark.webSite,
        displayOrder: mark.displayOrder,
        src: mark.src
      } as Mark;
    return this.angularFirestore.collection(firestoreCollections.webMarks).add(newMark);
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
    const filePath = `${MARKS_STORAGE_PATH}/${file.name}`;
    const storageRef = this.angularFireStorage.ref(filePath);
    const uploadTask = this.angularFireStorage.upload(filePath, file);
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
  uploadMarkPicutre(file: File) {
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    return resizeImage(file, MARKS_IMAGE_SIZE.width, MARKS_IMAGE_SIZE.height).then(blobResult => {
      const storageRef = this.angularFireStorage.ref(`images/${MARKS_STORAGE_PATH}/${fileName}`);
      const uploadTask = storageRef.put(blobResult);
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            this.onMarkPictureChanged.next(downloadURL);
          });
        })
      ).subscribe();
    }).catch(error => {
      const msg = error.message ? error.message : `La ressource n'a pas pu être traitée, veuillez joindre un fichier PNG ou JPEG`;
      this.matSnackBar.open(msg, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 30000,
        panelClass: 'warn'
      });
      console.log('###### errormessage', error);
    });
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

  uploadImageForProduct(product: Product, file: File): Promise<any> {
    const splited = file.name.split('.');
    const fileExtension = splited[splited.length - 1];
    const fileName = `${new Date().getTime()}.${fileExtension}`;
    return resizeImage(file, PRODUCTS_IMAGE_SIZE.width, PRODUCTS_IMAGE_SIZE.height).then(blobResult => {
      const filePath = `${PRODUCTS_STORAGE_PATH}/${fileName}`;
      const storageRef = this.angularFireStorage.ref(filePath);
      const uploadTask = storageRef.put(blobResult);
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
    }).catch(error => {
      const msg = error.message ? error.message : `La ressource n'a pas pu être traitée, veuillez joindre un fichier PNG ou JPEG`;
      this.matSnackBar.open(msg, 'OK', {
        verticalPosition: 'top',
        horizontalPosition: 'center',
        duration: 30000,
        panelClass: 'warn'
      });
      console.log('###### errormessage', error);
    });
  }

}
