import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ListComponent} from './list/list.component'
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  {
    path:'',
    component: ListComponent,
    data:{
      title:'Goal-Based Talent development solution / List'
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title:'Goal-Based Talent Development Solution / List'
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Goal-Based Talent Development Solution / Create',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'Goal-Based Talent Development Solution / Edit',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Goal-Based Talent Development Solution / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighEndGranularRoutingModule { }
