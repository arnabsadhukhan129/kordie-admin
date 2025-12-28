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
      title: 'About-Us / List',
    }
  },
  {
    path:'list', 
    component :ListComponent,
    data: {
      title: 'About-Us / List',
    }
  },
  {
    path:'create',
    component: CreateComponent,
    data:{
      title: 'About-Us / Create'
    }
  },
  {
    path:'edit/:id',
    component: CreateComponent,
    data:{
      title: 'About-Us / Edit'
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'About-Us / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutRoutingModule { }
