import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { VisitSummaryComponent } from './visit-summary/visit-summary.component';
import { ShiftViewComponent } from './shift-view/shift-view.component';
import { VisitLoggerComponent } from './visit-logger/visit-logger.component';

@NgModule({
  declarations: [
    ShiftViewComponent,
    VisitLoggerComponent,
    VisitSummaryComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule

  ]
})
export class UserModule { }
