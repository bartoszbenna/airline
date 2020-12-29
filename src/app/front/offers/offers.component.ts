import { Component, OnInit } from '@angular/core';
import { Airport, SearchResult, SearchService } from '../search.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  public airports: Airport[];
  public selectedAirport: string;
  public offers: SearchResult[];

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.airports = this.searchService.getAirports();
    this.selectedAirport = this.airports[0].code;
    this.changeAirport();
  }

  changeAirport() {
    this.offers = this.searchService.getOffers(this.selectedAirport);
  }

}