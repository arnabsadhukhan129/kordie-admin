import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from '../../../../app/services/customer-management/customer.service';
import { PageService } from '../../../../app/services/page/page.service';
import { RedirectPageService } from '../../../../app/services/redirect-to-another-component/redirect-page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {

  detailsId: string | null = null;
  getData: any;
  getPlan: any;
  currentUrl: string | null = null;


  constructor(
      private __customer: CustomerService,
      private __route:Router,
      private __shared:SharedService,
      private __spinner: NgxSpinnerService,
      private __activatedRoute:ActivatedRoute,
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
    localStorage.removeItem('Current URL');
   }

  ngOnInit(): void {
    this.getOrderDetails();
  }

  //get current url........
  getUrl(){
    this.currentUrl = this.__route.url;
    localStorage.setItem('Current URL',this.currentUrl)
  }


   //order details..............
   getOrderDetails() {
    this.__customer.getDetailById(this.detailsId)
    .subscribe((response)=>{
      
      if(response.error == false)
      {
          this.getData = response?.data?.ALL_PAYMENT_COURSES;
          this.getPlan = response?.data?.ALL_PLANS;
          // console.log('app-->', this.getData );
      }
      else{
        this.__shared.toastError(response.message);
      }
      
    },
    (err)=>{
      console.log(err);
      if(err.status == 403)
      {
            this.__shared.sessionExpired();
      }
    })
  }


  //Skip HTML Tags.............
  stripHtmlTags(html: string): string {
    return html ? html.replace(/<[^>]*>/g, '').trim() : '';
  }
  

}
