import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EnrolledCourseListComponent } from './enrolled-course-list/enrolled-course-list.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { ViewuserComponent } from '../user/viewuser/viewuser.component';

const routes: Routes = [
  {
    path:'',
    component: ListComponent,
    data:{
      title: 'User / List'
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title: 'User / List'
    }
  },
  {
    path:'create',
    component: CreateComponent,
    data:{
      title: 'User / Create'
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'User / Edit',
    }
  },
  // {
  //   path:'view/:id', 
  //   component:ViewuserComponent,
  //   data: {
  //     title: 'User / View',
  //   }
  // },
  {
    path:'enrolled-course/:id', 
    component:EnrolledCourseListComponent,
    data: {
      title: 'User / Enrolled Course List',
    }
  },
  {
    path:'Subscription-plan/:id', 
    component: PlanListComponent,
    data: {
      title: 'User / Subscription Plan List',
    }
  },
  {
    path:'role-permission/:id', 
    component:RolePermissionComponent,
    data: {
      title: 'User / Role Permission',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDetailsRoutingModule { }
