import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  cards: any[] = [];
  currentPage = 1;
  cardsPerPage = 3;
  loading:boolean=true

  constructor(private http: HttpClient,private router:Router) { }

  ngOnInit(): void {
    this.fetchData();
  }

  getDisplayedCards(): any[] {
    const startIndex = (this.currentPage - 1) * this.cardsPerPage;
    const endIndex = startIndex + this.cardsPerPage;
    return this.cards.slice(startIndex, endIndex);
  }

  changePage(pageNumber: number): void {
    this.currentPage = pageNumber;
  }

  fetchData(): void {

    const driveAPIUrl = 'https://localhost:7207/api/User/get/info';
    this.http.get(driveAPIUrl).subscribe(
      (data: any) => {
        this.cards = data; // Se atribuie datele primite variabilei 'cards'
        console.log(data);
        this.loading=false
      },
      (error) => {
        console.error(error);
        this.loading=false
      }
    );
  }
}
