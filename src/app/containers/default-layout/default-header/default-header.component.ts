import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { SharedService } from '../../../../app/services/shared/shared.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public profile_pic : any = localStorage.getItem('profile_pic');

  constructor(private classToggler: ClassToggleService, 
              private __route:Router,
              private __shared: SharedService,
             ) {    
    super();
  }

  logout()
  {
    // localStorage.removeItem('portal_login_token');
    // localStorage.removeItem('login_role');
    // localStorage.removeItem('profile_pic');
    // this.__route.navigate(['/login']);

        this.__shared.logout();
  }
}
