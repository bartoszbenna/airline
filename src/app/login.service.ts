import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUrl = 'http://localhost:3000/login';
  private validationUrl = 'http://localhost:3000/token/validate';
  private logoutUrl = 'http://localhost:3000/token/logout';

  constructor(private cookieService: CookieService, private http: HttpClient) { }

  async login(login: string, password: string) {
    let loginPromise = new Promise ((resolve, reject) => {
      this.http.post<any>(this.loginUrl, {login: login, password: password}).subscribe((res: any) => {
        const tokenString = res.tokenString;
        const role = res.role;
        const validity = res.validity;
        if (tokenString != '') {
          //logged in
          this.cookieService.set('token', tokenString, {expires: new Date(validity)});
          resolve({
            result: "correct",
            loginToken: tokenString,
            role: role
          });
        }
        else {
          //incorrect
          resolve({
            result: "incorrect"
          })
        }
      } )
    })
    let response = await loginPromise;
    return response;
  }

  async getRole() {
    if (!this.cookieService.check('token')) {
      return {logged: false}
    }
    const tokenString = this.cookieService.get('token');
    let validatePromise = new Promise ((resolve, reject) => {
      this.http.post(this.validationUrl, {tokenString: tokenString}).subscribe((res: any) => {
        resolve(res.role);
      })
    })
    let role = await validatePromise;
    return role;
  }

  logout() {
    if (this.cookieService.check('token')) {
      const token = this.cookieService.get('token');
      this.http.post(this.logoutUrl, {tokenString: token}).subscribe();
      this.cookieService.delete('token');
    }
  }
}
