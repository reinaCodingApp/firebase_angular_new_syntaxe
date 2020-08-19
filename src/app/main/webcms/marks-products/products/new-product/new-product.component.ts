import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Product } from '../../models/product';
import { MarksProductsService } from '../../marks-products.service';
import { Mark } from '../../models/mark';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { SharedNotificationService } from 'app/common/services/shared-notification.service';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewProductComponent implements OnInit {
  marks: Mark[] = [];
  product: Product = new Product();
  mode = 'new';
  productId: string;
  constructor(
    private marksPorductsService: MarksProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: SharedNotificationService) {
    this.mode = this.route.snapshot.queryParams.mode as string;

    if (this.mode === 'edit') {
      this.productId = this.route.snapshot.queryParams.productId;
      this.marksPorductsService.getProduct(this.productId).subscribe((result) => {
        if (result.exists) {
          this.product = { uid: result.id, ...result.data() } as Product;
        }
      });
    }
  }

  ngOnInit() {
    this.marksPorductsService.getMarks().pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Mark;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(marks => {
      console.log(marks);
      this.marks = marks;
      if (this.mode === 'edit') {
        const filteredMark = marks.filter(m => m.uid === this.product.mark.uid);
        if (filteredMark && filteredMark.length > 0) {
          this.product.mark = filteredMark[0];
        }

        console.log('this.product.mark', this.product.mark);
      }

    });
  }

  addProduct(form: NgForm): void {
    if (form.valid && this.product && this.product.images.length > 0) {
      this.marksPorductsService.addProduct(this.product).then(() => {
        this.router.navigateByUrl('marks-products/products');
      });
    } else {
      this.notificationService.showWarning(`Tout les champs et les images sont obligatoires`);
    }
  }

  updateProduct(form: NgForm): void {
    if (form.valid && this.product && this.product.images.length > 0) {
      this.marksPorductsService.updateProduct(this.product).then(() => {
        this.router.navigateByUrl('marks-products/products');
      });
    } else {
      this.notificationService.showWarning(`Tout les champs et les images sont obligatoires`);
    }
  }

  filePicked(fileInput): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const file = fileInput.target.files[0];
      if (this.mode === 'edit') {
        this.marksPorductsService.uploadImageForProduct(this.product, file)
          .then(() => {
          });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.marksPorductsService.uploadImageForProduct(this.product, file)
            .then(() => {
            });
        };
      }
    }
  }

  removeImage(index: number): void {
    this.product.images.splice(index, 1);
    this.marksPorductsService.updateProduct(this.product).then(() => {
      console.log('updated');
    });
  }

  removeDistribution(distribution: string): void {
    const index = this.product.distributionPlaces.indexOf(distribution);
    if (index >= 0) {
      this.product.distributionPlaces.splice(index, 1);
    }
  }

  addDistribution(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value) {
      this.product.distributionPlaces.push(value);
    }
    if (input) {
      input.value = '';
    }
  }

}
