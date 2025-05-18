import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftViewComponent } from './shift-view/shift-view.component';
import { VisitLoggerComponent } from './visit-logger/visit-logger.component';
import { VisitSummaryComponent } from './visit-summary/visit-summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'shift', pathMatch: 'full' },  // Default inside /user
  { path: 'shift', component: ShiftViewComponent },
  { path: 'logger', component: VisitLoggerComponent },
  { path: 'summary', component: VisitSummaryComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
