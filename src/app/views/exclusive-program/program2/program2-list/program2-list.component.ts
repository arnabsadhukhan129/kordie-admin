import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PageService } from '../../../../services/page/page.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Program2Service } from '../../../../services/exclusive-program/program2.service';

@Component({
  selector: 'app-program2-list',
  templateUrl: './program2-list.component.html',
  styleUrls: ['./program2-list.component.scss']
})
export class Program2ListComponent implements OnInit, OnDestroy {
  program2Subs!: Subscription;
  program2Page!: Subscription;
  program2DeleteSubs!: Subscription;
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
    private __program2: Program2Service,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.program2Page = this._pageService.getCurrentPage().subscribe((page:any)=>{
      if(page){
        this.current = page
      }
      else{
        this.current = 1;
      }
    });
    this.showLoader()
    this.getList();
  }

  ngOnDestroy(): void {
    if(this.program2Page){
      this.program2Page.unsubscribe();
    }
    if(this.program2Subs){
      this.program2Subs.unsubscribe();
    }
    if(this.program2DeleteSubs){
      this.program2DeleteSubs.unsubscribe();
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

  //List Data................
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
      this.program2Subs = this.__program2.getList(params, this.searchType, this.searchVal)
          .subscribe((response)=>{
            if(response.success == true)
            {
              this.listData = response?.data;
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
  
      sanitizeHtml(htmlContent: string): SafeHtml {
          return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
        }
      
        // Method to determine if the description contains HTML content
        isHtmlContent(description: string): boolean {
          const htmlRegex = /<\/?[a-z][\s\S]*>/i;
          return htmlRegex.test(description);
        }
      
        // Extract image sources from the HTML content
        extractImages(htmlContent: string): string[] {
          const div = document.createElement('div');
          div.innerHTML = htmlContent;
          const images = div.getElementsByTagName('img');
          return Array.from(images).map((img) => img.src);
        }
          
          // Strip HTML tags from a string
          stripHtml(htmlContent: string): string {
          const div = document.createElement('div');
          div.innerHTML = htmlContent;
          return div.textContent || div.innerText || '';
        }
      
        // Truncate text to a specific length with ellipsis
        truncateText(text: string, maxLength: number): string {
          return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
        }
    
      
      //Delete data........
      delete(id: string){
        if (confirm("Are you sure to delete?") == true) 
          {
            this.program2DeleteSubs = this.__program2.delete(id)
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
