import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
   {
        path:'', 
        component: ListComponent,
        data: {
          title: 'Course / List',
        }
      },
      {
        path:'upcoming-course-list', 
        component:ListComponent,
        data: {
          title: 'Upcoming-Course / List',
        }
      },
      {
        path:'create-upcoming-course',
        component: CreateComponent,
        data:{
          title: 'Upcoming-Course / Create'
        }
      },
      {
        path:'edit-upcoming-course/:id',
        component: CreateComponent,
        data:{
          title: 'Upcoming-Course / Edit'
        }
      },
      {
        path:'view-upcoming-course/:id',
        component: ViewComponent,
        data: {
          title: 'Upcoming-Course / View',
        }
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpcomingCourseRoutingModule { }
