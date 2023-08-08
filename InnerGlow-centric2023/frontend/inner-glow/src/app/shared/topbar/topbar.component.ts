import { HttpClient } from '@angular/common/http';
import { Component,EventEmitter,HostListener,Inject,Input, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs';
import { SharedData } from 'src/app/shared-data.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  constructor(private router: Router,private  http: HttpClient,private sharedData:SharedData) { }
  private subscription!: Subscription;
  isLoggedIn: boolean=this.sharedData.getUserLoggedInStatus();


  topbarPosition = '0'; // Initial top position

  private prevScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const currentScrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (currentScrollPos > this.prevScrollPos) {
      this.topbarPosition = '-100px'; 
    } else {
      this.topbarPosition = '0';
    }

    this.prevScrollPos = currentScrollPos;
  }
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.setClassBasedOnRoute();
      }
    });


      this.subscription = this.sharedData.userLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  currentRoute!: string;
  classToApplyHome!: string; //home
  classToApplyAbout!: string; //about
  classToApplyContact!: string; //contact-us
  classToApplyBlog!: string; //articles
  classToApplyFavorites!:string; //favorites
  classToApplyAdmin!:string; //admin

  
  setClassBasedOnRoute() {
    this.classToApplyHome = this.currentRoute.includes('/home') ? 'underline' : 'basic'; 
    this.classToApplyAbout = this.currentRoute.includes('/about') ? 'underline' : 'basic';
    this.classToApplyContact = this.currentRoute.includes('/contact-us') ? 'underline' : 'basic';
    this.classToApplyBlog= this.currentRoute.includes('/blog/articles') ? 'underline' : 'basic';
    this.classToApplyFavorites= this.currentRoute.includes('/blog/favorites') ? 'underline' : 'basic';
    this.classToApplyAdmin= this.currentRoute.includes('/admin') ? 'underline' : 'basic';
  }

  numeAdmin?:string='A';
 
  toggleElementVisibility() {
    console.log("status "+this.sharedData.getUserLoggedInStatus())
    this.sharedData.setUserLoggedInStatus(!this.sharedData.getUserLoggedInStatus())
  }
  handleSignOut(){
    this.toggleElementVisibility()
    localStorage.removeItem("token");
    localStorage.removeItem("id")
    localStorage.removeItem("isCreator")
  }
  getUserFirstLetter() {
    return this.sharedData.getUsername()![0];
  }

  handleFavoritesClick() {
    if (!this.isLoggedIn) {
      Swal.fire({
        allowEnterKey:true,
         allowEscapeKey:true,
         title: 'Hi There! ',
         text: 'It seems like you are not logged in 🤗. Do you care to join us ? ',
         showDenyButton: true,
         //showCancelButton: true,
         confirmButtonText: 'Yeah, sure!',
         denyButtonText: `Maybe another time!`,
         confirmButtonColor:"#356f48",
         denyButtonColor:"#a83246"
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/auth"])
          return 
        } else if (result.isDenied) {
        }
      })

    } else {
      this.router.navigate(['/blog/favorites']);
    }
  }
  searchQuery: string="";



  handleSubmit() {
    if (this.searchQuery || this.searchQuery==="") {
    

    
      this.router.navigate(['/blog/articles'], { queryParams: { q: this.searchQuery } });
      this.emitOutputData() 

      //this.searchQuery=""
    }
  }

 emitOutputData() {
    const outputData = 'Your output data here'; 
    this.sharedData.setSearch(this.searchQuery);
  }

handleUser(){
  if(this.sharedData.isUserCreator()===false){
    const name=this.sharedData.getUsername()
  Swal.fire({
    allowEnterKey:true,
     allowEscapeKey:true,
     title: 'Hi '+name +"🥰",
     text: ' Do you want change your password ? ',
     showDenyButton: true,
     //showCancelButton: true,
     confirmButtonText: 'Yeah, sure!',
     denyButtonText: `Maybe another time!`,
     confirmButtonColor:"#356f48",
     denyButtonColor:"#a83246"
  }).then((result) => {
    if (result.isConfirmed) {
      // console.log("asdfasdf true")
     this.router.navigate(["/recoveryaccount"])
      // return 
    } else if (result.isDenied) {
      // console.log("asdfasdf false")
    }
  })
  }
  else{
      this.router.navigate(["/blog/my-blogs"])

  }


}

}
