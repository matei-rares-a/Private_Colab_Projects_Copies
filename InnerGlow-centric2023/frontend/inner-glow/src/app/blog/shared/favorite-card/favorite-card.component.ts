import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { CookieOptions, CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-favorite-card',
  templateUrl: './favorite-card.component.html',
  styleUrls: ['./favorite-card.component.scss']
})
export class FavoriteCardComponent implements OnInit{
  imageSrcc?: string;
  loadingImage = true;
   defaultImageSrc = 'assets/loading-static.png';


  constructor(private http: HttpClient,private cookieService:CookieService) {  }

  heartImageSrc: string = "assets/full-heart.png";
  @Input() route?: string;
  @Input() imageBytecode: string="";
  @Input() title?: string;
  @Input() content!: string;
  @Input() date!: string;
  @Input() author?: string;
  @Input() articleId!: number;

  truncatedContent!:string;
  ngOnInit() {
    if (this.imageBytecode && this.imageBytecode!=null) {
      this.imageSrcc=this.imageBytecode
      this.loadingImage=false;
    } else {
      this.imageSrcc = this.defaultImageSrc;
    }
    this.date=this.formatDate(this.date)
    this.truncatedContent = this.content.length > 100 ? this.content.substring(0, 100) + '...' : this.content;
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
       this.sendPostUncheckFavorite(); //il scoate de la favorite
    }
  }
  
  sendPostCheckFavorite() {
    const token= localStorage.getItem('token')!.toString();
    this.http.post('https://localhost:7207/api/User/addToFavorites?articleId='+this.articleId, {}, {
      headers: {
        'Authorization': token
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
    this.http.post(`https://localhost:7207/api/User/removeToFavorites?articleId=${this.articleId}`, {undefined}, {
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

  //cand apas pe imagine sau pe link
  // face un get cu id-ul articolului pe care il iau din ordinea variabilei articles 
}
