import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path:'',
    component: ListComponent,
    data:{
      title:'We are trusted by over 1,000 leading companies across the US and UK / List'
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title:'We are trusted by over 1,000 leading companies across the US and UK / List'
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'We are trusted by over 1,000 leading companies across the US and UK / Create',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'We are trusted by over 1,000 leading companies across the US and UK / Edit',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'We are trusted by over 1,000 leading companies across the US and UK / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeAreTrustedRoutingModule { }
