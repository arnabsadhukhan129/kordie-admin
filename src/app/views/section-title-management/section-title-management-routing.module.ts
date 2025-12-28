import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';


const routes: Routes = [
  {
    path:'', 
    component:ListComponent,
    data: {
      title: 'Home Page Management / Title list',
    }
  },
  {
    path:'titlelist', 
    component:ListComponent,
    data: {
      title: 'Home Page Management / Title list',
    }
  },
  {
    path:'addtitle',
    component: CreateComponent,
    data: {
      title: 'Home Page management / Add title',
    }
  },
  {
    path:'viewtitle/:id',
    component: ViewComponent,
    data: {
      title: 'Home Page management / View title',
    }
  },
  {
    path:'edittitle/:id',
    component: CreateComponent,
    data: {
      title: 'Home Page management / Edit title',
    }
  },
  {
    path:'hospitiality-school-mangement',
    loadChildren: ()=>
      import('../hospitally-school/hospitally-school.module').then((m) => m.HospitallySchoolModule)
  },
  {
    path: 'goal-based-talent-development-solution-management',
    loadChildren: ()=>
      import('../high-end-granular/high-end-granular.module').then((m) => m.HighEndGranularModule)
  },
  {
    path: 'explore-learning-tracks',
    loadChildren: ()=>
      import('../explore-learning-tracks/explore-learning-tracks.module').then((m) => m.ExploreLearningTracksModule)
  },
  {
    path: 'support-your-goal',
    loadChildren: ()=>
      import('../support-your-goal/support-your-goal.module').then((m) => m.SupportYourGoalModule)
  },
  {
    path: 'learn-kordie',
    loadChildren: ()=>
      import('../learn-kordie/learn-kordie.module').then((m) => m.LearnKordieModule)
  },
  {
    path: 'meet-your-curators',
    loadChildren: ()=>
      import('../meet-your-curators/meet-your-curators.module').then((m) => m.MeetYourCuratorsModule)
  },
  {
    path: 'we-trusted',
    loadChildren: ()=>
      import('../we-are-trusted/we-are-trusted.module').then((m) => m.WeAreTrustedModule)
  },
  {
    path: 'student-speak-us',
    loadChildren: ()=>
      import('../student-speak-us/student-speak-us.module').then((m) => m.StudentSpeakUsModule)
  },
  {
    path: 'insights-highlights',
    loadChildren: ()=>
      import('../insight-highlight/insight-highlight.module').then((m) => m.InsightHighlightModule)
  },
  {
    path: 'hospitality-upskilling',
    loadChildren: ()=>
      import('../upload-hospitiality-skill/upload-hospitiality-skill.module').then((m) => m.UploadHospitialitySkillModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SectionTitleManagementRoutingModule { }
