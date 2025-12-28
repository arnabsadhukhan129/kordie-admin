import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { SharedService } from '../../../services/shared/shared.service';


@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.scss']
})
export class ViewuserComponent implements OnInit {

  user_id : any;
  userData : any = {
                      name : '',
                      email : '',
                      phone : '',
                      roles : '',
                      status : ''
                   };
  userRole : string = '';                 

  constructor(private __activatedRoute:ActivatedRoute,
              private __user:UserService,
              private __shared: SharedService,
              private location: Location,
              private __route:Router,
              ) 
  { }

  ngOnInit(): void {

    this.user_id = this.__activatedRoute.snapshot.queryParams['user'];
    this.getUserDetail();

  }


  getUserDetail()
  {
      this.__user.getUserDetail(this.user_id)
      .subscribe((response)=>{
        
        if(response.error == false)
        {
            this.userData = response.data;
            this.userRole = this.userData?.roles[0]?.slug;
            //console.log('app-->', this.userData );
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

  backClicked() {
    //this.location.back();
    
    if(this.userRole == 'editor' || this.userRole == 'administrator')
    {
          this.__route.navigate(['/user/userlist']);
    }
    else
    {          
          this.__route.navigate(['/user/studentlist']);
    }
    
    }

}
