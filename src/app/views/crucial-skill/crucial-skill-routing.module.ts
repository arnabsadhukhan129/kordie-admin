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
        title: 'Crucial Skill Set / School list',
      }
    },
    {
      path:'list', 
      component:ListComponent,
      data: {
        title: 'Crucial Skill Set / School list',
      }
    },
    {
      path:'create', 
      component:CreateComponent,
      data: {
        title: 'Crucial Skill Set / Create',
      }
    },
    {
      path:'edit/:key',
      component: CreateComponent,
      data:{
        title: 'Crucial Skill Set / Edit'
      }
    },
    {
      path:'view/:key',
      component: ViewComponent,
      data: {
        title: 'Crucial Skill Set / View',
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrucialSkillRoutingModule { }
