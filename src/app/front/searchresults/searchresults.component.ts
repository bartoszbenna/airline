import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BasketService } from 'src/app/basket/basket.service';
import { ISearchForm, ISearchResult, ISearchResults, SearchService } from '../search.service';

@Component({
  selector: 'app-searchresults',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchresultsComponent implements OnInit {

  public moment: any = moment;

  public searchResults: ISearchResults;
  public searchForm: ISearchForm;
  public outboundFlights = [];
  public inboundFlights = [];

  public showOutbound: boolean = true;
  public showInbound: boolean = false;
  public isWaitingForResults: boolean = false;
  public showSelectError: boolean = false;

  public selectedOutbound: ISearchResult = null;
  public selectedInbound: ISearchResult = null;

  constructor(public searchService: SearchService, private basketService: BasketService, private router: Router) { }

  ngOnInit(): void {
    this.searchService.searchForm.asObservable().subscribe(message => {
      this.searchForm = message;
    })
    
    this.searchService.resetResultsSubject.asObservable().subscribe(message => {
      this.resetResults();
    })

    this.searchService.isWaitingForResults.asObservable().subscribe(message => {
      this.isWaitingForResults = message;
    })
    
    this.searchService.searchResults.asObservable().subscribe(message => {
      this.searchResults = message;

      this.outboundFlights = [];

      let earliestOutbound = new Date(this.searchForm.outDate);
      earliestOutbound.setDate(earliestOutbound.getDate() - 1);
      let latestOutbound = new Date(this.searchForm.outDate);
      latestOutbound.setDate(latestOutbound.getDate() + 1);

      this.outboundFlights.push({date: new Date(earliestOutbound), flights: []});
      this.outboundFlights.push({date: new Date(this.searchForm.outDate), flights: []});
      this.outboundFlights.push({date: new Date(latestOutbound), flights: []});

      for (let flight of this.searchResults.outbound) {
        for (let day of this.outboundFlights) {
          if (moment(flight.depDate).isSame(day.date, 'days') && moment(flight.depDate).isAfter(new Date())) {
            day.flights.push(flight);
          }
        }
      }

      this.verifyInboundFlights();
    })
  }

  resetResults() {
    this.outboundFlights = []
    this.inboundFlights = []
    this.selectedOutbound = null;
    this.selectedInbound = null;
    this.showInbound = false;
    this.showOutbound = true;
  }

  verifyInboundFlights() {
    if (!this.searchForm.oneWay) {
      let earliestInbound = new Date(this.searchForm.inDate);
      earliestInbound.setDate(earliestInbound.getDate() - 1);
      let latestInbound = new Date(this.searchForm.inDate);
      latestInbound.setDate(latestInbound.getDate() + 1);

      this.inboundFlights = [];

      this.inboundFlights.push({date: new Date(earliestInbound), flights: []});
      this.inboundFlights.push({date: new Date(this.searchForm.inDate), flights: []});
      this.inboundFlights.push({date: new Date(latestInbound), flights: []});

      for (let flight of this.searchResults.inbound) {
        if (this.selectedOutbound == null || moment(flight.depDate).isAfter(this.selectedOutbound.depDate)) {
          for (let day of this.inboundFlights) {
            if (moment(flight.depDate).isSame(day.date, 'days')) {
              day.flights.push(flight);
            }
          }
        }
      }

      if (this.selectedInbound != null) {
        if (moment(this.selectedInbound.depDate).isBefore(this.selectedOutbound.arrDate)) {
          this.selectedInbound = null;
        }
      }
    }
  }

  decreaseOutDate() {
    let outDate = new Date(this.searchForm.outDate);
    outDate.setDate(new Date(outDate).getDate() - 1)
    if (!moment(outDate).isBefore(new Date(), 'days')) {
      this.searchForm.outDate = new Date(outDate);
      this.searchService.search(this.searchForm);
    }
  }

  increaseOutDate() {
    let outDate = new Date(this.searchForm.outDate);
    let inDate = new Date(this.searchForm.inDate);
    outDate.setDate(new Date(outDate).getDate() + 1)
    if (moment(outDate).isAfter(inDate)) {
      inDate.setDate(new Date(inDate).getDate() + Math.abs(moment(outDate).diff(inDate, 'days')))
    }
    this.searchForm.outDate = new Date(outDate);
    this.searchForm.inDate = new Date(inDate);
    this.searchService.search(this.searchForm)
  }

  continueOutbound() {
    if (this.selectedOutbound == null) {
      this.showSelectError = true;
    }
    else if (this.searchForm.oneWay) {
      this.continueToBasket();
    }
    else {
      this.showSelectError = false;

      this.verifyInboundFlights();

      this.showOutbound = false;
      this.showInbound = true;
    }
  }

  decreaseInDate() {
    let inDate = new Date(this.searchForm.inDate);
    if (moment(new Date(inDate).setDate(inDate.getDate()) - 1).isAfter(this.selectedOutbound.arrDate)) {
      inDate.setDate(new Date(inDate).getDate() - 1);
      this.searchForm.inDate = inDate;
      this.searchService.search(this.searchForm);
    }
  }

  increaseInDate() {
    let inDate = new Date(this.searchForm.inDate);
    inDate.setDate(new Date(this.searchForm.inDate).getDate() + 1);
    this.searchForm.inDate = inDate;
    this.searchService.search(this.searchForm);
  }

  returnInbound() {
    this.showInbound = false;
    this.showOutbound = true;
  }

  continueInbound() {
    if (this.selectedInbound == null && !this.searchForm.oneWay) {
      this.showSelectError = true;
    }
    else {
      this.showSelectError = false;
      this.continueToBasket();
    }
  }

  completePassengerNumber(flight: ISearchResult, adult: number, child: number, infant: number) {
    return {
      _id: flight._id,
      flightNumber: flight.flightNumber,
      depDate: flight.depDate,
      arrDate: flight.arrDate,
      depCode: flight.depCode,
      arrCode: flight.arrCode,
      price: flight.price,
      adult: adult,
      child: child,
      infant: infant
    }
  }

  continueToBasket() {
    const searchForm = this.searchForm;
    const basketContent = [this.completePassengerNumber(this.selectedOutbound, searchForm.adult, searchForm.child, searchForm.infant)];
    if (this.selectedInbound != null) {
      basketContent.push(this.completePassengerNumber(this.selectedInbound, searchForm.adult, searchForm.child, searchForm.infant))
    }

    this.basketService.addToBasket(basketContent);
    this.router.navigate(['basket']);
  }


}
