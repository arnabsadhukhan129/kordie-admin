import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageService } from '../../../app/services/page/page.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  pageSubscription!: Subscription
  @Input() totalRecords = 0;
  @Input() recordsPerPage = 0;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  public pages: number[] = [];
  activePage: number = 1;

  constructor(private pageService: PageService) {}

  // ngOnInit(): void {
  //   // Subscribe to PageService to get the current page when the component loads
  //   this.pageSubscription = this.pageService.getCurrentPage().subscribe((currentPage: number) => {
  //     this.activePage = currentPage || 1; // Set to currentPage from service or default to 1
  //     // this.onPageChange.emit(this.activePage); // Emit the active page for parent component
  //   });
  // }

  ngOnInit(): void {
    this.pageSubscription = this.pageService.getCurrentPage().subscribe((currentPage: number) => {
      if (this.activePage !== currentPage) {
        this.activePage = currentPage || 1;
      }
    });
  }
  

  ngOnDestroy(): void {
    if(this.pageSubscription){
      this.pageSubscription.unsubscribe();
    }
  }

  // ngOnChanges(): void {
  //   const pageCount = this.getPageCount();
  //   this.pages = this.getArrayOfPage(pageCount);

  //   // Ensure the activePage is within bounds when totalRecords or recordsPerPage changes
  //   if (this.activePage > this.pages.length) {
  //     this.activePage = 1; // Reset to 1 if it exceeds total pages
  //     this.pageService.sendCurrentPage(this.activePage); // Update in the service
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    const pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(pageCount);
    // Ensure activePage is within valid bounds
    if (this.activePage > this.pages.length) {
      this.activePage = 1;
      this.pageService.sendCurrentPage(this.activePage);
      this.onPageChange.emit(this.activePage); // Ensure only emits when it actually changes
    }
  }
  

  private getPageCount(): number {
    let totalPage = 0;
    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);
      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }
    return totalPage;
  }

  // private getArrayOfPage(pageCount: number): number[] {
  //   const pageArray = [];
  //   if (pageCount > 0) {
  //     for (let i = 1; i <= pageCount; i++) {
  //       pageArray.push(i);
  //     }
  //   }
  //   return pageArray;
  // }

  private getArrayOfPage(pageCount: number): number[] {
    return pageCount > 0 ? Array.from({ length: pageCount }, (_, i) => i + 1) : [];
  }
  

  // onClickPage(pageNumber: number): void {
  //   if (pageNumber >= 1 && pageNumber <= this.pages.length) {
  //     this.activePage = pageNumber;
  //     this.onPageChange.emit(this.activePage); // Emit the active page for parent component
  //     this.pageService.sendCurrentPage(this.activePage); // Update in the service
  //   }
  // }

  onClickPage(pageNumber: number): void {
    if (pageNumber !== this.activePage && pageNumber >= 1 && pageNumber <= this.pages.length) {
      this.activePage = pageNumber;
      this.pageService.sendCurrentPage(this.activePage); // Update service first
      this.onPageChange.emit(this.activePage); // Emit after updating the service
    }
  }
  
}
