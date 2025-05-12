import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { ConfirmationService } from 'src/app/services/confirmation.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Device } from 'src/app/models/device.model';

@Component({
  selector: 'app-display-devices',
  templateUrl: './display-devices.page.html',
  styleUrls: ['./display-devices.page.scss'],
  standalone: false,
})
export class DisplayDevicesPage implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  newDevices: Device[] = [];
  oldDevices: Device[] = [];
  groupedNewDevices: any[] = [];
  groupedOldDevices: any[] = [];
  isNewDevicesVisible: boolean = false;
  isOldDevicesVisible: boolean = false;
  isGroupedView: boolean = false;
  searchTerm: string = '';

  constructor(
    private storageService: StorageService,
    private toastController: ToastController,
    private confirmationService: ConfirmationService,
    private settingsService: SettingsService
  ) {}

  async ionViewWillEnter() {
    try {
      this.devices = await this.storageService.getAllDevices();
      this.filteredDevices = [...this.devices];
      this.sortDevices();
      this.groupDevices();
    } catch (error) {
      console.error('فشل تحميل الأجهزة:', error);
      await this.showToast('فشل تحميل الأجهزة، يرجى المحاولة لاحقًا.');
    }
  }

  ngOnInit() {}

  toggleDevices(type: string) {
    if (type === 'new') {
      this.isNewDevicesVisible = !this.isNewDevicesVisible;
    } else if (type === 'old') {
      this.isOldDevicesVisible = !this.isOldDevicesVisible;
    }
  }

  toggleView() {
    this.isGroupedView = !this.isGroupedView;
    this.groupDevices();
  }

  sortDevices() {
    this.newDevices = this.filteredDevices.filter(device => device.isNew === 'true');
    this.oldDevices = this.filteredDevices.filter(device => device.isNew === 'false');
  }

  groupDevices() {
    if (this.isGroupedView) {
      this.groupedNewDevices = this.groupDevicesByName(this.newDevices);
      this.groupedOldDevices = this.groupDevicesByName(this.oldDevices);
    } else {
      this.groupedNewDevices = [];
      this.groupedOldDevices = [];
    }
  }

  groupDevicesByName(devices: Device[]): any[] {
    const grouped = devices.reduce((acc, device) => {
      const name = device.name;
      if (!acc[name]) {
        acc[name] = { name, count: 1, isNew: device.isNew };
      } else {
        acc[name].count++;
      }
      return acc;
    }, {} as { [key: string]: { name: string; count: number; isNew: boolean | string } });
    return Object.values(grouped);
  }

  filterDevices() {
    const searchText = this.searchTerm.trim().toLowerCase();
    if (!searchText) {
      this.filteredDevices = [...this.devices];
    } else {
      this.filteredDevices = this.devices.filter(device =>
        device.name.toLowerCase().includes(searchText)
      );
    }
    this.sortDevices();
    this.groupDevices();
  }

  async decreaseDeviceCount(device: Device | { name: string; isNew: boolean | string }) {
    const confirm = this.settingsService.isConfirmationEnabled()
      ? await this.confirmationService.showConfirmation(
          'تأكيد الحذف',
          `هل أنت متأكد من إزالة جهاز ${device.name}؟`
        )
      : true;

    if (confirm) {
      try {
        let deviceId: string;
        if (this.isGroupedView) {
          const instance = this.devices.find(
            d => d.name === device.name && d.isNew === device.isNew
          );
          if (!instance) {
            throw new Error('الجهاز غير موجود');
          }
          deviceId = instance.id;
        } else {
          deviceId = (device as Device).id;
        }

        await this.storageService.deleteDevice(deviceId);
        this.devices = await this.storageService.getAllDevices();
        this.filterDevices();
        await this.showToast('تمت إزالة الجهاز بنجاح.');
      } catch (error) {
        console.error('خطأ أثناء إزالة الجهاز:', error);
        await this.showToast('فشل إزالة الجهاز، يرجى المحاولة لاحقًا.');
      }
    }
  }

  getStatusText(): string {
    return ''; // لا حاجة لعرض حالة المزامنة مع SQLite
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary', // Primary for success, danger for errors
    });
    await toast.present();
  }
}