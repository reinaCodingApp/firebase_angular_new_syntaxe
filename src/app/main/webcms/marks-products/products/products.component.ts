import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Product } from '../models/product';
import { MarksProductsService } from '../marks-products.service';
import { map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {

  displayedColumns = ['image', 'name', 'mark'];
  products: Product[] = [];
  constructor(private marksPorductsService: MarksProductsService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  searchProducts(searchInput: string): void {
    this.getProducts(searchInput);
  }

  getProducts(searchInput: string = null): void {
    this.marksPorductsService.getProducts(searchInput).pipe(map(data => {
      return data.map(item => {
        const o = item.payload.doc.data() as Product;
        o.uid = item.payload.doc.id;
        return o;
      });
    })).subscribe(products => {
      this.products = products;
    });
  }

}
