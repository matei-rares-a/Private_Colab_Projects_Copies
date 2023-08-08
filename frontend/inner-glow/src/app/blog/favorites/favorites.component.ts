import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs';
import { HttpService } from 'src/app/http.service';
import { SharedData } from 'src/app/shared-data.service';
//TODO modificat in functie de logica
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent  implements OnInit {
  articles: any[] = this.sharedData.articles;
  currentPage: number = 1;
  totalPages: number = 1; 
  loading:boolean=true

  constructor(
    private sharedData: SharedData,
    private articlesService: HttpService,
    private http:HttpClient,
    private cookieService:CookieService
  ) {}

  //TOADD On init face get la primele articole din baza de date si primeste nr total de pagini 
  ngOnInit() {
    this.getShortMyFavoriteArticles()

  }

  lastPage!:number;
  onPageChanged(currentpage: number) {
    this.currentPage = currentpage; 
    this.loadArticlesByPageNum(this.currentPage)

  }
  
  loadArticlesByPageNum(pagenum:number) {//TODO metoda asta face un get care are nr paginii,ca sa stie ce articole sa intoarca
    this.articles=this.sharedData.articles2; 

    this.articlesService.getArticles().subscribe(
      (data) => {
        this.articles = data
      },
      (error) => {
        console.error(error);
      }
    );
  }


  
  getShortMyFavoriteArticles(){
    this.http.post(`https://localhost:7207/api/Article/get/favorites?page=${this.currentPage}`,{
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
        console.log('Response Object Favorites:', responseObject);
        this.totalPages=responseObject.numberOfPage
        if(this.totalPages==0){
          this.currentPage=0
        }
        console.log(responseObject)
        this.articles=responseObject.shortArticles
        this.loading=false
      },
      (error: any) => {
        console.error('Failed to fetch data:', error);
      }
    );
  }


}
