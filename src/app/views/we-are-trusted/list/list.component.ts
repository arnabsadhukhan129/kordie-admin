import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import {WeTrustedService} from '../../../../app/services/we-trusted/we-trusted.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  trustedPage!: Subscription;
  trustedSubscription!: Subscription;
  deleteTrustedSubscription!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchVal : string = ''; 
  searchType : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;

  constructor(
    private _trusted:WeTrustedService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
  ) { }

  ngOnInit(): void {
    this.trustedPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.trustedPage){
      this.trustedPage.unsubscribe();
    }
    if(this.trustedSubscription){
      this.trustedSubscription.unsubscribe();
    }
    if(this.deleteTrustedSubscription){
      this.deleteTrustedSubscription.unsubscribe();
    }
  }

  //Delivery list................
  getList(page = this.current, limit = this.recordsPerPage) {
    if(this.searchVal!=''){
      this.searchType = 'title';
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
    this.trustedSubscription = this._trusted.getList(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.listData = response?.data?.items;
                    this.totalRecords = response.data.pagination?.total;
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
              this.deleteTrustedSubscription = this._trusted.delete(id)
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
