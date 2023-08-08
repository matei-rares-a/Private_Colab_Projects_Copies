import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { SharedData } from '../../shared-data.service';
import { Subject, Subscription, map } from 'rxjs';
import { HttpService } from '../../http.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';


@Component({
  selector: 'app-articles',
  //providers: [ArticlesService],
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
//nu mi-a mers sa fac Subscription la isLoggedIn aici pentru ca se apela instant ngOnDestroy()
export class ArticlesComponent implements OnInit {
  articles: any[] = this.sharedData.articles;
  currentPage: number = 1;
  totalPages: number = 1; 
  queryParam?: string|null;
  loading:boolean=true

  options:any= {
    search:'',
    optionsCategory:[''],
    optionsCity:[''],
    optionsAuthor:[''],
    optionsEventDate:'',
    optionsPostDate:'',
    optionsSortedBy:''
  };
  subscription: any;

  constructor(
    private sharedData: SharedData,
    private http:HttpClient,
    private activatedRoute:ActivatedRoute,
    private router:Router
      ) {

        this.subscription = this.sharedData.getOutputData().subscribe((data) => {
          this.queryParam=data
          this.getShortArticles()
        });
 /*
    this.subscription = this.sharedData.userLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      console.log("Client conectat? "+ this.isLoggedIn)
    });
    */
      }

  ngOnInit() {}
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  

  onOptionsSelected(options:any){
    this.options.optionsCategory = options.optionsCategory.length === 0 ? [''] : options.optionsCategory;
    this.options.optionsCity = options.optionsCity.length === 0 ? [''] : options.optionsCity;
    this.options.optionsAuthor = options.optionsAuthor.length === 0 ? [''] : options.optionsAuthor;
    this.options.optionsEventDate= options.optionsEventDate
    this.options.optionsPostDate=options.optionsPostDate
    this.options.optionsSortedBy=options.optionsSortedBy
    this.currentPage=1
    //console.log(this.options)
    this.getShortArticles()
  }


  lastPage!:number;
  onPageChanged(currentpage: number) {
    this.currentPage = currentpage; 
    this.loading=true
    this.getShortArticles()   
  }


  getShortArticles(){

    if(this.queryParam === null || this.queryParam ===''){
      this.options.search=''
    }else{
      this.options.search=this.queryParam
    }

    //console.log(this.options)
    if(localStorage.getItem("token")){
      //this.router.navigate(['/loading']); 
            this.http.post(`https://localhost:7207/api/Article/get/formatted?page=${this.currentPage}`,this.options, 
            {
              headers: {
                'Authorization':localStorage.getItem("token")!.toString()
              }
            }
            ).pipe(
              map((response: any) => {
                return JSON.parse(JSON.stringify(response));
              })
            ).subscribe(
              (responseObject: any) => {
                console.log('Response Object:', responseObject);
                this.totalPages=responseObject.numberOfPage
                if(this.totalPages==0){
                  this.currentPage=0
                }
                else if(this.totalPages==1){
                  this.currentPage=1
                }
                
                this.articles=responseObject.shortArticles

               // this.router.navigate(['/blog/articles']); 
                this.loading=false
              },
              (error) => {
                console.error('Failed to fetch data:', error);
                this.loading=false
              }
            );
    }else{

      this.http.post(`https://localhost:7207/api/Article/get/formatted?page=${this.currentPage}`,this.options
      ).pipe(
        map((response: any) => {
          return JSON.parse(JSON.stringify(response));
        })
      ).subscribe(
        (responseObject: any) => {
          console.log('Response Object:', responseObject);
          this.totalPages=responseObject.numberOfPage
          if(this.totalPages==0){
            this.currentPage=0
          }
          
          this.articles=responseObject.shortArticles
          this.loading=false

        },
        (error) => {
          console.error('Failed to fetch data:', error);
          this.loading=false
        }
      );
    }

  }


}











/* inca o varianta in care se foloseste ChangeDetectorRef

export class ArticlesComponent implements OnInit {
  articles: any[] = this.sharedData.articles;
  private articlesSubject = new Subject<any[]>();
  currentPage: number = 1; // Set the initial current page here
  totalPages: number = 2; // Set the total number of pages here

  constructor(
    private sharedData: SharedData,
    private cdr: ChangeDetectorRef,
    private articlesService: ArticlesService // Inject the service here
  ) {}

  ngOnInit() {
    // Subscribe to the changes in the articlesSubject
    this.articlesSubject.subscribe((updatedArticles) => {
      this.articles = updatedArticles;
      // Manually trigger change detection after updating the articles variable
      this.cdr.detectChanges();
    });
  }

  // This method should be called when the page changes in the paginator
  onPageChanged(page: number) {
    this.currentPage = page; // Update the current page
    this.loadArticles(); // Call the method to load articles based on the current page
  }

  loadArticles() {
    this.articlesService.getArticles().subscribe(
      (data) => {
        this.articles = data
        this.articlesSubject.next(this.articles); // Emit the updated articles to the articlesSubject
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
*/


/* static 

export class ArticlesComponent implements OnInit {
  articles: any[] = this.sharedData.articles;
  private articlesSubject = new Subject<any[]>();
  currentPage: number = 1; 
  totalPages: number = 2; 

  constructor(private sharedData: SharedData, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // Subscribe to the changes in the articlesSubject
    this.articlesSubject.subscribe((updatedArticles) => {
      this.articles = updatedArticles;
      // Manually trigger change detection after updating the articles variable
      this.cdr.detectChanges();
    });
  }

  // This method should be called when the page changes in the paginator
  onPageChanged(page: number) {
    this.currentPage = page; // Update the current page
    this.updateArticles(this.sharedData.articles); // Call the method to update the articles based on the current page
  }

  // This method should be called when you want to update the articles variable in SharedData
  updateArticles(newArticles:any ) {
    // Implement your logic to get the articles based on the current page
    // For example, if you have fetched new articles from an API, update the articles array here
    
    this.sharedData.setArticles(newArticles);
    // Emit the updated articles to the articlesSubject
    this.articlesSubject.next(newArticles);
  }
}

*/



/*

ngOnInit() {
  
  this.articlesService.getArticles().subscribe({
   next: (data) => {
     console.log(data);
   },
   error: (error) => {
     console.error(error);
   }
  })
}*/