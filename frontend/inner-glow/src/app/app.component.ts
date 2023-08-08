import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { SharedData } from './shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent {
  //aici pot face modificari inainte de a intra pe site
  constructor(private http: HttpClient,private cookieService:CookieService,private sharedData: SharedData){
    if(localStorage.getItem("token")){//tokenul exista

      this.sharedData.setUserLoggedInStatus(true)
      this.sharedData.setIsCreator(localStorage.getItem("isCreator")==="true")
      this.sharedData.setUserId(parseInt(localStorage.getItem("id")!))
      this.sharedData.setUsername(localStorage.getItem("name")!)
      console.log("Detalii setate")
    }
    else{
      console.log("Detalii nesetate")
    }
  }
 
 

  

  testMethod(){
  }


  makeGet() {
    this.http.get(this.endpoint, {headers:this.headers}).pipe( //desi in browser e codificat in base64, la server ajung eok si sunt despartite de :
      map((response: any) => {
        return JSON.parse(JSON.stringify(response));
      })
    ).subscribe(
      (responseObject: any) => {
        console.log('Response Object:', responseObject);
        const firstProperty = responseObject[0]; 
        console.log('First Property:', firstProperty);
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  } 

  

  endpoint='https://e8931a16-7d5f-4f06-966c-3a46e574c1eb.mock.pstmn.io/articles'
  email="emailul este acesta fii foarte atent aici"
  password="parola lunga cmf"

   headers = new HttpHeaders({
    'Authorization': 'Basic ' + `${this.email}:${this.password}`
  });
  
}

/*
  makeGet() {
    this.http.get(this.endpoint).pipe(
      map((response: any) => {
        // Assuming the response is a JSON object
        // You may need to adjust this based on your actual API response structure
        return JSON.parse(JSON.stringify(response));
      })
    ).subscribe(
      (responseObject: any) => {
        // Now you can use properties of the responseObject
        console.log('Response Object:', responseObject);
  
        // Accessing properties from the responseObject
        const firstProperty = responseObject[0]; // Replace 'someProperty' with an actual property key
        console.log('First Property:', firstProperty);
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  } 
  */

  /*
  makePost(): void {
    const payload = {
    title: "Italy",
    content: "Ma plimb de colo colo",
    publishDate: "2023-07-23T14:38:22.958Z"
    };
    this.http.post(this.endpoint, payload).subscribe(
      (response) => {
        // Handle the successful POST response (JSON data)
        console.log('POST Response:', response);
      },
      (error) => {
        // Handle the error response, e.g., show an error message.
        console.error('Failed to make POST request:', error);
      }
    );
  }
  */

