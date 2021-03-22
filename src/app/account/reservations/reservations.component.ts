import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { IReservation, IReservedFlight } from 'src/app/checkout/checkout.service';
import { SearchService } from 'src/app/front/search.service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {

  public showSpinner: boolean = false;
  public showError: boolean = false;
  public reservations: IReservation[] = [];

  constructor(private accountService: AccountService, private searchService: SearchService) { }

  public async ngOnInit() {
    this.showSpinner = true;
    try {
      this.reservations = await this.accountService.getReservations();
    }
    catch {
      this.showError = true;
    }
    this.showSpinner = false;
  }

  public formatDate(date: string) {
    return moment(date).format('Do MMM YYYY');
  }

  public formatDateHour(date: Date) {
    return moment(date).format('DD.MM.YYYY HH:mm');
  }

  public getAirportName(code: string) {
    return this.searchService.getNameFromCode(code);
  }

  public getFlightString(flight: IReservedFlight) {
    return flight.flightNumber +  " " + this.getAirportName(flight.depCode) + " - " + this.getAirportName(flight.arrCode) + " " + this.formatDateHour(flight.depDate)
  }

  public getPassengerString(reservation: IReservation) {
    let output = "";
    let count = 0;
    for (let passenger of reservation.flights[0].passengers) {
      output += passenger.firstName + " " + passenger.lastName;
      count++;
      if (count != reservation.flights[0].passengers.length) {
        output += ", ";
      }
    }
    return output;
  }
}
