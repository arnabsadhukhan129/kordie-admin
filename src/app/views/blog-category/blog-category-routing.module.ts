import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import {CreateEditBlogCategoryComponent} from './create-edit-blog-category/create-edit-blog-category.component'

const routes: Routes = [
  {
    path:'', 
    component: ListComponent,
    data: {
      title: 'Blog-Category / List',
    }
  },
  {
    path:'blog-list', 
    component:ListComponent,
    data: {
      title: 'Blog-Category / List',
    }
  },
  {
    path:'create',
    component: CreateEditBlogCategoryComponent,
    data:{
      title: 'Blog-Category / Create'
    }
  },
  {
    path:'edit/:id',
    component: CreateEditBlogCategoryComponent,
    data:{
      title: 'Blog-Category / Edit'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogCategoryRoutingModule { }
