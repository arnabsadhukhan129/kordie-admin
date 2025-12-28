import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { title } from 'process';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { PrivateCommetListComponent } from './private-commet-list/private-commet-list.component';
import { CreateCommentComponent } from './create-comment/create-comment.component';

const routes: Routes = [
  {
    path:'',
    component: ListComponent,
    data: {
      title: 'Customer Management / Customer List'
    }
  },
  {
    path:'list', 
    component: ListComponent,
    data: {
      title: 'Customer Management / Customer List',
    }
  },
  {
    path:'create', 
    component:CreateComponent,
    data: {
      title: 'Customer Management / Create',
    }
  },
  {
    path:'edit/:id',
    component: CreateComponent,
    data:{
      title: 'Customer Management / Edit'
    }
  },
  {
    path:'view/:id',
    component: ViewComponent,
    data: {
      title: 'Customer Management / View',
    }
  },
  {
    path:'order-history/:id',
    component: OrderHistoryComponent,
    data: {
      title: 'Customer Management / Order History',
    }
  },
  {
    path:'comment-logs/:id',
    component: PrivateCommetListComponent,
    data: {
      title: 'Customer Management / Private Comment Logs',
    }
  },
  {
    path:'create-comment/:id',
    component: CreateCommentComponent,
    data: {
      title: 'Customer Management / Add Comment',
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerManagementRoutingModule { }
