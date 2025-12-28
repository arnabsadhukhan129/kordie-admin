import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../app/services/product/product.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../../app/services/page/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RedirectPageService } from '../../../../app/services/redirect-to-another-component/redirect-page.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  productSubscription!: Subscription;
  productPage!: Subscription;
  productToggle!: Subscription;
  deleteProductSubscription!: Subscription;
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
    private _product: ProductService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private sanitizer: DomSanitizer,
    private _redirect: RedirectPageService,
    private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.productPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    console.log("ON DESTROY CALLED")
    if(this.productPage){
      this.productPage.unsubscribe();
    }
    if(this.productSubscription){
      this.productSubscription.unsubscribe();
    }
    if(this.productToggle){
      this.productToggle.unsubscribe();
    }
    if(this.deleteProductSubscription){
      this.deleteProductSubscription.unsubscribe();
    }
  }

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

  //List..............
  getList(page = this.current, limit = this.recordsPerPage) {
    console.log("CALL PRODUCT")
    if(this.searchVal!=''){
      this.searchType = 'course_name';
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
    this.productSubscription = this._product.getList(params, this.searchType, this.searchVal)
    .subscribe({
      next: (response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.items;
          // console.log("listData.....",this.listData);
          
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
        this.hideLoader(); //Hide loader
      },
      error: (err)=>{
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
        this.hideLoader(); //Hide loader
      }
    });
      /*.subscribe((response)=>{
        if(response.error == false)
        {
          this.listData = response?.data?.items;
          // console.log("listData.....",this.listData);
          
          this.totalRecords = response?.data?.pagination?.total;
          this.loaded_data = true;
        }
        this.hideLoader(); //Hide loader
      },
      (err)=>{
        console.log(err);
        if(err.status == 403)
        {
          this.__shared.sessionExpired();
        }
        this.hideLoader(); //Hide loader
      })*/
  }

  changeSearchType(event : any){
    console.log("CHANGE SEARCH TYPE")
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
            this.deleteProductSubscription = this._product.delete(id)
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

  //Change Fetaure Status..................
  toggleFeature(item: any): void {
    const previousStatus = item.is_feature;
    item.is_feature = !item.is_feature;
  
    this.productToggle = this._product.featureStatus(item._id).subscribe({
      next: (response) => {
        if (response.error) {
          this.handleError(response.message);
          item.is_feature = previousStatus;
        } else {
          this.__shared.toastSuccess('Feature status changed successfully');
        }
      },
      error: (err) => {
        this.handleApiError(err);
        item.is_feature = previousStatus;
      },
    });
  }

  toggleStatus(item: any): void {
    const previousStatus = item.is_active;
    item.is_active = !item.is_active;
  
    this._product.activeStatus(item._id).subscribe({
      next: (response) => {
        if (response.error) {
          this.handleError(response.message);
          item.is_active = previousStatus;
        } else {
          this.__shared.toastSuccess('Activation status changed successfully');
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

}
