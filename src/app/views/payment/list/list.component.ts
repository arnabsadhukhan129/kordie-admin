import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RedirectPageService } from '../../../services/redirect-to-another-component/redirect-page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PageService } from '../../../services/page/page.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  paymentSubs!: Subscription;
  paymentPage!: Subscription;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;
  display_error : boolean = false;
  loaded_data : boolean = false;
  searchType : string = '';
  searchVal : string = ''; 
  listData: any;
  current: number = 1;
  displayMessage : string = '';
  errorMessage : string = '';
  isLoading = false;

  constructor(
    private _payment: PaymentService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.paymentPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
      if(page){
        this.current = page
      }
      else{
        this.current = 1;
      }
    });
    // Start loader before fetching data
    this.showLoader();
    this.getList();
  }

  ngOnDestroy(): void {
    // if(this.paymentPage){
    //   this.paymentPage.unsubscribe();
    // }
    if(this.paymentSubs){
      this.paymentSubs.unsubscribe();
    }
  }

  //Hide loader..................
  hideLoader() {
    if(this.isLoading){
      this.isLoading = false;
      this.__spinner.hide();
    }
  }

  //Show loader........
  showLoader(){
    if(!this.isLoading){
      this.isLoading = true;
      this.__spinner.show();
    }
  }

  //List..............
  getList(page = this.current, limit = this.recordsPerPage) {
    if(this.searchVal!=''){
      this.searchType = 'product_name';
      this.searchVal = this.searchVal;
    }
    // Pagination variables
    this.activePage = this.current;
    this.recordsPerPage = limit;
    const params = {
      limit,
      page: page
    }
    this.loaded_data = false;
    this.paymentSubs= this._payment.getList(params, this.searchType, this.searchVal)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.payments;
          // console.log("listData.....",this.listData);
          
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
        this.hideLoader();
      },
      (err)=>{
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
        this.hideLoader();
      })
  }

  changeSearchType(event : any){
    this.searchVal = event.target.value;
    this.getList(1, this.recordsPerPage);
  }

  currentPage(){
    this._pageService.sendCurrentPage(this.current);
  }

   //Redirect To Content Page...............
   redirectToContentPage(title:any){
    this._redirect.sendredirectionPage(title);
  }

}
