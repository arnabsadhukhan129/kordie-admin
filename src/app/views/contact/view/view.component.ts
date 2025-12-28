import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../services/shared/shared.service';
import { ContactService } from '../../../services/contact/contact.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  addEditForm!: FormGroup;
  detailsId:string | null = null;
  getData: any;
  isLoading = false;

  constructor(
    private __fb: FormBuilder,
    private _contact: ContactService,
    private __shared:SharedService,
    private __spinner: NgxSpinnerService,
    private __activatedRoute:ActivatedRoute,
  ) {
    this.__activatedRoute.paramMap.subscribe({
      next: params => {
        this.detailsId = params.get('id');
      },
      error: err => {}
    });
   }

  ngOnInit(): void {
    this.createForm();
    if(this.detailsId){
      this.getDetail();
    }
  }

  createForm()
  {
    this.addEditForm = this.__fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      countryCode: [''],
      phone: [''],
      jobtitle: [''],
      company: [''],
      teamSize: [''],
      linkedin: [''],
      type: [''],
      country: [''],
      message: [''],
      businessType: ['']
    });
  }

    
  //get details............
  getDetail(){
    // Show loader
    this.isLoading = true;
    this.__spinner.show(); // Start visual spinner
    this._contact.getDetailById(this.detailsId)
      .subscribe((response)=>{
        this.isLoading = false;
        this.__spinner.hide(); 

        if(response.error == false)
        {
            this.getData = response.data;
            this.patchData();
            // console.log('app-->', this.titleData );
        }
        else{
          this.__shared.toastError(response.message);
        }
        
      },
      (err)=>{
        this.isLoading = false;
        this.__spinner.hide(); 

        console.log(err);
        if(err.status == 403)
        {
              this.__shared.sessionExpired();
        }
      })
  }
      
  patchData(){
    this.addEditForm.patchValue({
      firstname: this.getData.firstname ? this.getData.firstname : 'N/A',
      lastname: this.getData.lastname ? this.getData.lastname : 'N/A',
      email: this.getData.email ? this.getData.email : 'N/A',
      countryCode: this.getData.phone ? '+'+this.getData?.countryCode : 'N/A',
      phone: this.getData.phone ? this.getData.phone : 'N/A',
      jobtitle: this.getData.jobtitle ? this.getData.jobtitle : 'N/A',
      company: this.getData.company ? this.getData.company : 'N/A',
      teamSize: this.getData.teamSize ? this.getData.teamSize : 'N/A',
      businessType: this.getData.businessType ? this.getData.businessType : 'N/A',
      linkedin: this.getData.linkedin ? this.getData.linkedin : 'N/A',
      type: this.getData.type ? this.getData.type : 'N/A',
      country: this.getData.country ? this.getData.country : 'N/A',
      requestServices: this.getData.requestServices ? this.getData.requestServices : [],
      message: this.getData.message ? this.getData.message : 'N/A',
    });
  }

  getFileName(url: string): string {
    // Extract filename from URL
    return url.split('/').pop() || 'CV.pdf';
  }
  
  openCV(): void {
    const url = this.getData?.attachCV;
    if (url) {
      window.open(url, '_blank');
    }
  }
  

}
