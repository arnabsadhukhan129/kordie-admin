import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import {AddEditProductComponent} from './add-edit-product//add-edit-product.component';
import {ViewProductComponent} from './view-product/view-product.component';

const routes: Routes = [
  {
      path:'', 
      component: ListComponent,
      data: {
        title: 'Course / List',
      }
    },
    {
      path:'course-list', 
      component:ListComponent,
      data: {
        title: 'Course / List',
      }
    },
    {
      path:'add-course',
      component: AddEditProductComponent,
      data:{
        title: 'Course / Create'
      }
    },
    {
      path:'edit-course/:id',
      component: AddEditProductComponent,
      data:{
        title: 'Course / Edit'
      }
    },
    {
      path:'view-course/:id',
      component: ViewProductComponent,
      data: {
        title: 'Course / View',
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
