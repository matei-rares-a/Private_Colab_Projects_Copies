import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { SharedData } from 'src/app/shared-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  formGroup: FormGroup = new FormGroup({});
  constructor(private sharedData:SharedData,private http: HttpClient,private router:Router,private cookieService:CookieService) {}


  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    }); 
  }

  submitForm() {
    if (this.formGroup.valid) {
      const requestData = {
        email: this.formGroup.get('email')?.value,
        password: this.formGroup.get('password')?.value
      };
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

      this.router.navigate(['/loading']);
  
    this.http.post<any>('https://localhost:7207/api/User/login', requestData, { ...httpOptions, observe: 'response' })
  .subscribe(
    
    (response: HttpResponse<any>) => {
    
      const authorizationHeader = response.headers;
      console.log(authorizationHeader);

      
      const data = response.body;
      console.log( data); 

      localStorage.setItem('token', data.token);
      //this.cookieService.set('token',  data.token);
      localStorage.setItem('id', data.id);
      localStorage.setItem('isCreator', data.isCreator.toString());
      localStorage.setItem('name',data.name)


      console.log("local storage setat" )
      this.sharedData.setIsCreator(data.isCreator)
      this.sharedData.setUserLoggedInStatus(true)
      this.sharedData.setUserId(data.id)
      this.sharedData.setUsername(data.name)

      this.router.navigate(['/home']);
    },
    (error) => {

      console.error('Eroare la cerere:', error);
      this.router.navigate(['/unauthorized']);
    }
  );

    }
  }
  }
