import { Component, OnInit, TemplateRef } from '@angular/core';
import { NotificationsService } from '../services/notifications.service';


@Component({
  selector: 'app-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss']
})
export class NotificationContainerComponent implements OnInit {

  constructor(public notificationsService: NotificationsService) {}

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }

  ngOnInit(): void {
    
  }

}
