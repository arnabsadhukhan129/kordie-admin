import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private sendSubject = new BehaviorSubject<any>(null);
  private getSubject = this.sendSubject.asObservable();
  constructor() { }

  send(value:any){
    this.sendSubject.next(value);
  }

  get(){
    return this.getSubject;
  }
}
