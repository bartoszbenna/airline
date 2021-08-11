import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IAirport, ISearchResult, SearchService } from '../search.service';

@Component({
	selector: 'app-offers',
	templateUrl: './offers.component.html',
	styleUrls: ['./offers.component.css'],
})
export class OffersComponent implements OnInit {
	public airports: IAirport[];
	public selectedAirport: string;
	public offers: ISearchResult[];
	public moment: any = moment;
	public showSpinner: boolean = false;

	constructor(private searchService: SearchService) {}

	ngOnInit(): void {
		this.showSpinner = true;
		this.searchService.airportsSubject
			.asObservable()
			.subscribe((message) => {
				if (message != null) {
					this.airports = message;
					this.selectedAirport = this.airports[0].code;
					this.changeAirport();
				}
			});
	}

	async changeAirport() {
		this.showSpinner = true;
		this.offers = await this.searchService.getOffers(this.selectedAirport);
		this.showSpinner = false;
	}

	selectOffer(offer: ISearchResult) {
		const form = {
			oneWay: false,
			departure: offer.depCode,
			arrival: offer.arrCode,
			outDate: moment(offer.depDate).startOf('days').toDate(),
			inDate: moment(offer.depDate)
				.startOf('days')
				.add(1, 'days')
				.toDate(),
			adult: 1,
			child: 0,
			infant: 0,
		};
		this.searchService.insertSearch(form);
	}
}
