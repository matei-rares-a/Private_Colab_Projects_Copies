import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL:string='https://localhost:7207/'
  private apiURL: string = 'https://e8931a16-7d5f-4f06-966c-3a46e574c1eb.mock.pstmn.io/articles';

  constructor(private httpClient: HttpClient) { }

  getArticles(): Observable<any> {
    return this.httpClient.get(`https://localhost:7207/api/Article/get`);
  }



  
}
