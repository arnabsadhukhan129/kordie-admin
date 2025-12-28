import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Program1ListComponent } from './program1/program1-list/program1-list.component';
import { Program2ListComponent } from './program2/program2-list/program2-list.component';
import { Program3ListComponent } from './program3/program3-list/program3-list.component';
import { CreateComponent } from './create-program1/create/create.component';
import { ViewComponent } from './view-program1/view/view.component';
import { CreateProgram2Component } from './create-program2/create-program2.component';
import { ViewComponent2 } from './view-program2/view/view.component';
import { CreateProgram3Component } from './create-program3/create-program3.component';
import { ViewComponent3Component } from './view-program3/view-component3/view-component3.component';


const routes: Routes = [
  //Program1 List...........
  {
    path: 'program1-list',
    component: Program1ListComponent,
    data:{
      title: 'Exclusive Program-1 / List'
    }
  },
  //Program1 Edit...........
  {
    path: 'program1-list/program1-edit/:id',
    component: CreateComponent,
    data:{
      title: 'Exclusive Program-1 / Edit'
    }
  },
  //Program1 View...........
  {
    path:'program1-list/program1-view/:id',
    component: ViewComponent,
    data: {
      title: 'Exclusive Program-1 / View',
    }
  },
  //Program2 List............
  {
    path: 'program2-list',
    component: Program2ListComponent,
    data:{
      title: 'Exclusive Program-2 / List'
    }
  },
   //Program2 Edit...........
   {
    path: 'program2-list/program2-edit/:id',
    component: CreateProgram2Component,
    data:{
      title: 'Exclusive Program-2 / Edit'
    }
  },
  //Program2 View...........
  {
    path:'program2-list/program2-view/:id',
    component: ViewComponent2,
    data: {
      title: 'Exclusive Program-2 / View',
    }
  },
  //Program3 List............
  {
    path: 'program3-list',
    component: Program3ListComponent,
    data:{
      title: 'Exclusive Program-3 / List'
    }
  },
   //Program3 Edit...........
   {
    path: 'program3-list/program3-edit/:id',
    component: CreateProgram3Component,
    data:{
      title: 'Exclusive Program-3 / Edit'
    }
  },
  //Program3 View...........
  {
    path:'program3-list/program3-view/:id',
    component: ViewComponent3Component,
    data: {
      title: 'Exclusive Program-3 / View',
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExclusiveProgramRoutingModule { }
