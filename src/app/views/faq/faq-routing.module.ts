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
          title: 'Faq / list',
        }
      },
      {
        path:'list', 
        component: ListComponent,
        data: {
          title: 'Faq / list',
        }
      },
      {
        path:'create', 
        component:CreateComponent,
        data: {
          title: 'Faq / Create',
        }
      },
      {
        path:'edit/:id',
        component: CreateComponent,
        data:{
          title: 'Faq / Edit'
        }
      },
      {
        path:'view/:id',
        component: ViewComponent,
        data: {
          title: 'Faq / View',
        }
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
