import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '../../../../app/services/title/title.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { environment } from '../../../../environments/environment';
import { PageService } from '../../../../app/services/page/page.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {RedirectPageService} from '../../../../app/services/redirect-to-another-component/redirect-page.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  titlePage!: Subscription;
  sectionSubscription!: Subscription;
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;
  display_error : boolean = false;
  loaded_data : boolean = false;
  searchType : string = '';
  searchVal : string = ''; 
  titleList: any;
  current: number = 1;
  isLoading = false;

  constructor(
              private _title: TitleService,
              private __shared:SharedService,
              private __route:Router,
              private _pageService:PageService,
              private sanitizer: DomSanitizer,
              private _redirect: RedirectPageService,
              private __spinner: NgxSpinnerService,
            ) { }

  ngOnInit(): void {
    this.titlePage = this._pageService.getCurrentPage().subscribe((page: any) => {
      this.current = page ? page : 1;
    });
    this.showLoader();
    this.getTitleList();
  }

  ngOnDestroy(): void {
    if(this.titlePage){
      this.titlePage.unsubscribe();
    }
    if(this.sectionSubscription){
      this.sectionSubscription.unsubscribe();
    }
  }

  getTitleList(page = this.current, limit = this.recordsPerPage) {
    if(this.searchVal!=''){
      this.searchType = 'name';
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
    this.sectionSubscription = this._title.getTitleListWithParam(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.titleList = response.data.topics;
                    this.totalRecords = response.data.pagination?.total;
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
                      this.hideLoader();//Hide loader
                })
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

  changeSearchType(event : any){
    this.searchVal = event.target.value;
    this.getTitleList(1, this.recordsPerPage);
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



}
