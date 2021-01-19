import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

export interface IAirport {
  code: string,
  name: string
}

export interface ISearchResult {
  flightNumber: string,
  depDate: Date,
  arrDate: Date,
  depCode: string,
  arrCode: string,
  price: number,
}

export interface ISearchResults {
  outbound: ISearchResult[],
  inbound: ISearchResult[]
}

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

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  public isShowingResults = new Subject<boolean>();
  public isWaitingForResults = new BehaviorSubject<boolean>(false);
  public resetResultsSubject = new Subject<boolean>();
  public searchForm = new BehaviorSubject<ISearchForm>(null);
  public searchResults = new BehaviorSubject<ISearchResults>({outbound: [], inbound: []});
  public airportsSubject = new BehaviorSubject<IAirport[]>(null);

  private searchApi = "http://localhost:3000/search/";

  private airports: IAirport[];

  constructor(private http: HttpClient) {
    this.getAirports();
  }

  getAirports() {
    this.http.get<IAirport[]>(this.searchApi + 'getAirports').subscribe(message => {
      
      this.airportsSubject.next(message);
      this.airports = message;
    })
  }

  getNameFromCode(airportCode: string) {
    for (let airport of this.airports) {
      if (airportCode == airport.code) {
        return airport.name;
      }
    }
  }

  search(form: ISearchForm) {
    this.isWaitingForResults.next(true);
    this.searchForm.next(form);
    this.showResults();
    
    const params = new HttpParams()
      .set('oneWay', String(form.oneWay))
      .set('departure', form.departure)
      .set('arrival', form.arrival)
      .set('outDate', moment(form.outDate).format('YYYY-MM-DD'))
      .set('inDate', form.oneWay ? '' : moment(form.inDate).format('YYYY-MM-DD'))
      .set('adult', String(form.adult))
      .set('child', String(form.child))
      .set('infant', String(form.infant))

    this.http.get<any>(this.searchApi + 'getResults', {params: params}).subscribe(message => {
      this.searchResults.next(message);
      this.isWaitingForResults.next(false);
    })
  }

  getOffers(airportCode: string) {
    if (airportCode == "LHR") {
      const offers: ISearchResult[] = [
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 10, 13, 15, 0), arrDate: new Date(2021, 1, 10, 13, 15, 0), depCode: "LHR", arrCode: "FRA", price: 150},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 11, 15, 0, 0), arrDate: new Date(2021, 1, 13, 15, 0, 0), depCode: "LHR", arrCode: "CDG", price: 175},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 12, 12, 55, 0), arrDate: new Date(2021, 1, 14, 12, 55, 0), depCode: "LHR", arrCode: "WAW", price: 190},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 13, 9, 15, 0), arrDate: new Date(2021, 1, 15, 9, 15, 0), depCode: "LHR", arrCode: "MAD", price: 80},
      ]
      return offers
    }

    if (airportCode == "FRA") {
      const offers: ISearchResult[] = [
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 17, 17, 15, 0), arrDate: new Date(2021, 1, 17, 19, 15, 0), depCode: "FRA", arrCode: "CDG", price: 125},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 18, 18, 20, 0), arrDate: new Date(2021, 1, 18, 20, 20, 0), depCode: "FRA", arrCode: "LHR", price: 75},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 19, 9, 55, 0), arrDate: new Date(2021, 1, 19, 11, 55, 0), depCode: "FRA", arrCode: "WAW", price: 190},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 20, 5, 35, 0), arrDate: new Date(2021, 1, 20, 7, 35, 0), depCode: "FRA", arrCode: "MAD", price: 160},
      ]
      return offers
    }

    else {
      return [];
    }
  }

  showResults() {
    this.isShowingResults.next(true);
  }

  hideResults() {
    this.isShowingResults.next(false);
    this.resetResults();
  }

  resetResults() {
    this.resetResultsSubject.next(true);
  }
}
