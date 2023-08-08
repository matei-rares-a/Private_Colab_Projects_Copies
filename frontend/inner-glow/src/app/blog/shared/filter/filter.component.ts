import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { TuiDay } from '@taiga-ui/cdk';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpService } from 'src/app/http.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit{

  optionsCategory: string[] = [
    'Yoga',
    'Spa',
    'Meditation',
    'Zumba',
    'Nutrition',
  ];
  optionsCity: string[] = [
    'Iasi',
    'Suceava',
    'Galati',
    'Bacau',
    'Bucuresti',
    'Online'
  ];
  optionsAuthor: string[] = [
    'Author1',
    'Author2',
    'Author3',
    'Author4',
    'Author5',
  ];
  optionsSortedBy: string[] = [
    'Newest events on top( by published date)(default)',
    'Event date ascending',
    'Event date descending',
    'Upcoming event descending'

  ];
  optionsEventDate: string[] = [
    'This week',
    'In 1 month',
    'In 3 months',
    'In 6 months',
    'In 1 year',
  ];
  optionsPostDate: string[] = [
    'Last 24h',
    'Last 3 days',
    'Last 7 days',
    'Last 14 days',
    'Last month',
    'Last year'
  ];

  selectedOptionsCategory: string[] = []; 
  

  areOptionsVisible: boolean = false;

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    this.http.get("https://localhost:7207/api/User/User/get/authors").pipe(
      map((response: any) => {
        return JSON.parse(JSON.stringify(response));
      })
    ).subscribe(
      (responseObject: any) => {
        //console.log( responseObject);
        this.optionsAuthor=responseObject
        console.log("autori -> "+responseObject)
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  }
  toggleOptionsVisibilityCategory(isVisible: boolean) {
    this.areOptionsVisible = isVisible;
  }

  toggleSelectionCategory(option: string) {
    if (this.selectedOptionsCategory.includes(option)) {
      this.selectedOptionsCategory = this.selectedOptionsCategory.filter(
        (selectedOptionsCategory) => selectedOptionsCategory !== option
      );
    } else {
      this.selectedOptionsCategory.push(option);
    }
  }

  getSelectedDisplayCategory(): string {
    if (this.selectedOptionsCategory.length === 0) {
      return 'Category';
    } else if (this.selectedOptionsCategory.length === 1) {
      return this.selectedOptionsCategory[0];
    } else {
      return this.selectedOptionsCategory[0] + '...';
    }
  }
  getSelectedDisplayCity(): string {
    if (this.selectedOptionsCity.length === 0) {
      return 'City';
    } else if (this.selectedOptionsCity.length === 1) {
      return this.selectedOptionsCity[0];
    } else {
      return this.selectedOptionsCity[0] + '...';
    }
  }
  getSelectedDisplayAuthor(): string {
    if (this.selectedOptionsAuthor.length === 0) {
      return 'Author';
    } else if (this.selectedOptionsAuthor.length === 1) {
      return this.selectedOptionsAuthor[0];
    } else {
      return this.selectedOptionsAuthor[0] + '...';
    }
  }
  toggleSelectionCity(option: string) {
    if (this.selectedOptionsCity.includes(option)) {
      this.selectedOptionsCity = this.selectedOptionsCity.filter(
        (selectedOptionsCity) => selectedOptionsCity !== option
      );
    } else {
      this.selectedOptionsCity.push(option);
    }
  }
  toggleSelectionAuthor(option: string) {
    if (this.selectedOptionsAuthor.includes(option)) {
      this.selectedOptionsAuthor = this.selectedOptionsAuthor.filter(
        (selectedOptionsAuthor) => selectedOptionsAuthor !== option
      );
    } else {
      this.selectedOptionsAuthor.push(option);
    }
  }

  /////////////second select
  optionsSecond: string[] = ['Option 1', 'Option 2', 'Option 3'];
  selectedOptionsCity: string[] = [];
  selectedOptionsAuthor: string[] = [];
  selectedOptionsSortedBy: string = '';
  selectedOptionsEventDate: string = '';
  selectedOptionsPostDate: string = '';


  areOptionsVisibleCity: boolean = false;
  areOptionsVisibleAuthor: boolean = false;
  areOptionsVisibleSortedBy: boolean = false;
  areOptionsVisiblePostDate: boolean = false;
  areOptionsVisibleEventDate: boolean = false;

  toggleOptionsVisibilityCity(isVisible: boolean) {
    this.areOptionsVisibleCity = isVisible;
  }

  toggleOptionsVisibilityAuthor(isVisible: boolean) {
    this.areOptionsVisibleAuthor = isVisible;
  }
  toggleOptionsVisibilitySortedBy(isVisible: boolean) {
    this.areOptionsVisibleSortedBy = isVisible;
  }

  toggleOptionsVisibilityPostDate(isVisible: boolean){
    this.areOptionsVisiblePostDate = isVisible;
  }

  toggleOptionsVisibilityEventDate(isVisible: boolean){
    this.areOptionsVisibleEventDate = isVisible;
  }

  selectOptionEventDate(option: string) {
    this.selectedOptionsEventDate= option;
    this.areOptionsVisibleEventDate = false;
  }
  selectOptionPostDate(option: string) {
    this.selectedOptionsPostDate = option;
    this.areOptionsVisiblePostDate = false;
  }

 
  selectOptionSortedBy(option: string) {
    this.selectedOptionsSortedBy = option;
    this.areOptionsVisibleSortedBy = false;
  }

  lastSelected?: any ;
  @Output() selectedOptionsEmmiter: EventEmitter<any> = new EventEmitter<any>();
  selectedOptions(){
    let selectedOptionsFinal:any= {
      optionsCategory:this.selectedOptionsCategory,
      optionsCity:this.selectedOptionsCity,
      optionsAuthor:this.selectedOptionsAuthor,
      optionsEventDate:this.selectedOptionsEventDate,
      optionsPostDate:this.selectedOptionsPostDate,
      optionsSortedBy:this.selectedOptionsSortedBy
    };

    if ((JSON.stringify(selectedOptionsFinal) !== JSON.stringify(this.lastSelected))) {
      this.lastSelected ={...selectedOptionsFinal}; 
     // console.log(selectedOptionsFinal)
      this.selectedOptionsEmmiter.emit(selectedOptionsFinal)
    }
  }


  clearOptions(){
    this.selectedOptionsCategory=[];
    this.selectedOptionsCity= [];
    this.selectedOptionsAuthor= [];
    this.selectedOptionsSortedBy = '';
    this.selectedOptionsEventDate= '';
    this.selectedOptionsPostDate= '';
  }
  /*
  /////////////date

  isPostDateChosen: boolean = true; // Initially, the label is visible
  isEventDateChosen: boolean = true; // Initially, the label is visible

  @ViewChild('eventDateInput') eventDateInput!: ElementRef<HTMLInputElement>; // Reference to the input field
  @ViewChild('postDateInput') postDateInput!: ElementRef<HTMLInputElement>; // Reference to the input field

  eventDate!: Date;
  postDate!: Date;

  onEventDateChosen() {
    const dateStr = this.eventDateInput.nativeElement.value;
    this.isEventDateChosen = dateStr === ''; // Check if the date is empty or not
    if (!this.isEventDateChosen) {
      const date: Date = new Date(dateStr); // Access the value property using the nativeElement
    }
  }

  onPostDateChosen() {
    const dateStr = this.postDateInput.nativeElement.value;
    this.isPostDateChosen = dateStr === ''; // Check if the date is empty or not
    if (!this.isPostDateChosen) {
      const date: Date = new Date(dateStr); // Access the value property using the nativeElement
    }
  }
  */
}
