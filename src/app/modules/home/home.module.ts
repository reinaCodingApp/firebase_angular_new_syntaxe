import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as moment from 'moment';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { BoardTasksComponent } from './board-tasks/board-tasks.component';
import { BoardTasksAddListComponent } from './board-tasks/board-tasks-add-list/board-tasks-add-list.component';
 
const redirectUnauthorizedToSignin = () => redirectUnauthorizedTo(['/sign-in']);

const homeRoutes: Route[] = [
  {
      path     : '',
      component: BoardTasksComponent,
      resolve: {main: HomeService},
      ...canActivate(redirectUnauthorizedToSignin) 
  }, 
];


 

@NgModule({
  declarations: [
    HomeComponent,
  

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes), 

  
  ],
 
 
 
})
export class HomeModule { }
