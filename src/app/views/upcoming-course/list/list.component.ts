import { Component, OnInit } from '@angular/core';
import { UpcomingService } from '../../../services/upcoming-course/upcoming.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../services/page/page.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  pageSubs!: Subscription;
  upcomingCouseSubs!: Subscription;
  deleteCourseSubs!: Subscription;
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
    private __course: UpcomingService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.pageSubs = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.pageSubs){
      this.pageSubs.unsubscribe();
    }
    if(this.upcomingCouseSubs){
      this.upcomingCouseSubs.unsubscribe();
    }
    if(this.deleteCourseSubs){
      this.deleteCourseSubs.unsubscribe();
    }
  }

  //Hide loader.......
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
    this.upcomingCouseSubs = this.__course.getList(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.success == true)
                  {
                    this.listData = response?.data;
                    // console.log("listData======",this.listData);
                    
                    this.totalRecords = response?.pagination?.total;
                    // console.log("totalRecords====",this.totalRecords);
                    
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

  //Delete data........
  delete(id: string){
    if (confirm("Are you sure to delete?") == true) 
      {
          this.deleteCourseSubs =  this.__course.delete(id)
            .subscribe((response)=>{
              
              if(response.success == true)
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
