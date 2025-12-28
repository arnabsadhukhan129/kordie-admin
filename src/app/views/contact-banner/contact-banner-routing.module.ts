import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { CreateComponent } from './create/create.component';

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'Contact-Banner / list',
    }
  },
  {
    path:'list', 
    component: ListComponent,
    data: {
      title: 'Contact-Banner / list',
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Contact-Banner / Create',
    }
  },
  {
    path:'edit/:id',
    component: CreateComponent,
    data:{
      title: 'Contact-Banner / Edit'
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Contact-Banner / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactBannerRoutingModule { }
