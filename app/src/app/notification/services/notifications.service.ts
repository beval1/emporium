import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: any[] = [];

  private show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.notifications.push({ textOrTpl, ...options });
  }

  showSuccess(textOrTpl: string | TemplateRef<any>){
    this.show(textOrTpl, {classname: 'bg-success text-light', delay: 10000})
  }

  showError(textOrTpl: string | TemplateRef<any>){
    this.show(textOrTpl, {classname: 'bg-danger text-light', delay: 15000})
  }

  remove(toast: any) {
    this.notifications = this.notifications.filter(t => t !== toast);
  }

  clear() {
    this.notifications.splice(0, this.notifications.length);
  }
}
