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
      title: 'Contact us content / List',
    }
  },
  {
    path:'list', 
    component :ListComponent,
    data: {
      title: 'Contact us content / List',
    }
  },
  {
    path:'create',
    component: CreateComponent,
    data:{
      title: 'Contact us content / Create'
    }
  },
  {
    path:'edit/:id',
    component: CreateComponent,
    data:{
      title: 'Contact us content / Edit'
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Contact us content / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactUsRoutingModule { }
