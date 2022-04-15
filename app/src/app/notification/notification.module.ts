import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    NotificationContainerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FontAwesomeModule,
  ],
  // bootstrap: [NotificationContainerComponent],
  exports: [NotificationContainerComponent],
})
export class NotificationModule { }
