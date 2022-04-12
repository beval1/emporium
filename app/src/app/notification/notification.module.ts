import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NotificationContainerComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  // bootstrap: [NotificationContainerComponent],
  exports: [NotificationContainerComponent],
})
export class NotificationModule { }
