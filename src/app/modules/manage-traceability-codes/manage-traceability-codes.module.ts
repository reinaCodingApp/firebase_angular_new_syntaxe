import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { redirectUnauthorizedTo, canActivate } from '@angular/fire/auth-guard';
import { ManageTraceabilityCodesComponent } from './manage-traceability-codes.component';
import { ManageTraceabilityCodesService } from './manage-traceability-codes.service';
import { SharedModule } from 'app/shared/shared.module';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/sign-in']);
const routes: Routes = [
  {
    path: '',
    component: ManageTraceabilityCodesComponent,
    ...canActivate(redirectUnauthorizedToLogin),
    resolve: { resolve: ManageTraceabilityCodesService }
  }
];

@NgModule({
  declarations: [
    ManageTraceabilityCodesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatSelectModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule
  ],
})
export class ManageTraceabilityCodesModule {
}
