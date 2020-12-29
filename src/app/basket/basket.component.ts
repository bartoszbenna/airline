import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import * as moment from 'moment';
import { SearchService } from '../front/search.service';
import { BasketService } from './basket.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {

  @ViewChild(MatTable) table: MatTable<any>;

  public basketContent = [];
  public columnsDisplayed = ['flightNumber', 'dates', 'depAirport', 'arrAirport', 'adult', 'child', 'infant', 'price', 'remove'];
  public totalBasketCount = 0;
  public moment: any = moment;

  constructor(private basketService: BasketService, public searchService: SearchService) { }

  ngOnInit(): void {
    this.basketService.basketBuffer.subscribe(message => {
      this.basketContent = message;
      this.recountPrices();
    })
  }

  removeFromBasket(element: any) {
    this.basketService.remove(element);
    this.table.renderRows();
    this.recountPrices();
  }

  recountPrices() {
    if (this.basketContent != null) {
      for (let element of this.basketContent) {
        element.totalPrice = (element.adult + element.child + element.infant) * element.price
      }
    }
    let tempPrice = 0;
    if (this.basketContent != null) {
      for (let element of this.basketContent) {
        tempPrice += element.totalPrice;
      }
    }
    this.totalBasketCount = tempPrice;
  }

  continue() {
    console.log(this.basketContent)
  }

}
