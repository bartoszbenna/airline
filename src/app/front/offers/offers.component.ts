import { Component, OnInit } from '@angular/core';
import { IAirport, ISearchResult, SearchService } from '../search.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  public airports: IAirport[];
  public selectedAirport: string;
  public offers: ISearchResult[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.airportsSubject.asObservable().subscribe(message => {
      if (message != null) {
        this.airports = message;
        this.selectedAirport = this.airports[0].code;
        this.changeAirport();
      }
    })
  }

  changeAirport() {
    this.offers = this.searchService.getOffers(this.selectedAirport);
  }
}