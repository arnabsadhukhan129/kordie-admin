import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentServiceService } from '../../../services/content-management/content-service.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../services/page/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RedirectPageService } from '../../../services/redirect-to-another-component/redirect-page.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit,OnDestroy {
  contentPage!: Subscription;
  contentSubscription!: Subscription;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;
  display_error : boolean = false;
  loaded_data : boolean = false;
  searchType : string = '';
  searchVal : string = ''; 
  listData: any;
  current: number = 1;
  isLoading = false;

  constructor(
    private _content: ContentServiceService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.contentPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.contentPage){
      this.contentPage.unsubscribe();
    }
    if(this.contentSubscription){
      this.contentSubscription.unsubscribe();
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
       // Show loader
       // this.isLoading = true;
       // this.__spinner.show(); // Start visual spinner
       this.loaded_data = false;
       this.contentSubscription = this._content.getList(params, this.searchType, this.searchVal)
                   .subscribe((response)=>{
                     // this.isLoading = false;
                     // this.__spinner.hide(); // hide visual spinner
                     if(response.error == false)
                     {
                       this.listData = response?.data?.content;
                      //  console.log("listData......",this.listData);
                       
                       this.totalRecords = response.data.pagination?.total;
                       this.loaded_data = true;
                     }
                     this.hideLoader();
                   },
                   (err)=>{
                     // this.isLoading = false;
                     // this.__spinner.hide(); // hide visual spinner
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
     
}
