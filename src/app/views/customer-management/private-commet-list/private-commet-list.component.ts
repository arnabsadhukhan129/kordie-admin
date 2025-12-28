import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../services/customer-management/customer.service';
import { SharedService } from '../../../services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-private-commet-list',
  templateUrl: './private-commet-list.component.html',
  styleUrls: ['./private-commet-list.component.scss']
})
export class PrivateCommetListComponent implements OnInit {
  detailsId: string | null = null;
  getData: any;
  totalRecords!: number;
  current: number = 1;
  recordsPerPage: number = environment.itemsPerPage;
  activePage: number = 1;

  constructor(
    private __activatedRoute:ActivatedRoute,
    private __customer: CustomerService,
    private __route:Router,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
  ) { 
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
  }

  ngOnInit(): void {
    this.getCommentDetails();
  }

  //order details..............
  getCommentDetails(page = this.current, limit = this.recordsPerPage) {
    // Pagination variables
    this.current = page; // <-- Add this line
    this.activePage = this.current;
    this.recordsPerPage = limit;
    const params = {
      limit,
      page: page,
    }
    this.__customer.getCommentList(params,this.detailsId)
    .subscribe((response)=>{
      
      if(response.error == false)
      {
          this.getData = response?.data?.data;
          this.totalRecords = response?.data?.pagination?.total;
          console.log('app-->', this.getData );
      }
      else{
        this.__shared.toastError(response.message);
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

}
