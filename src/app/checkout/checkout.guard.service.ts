import { ThrowStmt } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import * as moment from "moment";
import { BasketService } from "../basket/basket.service";
import { LoginService } from "../login/login.service";


@Injectable()
export class CheckoutGuardService implements CanActivate {

    constructor(private basketService: BasketService, private loginService: LoginService, private router: Router) {}

    async canActivate() {
        if (this.basketService.basket != undefined && this.loginService.currentStatus == true && moment(this.basketService.basket.expiryTime).toDate() > new Date()) {
            return true;
        }
        else {
            this.router.navigate(['/']);
            return false;
        }
    }
}