import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject, BehaviorSubject } from 'rxjs';
import { SearchresultsComponent } from './searchresults/searchresults.component';

export interface Airport {
  code: string,
  name: string
}

export interface SearchResult {
  flightNumber: string,
  depDate: Date,
  arrDate: Date,
  depCode: string,
  arrCode: string,
  price: number,
}

export interface SearchResults {
  outbound: SearchResult[],
  inbound: SearchResult[],
  searchForm: SearchForm
}

export interface SearchForm {
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
  public resetResultsSubject = new Subject<boolean>();
  public searchResults = new BehaviorSubject<SearchResults>({outbound: [], inbound: [], searchForm: null});

  private airports = [
    {code: "LHR", name: "London-Heathrow"},
    {code: "FRA", name: "Frankfurt"},
    {code: "CDG", name: "Paris CDG"},
    {code: "WAW", name: "Warsaw"},
    {code: "MAD", name: "Madrid-Barajas"}
  ]

  private flights: SearchResult[] = [
    {flightNumber: 'AA1234', depDate: new Date(2021, 0, 10, 13, 15, 0, 0), arrDate: new Date(2021, 0, 10, 15, 15, 0, 0), depCode: 'LHR', arrCode: 'FRA', price: 180},
    {flightNumber: 'AA1234', depDate: new Date(2021, 0, 11, 13, 15, 0, 0), arrDate: new Date(2021, 0, 11, 15, 15, 0, 0), depCode: 'LHR', arrCode: 'FRA', price: 190},
    {flightNumber: 'AA1234', depDate: new Date(2021, 0, 11, 18, 20, 0, 0), arrDate: new Date(2021, 0, 11, 20, 20, 0, 0), depCode: 'LHR', arrCode: 'FRA', price: 185},
    {flightNumber: 'AA1234', depDate: new Date(2021, 0, 12, 13, 15, 0, 0), arrDate: new Date(2021, 0, 12, 15, 15, 0, 0), depCode: 'LHR', arrCode: 'FRA', price: 315},
    {flightNumber: 'AA1234', depDate: new Date(2021, 0, 13, 18, 20, 0, 0), arrDate: new Date(2021, 0, 13, 20, 20, 0, 0), depCode: 'LHR', arrCode: 'FRA', price: 300},
    {flightNumber: 'AA1235', depDate: new Date(2021, 0, 11, 13, 15, 0, 0), arrDate: new Date(2021, 0, 11, 15, 15, 0, 0), depCode: 'FRA', arrCode: 'LHR', price: 190},
    {flightNumber: 'AA1235', depDate: new Date(2021, 0, 12, 18, 20, 0, 0), arrDate: new Date(2021, 0, 12, 20, 20, 0, 0), depCode: 'FRA', arrCode: 'LHR', price: 185},
    {flightNumber: 'AA1235', depDate: new Date(2021, 0, 13, 13, 15, 0, 0), arrDate: new Date(2021, 0, 13, 15, 15, 0, 0), depCode: 'FRA', arrCode: 'LHR', price: 315},
    {flightNumber: 'AA1235', depDate: new Date(2021, 0, 13, 18, 20, 0, 0), arrDate: new Date(2021, 0, 13, 20, 20, 0, 0), depCode: 'FRA', arrCode: 'LHR', price: 300},
    {flightNumber: 'AA1235', depDate: new Date(2021, 0, 15, 18, 20, 0, 0), arrDate: new Date(2021, 0, 15, 20, 20, 0, 0), depCode: 'FRA', arrCode: 'LHR', price: 150}
  ]

  constructor() { }

  getAirports() {
    return this.airports;
  }

  getNameFromCode(airportCode: string) {
    for (let airport of this.airports) {
      if (airportCode == airport.code) {
        return airport.name;
      }
    }
  }

  search(form: SearchForm) {
    const oneWay = form.oneWay;
    const depCode = form.departure;
    const arrCode = form.arrival;
    const outDate = form.outDate;
    const inDate = form.inDate;
    const inbounds: SearchResult[] = [];
    const outbounds: SearchResult[] = [];
    this.showResults();

    for (let flight of this.flights) {
      if (flight.depCode == depCode && flight.arrCode == arrCode && Math.abs(moment(flight.depDate).diff(outDate, 'days')) <= 1) {
        outbounds.push(flight);
      }
      if (flight.depCode == arrCode && flight.arrCode == depCode && Math.abs(moment(flight.depDate).diff(inDate, 'days')) <= 1 && !oneWay) {
        inbounds.push(flight);
      }
    }
    this.searchResults.next({outbound: outbounds, inbound: inbounds, searchForm: form})
  }

  getOffers(airportCode: string) {
    if (airportCode == "LHR") {
      const offers: SearchResult[] = [
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 10, 13, 15, 0), arrDate: new Date(2021, 1, 10, 13, 15, 0), depCode: "LHR", arrCode: "FRA", price: 150},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 11, 15, 0, 0), arrDate: new Date(2021, 1, 13, 15, 0, 0), depCode: "LHR", arrCode: "CDG", price: 175},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 12, 12, 55, 0), arrDate: new Date(2021, 1, 14, 12, 55, 0), depCode: "LHR", arrCode: "WAW", price: 190},
        {flightNumber: 'AA1234', depDate: new Date(2021, 1, 13, 9, 15, 0), arrDate: new Date(2021, 1, 15, 9, 15, 0), depCode: "LHR", arrCode: "MAD", price: 80},
      ]
      return offers
    }

    if (airportCode == "FRA") {
      const offers: SearchResult[] = [
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

  resetResults() {
    this.resetResultsSubject.next(true);
  }
}
