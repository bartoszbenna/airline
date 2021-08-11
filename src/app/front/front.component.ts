import { Component, OnInit } from '@angular/core';
import { SearchService } from './search.service';

@Component({
	selector: 'app-front',
	templateUrl: './front.component.html',
	styleUrls: ['./front.component.css'],
})
export class FrontComponent implements OnInit {
	public isShowingResults: boolean = false;

	constructor(private searchService: SearchService) {}

	ngOnInit(): void {
		this.searchService.isShowingResults
			.asObservable()
			.subscribe((message) => {
				this.isShowingResults = message;
			});
	}
}
