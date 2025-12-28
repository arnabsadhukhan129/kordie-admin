import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import { SubscribedUserListComponent } from './subscribed-user-list/subscribed-user-list.component';
import { SubscribedUserViewComponent } from './subscribed-user-view/subscribed-user-view.component';

const routes: Routes = [
   {
      path:'',
      component: ListComponent,
      data:{
        title: 'Subscription / List'
      }
    },
    {
      path:'list',
      component: ListComponent,
      data:{
        title: 'Subscription / List'
      }
    },
    {
      path:'create', 
      component:CreateComponent,
      data: {
        title: 'Subscription / Create',
      }
    },
    {
      path:'edit/:id', 
      component:CreateComponent,
      data: {
        title: 'Subscription / Edit',
      }
    },
    {
      path:'view/:id',
      component: ViewComponent,
      data: {
        title: 'Subscription / View',
      }
    },
    {
      path:'subscribed-user-list/:id',
      component: SubscribedUserListComponent,
      data: {
        title: 'Subscription / Subscribed User List',
      }
    },
    {
      path:'subscribed-user-details/:id/:user_associated_plan_id',
      component: SubscribedUserViewComponent,
      data: {
        title: 'Subscription / Subscribed User Details',
      }
    }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionRoutingModule { }
