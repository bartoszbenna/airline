import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

export interface IAirport {
	code: string;
	name: string;
}

export interface ISearchResult {
	_id: string;
	flightNumber: string;
	depDate: Date;
	arrDate: Date;
	depCode: string;
	arrCode: string;
	price: number;
}

export interface ISearchResults {
	outbound: ISearchResult[];
	inbound: ISearchResult[];
}

export interface ISearchForm {
	oneWay: boolean;
	departure: string;
	arrival: string;
	outDate: Date;
	inDate: Date;
	adult: number;
	child: number;
	infant: number;
}

@Injectable({
	providedIn: 'root',
})
export class SearchService {
	public isShowingResults = new Subject<boolean>();
	public isWaitingForResults = new BehaviorSubject<boolean>(false);
	public resetResultsSubject = new Subject<boolean>();
	public searchForm = new BehaviorSubject<ISearchForm>(null);
	public searchResults = new BehaviorSubject<ISearchResults>({
		outbound: [],
		inbound: [],
	});
	public airportsSubject = new BehaviorSubject<IAirport[]>(null);
	public searchInsertionSubject = new Subject<ISearchForm>();

	private searchApi = 'http://localhost:3000/search/';

	private airports: IAirport[] = [];

	constructor(private http: HttpClient) {
		this.getAirports();
	}

	getAirports() {
		this.http
			.get<IAirport[]>(this.searchApi + 'getAirports')
			.subscribe((message) => {
				this.airportsSubject.next(message);
				this.airports = message;
			});
	}

	getNameFromCode(airportCode: string) {
		for (let airport of this.airports) {
			if (airportCode == airport.code) {
				return airport.name;
			}
		}
		return '';
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
			.set(
				'inDate',
				form.oneWay ? '' : moment(form.inDate).format('YYYY-MM-DD')
			)
			.set('adult', String(form.adult))
			.set('child', String(form.child))
			.set('infant', String(form.infant));

		this.http
			.get<any>(this.searchApi + 'getResults', { params: params })
			.subscribe((message) => {
				this.searchResults.next(message);
				this.isWaitingForResults.next(false);
			});
	}

	async getOffers(airportCode: string) {
		const offerPromise = new Promise<ISearchResult[]>(
			async (resolve, reject) => {
				this.http
					.get<ISearchResult[]>(this.searchApi + 'getOffers', {
						params: { airport: airportCode },
					})
					.subscribe(
						(message) => {
							resolve(message);
						},
						(error) => {
							resolve([]);
						}
					);
			}
		);
		const result = await offerPromise;
		return result;
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

	insertSearch(form: ISearchForm) {
		this.searchInsertionSubject.next(form);
	}
}
