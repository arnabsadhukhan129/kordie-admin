import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageService } from '../../../services/page/page.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { EnquiryService } from '../../../services/course-enquiry/enquiry.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  enquirySubs!: Subscription;
  enquiryPage!: Subscription;
  enquiryDeleteSubs!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchVal : string = ''; 
  searchType : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;
  isLoading = false;

  constructor(
    private __enquiry: EnquiryService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.enquiryPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.enquiryPage){
      this.enquiryPage.unsubscribe();
    }
    if(this.enquirySubs){
      this.enquirySubs.unsubscribe();
    }
    if(this.enquiryDeleteSubs){
      this.enquiryDeleteSubs.unsubscribe();
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
  
//list Data..........
  getList(page = this.current, limit = this.recordsPerPage) {
    this.activePage = this.current;
    this.recordsPerPage = limit;
    const params: any = { limit, page };
    if (this.searchVal) {
        params.searchField = 'full_name'; 
        params.searchValue = this.searchVal.trimEnd();
    }
    // Pagination variables
    this.activePage = this.current;
    this.recordsPerPage = limit;
    this.loaded_data = false;
    this.enquirySubs = this.__enquiry.getList(params)
        .subscribe((response) => {
            if (!response.error) {
                this.listData = response?.data?.data;
                this.totalRecords = response.data.pagination?.total;
                console.log("totalRecords=====",this.totalRecords);
                
                this.loaded_data = true;
            }
            this.hideLoader();
        }, (err) => {
            console.log(err);
            if (err.status === 403) {
                this.__shared.sessionExpired();
            }
            this.hideLoader();
        });
}


  changeSearchType(event : any){
    this.searchVal = event.target.value;
    this.getList(1, this.recordsPerPage);
  }

  currentPage(){
    this._pageService.sendCurrentPage(this.current);
  }

  
    //Delete data........
    delete(id: string){
      if (confirm("Are you sure to delete?") == true) 
        {
              this.enquiryDeleteSubs =  this.__enquiry.delete(id)
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
