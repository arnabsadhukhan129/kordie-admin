import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectPageService implements OnInit {

  constructor(
    private __route:Router,
  ) { }

  ngOnInit(): void {
    
  }

  sendredirectionPage(data:any){
    if(data === '67498e27ecf109fee481f59d'){
      this.__route.navigateByUrl('/section-title-mangement/hospitiality-school-mangement');
    }
    else if(data === '6749abaa433825a3948ddea9'){
      this.__route.navigateByUrl('/section-title-mangement/goal-based-talent-development-solution-management');
    }
    else if(data === '674d9bf1f3f72fd1c4331597'){
      this.__route.navigateByUrl('/section-title-mangement/explore-learning-tracks');
    }
    else if(data === '674dc2ab467464979dcc86ba'){
      this.__route.navigateByUrl('/section-title-mangement/support-your-goal');
    }
    else if(data === '674ed1ea6f534000dab852f6'){
      this.__route.navigateByUrl('/section-title-mangement/learn-kordie');
    }
    else if(data === '674eecb02a26a746f7a1fd8c'){
      this.__route.navigateByUrl('/section-title-mangement/meet-your-curators');
    }
    else if(data === "674f00831afb687b4f195444"){
      this.__route.navigateByUrl('/section-title-mangement/we-trusted');
    }
    else if(data === "674f01a21afb687b4f19545d"){
      this.__route.navigateByUrl('/section-title-mangement/student-speak-us');
    }
    else if(data === "674f02a61afb687b4f19546c"){
      this.__route.navigateByUrl('/section-title-mangement/insights-highlights');
    }
    else if(data === "67a346d8b9b8699e2d37b3af"){
      this.__route.navigateByUrl('/section-title-mangement/hospitality-upskilling');
    }
  }

}
