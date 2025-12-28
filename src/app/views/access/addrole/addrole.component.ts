import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormsModule, ValidatorFn, AbstractControl, FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/services/shared/shared.service';
import { AccessService } from 'src/app/services/access/access.service';
import { AccessRightsData } from 'src/app/data/role-rights';
import { elementAt } from 'rxjs';


@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.scss']
})
export class AddroleComponent implements OnInit {

  editForm: any;
  displayMessage : string = '';
  errorMessage : string = '';
  roleId : string | null = this._activatedRoute.snapshot.queryParams['role'];

  constructor(private __fb: FormBuilder,
              private __shared:SharedService,
              private _access: AccessService,
              private __route:Router,
              private _activatedRoute : ActivatedRoute,
             ) 
  { }

  ngOnInit(): void {

    this.editForm = this.__fb.group({
      name:['',[Validators.required,Validators.pattern(/^[^-\s!@#$%^&*(),.?":{}|<>0-9][a-zA-Z\s]*$/)]], 
      rights: [!this.roleId ? AccessRightsData : '']
    });

    if(this.roleId)
    {
        this.getRoleData();
    }

  }


  getRoleData()
  {
        this._access.getRoleDetail(this.roleId).subscribe((response)=>{
                if(response.error == false)
                {

                  const data = response.data;

                        this.editForm.patchValue({
                          name : data.name,
                          rights : data.rights
                        });
                }
                else
                {
                    this.errorMessage = response.message;
                    this.__shared.toastError(this.errorMessage);
                }
        },
        (err)=>{
          this.errorMessage = err.error.message;
          this.__shared.toastError(this.errorMessage);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
        })
  }

  saveRole()
  {
        if(this.roleId)
        {
            this.editRole();
        }
        else
        {
          this.addRole();
        }
  }

  addRole() 
  {
    let data : any = this.editForm.value;

    this._access.addRole(data)
                .subscribe((response)=>{

                  //console.log('response=====>>>',response.error);

                  if(response.error == false)
                  {
                      this.displayMessage = response.message;
                      //this.__shared.queryParamData.rolelist.displayMessage = this.displayMessage;
                      this.__shared.toastSuccess(this.displayMessage);
                      const roleId = response.data.id;
                      this.__route.navigate(['/access/permission'],{queryParams:{role: roleId}});                
                                        
                  }
                  else
                  {
                    this.errorMessage = response.message;
                    this.__shared.toastError(this.errorMessage);
                  }


                },
                (err)=>{
                  //console.log('error===>',err);
                  this.errorMessage = err.error.message;
                  this.__shared.toastError(this.errorMessage);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                }
                )
  }


  editRole() 
  {

    //this.__route.navigate(['/access/permission'],{queryParams:{role: this.roleId}});

    let data : any = this.editForm.value;

    this._access.editRole(this.roleId, data)
                .subscribe((response)=>{

                  //console.log('response=====>>>',response.error);

                  if(response.error == false)
                  {
                      this.displayMessage = response.message;
                      //this.__shared.queryParamData.rolelist.displayMessage = this.displayMessage;
                      this.__shared.toastSuccess(this.displayMessage);
                      this.__route.navigate(['/access/permission'],{queryParams:{role: this.roleId}});                
                                        
                  }
                  else
                  {
                    this.errorMessage = response.message;
                    this.__shared.toastError(this.errorMessage);
                  }


                },
                (err)=>{
                  //console.log('error===>',err);
                  this.errorMessage = err.error.message;
                  this.__shared.toastError(this.errorMessage);
                  if(err.status == 403)
                      {
                            this.__shared.sessionExpired();
                      }
                }
                )
  }

  backClicked() {
    this.__route.navigate(['/access/rolelist']);
    }

}
