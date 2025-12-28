import { Component, OnDestroy, OnInit } from '@angular/core';
import { SkillService } from '../../../services/crucial-skill/skill.service';
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
  skillPage!: Subscription;
  skillSubs!: Subscription;
  skillDeleteSubs!: Subscription;
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
        private __skill: SkillService,
        private __shared: SharedService,
        private __route: Router,
        private _pageService: PageService,
        private sanitizer: DomSanitizer,
        private _redirect: RedirectPageService,
        private __spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.skillPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.skillPage){
      this.skillPage.unsubscribe();
    }
    if(this.skillSubs){
      this.skillSubs.unsubscribe();
    }
    if(this.skillDeleteSubs){
      this.skillDeleteSubs.unsubscribe();
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
      this.skillSubs = this.__skill.getList(params, this.searchType, this.searchVal)
        .subscribe((response)=>{
          if(response.error == false)
          {
            this.listData = response?.data?.skillset;
            // console.log("listData.....",this.listData);
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
            this.skillDeleteSubs = this.__skill.delete(id)
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

}
