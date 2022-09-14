import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Route, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/compat/auth-guard';
import { HomeService } from './home.service';

const redirectUnauthorizedToSignin = () => redirectUnauthorizedTo(['/sign-in']);

const homeRoutes: Route[] = [
  {
      path     : '',
      component: HomeComponent,
      resolve: {main: HomeService},
      ...canActivate(redirectUnauthorizedToSignin) 
  }
];

@NgModule({
  declarations: [
    HomeComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes)
  ]
})
export class HomeModule { }
