import { Injectable } from '@angular/core';
import { log } from 'console';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private page: number = 1;
  private sendPage: BehaviorSubject<number> = new BehaviorSubject<number>(this.page);
  getPage: Observable<number> = this.sendPage.asObservable();
  
  constructor() { }
  sendCurrentPage(value: number): void {
    this.page = value; // Store the page number
    this.sendPage.next(value);
  }

  getCurrentPage(): Observable<number> {
    return this.getPage;
  }

  resetPage(): void {
    console.log("Resetting page to default (1)");
    this.sendCurrentPage(1);
  }
}
