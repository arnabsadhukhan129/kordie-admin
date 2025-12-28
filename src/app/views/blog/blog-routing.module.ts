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
          title: 'Blog / List',
        }
      },
      {
        path:'blog-list', 
        component:ListComponent,
        data: {
          title: 'Blog / List',
        }
      },
      {
        path:'add-blog',
        component: CreateComponent,
        data:{
          title: 'Blog / Create'
        }
      },
      {
        path:'edit-blog/:id',
        component: CreateComponent,
        data:{
          title: 'Blog / Edit'
        }
      },
      {
        path:'view-blog/:id',
        component: ViewComponent,
        data: {
          title: 'Blog / View',
        }
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }
