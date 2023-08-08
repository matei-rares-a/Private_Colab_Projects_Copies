import { Inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedData } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class Guardian implements CanActivate {

  constructor(private router: Router,private sharedData:SharedData) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const url: string = state.url;
    console.log('Trying to access URL:', url);
    if(url.includes("admin/form") || url.includes("blog/my-blogs") ){

      console.log("  "+this.sharedData.getUserLoggedInStatus()===true +"  "+ this.sharedData.isUserCreator()===true)

      if(this.sharedData.getUserLoggedInStatus()===true && this.sharedData.isUserCreator()===true){
        return true;
      }
      else{
        console.log("Nu ai acces la"+url)
        this.router.navigate(['/home']);
        return true;
      }
    }

    if(url.includes("blog/favorites") ){
      console.log(this.sharedData.getUserLoggedInStatus()===true)
      if(this.sharedData.getUserLoggedInStatus()===true){
        return true;
      }
      else{
        console.log("Nu ai acces la"+url)
        this.router.navigate(['/home']);
        return false;
      }
    }



   
      


      return true; // daca vreau sa il las pe url
      //return false; // daca vreau sa il redirectez

  }
}