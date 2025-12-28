import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'Payment / List',
    }
  },
  {
    path:'list', 
    component :ListComponent,
    data: {
      title: 'Payment / List',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
