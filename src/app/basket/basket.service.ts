import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  public basketContent = [];
  public basketBuffer = new BehaviorSubject<any[]>(null);

  constructor() { } 

  addToBasket(content: any[]) {
    for (let element of content) {
      this.basketContent.push(element);
    }
    this.basketBuffer.next(this.basketContent);
  }

  remove(element: any) {
    for (let i = 0; i < this.basketContent.length; i++) {
      if (this.basketContent[i] == element) {
        this.basketContent.splice(i, 1);
        return ;
      }
    }
  }
}
