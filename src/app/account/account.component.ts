import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private loginService: LoginService, public router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
	if (this.router.url == '/account') {
	  this.router.navigate(['details'], {relativeTo: this.route})
	}
  }
}
