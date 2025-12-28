import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from '../../../../services/master-list/list.service';
import { UpdateService } from '../../../../services/master-list/update.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../../services/page/page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RedirectPageService } from '../../../../services/redirect-to-another-component/redirect-page.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-taughy-by',
  templateUrl: './taughy-by.component.html',
  styleUrls: ['./taughy-by.component.scss']
})
export class TaughyByComponent implements OnInit, OnDestroy {

  taughtPage!: Subscription;
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
    private _taught: ListService,
    private _updateStatus: UpdateService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.taughtPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.taughtPage){
      this.taughtPage.unsubscribe();
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
    this.isLoading = true; // Stop loading spinner
    this.__spinner.hide();
    this._taught.taughtList(params, this.searchType, this.searchVal)
      .subscribe((response)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        if(response.error == false)
        {
          this.listData = response?.data?.items;
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
      },
      (err)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
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
  
    // Set loading state and show spinner
    this.isLoading = true;
    this.__spinner.show();
  
    this._updateStatus.taughtByStatus(item._id).subscribe({
      next: (response) => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide spinner on success
        if (response.error) {
          this.handleError(response.message);
          item.is_active = previousStatus; // Revert status if error occurs
        } else {
          this.__shared.toastSuccess('Status changed successfully');
        }
      },
      error: (err) => {
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide(); // Hide spinner on error
        this.handleApiError(err);
        item.is_active = previousStatus; // Revert status if error occurs
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

  //Delete data........
  delete(id: string){
    if (confirm("Are you sure to delete?") == true) 
      {
                this._updateStatus.taughtByDelete(id)
              .subscribe((response)=>{
                
                if(response.error == false)
                {
                  this.__shared.toastSuccess('Record has been deleted successfully'); //response.message;
                }
                else
                {
                  this.__shared.toastError(response.message);
                }
                console.log("length....",this.listData?.length === 0);
                
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
