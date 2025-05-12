import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor(private alertController: AlertController) {}

  async showConfirmation(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'إلغاء',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'تأكيد',
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }
}