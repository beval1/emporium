import { Component, TemplateRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
  host: {'class': 'notification-container position-fixed pt-5 mt-3 top-0 end-0', 'style': 'z-index: 9999'}
})
export class NotificationContainerComponent {
  faCheck = faCheck;
  faCircleExclamation = faCircleExclamation;

  constructor(public notificationsService: NotificationsService) {}

  //isTemplate(notification: any) { return notification.textOrTpl instanceof TemplateRef; }
}
