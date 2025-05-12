import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.page.html',
  styleUrls: ['./add-device.page.scss'],
  standalone: false,
})
export class AddDevicePage implements OnInit {
  deviceForm!: FormGroup;
  deviceSuggestions: string[] = [];
  deviceName: string = '';
  isloading: boolean = false;

  constructor(
    private toastController: ToastController,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.deviceForm = this.formBuilder.group({
      deviceName: ['', Validators.required],
      numberOfDevices: [1, [Validators.required, Validators.min(1)]],
      isNewDevice: [null, Validators.required],
    });


  }


  ionViewWillEnter() {
    this.storageService.getDeviceNames().then(suggestions => {
      this.deviceSuggestions = suggestions;
    });
  }



  selectItem(name: string) {
    this.deviceForm.get('deviceName')?.setValue(name);
  }

  selectRadio(radioId: string) {
    const radioElement = document.getElementById(radioId) as HTMLIonRadioElement;
    if (radioElement) {
      radioElement.click();
    }
  }

  async addDevice() {
    this.isloading = true;
    const deviceName = this.deviceForm.get('deviceName')?.value.trim().toLowerCase();
    const numberOfDevices = this.deviceForm.get('numberOfDevices')?.value;
    const isNewDevice = this.deviceForm.get('isNewDevice')?.value;

    if (!deviceName) {
      await this.showToast('يرجى إدخال اسم الجهاز.');
      this.isloading = false;
      return;
    }

    try {
      // Add multiple instances of the device
      for (let i = 0; i < numberOfDevices; i++) {
        const device = { name: deviceName.toLowerCase(), isNew: isNewDevice.toString() } as any;
        await this.storageService.addDevice(device);

      }
      this.isloading = false;
      this.deviceForm.reset({deviceName : null, numberOfDevices: 1, isNewDevice: null });
      await this.showToast('تمت إضافة الأجهزة بنجاح.');
    } catch (error) {
      console.error('خطأ أثناء إضافة الجهاز:', error);
       this.isloading = false;
      await this.showToast('فشل في إضافة الأجهزة.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary',
    });
    await toast.present();
  }
}