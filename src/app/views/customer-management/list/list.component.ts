import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RedirectPageService } from '../../../services/redirect-to-another-component/redirect-page.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PageService } from '../../../services/page/page.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { CustomerService } from '../../../services/customer-management/customer.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  customerPageSubs!: Subscription;
  customerSubs!: Subscription;
  deleteCustomerSubs!: Subscription;
  customerStatusSubs!: Subscription;
  totalRecords!: number;
  current: number = 1;
  displayMessage : string = '';
  errorMessage : string = '';
  isLoading = false;
  listData: any;
  recordsPerPage: number = environment.itemsPerPage;
  searchType : string = '';
  searchVal : string = ''; 
  activePage: number = 1;
  loaded_data : boolean = false;

  constructor(
    private __customer: CustomerService,
    private __shared: SharedService,
    private __route: Router,
    private _pageService: PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.customerPageSubs = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.customerPageSubs){
      this.customerPageSubs.unsubscribe();
    }
    if(this.customerSubs){
      this.customerSubs.unsubscribe();
    }
    if(this.customerStatusSubs){
      this.customerStatusSubs.unsubscribe();
    }
  }

  //List..............
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
      page: page
    }
    this.loaded_data = false;
    this.customerSubs = this.__customer.getList(params, this.searchType, this.searchVal)
      .subscribe((response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.data;
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
        this.hideLoader();
      },
      (err)=>{
        this.isLoading = false; // Stop loading spinner
        this.__spinner.hide();
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
        this.hideLoader();
      })
  }

  //Hide loader........
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

  //Delete data........
  delete(id: string){
    if (confirm("Are you sure to delete?") == true) 
      {
          this.deleteCustomerSubs = this.__customer.delete(id)
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

  //Change Status..................
  toggleStatus(item: any): void {
    const previousStatus = item.is_active;
    item.is_active = !item.is_active;
  
    this.customerStatusSubs = this.__customer.changeStatus(item._id).subscribe({
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

  //Export Newsletter Customer.....
  downloadCSV() {
    this.__customer.exportData().subscribe(
      (response: ArrayBuffer) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter_customers.xlsx'; // Adjust filename if needed
        a.click();
  
        window.URL.revokeObjectURL(url);
      },
      (err) => {
        console.log(err);
        if (err.status === 403) {
          this.__shared.sessionExpired();
        }
      }
    );
  }
  


  
  
  

}
