import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule, MatDatepickerModule, MatTabsModule, MatTableModule, MatChipsModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MarksProductsComponent } from './marks-products.component';
import { MarksProductsService } from './marks-products.service';
import { MarksComponent } from './marks/marks.component';
import { ProductsComponent } from './products/products.component';
import { NewProductComponent } from './products/new-product/new-product.component';


const redirectUnauthorizedToLoginPage = redirectUnauthorizedTo(['login']);
const routes: Routes = [
  {
    path: 'marks-products/marks',
    component: MarksComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MarksProductsService }
  },
  {
    path: 'marks-products/products',
    component: ProductsComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MarksProductsService }
  },
  {
    path: 'marks-products/products/product',
    component: NewProductComponent, ...canActivate(redirectUnauthorizedToLoginPage),
    resolve: { resolve: MarksProductsService }
  }
];

@NgModule({
  declarations: [
    MarksProductsComponent,
    MarksComponent,
    ProductsComponent,
    NewProductComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSelectModule,
    MatToolbarModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatCardModule,
    MatStepperModule,
    MatDatepickerModule,
    MatTabsModule,
    MatTableModule,
    MatChipsModule,

    FuseSharedModule,
    FuseSidebarModule,
  ],
  providers: [MarksProductsService]
})
export class MarksProductsModule { }
