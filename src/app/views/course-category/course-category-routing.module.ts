import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { ViewCategoryComponent } from './view-category/view-category.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';

const routes: Routes = [
   {
      path:'', 
      component: ListComponent,
      data: {
        title: 'Course category / List',
      }
    },
    {
      path:'list', 
      component:ListComponent,
      data: {
        title: 'Course category / List',
      }
    },
    {
      path:'add-category',
      component: AddEditCategoryComponent,
      data:{
        title: 'Course category / Create'
      }
    },
    {
      path:'edit-category/:id',
      component: AddEditCategoryComponent,
      data:{
        title: 'Course category / Edit'
      }
    },
    {
      path:'view-category/:id',
      component: ViewCategoryComponent,
      data: {
        title: 'Course category / View',
      }
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CourseCategoryRoutingModule { }
