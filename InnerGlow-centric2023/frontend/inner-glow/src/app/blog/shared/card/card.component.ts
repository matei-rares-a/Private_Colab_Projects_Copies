import { Component,Input, OnInit,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedData } from 'src/app/shared-data.service';
import { CookieService } from 'ngx-cookie-service';
import { style, transition, trigger,animate } from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
 
})

export class CardComponent implements OnInit{

  imageSrcc?: string;
  loadingImage = true;
  defaultImageSrc = 'assets/loading-static.png';
  
  constructor(private http: HttpClient, private sharedData: SharedData,private cookieService:CookieService) {  }

  heartImageSrc: string = "assets/empty-heart.png";
  @Input() route?: string;
  @Input() imageBytecode?: string;
  @Input() title?: string;
  @Input() content!: string;
  @Input() date!: string;
  @Input() author?: string;
  @Input() articleId!: number;
  @Input() isFavorite!:boolean;

  isLoggedIn?:boolean;
  truncatedContent!:string;

  ngOnInit() {
    if (this.isFavorite) {
      this.heartImageSrc = "assets/full-heart.png";
      } else {
      this.heartImageSrc = "assets/empty-heart.png";
    }

    if (this.imageBytecode && this.imageBytecode!=null) {
      this.imageSrcc=this.imageBytecode
      this.loadingImage=false;
    } else {
      this.imageSrcc = this.defaultImageSrc;
    }
  
    this.isLoggedIn=this.sharedData.getUserLoggedInStatus()
    
    this.date=this.formatDate(this.date)


    this.truncatedContent = this.content.length > 100 ? this.content.substring(0, 120) + '...' : this.content;
  }

  formatDate(inputString: string): string {
    const date = new Date(inputString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  toggleHeart() {
    if (this.heartImageSrc === "assets/empty-heart.png") {
      this.heartImageSrc = "assets/full-heart.png";
      this.sendPostCheckFavorite() 
      } else {
      this.heartImageSrc = "assets/empty-heart.png";
      this.sendPostUncheckFavorite()
    }
  }

  sendPostCheckFavorite() {
    const numOfArticle:number=this.articleId
    this.http.post(`https://localhost:7207/api/User/addToFavorites?articleId=${numOfArticle}`, {undefined}, {
      headers: {
        'Authorization':localStorage.getItem("token")!.toString()
      }
    }).subscribe(
      response => {
        console.log('Postare adaugata la favorite:', response);
      },
      error => {
        console.log('POST request failed:', error);
            }
    );
  }


  sendPostUncheckFavorite() {
    const numOfArticle:number=this.articleId

    this.http.post(`https://localhost:7207/api/User/removeToFavorites?articleId=${numOfArticle}`, {undefined}, {
      headers: {
        'Authorization':localStorage.getItem("token")!.toString()
      }
    }).subscribe(
      response => {
        console.log('Postare scoasa de la favorite:', response);
      },
      error => {
        console.log('POST request failed:', error);
            }
    );
  }
}

 

