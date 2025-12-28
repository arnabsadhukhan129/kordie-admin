import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'Hospitality upskilling / Logo List',
    }
  },
  {
    path:'list', 
    component :ListComponent,
    data: {
      title: 'Hospitality upskilling / Logo List',
    }
  },
  {
    path:'create',
    component: CreateComponent,
    data:{
      title: 'Hospitality upskilling  / Upload Logo'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadHospitialitySkillRoutingModule { }
