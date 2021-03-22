import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';
import { threadId } from 'worker_threads';
import { IAirport, SearchService } from '../search.service';

export interface ISearchForm {
  oneWay: boolean,
  departure: string,
  arrival: string,
  outDate: Date,
  inDate: Date,
  adult: number,
  child: number,
  infant: number
}

const DepArrDateValidator: ValidatorFn = (fg: FormGroup) => {
  const depDate = fg.get('outDate').value;
  const arrDate = fg.get('inDate').value;
  const errors = { depDateError: false, dateRangeError: false, returnDateNull: false }

  if (moment(depDate).isBefore(new Date(), 'day')) {
    errors.depDateError = true;
  }

  if (arrDate != null) {
    if (moment(depDate).isAfter(arrDate, 'day')) {
      errors.dateRangeError = true;
    }
  }

  if (arrDate == null) {
    if (!fg.get('oneWay').value) {
      errors.returnDateNull = true;
    }
  }

  if (errors.depDateError == false && errors.dateRangeError == false && errors.returnDateNull == false) {
    return null
  }

  return errors;
}

const ArrAirportValidator: ValidatorFn = (fg: FormGroup) => {
  const depCode = fg.get('departure').value;
  const arrCode = fg.get('arrival').value;

  if (depCode == arrCode && depCode != null) {
    return { depArrAirportError: true };
  }

  return null;
}

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {

  public oneWay: boolean = false;
  public hasBeenSubmitted: boolean = false;
  public minDate: Date;
  public maxDate: Date;

  public departures: IAirport[];
  public arrivals: IAirport[];

  public searchForm = new FormGroup({
    oneWay: new FormControl(false, [Validators.required]),
    departure: new FormControl('LHR', [Validators.required]),
    arrival: new FormControl('FRA', [Validators.required]),
    outDate: new FormControl(new Date(2021, 4, 11, 2), [Validators.required]),
    inDate: new FormControl(new Date(2021, 4, 13, 2)),
    adult: new FormControl(1, [Validators.required]),
    child: new FormControl(0, [Validators.required]),
    infant: new FormControl(0, [Validators.required])
  }, [DepArrDateValidator, ArrAirportValidator])


  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.minDate = new Date(today);
    this.maxDate = new Date(currentYear + 1, 11, 31);
    this.searchService.airportsSubject.asObservable().subscribe(message => {
      this.departures = message;
      this.arrivals = message;
    })
    this.searchService.searchInsertionSubject.asObservable().subscribe(message => {
      this.searchForm.get('oneWay').setValue(message.oneWay)
      this.searchForm.get('departure').setValue(message.departure)
      this.searchForm.get('arrival').setValue(message.arrival)
      this.searchForm.get('outDate').setValue(message.outDate)
      this.searchForm.get('inDate').setValue(message.inDate)
      this.searchForm.get('adult').setValue(message.adult)
      this.searchForm.get('child').setValue(message.child)
      this.searchForm.get('infant').setValue(message.infant)
      this.submitSearch();
    })
  }

  submitSearch() {
    this.hasBeenSubmitted = true;
    if(this.searchForm.status == 'VALID') {
      this.searchService.resetResults();
      this.searchService.search({
        oneWay: this.searchForm.get('oneWay').value,
        departure: this.searchForm.get('departure').value,
        arrival: this.searchForm.get('arrival').value,
        outDate: this.searchForm.get('outDate').value,
        inDate: this.searchForm.get('inDate').value,
        adult: this.searchForm.get('adult').value,
        child: this.searchForm.get('child').value,
        infant: this.searchForm.get('infant').value
      });
    }
  }
}
