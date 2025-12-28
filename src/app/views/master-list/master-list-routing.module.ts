import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicComponent } from '../master-list/Topic/topic/topic.component';
import { AddEditTopicComponent } from '../master-list/Topic/add-edit-topic/add-edit-topic.component';
import { TypeComponent} from '../master-list/Type/type/type.component';
import { AddEditTypeComponent} from '../master-list/Type/add-edit-type/add-edit-type.component';
import { TimeToCompleteComponent } from '../master-list/Time-to-complete/time-to-complete/time-to-complete.component';
import { AddEditTimeComponent } from '../master-list/Time-to-complete/add-edit-time/add-edit-time.component';
import { GoalComponent } from '../master-list/Goal/goal/goal.component';
import { AddEditGoalComponent } from './Goal/add-edit-goal/add-edit-goal.component';
import {TaughyByComponent} from './Taught-By/taughy-by/taughy-by.component';
import {AddEditTaughtByComponent} from './Taught-By/add-edit-taught-by/add-edit-taught-by.component';
import { IndustryComponent } from './Industry/industry/industry.component';
import { AddEditIndustryComponent } from './Industry/add-edit-industry/add-edit-industry.component';
import { InterestComponent } from './Interest/interest/interest.component';
import { AddEditInterestComponent } from './Interest/add-edit-interest/add-edit-interest.component';
import { ListComponent } from './blog-type/list/list.component';
import { CreateComponent } from './blog-type/create/create.component';


const routes: Routes = [

  //Topic.............
  {
    path:'topic-list',
    component: TopicComponent,
    data:{
      title: 'Topic / List'
    }
  },
  {
    path:'topic-list/add-topic',
    component: AddEditTopicComponent,
    data:{
      title: 'Topic / Create'
    }
  },
  {
    path:'topic-list/edit-topic/:id',
    component: AddEditTopicComponent,
    data:{
      title: 'Topic / Edit'
    }
  },

  //Time.......................
  {
    path:'time-list',
    component: TimeToCompleteComponent,
    data:{
      title: 'Time To Complete / List'
    }
 },
 {
  path:'time-list/add-time',
  component: AddEditTimeComponent,
  data:{
    title: 'Time To Complete / Create'
  }
},
{
  path:'time-list/edit-time/:id',
  component: AddEditTimeComponent,
  data:{
    title: 'Time To Complete / Edit'
  }
},

//Type......................
{
  path:'type-list',
  component: TypeComponent,
  data:{
    title: 'Type / List'
  }
},
{
  path:'type-list/add-type',
  component: AddEditTypeComponent,
  data:{
    title: 'Time To Complete / Create'
  }
},
{
  path:'type-list/edit-type/:id',
  component: AddEditTypeComponent,
  data:{
    title: 'Time To Complete / Edit'
  }
},

//Goal.................
{
  path:'goal-list',
  component: GoalComponent,
  data:{
    title: 'The Goal / List'
  }
},
{
  path:'goal-list/add-goal',
  component: AddEditGoalComponent,
  data:{
    title: 'Time To Complete / Create'
  }
},
{
  path:'goal-list/edit-goal/:id',
  component: AddEditGoalComponent,
  data:{
    title: 'Time To Complete / Edit'
  }
},

//Taught By................
{
  path:'taught-by-list',
  component: TaughyByComponent,
  data:{
    title: 'Taught By / List'
  }
},
{
  path:'taught-by-list/add-taught',
  component: AddEditTaughtByComponent,
  data:{
    title: 'Taught By / Create'
  }
},
{
  path:'taught-by-list/edit-taught/:id',
  component: AddEditTaughtByComponent,
  data:{
    title: 'Taught By / Edit'
  }
},

//Industry...............
{
  path:'industry-list',
  component: IndustryComponent,
  data:{
    title: 'Industry / List'
  }
},
{
  path:'industry-list/add-industry',
  component: AddEditIndustryComponent,
  data:{
    title: 'Industry / Create'
  }
},
{
  path:'industry-list/edit-industry/:id',
  component: AddEditIndustryComponent,
  data:{
    title: 'Industry / Edit'
  }
},

//Interest..................
{
  path:'interest-list',
  component: InterestComponent,
  data:{
    title: 'Interest / List'
  }
},
{
  path:'interest-list/add-interest',
  component: AddEditInterestComponent,
  data:{
    title: 'Interest / Create'
  }
},
{
  path:'interest-list/edit-interest/:id',
  component: AddEditInterestComponent,
  data:{
    title: 'Interest / Edit'
  }
},
//Blog Type.......
{
  path:'blog-type-list',
  component: ListComponent,
  data:{
    title: 'Blog-Type / List'
  }
},
{
  path:'blog-type-list/add-blog-type',
  component: CreateComponent,
  data:{
    title: 'Blog-Type / Create'
  }
},
{
  path:'blog-type-list/edit-blog-type/:id',
  component: CreateComponent,
  data:{
    title: 'Blog-Type / Edit'
  }
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterListRoutingModule { }
