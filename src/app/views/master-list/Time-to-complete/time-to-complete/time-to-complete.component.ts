import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ListService } from '../../../../services/master-list/list.service';
import { UpdateService } from '../../../../services/master-list/update.service';
import { PageService } from '../../../../services/page/page.service';
import { RedirectPageService } from '../../../../services/redirect-to-another-component/redirect-page.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-time-to-complete',
  templateUrl: './time-to-complete.component.html',
  styleUrls: ['./time-to-complete.component.scss']
})
export class TimeToCompleteComponent implements OnInit, OnDestroy {
  timePage!: Subscription;
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
    
  constructor(
    private _time: ListService,
    private _updateStatus: UpdateService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService
  ) { }

  ngOnInit(): void {
    this.timePage = this._pageService.getCurrentPage().subscribe((page:any)=>{
      if(page){
        this.current = page
      }
      else{
        this.current = 1;
      }
    });
    this.getList();
  }

  ngOnDestroy(): void {
    if(this.timePage){
      this.timePage.unsubscribe();
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
    this._time.timeList(params, this.searchType, this.searchVal)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.items;
          // console.log("topicList.....",this.listData);
          
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
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
  
    this._updateStatus.timeStatus(item._id).subscribe({
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
          this._updateStatus.timeByDelete(id)
            .subscribe((response)=>{
              
              if(response.error == false)
              {
                this.__shared.toastSuccess('Record has been deleted successfully'); //response.message;
              }
              else
              {
                this.__shared.toastError(response.message);
              }
              
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
