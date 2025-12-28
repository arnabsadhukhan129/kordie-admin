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
      title: 'See how Kordie can support you in your goals / List'
    }
  },
  {
    path:'list',
    component: ListComponent,
    data:{
      title: 'See how Kordie can support you in your goals / List'
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'See how Kordie can support you in your goals / Create',
    }
  },
  {
    path:'edit/:id', 
    component:CreateComponent,
    data: {
      title: 'See how Kordie can support you in your goals / Edit',
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'See how Kordie can support you in your goals / View',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportYourGoalRoutingModule { }
