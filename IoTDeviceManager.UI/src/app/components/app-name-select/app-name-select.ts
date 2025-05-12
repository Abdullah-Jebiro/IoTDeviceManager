import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IonIcon, IonItem, IonButton, IonLabel, IonInput, IonList } from "@ionic/angular/standalone";

@Component({
  selector: 'app-name-select',
  templateUrl: `app-name-select.html`,
  styles: [`
    .name-select-container {
      position: relative;
      width: 100%;
    }
    .dropdown-container {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 999;
      background: white;
      border: 1px solid #ddd;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      max-height: 200px;
      overflow-y: auto;
    }
    .search-results {
      width: 100%;
    }
    .no-results {
      padding: 16px;
      text-align: center;
    }
    .selected {
      --background: rgba(var(--ion-color-primary-rgb), 0.1);
    }
  `],
  standalone : false,
})
export class NameSelectComponent implements OnInit {
  @Input() names: string[] = [];
  @Input() label: string = 'اختر الاسم';
  @Input() selectedName: string = '';
  @Input() allowCreatingNames: boolean = true; 

  @Output() nameChange = new EventEmitter<string>();
  @Output() nameCreated = new EventEmitter<string>();

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef;

  searchControl: FormControl = new FormControl('');
  filteredNames: string[] = [];
  isDropdownOpen: boolean = false;

  constructor() {}

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.filterNames(value);
    });

    this.filteredNames = [...this.names];

    if (this.selectedName) {
      this.searchControl.setValue(this.selectedName, { emitEvent: false });
    }
  }

  filterNames(searchTerm: string) {
    if (!searchTerm) {
      this.filteredNames = [...this.names];
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    this.filteredNames = this.names.filter(name => 
      name.toLowerCase().includes(searchTermLower)
    );
  }

  selectName(name: string) {
    this.selectedName = name;
    this.searchControl.setValue(name, { emitEvent: false });
    this.nameChange.emit(name);
    this.isDropdownOpen = false;
  }

  showDropdown() {
    this.isDropdownOpen = true;
    this.filterNames(this.searchControl.value);
  }

  hideDropdown() {
    setTimeout(() => {
      this.isDropdownOpen = false;
    }, 200);
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue('');
    this.isDropdownOpen = false;
  }

  addNewName() {
    const newName = this.searchControl.value.trim().toLowerCase();
    if (!newName) return;

    this.nameCreated.emit(newName);
    
    if (!this.names.includes(newName)) {
      this.names.push(newName);
    }
    
    this.selectName(newName);
    this.hideDropdown();
  }
}