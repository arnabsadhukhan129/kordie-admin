import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BlogCategoryService } from '../../../../app/services/blog-category/blog-category.service';
import { PageService } from '../../../../app/services/page/page.service';
import { RedirectPageService } from '../../../../app/services/redirect-to-another-component/redirect-page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit,OnDestroy {
  blogCategroySubs!: Subscription;
  blogCategoryPage!: Subscription;
  blogCategoryStatusSubs!: Subscription;
  blogCategoryDeleteSubs!: Subscription;
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
    private _blog_category: BlogCategoryService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.blogCategoryPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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

  ngOnDestroy(): void {
    if(this.blogCategoryPage){
      this.blogCategoryPage.unsubscribe();
    }
    if(this.blogCategroySubs){
      this.blogCategroySubs.unsubscribe();
    }
    if(this.blogCategoryStatusSubs){
      this.blogCategoryStatusSubs.unsubscribe();
    }
    if(this.blogCategoryDeleteSubs){
      this.blogCategoryDeleteSubs.unsubscribe();
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
      this.searchType = 'name';
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
    this.blogCategroySubs = this._blog_category.getList(params, this.searchType, this.searchVal)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.topics;
          // console.log("goalList.....",this.listData);
          
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
        this.hideLoader(); //hide loader
      },
      (err)=>{
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
        this.hideLoader(); //hide loader
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

  //Change Status..................
  toggleStatus(item: any): void {
    const previousStatus = item.is_active;
    item.is_active = !item.is_active;
  
    this.blogCategoryStatusSubs = this._blog_category.changeStatus(item._id).subscribe({
      next: (response) => {
        if (response.error) {
          this.handleError(response.message);
          item.is_active = previousStatus;
        } else {
          this.__shared.toastSuccess('Status changed successfully');
        }
      },
      error: (err) => {
        this.handleApiError(err);
        item.is_active = previousStatus;
      },
    });
  }
  

  // Common error handler for API responses
    private handleError(message: string): void {
      this.errorMessage = message;
      this.__shared.toastError(this.errorMessage);
    }

  // Common API error handler
  private handleApiError(err: any): void {
    this.errorMessage = err.error?.message || "An error occurred";

    if (err.status === 403) {
      this.__shared.sessionExpired();
    } else {
      this.__shared.toastError(this.errorMessage);
    }
  }

  //Delete data........
  delete(id: string){
    if (confirm("Are you sure to delete?") == true) 
      {
          this.blogCategoryDeleteSubs = this._blog_category.delete(id)
              .subscribe((response)=>{
                
                if(response.error == false)
                {
                  this.__shared.toastSuccess('Record has been deleted successfully'); //response.message;
                }
                else
                {
                  this.__shared.toastError(response.message);
                }
                // console.log("length....",this.listData?.length === 0);
                
                if (this.listData?.length === 1 && this.current > 1) {
                  // If deleting the last item on the page, navigate to the previous page
                  this.current -= 1;
                }
                this.getList(this.current, this.recordsPerPage); // Fetch updated list
                
              },
              (err)=>{
                console.log(err);
                this.__shared.toastError(err.error.message);
                if(err.status == 403)
                    {
                          this.__shared.sessionExpired();
                    }
              })
      }  
  }

}
