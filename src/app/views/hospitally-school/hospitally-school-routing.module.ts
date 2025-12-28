import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListComponent} from './list/list.component'
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'Hospitiality School Management / School list',
    }
  },
  {
    path:'hospitialitylist', 
    component:ListComponent,
    data: {
      title: 'Hospitiality School Management / School list',
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Hospitiality School Management / Create School Details',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'Hospitiality School Management / Edit School Details',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Hospitiality School Management / View School Details',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitallySchoolRoutingModule { }
