import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private confirmationEnabled: boolean = true;

  isConfirmationEnabled(): boolean {
    return this.confirmationEnabled;
  }

  setConfirmationEnabled(enabled: boolean): void {
    this.confirmationEnabled = enabled;
  }
}