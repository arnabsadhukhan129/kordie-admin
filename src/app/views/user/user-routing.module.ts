import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserlistComponent } from './userlist/userlist.component';
import { StudentlistComponent } from './studentlist/studentlist.component';
import { EdituserComponent } from './edituser/edituser.component';
import { AdduserComponent } from './adduser/adduser.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ViewuserComponent } from './viewuser/viewuser.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User Management',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'userlist',
      },
      {
        path: 'userlist',
        component: UserlistComponent,
        data: {
          title: 'Sub Admin List',
        },
      },
      {
        path: 'studentlist',
        component: StudentlistComponent,
        data: {
          title: 'App User List',
        },
      },
      {
        path: 'adduser',
        component: AdduserComponent,
        data: {
          title: 'Add User',
        },
      },
      {
        path: 'viewuser',
        component: ViewuserComponent,
        data: {
          title: 'View User',
        },
      },
      {
        path: 'edituser',
        component: EdituserComponent,
        data: {
          title: 'Edit User',
        },
      }
    ],
  },  
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: 'Profile',
    },
  },
  {
    path: 'changepassword',
    component: ChangepasswordComponent,
    data: {
      title: 'Change Password',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
