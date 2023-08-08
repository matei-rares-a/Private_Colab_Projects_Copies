import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service'; // Importați CookieService

@Component({
  selector: 'app-checkcode',
  templateUrl: './checkcode.component.html',
  styleUrls: ['./checkcode.component.scss']
})
export class CheckcodeComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService 
  ) {}

  onSubmit(email: string, code: string) {
    const requestData = {
      email: email,
      code: parseInt(code)
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 289'
      })
    };

    this.router.navigate(['/loading']);

    this.http.post<any>('https://localhost:7207/api/User/checkCode', requestData, httpOptions)
      .subscribe(
        (response) => {
          console.log('Răspuns de la server:', response);
          console.log(response.token);

          // Verificați dacă răspunsul conține tokenul și puneți-l într-o variabilă cookie
          if (response.token) {
            const token = response.token;
            this.cookieService.set('token', token); 
            }
          else{
            console.log('nu s-a gasit token');
          }
         
            if (this.cookieService.check('token')) {
              console.log('Tokenul a fost pus în cookie cu succes.');
              console.log('Tokenul din cookie:', this.cookieService.get('token'));
            } else {
              console.log('Nu s-a putut pune tokenul în cookie.');
            }
          

          this.router.navigate(['/forgotpassword']);
        },
        (error) => {
          console.error('Eroare la cerere:', error);
          this.router.navigate(['/badrequest']);
        }
      );
  }
}
