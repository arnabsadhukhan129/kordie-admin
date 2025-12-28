import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/content/content.service'

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {

  contentData : any = '';

  constructor(private service: ContentService,) { }

  ngOnInit(): void {
    this.TermsConditionsDetail();
  }


  TermsConditionsDetail(){
    this.service.getContentDetailBySlug('terms-conditions')
                .subscribe((response : any)=>{
                  
                  if(response.error == false)
                  {
                      this.contentData = response.data;
                  }
                  
                },
                (err)=>{
                  console.log(err);
                })

  }

}
