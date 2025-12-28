import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { CorporateUserComponent } from './corporate-user/corporate-user.component';

const routes: Routes = [
  {
        path:'',
        component: ListComponent,
        data:{
          title: 'Course Enquiry / List'
        }
      },
      {
        path:'list',
        component: ListComponent,
        data:{
          title: 'Course Enquiry / List'
        }
      },
      {
        path:'create', 
        component:CreateComponent,
        data: {
          title: 'Course Enquiry / Create',
        }
      },
      {
        path:'edit/:id', 
        component:CreateComponent,
        data: {
          title: 'Course Enquiry / Edit',
        }
      },
      {
        path:'view/:id',
        component: ViewComponent,
        data: {
          title: 'Course Enquiry / View',
        }
      },
      {
        path:'corporate-user/:id', 
        component:CorporateUserComponent,
        data: {
          title: 'Course Enquiry / Create Corporate User',
        }
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseEnquiryRoutingModule { }
