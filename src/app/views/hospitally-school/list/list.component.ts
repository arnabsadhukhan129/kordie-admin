import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitialitySchoolService } from '../../../../app/services/hospitiality-school/hospitiality-school.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { environment } from '../../../../environments/environment';
import { PageService } from '../../../../app/services/page/page.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit,OnDestroy {
  hospitialityPage!: Subscription
  totalRecords!: number;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;
  display_error : boolean = false;
  loaded_data : boolean = false;
  searchType : string = '';
  searchVal : string = ''; 
  schoolList: any;
  current: number = 1;
  currentUrl:string = '';
  
  constructor(
    private _hospitiality: HospitialitySchoolService,
    private __shared:SharedService,
    private __route:Router,
    private _pageService:PageService,
  ) { }

  ngOnInit(): void {
    this.hospitialityPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
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
    if(this.hospitialityPage){
      this.hospitialityPage.unsubscribe();
    }
  }

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
    this._hospitiality.getListWithParam(params, this.searchType, this.searchVal)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.schoolList = response.data.hospitality;
                    this.totalRecords = response.data.pagination?.total;
                    this.loaded_data = true;
                  }
                },
                (err)=>{
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

  //Delete........
  delete(id: string){
    if (confirm("Are you sure to delete?") == true) 
      {
                this._hospitiality.delete(id)
              .subscribe((response)=>{
                
                if(response.error == false)
                {
                  this.__shared.toastSuccess('Record has been deleted successfully'); //response.message;
                }
                else
                {
                  this.__shared.toastError(response.message);
                }
                console.log("length....",this.schoolList?.length === 0);
                
                if (this.schoolList?.length === 1 && this.current > 1) {
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

  currentPage(){
    this._pageService.sendCurrentPage(this.current);
  }

}
