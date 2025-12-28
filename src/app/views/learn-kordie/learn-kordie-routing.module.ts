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
      title: 'Why learn with Kordie / List'      
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title: 'Why learn with Kordie / List'
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Why learn with Kordie / Create',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'Why learn with Kordie / Edit',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Why learn with Kordie / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnKordieRoutingModule { }
