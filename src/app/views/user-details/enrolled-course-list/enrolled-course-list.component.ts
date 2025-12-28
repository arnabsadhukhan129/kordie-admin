import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageService } from '../../../../app/services/page/page.service';
import { SharedService } from '../../../../app/services/shared/shared.service';
import { UserService } from '../../../services/user-details/user.service';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-enrolled-course-list',
  templateUrl: './enrolled-course-list.component.html',
  styleUrls: ['./enrolled-course-list.component.scss']
})
export class EnrolledCourseListComponent implements OnInit {

  planPage!: Subscription;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  searchVal : string = ''; 
  searchType : string = '';
  activePage: number = 1;
  loaded_data : boolean = false;
  listData: any;
  totalRecords!: number;
  userId:string | null = null;

  constructor(
    private __user: UserService,
    private __shared: SharedService,
    private __route: Router,
    private _pageService: PageService,
    private __activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.planPage = this._pageService.getCurrentPage().subscribe((page:any)=>{
      if(page){
        this.current = page
      }
      else{
        this.current = 1;
      }
    });
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.userId = params.get('id');
      },
      error: err => {}
    });
    this.getList();
  }

  //Delivery list................
  getList(page = this.current, limit = this.recordsPerPage) {
    // Pagination variables
    this.activePage = this.current;
    this.recordsPerPage = limit;
    const params = {
      limit,
      page: page
    }
    this.loaded_data = false;
    this.__user.enrolledCourseList(params,this.userId)
                .subscribe((response)=>{
                  if(response.error == false)
                  {
                    this.listData = response?.data?.courses;
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

  currentPage(){
    this._pageService.sendCurrentPage(this.current);
  }

}
