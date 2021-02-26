import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { BasketService } from '../basket/basket.service';
import { LoginService } from '../login/login.service';

export interface IPassengerData {
  type: string,
  firstName: string,
  lastName: string,
  dob: Date,
  handBaggage: number,
  checkedBaggage: number,
  seats: ISeat[]
}

interface ISeat {
  flightId: string,
  seat: string
}

export interface IServerReservation {
  reservation: IReservation,
  errors: string[]
}

export interface IReservation {
  reservationNumber: string,
  userId: string,
  reservationDate: Date,
  flights: IReservedFlight[],
  totalPrice: number,
  isConfirmed: boolean
}

export interface IReservedFlight {
  _id: string,
  flightNumber: string,
  depDate: Date,
  arrDate: Date,
  depCode: string,
  arrCode: string,
  price: number,
  passengers: IPassenger[]
}

export interface IPassenger {
  type: string,
  firstName: string,
  lastName: string,
  dob: Date,
  handBaggage: number,
  checkedBaggage: number,
  seat: string,
  isCheckedIn: boolean,
  checkInDate: Date,
  documentType: string,
  documentNumber: string
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  public passengerData: IPassengerData[];
  public componentSubject = new Subject<string>();
  private searchApi: string = "http://localhost:3000/search/";
  private reservationApi: string = "http://localhost:3000/reservation/";
  public reservation: IServerReservation;

  constructor(private http: HttpClient,
    private basketService: BasketService,
    private loginService: LoginService, 
    private cookieService: CookieService,
    private router: Router) { }

  public initPassengerData(data: IPassengerData[]) {
    this.passengerData = data;
  }

  public changeComponent(selection: string) {
    this.loginService.getUserData();
    if (selection == 'details' || selection == 'extras' || selection == 'payment') {
      this.componentSubject.next(selection);
    }
  }

  public async getSeatMap(planeType: string) {
    const seatMapPromise = new Promise<string[][]>((resolve, reject) => {
      this.http.get(this.searchApi + 'getSeatMap', {params: {type: planeType}}).subscribe((message: string[][]) => {
        resolve(message);
      }, error => {
        reject('error');
      })
    })
    const result = await seatMapPromise;
    return result;
  }

  public async getOccupiedSeats(flightId: string) {
    const seatPromise = new Promise<string[]>((resolve, reject) => {
      this.http.get(this.searchApi + 'getOccupiedSeats', {params: {id: flightId}}).subscribe((message: string[]) => {
        resolve(message);
      }, (error) => {
        reject('error');
      })
    });
    const result = await seatPromise;
    return result;
  }

  public enterExtras(checkedBaggage: number[], handBaggage: number[], outboundSeats: string[], inboundSeats: string[]) {
    for (let i = 0; i < this.passengerData.length; i++) {
      this.passengerData[i].checkedBaggage = checkedBaggage[i];
      this.passengerData[i].handBaggage = handBaggage[i];
      this.passengerData[i].seats.push({
        flightId: this.basketService.basket.flights[0]._id,
        seat: outboundSeats[i]
      });
      if (inboundSeats != undefined && inboundSeats.length != 0) {
        this.passengerData[i].seats.push({
          flightId: this.basketService.basket.flights[1]._id,
          seat: inboundSeats[i]
        });
      }
    }
  }

  public async makeReservation() {
    const payload = {
      basketId: this.basketService.basket._id,
      passengers: this.passengerData
    }
    if (this.cookieService.check('token')) {
      const token = this.cookieService.get('token');
      const headers = {
        'x-access-token': token
      }
      const reservationPromise = new Promise<IServerReservation>((resolve, reject) => {
        this.http.post(this.reservationApi + 'create', payload, {headers: headers}).subscribe((res: IServerReservation) => {
          this.reservation = res;
          resolve(res);
        }, error => {
          reject('error');
        });
      })
      const result = await reservationPromise;
      return result;
    }
    else {
      this.router.navigate(['/basket'])
    }
  }

  public async confirmReservation(reservationNumber: string) {
    const reservationConfirmationPromise = new Promise<boolean>(async (resolve, reject) => {
      const payload = {
        reservationNumber: reservationNumber
      }
      this.http.patch(this.reservationApi + 'confirm', payload).subscribe((res: any) => {
        resolve(true);
      }, error => {
        resolve(false);
      })
    })
    return await reservationConfirmationPromise;
  }
}
