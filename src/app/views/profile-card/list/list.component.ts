import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { RedirectPageService } from '../../../services/redirect-to-another-component/redirect-page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { PageService } from '../../../services/page/page.service';
import { Router } from '@angular/router';
import { SharedService } from '../../../services/shared/shared.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CardService } from '../../../services/profile-card/card.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  profilePage!: Subscription;
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
    private __card: CardService,
    private __shared: SharedService,
    private __route: Router,
    private _pageService: PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.profilePage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.profilePage){
      this.profilePage.unsubscribe();
    }
  }

   //List..............
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
        this.isLoading = true; // Stop loading spinner
        this.__spinner.show();
        this.__card.getList(params, this.searchType, this.searchVal)
          .subscribe((response)=>{
            this.isLoading = false; // Stop loading spinner
            this.__spinner.hide();
            if(response.success === true)
            {
              this.listData = response?.data;
              this.totalRecords = response?.pagination?.total || 0;
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
    
      //Delete data........
      delete(id: string){
        if (confirm("Are you sure to delete?") == true) 
          {
              this.__card.delete(id)
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

}
