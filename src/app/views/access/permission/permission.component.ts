import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AccessService } from 'src/app/services/access/access.service';
import { SharedService } from 'src/app/services/shared/shared.service';
import { Roles } from 'src/app/models/access/role.model';
import {CommonService} from 'src/app/services/common/common.service'
@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {

  resourceData : any = [];
  userRoleData : Roles | null = null;
  //selectedUserRoleIndex : any = '';
  // displayMessage: string = '';
  // errorMessage: string = '';
  role : any;
  items = [1, 2, 3, 4];
  readValue: boolean = false;

  constructor(private _access: AccessService,
              private __shared: SharedService,
              private __route: Router,
              private __activatedRoute:ActivatedRoute,
              private sanitizer: DomSanitizer,
              private commonService: CommonService
              ) 
    { }

  ngOnInit(): void {

    this.role = this.__activatedRoute.snapshot.queryParams['role'];
    this.getUserRoleDetail(); //imp
    this.getResourcesList();

  }

  

  getResourcesList(){
    this._access.getResourcesList()
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                      this.resourceData = response.data.items;
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


  getUserRoleDetail(){
    this._access.getRoleDetail(this.role)
                .subscribe((response)=>{
                  
                  if(response.error == false)
                  {
                      this.userRoleData = response.data;
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

  changeSearchType(event : any)
  {
       console.log('event------->',event.data, event.type, event.target.value);

          //    this.selectedUserRoleIndex = event.target.value;  
  }

  changeAccess(event : any, property : any, index : number)
  {
        // console.log('event=========>',event.currentTarget.checked);

        let changedVal = event.currentTarget.checked;
        // console.log("changedVal.....",this.userRoleData);
        
        // console.log(property, index);

        if(this.userRoleData != null)
        {
            if(property == 'create')
            {
              this.userRoleData.rights[index].access.create = changedVal;
            }
            else if(property == 'delete')
            {
              this.userRoleData.rights[index].access.delete = changedVal;
            }
            else if(property == 'read')
            {
              this.userRoleData.rights[index].access.read = changedVal;
            }    
            else if(property == 'update')
            {
              this.userRoleData.rights[index].access.update = changedVal;
            }

            // if(this.userRoleData.rights[index].access.create === true || this.userRoleData.rights[index].access.update === true || this.userRoleData.rights[index].access.delete === true){
            //   if(this.userRoleData.rights[index].access.read === false){
            //     this.readValue = true;
            //   }
            //   else{
            //     this.readValue = false;
            //   }
            // }
            // else{
            //   this.readValue = false;
            // }
    
    
            // console.log('updated value =========>',this.userRoleData.rights[index]);
        }
       // this.updateRole();
  }

  // updateRole(){
  //   let roleId = this.userRoleData ? this.userRoleData.id : '';
  //   let data = {rights : this.userRoleData ? this.userRoleData.rights : ''};
  //   if(this.readValue){
  //     this.__shared.toastError("Please give the first view permission");
  //     return;
  //   }
  //   this._access.editRole(roleId, data)
  //               .subscribe((response)=>{
                  
  //                 if(response.error == false)
  //                 {
  //                   if(response.data.slug === localStorage.getItem('login_role')){
  //                     localStorage.setItem('login_rights',JSON.stringify(response.data.rights));
  //                   }
  //                   // this.commonService.send("send_value");
  //                   this.commonService.send(response.data.rights);
  //                   this.__shared.toastSuccess(response.message);
  //                   this.__route.navigate(['access/rolelist']);
  //                 }
                  
  //               },
  //               (err)=>{
  //                 console.log(err);
  //                 if(err.status == 403)
  //                     {
  //                           this.__shared.sessionExpired();
  //                     }
  //               })

  // }

  updateRole() {
    let roleId = this.userRoleData ? this.userRoleData.id : '';
    let data = { rights: this.userRoleData ? this.userRoleData.rights : '' };
    let hasError = false; // Flag to track if there's an error

    if (!this.userRoleData || !this.userRoleData.rights) {
        // Handle the case where userRoleData or its rights are null
        return;
    }

    for (let i = 0; i < this.userRoleData.rights.length; i++) {
        const resource = this.userRoleData.rights[i].resource;
        const access = this.userRoleData.rights[i].access;

        // Check if the resource requires certain permissions
        if (resource === "users" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Users: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        } else if (resource === "roles" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Roles: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
         else if (resource === "resources" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Resources: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
         else if (resource === "permissions" && ((access.create || access.update || access.delete) && !access.read)) {
              this.__shared.toastError("Permissions: Please give the correct permissions");
              hasError = true; // Set flag to true if there's an error
              break; // Exit the loop, no need to continue checking
        }
         else if (resource === "contents" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Contents: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "categories" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Categories: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "courses" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Courses: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "report" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Report: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "chapters" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Chapters: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "videos" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Videos: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "transactions" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Transactions: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "wishlists" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Wishlists: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
          else if (resource === "coupons" && ((access.create || access.update || access.delete) && !access.read)) {
            this.__shared.toastError("Coupons: Please give the correct permissions");
            hasError = true; // Set flag to true if there's an error
            break; // Exit the loop, no need to continue checking
        }
        
    }

    if (hasError) {
        return; // Exit the function if there's an error
    }

    // Proceed with updating the role if there are no errors
    this._access.editRole(roleId, data)
        .subscribe((response) => {
            if (response.error == false) {
                if (response.data.slug === localStorage.getItem('login_role')) {
                    localStorage.setItem('login_rights', JSON.stringify(response.data.rights));
                }
                this.commonService.send(response.data.rights);
                this.__shared.toastSuccess(response.message);
                this.__route.navigate(['access/rolelist']);
            }
        },
        (err) => {
            console.log(err);
            if (err.status == 403) {
                this.__shared.sessionExpired();
            }
        });
}




  backClicked() {
    this.__route.navigate(['/access/rolelist']);
    }



getAccordionBodyText(value: string) {
  const textSample = `
    <strong>This is the <mark>#${value}</mark> item accordion body.</strong> It is hidden by
    default, until the collapse plugin adds the appropriate classes that we use to
    style each element. These classes control the overall appearance, as well as
    the showing and hiding via CSS transitions. You can modify any of this with
    custom CSS or overriding our default variables. It&#39;s also worth noting
    that just about any HTML can go within the <code>.accordion-body</code>,
    though the transition does limit overflow.
  `;
  return this.sanitizer.bypassSecurityTrustHtml(textSample);
}
  

}
