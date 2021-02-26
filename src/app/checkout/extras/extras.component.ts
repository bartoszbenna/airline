import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasketService, IServerBasket } from 'src/app/basket/basket.service';
import { CheckoutService, IPassengerData } from '../checkout.service';

@Component({
    selector: 'app-checkoutextras',
    templateUrl: './extras.component.html',
    styleUrls: ['./extras.component.css'],
    animations: [
        trigger(
            'SeatsInOutAnimation', 
            [
              transition(
                ':enter', 
                [
                  style({ height: 0 }),
                  animate('0.5s ease-out', 
                          style({ height: '100vh' }))
                ]
              ),
              transition(
                ':leave', 
                [
                  style({ height: '100vh' }),
                  animate('0.5s ease-in', 
                          style({ height: 0 }))
                ]
              )
            ]
          )
    ]
})
export class ExtrasComponent implements OnInit {
    private seatPrice: number = 10;
    private checkedBaggagePrice: number = 30;
    private handBaggagePrice: number = 10;
    public totalPrice: number;

    public showSpinner: boolean = false;
    public basket: IServerBasket;
    public oneWay: boolean = true;
    public passengerData: IPassengerData[];
    public outboundSeatMap: string[][];
    public inboundSeatMap: string[][];
    public outboundSeatsSelect: boolean = false;
    public inboundSeatsSelect: boolean = false;
    public outboundSelectedSeats: string[] = [];
    public inboundSelectedSeats: string[] = [];
    public outboundOccupiedSeats: string[];
    public inboundOccupiedSeats: string[];
    public checkedBaggage: number[] = [];
    public handBaggage: number[] = [];

    public errorMessages: string[] = [];
    public showErrors: boolean = false;

    constructor(
        private checkoutService: CheckoutService,
        private basketService: BasketService,
        private router: Router) {}

    async ngOnInit() {
        this.showSpinner = true;
        this.basket = this.basketService.basket;
        this.passengerData = this.checkoutService.passengerData;
        if (this.basket.flights.length == 2) {
            this.oneWay = false;
            this.inboundOccupiedSeats = await this.checkoutService.getOccupiedSeats(
                this.basket.flights[1]._id
            );
            for (let i = 0; i < this.passengerData.length; i++) {
                this.inboundSelectedSeats.push('');
            }
        } else {
            this.oneWay = true;
        }
        this.outboundOccupiedSeats = await this.checkoutService.getOccupiedSeats(
            this.basket.flights[0]._id
        );
        for (let i = 0; i < this.passengerData.length; i++) {
            this.outboundSelectedSeats.push('');
            this.checkedBaggage.push(0);
            this.handBaggage.push(1);
        }
        await this.getSeatMaps();
        this.showSpinner = false;
        this.totalPrice = this.basket.totalPrice;
    }

    async getSeatMaps() {
        this.outboundSeatMap = await this.checkoutService.getSeatMap(
            this.basket.flights[0].planeType
        );
        if (!this.oneWay) {
            if (
                this.basket.flights[0].planeType ==
                this.basket.flights[1].planeType
            ) {
                this.inboundSeatMap = this.outboundSeatMap;
            } else {
                this.inboundSeatMap = await this.checkoutService.getSeatMap(
                    this.basket.flights[1].planeType
                );
            }
        }
    }
    selectSeat(selectedSeat: string, type: string) {
        if (type == 'out') {
            for (let i in this.outboundSelectedSeats) {
                if (this.outboundSelectedSeats[i] == '') {
                    this.outboundSelectedSeats[i] = selectedSeat;
                    break;
                }
            }
        } else if (type == 'in') {
            for (let i in this.inboundSelectedSeats) {
                if (this.inboundSelectedSeats[i] == '') {
                    this.inboundSelectedSeats[i] = selectedSeat;
                    break;
                }
            }
        }
    }

    deselectSeat(seatToDeselect: string, type: string) {
        if (
            type == 'out' &&
            this.outboundSelectedSeats.includes(seatToDeselect)
        ) {
            for (let i in this.outboundSelectedSeats) {
                if (this.outboundSelectedSeats[i] == seatToDeselect) {
                    this.outboundSelectedSeats[i] = '';
                    break;
                }
            }
        } else if (
            type == 'in' &&
            this.inboundSelectedSeats.includes(seatToDeselect)
        ) {
            for (let i in this.inboundSelectedSeats) {
                if (this.inboundSelectedSeats[i] == seatToDeselect) {
                    this.inboundSelectedSeats[i] = '';
                    break;
                }
            }
        }
    }

    getInitials(passengerIndex: number) {
        return (
            this.passengerData[passengerIndex].firstName.slice(0, 1) +
            this.passengerData[passengerIndex].lastName.slice(0, 1)
        );
    }

    getSeatString(passengerIndex: number) {
        let outSeat = this.outboundSelectedSeats[passengerIndex];
        if (outSeat == '') {
            if (this.outboundSeatsSelect) {
                outSeat = 'None';
            } else {
                outSeat = 'Random';
            }
        }
        if (!this.oneWay) {
            let inSeat = this.inboundSelectedSeats[passengerIndex];
            if (inSeat == '') {
                if (this.inboundSeatsSelect) {
                    inSeat = 'none';
                } else {
                    inSeat = 'random';
                }
            }
            return "Seats: " + outSeat + ', ' + inSeat;
        }
        return "Seat: " + outSeat;
    }

    outboundSelectChange() {
        if (!this.outboundSeatsSelect) {
            for (let i in this.outboundSelectedSeats) {
                this.outboundSelectedSeats[i] = '';
            }
        }
    }

    inboundSelectChange() {
        if (!this.inboundSeatsSelect) {
            for (let i in this.inboundSelectedSeats) {
                this.inboundSelectedSeats[i] = '';
            }
        }
    }

    addBaggage(passIndex: number, type: string) {
        if (type == "hand") {
            try {
                if (this.handBaggage[passIndex] < 2) {
                    this.handBaggage[passIndex] += 1;
                }
            }
            catch(err) {}
        }
        else {
            try {
                if (this.checkedBaggage[passIndex] < 3) {
                    this.checkedBaggage[passIndex] += 1;
                }
                
            }
            catch(err) {}
        }
    }

    removeBaggage(passIndex: number, type: string) {
        if (type == "hand") {
            try {
                if (this.handBaggage[passIndex] > 1) {
                    this.handBaggage[passIndex] -= 1
                }
            }
            catch(err) {}
        }
        else {
            try {
                if (this.checkedBaggage[passIndex] > 0) {
                    this.checkedBaggage[passIndex] -= 1
                }
            }
            catch(err) {}
        }
    }

    verifySeats() {
        if (this.outboundSeatsSelect) {
            for (let seat of this.outboundSelectedSeats) {
                if (seat == "") {
                    return false;
                }
            }
        }
        if (!this.oneWay && this.inboundSeatsSelect) {
            for (let seat of this.inboundSelectedSeats) {
                if (seat == "") {
                    return false;
                }
            }
        }
        return true;
    }

    verifyBaggage() {
        this.checkedBaggage.forEach(number => {
            if (number < 0 || number > 3) {
                return false;
            }
        })
        this.handBaggage.forEach(number => {
            if (number < 0 || number > 2) {
                return false;
            }
        })
        return true;
    }

    countPrices() {
        let price = this.basket.totalPrice;
        let seats = 0;
        let handBaggages = 0;
        let checkedBaggages = 0;
        this.outboundSelectedSeats.forEach(seat => {
            if (seat != "") {
                seats += 1;
            }
        })
        if (!this.oneWay) {
            this.inboundSelectedSeats.forEach(seat => {
                if (seat != "") {
                    seats += 1;
                }
            })
        }
        this.handBaggage.forEach(item => {
            if (item > 1) { // one hand baggage free
                handBaggages += (item - 1);
            }
        })
        this.checkedBaggage.forEach(item => {
            checkedBaggages += item;
        })
        const multiplication = this.oneWay ? 1 : 2
        price += seats * this.seatPrice;
        price += handBaggages * this.handBaggagePrice * multiplication;
        price += checkedBaggages * this.checkedBaggagePrice * multiplication;
        this.totalPrice = price;
        return price;
    }

    async next() {
        this.showErrors = false;
        this.errorMessages = [];
        if (!this.verifySeats()) {
            this.errorMessages.push("Please make sure all seats are selected, or 'random' option is chosen.");
        }
        if (!this.verifyBaggage()) {
            this.errorMessages.push("There has been a problem with the number of baggage.");
        }
        this.showErrors = true;
        if (this.errorMessages.length == 0) {
            this.checkoutService.enterExtras(this.checkedBaggage, this.handBaggage, this.outboundSelectedSeats, this.inboundSelectedSeats);
            try {
                await this.checkoutService.makeReservation();
                this.checkoutService.changeComponent("payment");
            }
            catch (error) {
                this.router.navigate(['/basket']);
            }
        }
    }
}
