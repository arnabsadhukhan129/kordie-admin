import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { environment } from '../../../../environments/environment';
import { SubscriptionService } from '../../../services/subscription/subscription.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  subscriptionPage!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchValue : string = ''; 
  searchField : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;
  isLoading = false;

  constructor(
    private _subscription: SubscriptionService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
  ) {
    localStorage.removeItem('Current URL');
   }

  ngOnInit(): void {
    this.subscriptionPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.subscriptionPage){
      this.subscriptionPage.unsubscribe();
    }
  }

  //hide loader..........
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

  getList(page = this.current, limit = this.recordsPerPage) {
    // Trim right-side spaces from searchValue
    if (this.searchValue && this.searchValue.trimEnd() !== '') {
        this.searchField = 'plan_name';  
        this.searchValue = this.searchValue.trimEnd(); // Trim only right-side spaces
    } else {
        this.searchField = ''; 
        this.searchValue = ''; 
    }

    // Pagination variables
    this.activePage = page;
    this.recordsPerPage = limit;

    // Build the params object
    const params: any = {
        limit,
        page
    };

    // Add search parameters only if there is a valid search value
    if (this.searchValue) {
        params.searchField = this.searchField;
        params.searchValue = this.searchValue;
    }

    this.loaded_data = false;

    this._subscription.getList(params)
        .subscribe(
            (response) => {
                if (!response.error) {
                    this.listData = response?.data?.data;
                    this.totalRecords = response.data.pagination?.total;
                    this.loaded_data = true;
                }
                this.hideLoader();
            },
            (err) => {
                console.log(err);
                if (err.status === 403) {
                    this.__shared.sessionExpired();
                }
                this.hideLoader();
            }
        );
}

// Function to trigger search
changeSearchType(event: any) {
    this.searchValue = event.target.value.trimEnd(); // Trim right-side spaces before setting value
    this.getList(1, this.recordsPerPage); // Reset to first page on new search
}

SubsuserList(id:any){
  this.__route.navigateByUrl('/subscription/subscribed-user-list/'+id);
  localStorage.setItem('Current URL',this.__route.url);
  this.currentPage();
}

  currentPage(){
    this._pageService.sendCurrentPage(this.current);
  }

  
    //Delete data........
    delete(id: string){
      if (confirm("Are you sure to delete?") == true) 
        {
                this._subscription.delete(id)
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

  //Skip HTML Tags.............
  stripHtmlTags(html: string): string {
    return html ? html.replace(/<[^>]*>/g, '').trim() : '';
  }

}
