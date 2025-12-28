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
      title: 'Insights and highlights / List'
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title: 'Insights and highlights / List'
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Insights and highlights / Create',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'Insights and highlights / Edit',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Insights and highlights / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsightHighlightRoutingModule { }
