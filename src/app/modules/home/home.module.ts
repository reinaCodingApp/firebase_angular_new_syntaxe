import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import * as moment from 'moment';
import { SharedModule } from 'app/shared/shared.module';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { HomeComponent } from './home.component';
import { HomeService } from './home.service';
import { BoardTasksComponent } from './board-tasks/board-tasks.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomConfirmDialogModule } from 'app/shared/custom-confirm-dialog/custom-confirm-dialog.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddCardTaskDialogComponent } from './board-tasks/dialogs/add-card-task-dialog/add-card-task-dialog.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
 
const redirectUnauthorizedToSignin = () => redirectUnauthorizedTo(['/sign-in']);

const homeRoutes: Route[] = [
  {
      path     : '',
      component: HomeComponent,
      ...canActivate(redirectUnauthorizedToSignin),
      children: [
        {
          path     : '',
          component: BoardTasksComponent,
          resolve: {main: HomeService},
        }
      ]

  }, 
];


 

@NgModule({
  declarations: [
    HomeComponent,
    BoardTasksComponent,
    AddCardTaskDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(homeRoutes), 
    MatSortModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatTableModule,
    NgxMatSelectSearchModule,
    CustomConfirmDialogModule,
    FormsModule,
    MatDialogModule,
    MatNativeDateModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    DragDropModule,
    MatCheckboxModule
  
  ],
 
 
 
})
export class HomeModule { }
