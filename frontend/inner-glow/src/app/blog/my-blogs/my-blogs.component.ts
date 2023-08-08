import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { SharedData } from 'src/app/shared-data.service';

@Component({
  selector: 'app-my-blogs',
  templateUrl: './my-blogs.component.html',
  styleUrls: ['./my-blogs.component.scss']
})
export class MyBlogsComponent implements OnInit {
  articles: any[] = this.sharedData.articles;
  currentPage: number = 1;
  totalPages: number = 1; 
  loading:boolean=true;
  constructor(
    private sharedData: SharedData,
    private http:HttpClient,
    private cookieService:CookieService
  ) {}

  ngOnInit() {
    this.getShortMyArticles()
  }

  onOptionsSelected(options:any){
    console.log(options)
  }

  lastPage!:number;
  onPageChanged(currentpage: number) {
    this.currentPage = currentpage; 
  }
  
  loadArticlesByPageNum(pagenum:number) {
  
  }


  getShortMyArticles(){
    this.http.post(`https://localhost:7207/api/Article/get/byAuthorId?page=${this.currentPage}`,{
      "search": "",
      "optionsCategory": [
        ""
      ],
      "optionsCity": [
        ""
      ],
      "optionsAuthor": [
        ""
      ],
      "optionsEventDate": "",
      "optionsPostDate": "",
      "optionsSortedBy": ""
    },{
    headers: new HttpHeaders({
      'Authorization':localStorage.getItem("token")!.toString()
    }
    )}).pipe(
      map((response: any) => {
        return JSON.parse(JSON.stringify(response));
      })
    ).subscribe(
      (responseObject: any) => {
        console.log('Response Object My articles:', responseObject);
        this.totalPages=responseObject.numberOfPage
        if(this.totalPages==0){
          this.currentPage=0
        }
        this.articles=responseObject.shortArticles
        this.loading=false;
      },
      (error: any) => {
        console.error('Failed to fetch data:', error);
        this.loading=false;
      }
    );
  }


}