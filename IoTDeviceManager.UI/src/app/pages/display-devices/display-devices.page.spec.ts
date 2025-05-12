import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayDevicesPage } from './display-devices.page';

describe('DisplayDevicesPage', () => {
  let component: DisplayDevicesPage;
  let fixture: ComponentFixture<DisplayDevicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayDevicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
