import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListService } from '../../../../services/master-list/list.service';
import { SharedService } from '../../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../../services/page/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RedirectPageService } from '../../../../services/redirect-to-another-component/redirect-page.service';
import { environment } from '../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { UpdateService } from '../../../../services/master-list/update.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit, OnDestroy {
  topicPage!: Subscription;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;
  display_error : boolean = false;
  loaded_data : boolean = false;
  searchType : string = '';
  searchVal : string = ''; 
  topicList: any;
  current: number = 1;
  displayMessage : string = '';
  errorMessage : string = '';
  

  constructor(
    private _topic: ListService,
    private _updateStatus: UpdateService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.topicPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.topicPage){
      this.topicPage.unsubscribe();
    }
  }

  //List..............
  getList(page: number = this.current, limit: number = this.recordsPerPage): void {
    // Set search type if a search value exists
    if (this.searchVal) {
      this.searchType = 'name';
    }
  
    // Update pagination variables
    this.activePage = page;
    this.recordsPerPage = limit;
  
    const params = {
      limit,
      page,
    };
  
    // Start the loader and set loading state
    this.__spinner.show();
    this.loaded_data = true;
  
    this._topic.tpicList(params, this.searchType, this.searchVal).subscribe(
      (response) => {
        // Stop the loader
        this.__spinner.hide();
        this.loaded_data = false;
  
        if (!response.error) {
          // Update topic list and total records
          this.topicList = response?.data?.items || [];
          this.totalRecords = response?.data?.pagination?.total || 0;
        } else {
          this.__shared.toastError(response.message);
        }
      },
      (err) => {
        // Stop the loader and handle errors
        this.__spinner.hide();
        this.loaded_data = false;
  
        console.error(err);
        if (err.status === 403) {
          this.__shared.sessionExpired();
        } else {
          this.__shared.toastError('Failed to load the topic list.');
        }
      }
    );
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
  
    //Redirect To Content Page...............
    redirectToContentPage(title:any){
      this._redirect.sendredirectionPage(title);
    }

    //Change Status..................
    toggleStatus(item: any): void {
      const previousStatus = item.is_active;
      item.is_active = !item.is_active;
    
      this._updateStatus.topicStatus(item._id).subscribe({
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
            this._updateStatus.topicByDelete(id)
              .subscribe((response)=>{
                
                if(response.error == false)
                {
                  this.__shared.toastSuccess('Record has been deleted successfully'); //response.message;
                }
                else
                {
                  this.__shared.toastError(response.message);
                }
                
                if (this.topicList?.length === 1 && this.current > 1) {
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
