import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../services/page/page.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { UserService } from '../../../services/user-details/user.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-subscribed-user-list',
  templateUrl: './subscribed-user-list.component.html',
  styleUrls: ['./subscribed-user-list.component.scss']
})
export class SubscribedUserListComponent implements OnInit {

  userSubs!: Subscription;
  userPage!: Subscription;
  userDeleteSubs!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchVal : string = ''; 
  searchType : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;
  isLoading = false;
  detailsId:string | null = null;
  lastPage:any;
  currentUrl: string | null = null;

  constructor(
    private __user: UserService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
    private location: Location
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.lastPage = params.get('lastPage');
      },
      error: err => {}
    });
    // localStorage.removeItem('Current URL');
   }

  ngOnInit(): void {
    this.userPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
      if(page){
        this.current = page
      }
      else{
        this.current = 1;
      }
    });
    this.showLoader();
    this.getList();
  }

  goBack(): void {
    this.currentUrl = localStorage.getItem('Current URL');
    if(this.currentUrl){
      this.__route.navigateByUrl(this.currentUrl);
      this._pageService.sendCurrentPage(1);
    }
    // this.currentPage();
    // else{
    //   this.location.back();
    // }
  }

  ngOnDestroy(): void {
    if(this.userPage){
      this.userPage.unsubscribe();
    }
    if(this.userSubs){
      this.userSubs.unsubscribe();
    }
    if(this.userDeleteSubs){
      this.userDeleteSubs.unsubscribe();
    }
  }

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

  //Delivery list................
  getList(page = this.current, limit = this.recordsPerPage) {
    if(this.searchVal!=''){
      this.searchType = 'email';
      this.searchVal = this.searchVal;
    }
    // Pagination variables
    this.activePage = this.current;
    this.recordsPerPage = limit;
    const params = {
      limit,
      page: page,
      id: this.detailsId
    }
    this.loaded_data = false;
    this.userSubs = this.__user.subscribedUserList(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.listData = response?.data?.data;
                    // console.log("listData===",this.listData);
                    
                    this.totalRecords = response.data.pagination?.total;
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

  // Truncate text to a specific length with ellipsis
   truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

   // Strip HTML tags from a string
   stripHtml(htmlContent: string): string {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    return div.textContent || div.innerText || '';
  }

}
