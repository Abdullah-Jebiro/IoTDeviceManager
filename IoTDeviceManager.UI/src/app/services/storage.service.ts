import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Device } from '../models/device.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private readonly DB_NAME = 'iotDeviceManager';
  private readonly DB_VERSION = 1;

  constructor(private toastController: ToastController) {
    this.init();
  }

  // Initialize SQLite database
  private async init(): Promise<void> {
    try {
      this.db = await this.sqlite.createConnection(this.DB_NAME, false, 'no-encryption', this.DB_VERSION, false);
      await this.db.open();

      // Create tables if they don't exist
      const createDevicesTable = `
        CREATE TABLE IF NOT EXISTS devices (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          isNew TEXT NOT NULL
        );
      `;
      const createDeviceNamesTable = `
        CREATE TABLE IF NOT EXISTS deviceNames (
          name TEXT PRIMARY KEY
        );
      `;
      await this.db.execute(createDevicesTable);
      await this.db.execute(createDeviceNamesTable);
    } catch (error) {
      console.error('فشل تهيئة قاعدة البيانات:', error);
      await this.showToast('فشل تهيئة قاعدة البيانات، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Add device
  async addDevice(device: Device): Promise<void> {
    try {
      if (!device.id) {
        device.id = Date.now().toString(); // Generate unique ID
      }
      const query = `
        INSERT INTO devices (id, name, isNew)
        VALUES (?, ?, ?);
      `;
      await this.db?.run(query, [device.id, device.name, device.isNew]);
      await this.addDeviceName(device.name);
      await this.showToast('تمت إضافة الجهاز بنجاح.');
    } catch (error) {
      console.error('فشل إضافة الجهاز:', error);
      await this.showToast('فشل إضافة الجهاز، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Delete device
  async deleteDevice(deviceId: string): Promise<void> {
    try {
      const query = `DELETE FROM devices WHERE id = ?;`;
      await this.db?.run(query, [deviceId]);
      await this.showToast('تمت إزالة الجهاز بنجاح.');
    } catch (error) {
      console.error('فشل حذف الجهاز:', error);
      await this.showToast('فشل حذف الجهاز، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Get all devices
  async getAllDevices(): Promise<Device[]> {
    try {
      const query = `SELECT * FROM devices;`;
      const result = await this.db?.query(query);
      const devices: Device[] = result?.values?.map(row => ({
        id: row.id,
        name: row.name,
        isNew: row.isNew,
      })) || [];
      return devices;
    } catch (error) {
      console.error('فشل جلب الأجهزة:', error);
      await this.showToast('فشل جلب الأجهزة، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Clear all devices
  async clearAllDevices(): Promise<void> {
    try {
      const query = `DELETE FROM devices;`;
      await this.db?.run(query);
      await this.showToast('تم مسح جميع الأجهزة بنجاح.');
    } catch (error) {
      console.error('فشل مسح الأجهزة:', error);
      await this.showToast('فشل مسح الأجهزة، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Add device name
  async addDeviceName(name: string): Promise<void> {
    try {
      const lowerCaseName = name.toLowerCase();
      const checkQuery = `SELECT name FROM deviceNames WHERE LOWER(name) = ?;`;
      const checkResult = await this.db?.query(checkQuery, [lowerCaseName]);
      if (!checkResult?.values?.length) {
        const query = `INSERT INTO deviceNames (name) VALUES (?);`;
        await this.db?.run(query, [name]);
      }
    } catch (error) {
      console.error('فشل إضافة اسم الجهاز:', error);
      await this.showToast('فشل إضافة اسم الجهاز، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Get device names
  async getDeviceNames(): Promise<string[]> {
    try {
      const deviceNames = [
        'Galaxy A33', 'Galaxy A34', 'Galaxy A52', 'Galaxy A53',
        'Galaxy A54', 'Galaxy A71', 'Galaxy A72', 'Galaxy A73',
        'Galaxy M53', 'Galaxy M54', 'Galaxy Note 20', 'Galaxy Note 20 Ultra',
        'Galaxy Note 7', 'Galaxy Note 8', 'Galaxy S21', 'Galaxy S21 Ultra',
        'Galaxy S21+', 'Galaxy S22', 'Galaxy S22 Ultra', 'Galaxy S22+',
        'Galaxy S23', 'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S24',
        'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy Z Flip4', 'Galaxy Z Flip5',
        'Galaxy Z Fold4', 'Galaxy Z Fold5', 'Huawei Mate 50 Pro',
        'Huawei Mate 60 Pro+', 'Huawei Nova 11', 'Huawei P50 Pro',
        'Huawei P60 Pro', 'iPhone 11', 'iPhone 11 Pro', 'iPhone 11 Pro Max',
        'iPhone 12', 'iPhone 12 Mini', 'iPhone 12 Pro', 'iPhone 12 Pro Max',
        'iPhone 13', 'iPhone 13 Mini', 'iPhone 13 Pro', 'iPhone 13 Pro Max',
        'iPhone 14', 'iPhone 14 Plus', 'iPhone 14 Pro', 'iPhone 14 Pro Max',
        'iPhone 15', 'iPhone 15 Plus', 'iPhone 15 Pro', 'iPhone 15 Pro Max',
        'iPhone 16', 'iPhone 16 Pro Max', 'iPhone 6', 'iPhone 6s',
        'iPhone 6s Plus', 'iPhone 7', 'iPhone 7 Plus', 'iPhone 8',
        'iPhone 8 Plus', 'iPhone SE (2nd generation)', 'iPhone SE (3rd generation)',
        'iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max',
        'OnePlus 10 Pro', 'OnePlus 10T', 'OnePlus 11', 'OnePlus 12',
        'OnePlus 7 Pro', 'OnePlus 7T Pro', 'OnePlus 8 Pro', 'OnePlus 8T',
        'OnePlus 9', 'OnePlus 9 Pro', 'OnePlus Nord 2', 'OnePlus Nord 3',
        'Pixel 3', 'Pixel 3 XL', 'Pixel 3a', 'Pixel 4',
        'Pixel 4 XL', 'Pixel 4a', 'Pixel 5', 'Pixel 5a',
        'Pixel 6', 'Pixel 6 Pro', 'Pixel 6a', 'Pixel 7',
        'Pixel 7 Pro', 'Pixel 8', 'Pixel 8 Pro', 'POCO F5 Pro',
        'POCO X4 GT', 'POCO X5 Pro', 'Redmi Note 11', 'Redmi Note 12 Pro',
        'Redmi Note 13 Pro+', 'Redmi Note 14 Pro+', 'Xiaomi 12T Pro',
        'Xiaomi 13', 'Xiaomi 13 Pro', 'Xiaomi 14 Pro', 'Xiaomi 14 Ultra'
      ];
      const query = `SELECT name FROM deviceNames;`;
      const result = await this.db?.query(query);
      let names: string[] = result?.values?.map(row => row.name) || [];

      if (names.length === 0) {
        await this.showToast('Default device names to insert');
        // Insert default names using individual INSERT OR IGNORE queries
        for (const name of deviceNames) {
          const insertQuery = `INSERT OR IGNORE INTO deviceNames (name) VALUES (?);`;
          await this.db?.run(insertQuery, [name]);
        }
        return deviceNames;
      }
      const mergedNames = [...new Set([...names, ...deviceNames])];
      mergedNames.sort((a, b) => a.localeCompare(b, 'ar', { sensitivity: 'base' }));
      return mergedNames;

    } catch (error) {
      console.error('فشل جلب أسماء الأجهزة:', error);
      await this.showToast('فشل جلب أسماء الأجهزة، يرجى المحاولة لاحقًا.');
      throw error;
    }
  }

  // Show toast message
  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'primary', // Primary for success, danger for errors
    });
    await toast.present();
  }

  // Close database connection (optional, for cleanup)
  async closeConnection(): Promise<void> {
    try {
      if (this.db) {
        await this.db.close();
        await this.sqlite.closeConnection(this.DB_NAME, false);
      }
    } catch (error) {
      console.error('فشل إغلاق قاعدة البيانات:', error);
    }
  }
}