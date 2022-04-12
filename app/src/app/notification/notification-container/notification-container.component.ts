import { Component, TemplateRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
  host: {'class': 'notification-container position-fixed pt-5 mt-3 top-0 end-0', 'style': 'z-index: 9999'}
})
export class NotificationContainerComponent {

  constructor(public notificationsService: NotificationsService) {}

  isTemplate(notification: any) { return notification.textOrTpl instanceof TemplateRef; }
}
