import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedData {
  public token: any ;
  private userLoggedInSubject=new Subject<boolean>();
  public userLoggedIn$= this.userLoggedInSubject.asObservable();
  private userLoggedIn:boolean=false; //modifica aici cu true daca testezi css
  private userId:number | undefined
  private isCreator:boolean=false;
  private userName:string=""


  setUsername(usrn:string){
    this.userName=usrn
  }
  getUsername():string{
    return this.userName
  }

  setUserLoggedInStatus(status: boolean) {
    this.userLoggedInSubject.next(status);
    this.userLoggedIn=status;
  }

  setUserId(num:number){
    this.userId=num;
  }
  getUserId():number | undefined{
    return this.userId
  }
  isUserCreator():boolean{
    return this.isCreator;
  }
  setIsCreator(bol:boolean){
    this.isCreator=bol;
  }

  getUserLoggedInStatus():boolean{
    return this.userLoggedIn
  }
  

  public userDetails: any;
  constructor() {}
  

  getUserLoggedInStatusObservale() {
    //this.userLoggedInSubject.next(true);//
    return this.userLoggedIn$;
  }

  getToken() {
    return this.token;
  }



/*setUserLoggedInStatus(status: boolean) {
    console.log('set logged in status to ' + status);
    if (!this.userLoggedIn && status == true) {
      //do something on login here...
    } else {
      // do someting when logout
    }
    return true;
  }*/



  saveToken(token:any): boolean {
    try {
      localStorage.setItem('jwt-token', JSON.stringify(token));
      //this.token = JSON.parse(localStorage.getItem('jwt-token'));
      alert(`Login successful!`);
      window.location.href = '/';
      return true;
    } catch (error) {
      throw new Error(`Error saving token ${error}`);
    }
  }

  deleteToken(): void {
    localStorage.removeItem('jwt-token');
    console.log('logout');
    location.reload();
  }

  getUserName(): string | null {
    if (!this.getUserLoggedInStatus()) {
      //alert ("Please login first!");
      return null;
    } else {
      let userObj = {
        username: this.userDetails['username'],
        email: this.userDetails['email'],
      };
      return `${userObj}`;
    }
  }

  getUserEmail() {
    if (!this.getUserLoggedInStatus()){
      alert('Please log in to access your account details.');
      return ;}
    else return `Your Email is:${this.userDetails['email']} `;
  }

  getUserPhone() {
    if (!this.getUserLoggedInStatus()){
      alert('Please log in to access your phone number.');
      return}
    else return `Your Phone Number is ${this.userDetails['phone']}`;
  }

  setArticles(newVar: any) {
    this.articles = newVar;
  }

  public articles = [
    {
      id_article: 1,
      title: 'art1',
      content: 'articol 1 cu text',
      date: '1.1.1',
      author: 'John One',
      img: '',
      categoy: ['Yoga', 'Spa', 'Meditation', 'Zumba', 'Nutrition'],
      city: 'Bucuresti',
    },
    {
      id_article: 2,
      title: 'art2',
      content: 'articol 2 cu text',
      date: '2.2.2',
      author: 'John Two',
      img: '',
      categoy: ['Yoga', 'Spa'],
      city: 'Iasi',
    },
    {
      id_article: 3,
      title: 'art3',
      content: 'articol 3 cu text',
      date: '3.3.3',
      author: 'John Three',
      img: '',
      categoy: ['Yoga'],
      city: 'Timisoara',
    },
    {
      id_article: 1,
      title: 'art1',
      content: 'articol 1 cu text',
      date: '1.1.1',
      author: 'John One',
      img: '',
      categoy: ['Yoga', 'Spa', 'Meditation', 'Zumba', 'Nutrition'],
      city: 'Bucuresti',
    },
    {
      id_article: 2,
      title: 'art2',
      content: 'articol 2 cu text',
      date: '2.2.2',
      author: 'John Two',
      img: '',
      categoy: ['Yoga', 'Spa'],
      city: 'Iasi',
    },
    {
      id_article: 3,
      title: 'art3',
      content: 'articol 3 cu text',
      date: '3.3.3',
      author: 'John Three',
      img: '',
      categoy: ['Yoga'],
      city: 'Timisoara',
    },
    
  ];

  public articles2 = [
    {
      id_article: 3,
      title: 'art3',
      content: 'articol 3 cu text',
      date: '3.3.3',
      author: 'John Three',
      img: '',
      categoy: ['Yoga'],
      city: 'Timisoara',
    },
    {
      id_article: 1,
      title: 'art1',
      content: 'articol 1 cu text',
      date: '1.1.1',
      author: 'John One',
      img: '',
      categoy: ['Yoga', 'Spa', 'Meditation', 'Zumba', 'Nutrition'],
      city: 'Bucuresti',
    },
    {
      id_article: 2,
      title: 'art2',
      content: 'articol 2 cu text',
      date: '2.2.2',
      author: 'John Two',
      img: '',
      categoy: ['Yoga', 'Spa'],
      city: 'Iasi',
    },
    {
      id_article: 3,
      title: 'art3',
      content: 'articol 3 cu text',
      date: '3.3.3',
      author: 'John Three',
      img: '',
      categoy: ['Yoga'],
      city: 'Timisoara',
    },
    {
      id_article: 1,
      title: 'art1',
      content: 'articol 1 cu text',
      date: '1.1.1',
      author: 'John One',
      img: '',
      categoy: ['Yoga', 'Spa', 'Meditation', 'Zumba', 'Nutrition'],
      city: 'Bucuresti',
    },
    {
      id_article: 2,
      title: 'art2',
      content: 'articol 2 cu text',
      date: '2.2.2',
      author: 'John Two',
      img: '',
      categoy: ['Yoga', 'Spa'],
      city: 'Iasi',
    },
  ];


  searched:string="";
  private searchedSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");

  setSearch(search:string){
    this.searched=search
    this.searchedSubject.next(search);

  }
  getOutputData() {
    return this.searchedSubject.asObservable();
  }


  public currentArticle:any //care are o structura de genul luata din article-details:
  /*
  article: any = {
    id: '',
    title: '',
    publicateDate: '2023-07-22T12:00:28.689',
    author: 'TODO',
    authorId: 0,
    content: 'Sample content for the first article.',
    city: 'Iasi',
    dateOfTheEvent: '2023-07-22T12:00:28.689',
    facebook: 'facebook.com/sample1',
    twitter: 'twitter.com/sample1',
    instagram: 'instagram.com/sample1',
    categories: ['Technology', 'Yoga'],
    articleImages: [
      {
        content: ''
      },
    ],
    comments: [],
  };
*/

}
