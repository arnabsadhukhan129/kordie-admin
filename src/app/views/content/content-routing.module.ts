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
      title: 'Content / list',
    }
  },
  {
    path:'list', 
    component: ListComponent,
    data: {
      title: 'Content / list',
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Content / Create',
    }
  },
  {
    path:'edit/:id',
    component: CreateComponent,
    data:{
      title: 'Content / Edit'
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Content / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
