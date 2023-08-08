import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recoveryaccount',
  templateUrl: './recoveryaccount.component.html',
  styleUrls: ['./recoveryaccount.component.scss']
})
export class RecoveryaccountComponent {
  constructor(private http: HttpClient,private router: Router) {}

  onSubmit(email: string) {
    this.router.navigate(['/loading']);
    const url = 'https://localhost:7207/api/User/sendCode';
    const body = { Email: email }; 
    console.log(body);

    this.http.post(url, body, { headers: { 'Content-Type': 'application/json' } }).subscribe(
      () => {
        console.log('Cererea a fost trimisă cu succes!');
        this.router.navigate(['/checkcode']);
      },
      (error) => {
        console.error('Eroare la trimiterea cererii:', error);
      }
    );
  }
}