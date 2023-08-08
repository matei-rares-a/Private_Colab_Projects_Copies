import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent {

  constructor(private http: HttpClient, private cookieService: CookieService,    private router: Router,
    ) {}

  onSubmit(password: string) {
    const requestData = {
      password: password
    };

    const token = this.cookieService.get('token'); 
    console.log(token);

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `${token}` 
      })
    };

    this.router.navigate(['/loading']);

    this.http.post<any>('https://localhost:7207/api/User/changePassword', requestData, httpOptions)
      .subscribe(
        (response) => {
          console.log('Parola a fost modificată cu succes!', response);
         
          this.router.navigate(['/changepass']);


        },
        (error) => {
          console.error('Eroare la modificarea parolei:', error);
         
        }
      );
  }
}
