import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BasketService } from 'src/app/basket/basket.service';
import { SearchResult, SearchResults, SearchService } from '../search.service';

@Component({
  selector: 'app-searchresults',
  templateUrl: './searchresults.component.html',
  styleUrls: ['./searchresults.component.css']
})
export class SearchresultsComponent implements OnInit {

  public moment: any = moment;

  public searchResults: SearchResults;
  public outboundFlights = [];
  public inboundFlights = [];

  public showOutbound: boolean = true;
  public showInbound: boolean = false;
  public showSelectError: boolean = false;

  public selectedOutbound: SearchResult = null;
  public selectedInbound: SearchResult = null;

  constructor(private searchService: SearchService, private basketService: BasketService, private router: Router) { }

  ngOnInit(): void {
    this.searchService.resetResultsSubject.asObservable().subscribe(message => {
      this.resetResults();
    })
    
    this.searchService.searchResults.asObservable().subscribe(message => {
      this.searchResults = message;

      this.outboundFlights = [];

      let earliestOutbound = new Date(this.searchResults.searchForm.outDate);
      earliestOutbound.setDate(earliestOutbound.getDate() - 1);
      let latestOutbound = new Date(this.searchResults.searchForm.outDate);
      latestOutbound.setDate(latestOutbound.getDate() + 1);

      this.outboundFlights.push({date: new Date(earliestOutbound), flights: []});
      this.outboundFlights.push({date: new Date(this.searchResults.searchForm.outDate), flights: []});
      this.outboundFlights.push({date: new Date(latestOutbound), flights: []});

      for (let flight of this.searchResults.outbound) {
        for (let day of this.outboundFlights) {
          if (moment(flight.depDate).isSame(day.date, 'days')) {
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
    if (!this.searchResults.searchForm.oneWay) {
      let earliestInbound = new Date(this.searchResults.searchForm.inDate);
      earliestInbound.setDate(earliestInbound.getDate() - 1);
      let latestInbound = new Date(this.searchResults.searchForm.inDate);
      latestInbound.setDate(latestInbound.getDate() + 1);

      this.inboundFlights = [];

      this.inboundFlights.push({date: new Date(earliestInbound), flights: []});
      this.inboundFlights.push({date: new Date(this.searchResults.searchForm.inDate), flights: []});
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
    let newForm = this.searchResults.searchForm;
    newForm.outDate.setDate(newForm.outDate.getDate() - 1)
    if (!moment(newForm.outDate).isBefore(new Date(), 'days')) {
      this.searchService.search(newForm);
    }
  }

  increaseOutDate() {
    let newForm = this.searchResults.searchForm;
    newForm.outDate.setDate(newForm.outDate.getDate() + 1)
    if (moment(newForm.outDate).isAfter(newForm.inDate)) {
      newForm.inDate.setDate(newForm.inDate.getDate() + Math.abs(moment(this.searchResults.searchForm.outDate).diff(this.searchResults.searchForm.inDate, 'days')))
    }
    this.searchService.search(newForm)
  }

  continueOutbound() {
    if (this.selectedOutbound == null) {
      this.showSelectError = true;
    }
    else if (this.searchResults.searchForm.oneWay) {
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
    const inDate = this.searchResults.searchForm.inDate;
    if (moment(new Date(inDate).setDate(inDate.getDate()) - 1).isAfter(this.selectedOutbound.arrDate)) {
      let newForm = this.searchResults.searchForm;
      newForm.inDate.setDate(newForm.inDate.getDate() - 1);
      this.searchService.search(newForm);
    }
  }

  increaseInDate() {
    let newForm = this.searchResults.searchForm;
    newForm.inDate.setDate(newForm.inDate.getDate() + 1);
    this.searchService.search(newForm);
  }

  returnInbound() {
    this.showInbound = false;
    this.showOutbound = true;
  }

  continueInbound() {
    if (this.selectedInbound == null && !this.searchResults.searchForm.oneWay) {
      this.showSelectError = true;
    }
    else {
      this.showSelectError = false;
      this.continueToBasket();
    }
  }

  completePassengerNumber(flight: SearchResult, adult: number, child: number, infant: number) {
    return {
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
    const searchForm = this.searchResults.searchForm;
    const basketContent = [this.completePassengerNumber(this.selectedOutbound, searchForm.adult, searchForm.child, searchForm.infant)];
    if (this.selectedInbound != null) {
      basketContent.push(this.completePassengerNumber(this.selectedInbound, searchForm.adult, searchForm.child, searchForm.infant))
    }

    this.basketService.addToBasket(basketContent);
    this.router.navigate(['basket']);
  }


}
