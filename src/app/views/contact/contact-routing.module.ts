import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'contact / list',
    }
  },
  {
    path:'list', 
    component: ListComponent,
    data: {
      title: 'contact / list',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'contact / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
