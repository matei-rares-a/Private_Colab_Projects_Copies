import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { SharedData } from 'src/app/shared-data.service';

@Component({
  selector: 'app-my-card',
  templateUrl: './my-card.component.html',
  styleUrls: ['./my-card.component.scss']
})
export class MyCardComponent implements OnInit{
  imageSrcc?: string;
  loadingImage = true;

  constructor(    private sharedData: SharedData,
    private http: HttpClient,private router:Router) {  }
  defaultImageSrc = 'assets/loading-static.png';

  heartImageSrc: string = "assets/pen.png";
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
    console.log(this.date)
    this.date=this.formatDate(this.date)
    console.log(this.date)
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

  handlePen(){
   // this.sharedData.currentArticle=this.article
    //TODO get la articol cu datele lui
    this.getArticle(
      'https://localhost:7207/api/Article/get/' + this.articleId
    );

   
  }


  getArticle(url: string) {
    this.http
      .get(url)
      .pipe(
        map((response: any) => {
          return JSON.parse(JSON.stringify(response));
        })
      )
      .subscribe(
        (responseObject: any) => {
          
          this.sharedData.currentArticle=responseObject
          this.router.navigate(['/admin/form'], { queryParams: {state:'edit'}});
        },
        (error) => {
          console.error('Failed to fetch data:', error);
        }
      );
  }
 
 }
