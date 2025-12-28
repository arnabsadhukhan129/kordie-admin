import { Component, OnInit, inject, TemplateRef, } from '@angular/core';
import { UserService } from '../../../services/user-details/user.service';
import { SharedService } from '../../../services/shared/shared.service';
import { Router } from '@angular/router';
import { PageService } from '../../../services/page/page.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  userSubs!: Subscription;
  userPage!: Subscription;
  userDeleteSubs!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchVal : string = ''; 
  searchType : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;
  isLoading = false;
  selectedUser: any = null;
  users: User[] = [];
  userDetails: any;
  modalService = inject(NgbModal);

  constructor(
    private __user: UserService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
    private __spinner: NgxSpinnerService,
  ) {  }

  ngOnInit(): void {
    this.userPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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


  viewUser(ViewUserModal: TemplateRef<any>, user: User) {
    this.userDetails = user;
    this.modalService.open(ViewUserModal, { scrollable : true, size: 'lg' });
  }

  closeModal() {
    this.userDetails = null;
    this.modalService.dismissAll();
  }

  ngOnDestroy(): void {
    if(this.userPage){
      this.userPage.unsubscribe();
    }
    if(this.userSubs){
      this.userSubs.unsubscribe();
    }
    if(this.userDeleteSubs){
      this.userDeleteSubs.unsubscribe();
    }
  }

  breakWord(word : string) {
    if (!word) return "-";

    let camelCaseSplit = word.replace(/([a-z])([A-Z])/g, "$1 $2");
    let result = camelCaseSplit.replace(/_/g, " ");

    result = result
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return result;
  }

  formatDate(dateStr: string){
    return moment(new Date(dateStr)).format("YYYY-MM-DD")
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

  //Delivery list................
  getList(page = this.current, limit = this.recordsPerPage) {
    if(this.searchVal!=''){
      this.searchType = 'keyword';
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
    this.userSubs = this.__user.getList(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.listData = response?.data?.users;
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
          this.userDeleteSubs =  this.__user.delete(id)
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
