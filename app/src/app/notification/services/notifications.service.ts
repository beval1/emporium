import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifications: any[] = [];

  private show(Tpl: string, text: string, options: any = {}) {
    this.notifications.push({ Tpl, text, ...options });
  }

  showSuccess(text: string){
    this.show('success', text, {classname: 'notification bg-success text-light', delay: 10000})
  }

  showError(text: string){
    this.show('error', text, {classname: 'notification bg-danger text-light', delay: 15000})
  }

  remove(toast: any) {
    this.notifications = this.notifications.filter(t => t !== toast);
  }

  clear() {
    this.notifications.splice(0, this.notifications.length);
  }
}
