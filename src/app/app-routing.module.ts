import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { ForgotpasswordComponent } from './views/pages/forgotpassword/forgotpassword.component';
import { PrivacyPolicyComponent } from './views/pages/privacy-policy/privacy-policy.component';
import { AuthGuardGuard } from './guards/auth-guard.guard';
import { TermsConditionsComponent } from './views/pages/terms-conditions/terms-conditions.component';
import { DeleteAccountComponent } from './views/pages/delete-account/delete-account.component';
import { ResetPasswordComponent } from './views/pages/reset-password/reset-password.component';
import { TestComponent } from './views/test/test.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [AuthGuardGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'section-title-mangement',
        loadChildren: ()=>
          import('./views/section-title-management/section-title-management.module').then((m) => m.SectionTitleManagementModule)
      },
      {
        path: 'master-list',
        loadChildren: ()=>
          import('./views/master-list/master-list.module').then((m) => m.MasterListModule)
      },
      {
        path: 'exclusive-program',
        loadChildren: ()=>
          import('./views/exclusive-program/exclusive-program.module').then((m) => m.ExclusiveProgramModule)
      },
      {
        path: 'meet-your-curators',
        loadChildren: ()=>
          import('./views/meet-your-curators/meet-your-curators.module').then((m) => m.MeetYourCuratorsModule)
      },
      {
        path: 'content',
        loadChildren: ()=>
          import('./views/content/content.module').then((m) => m.ContentModule)
      },
      {
        path: 'course-category',
        loadChildren: ()=>
          import('./views/course-category/course-category.module').then((m) => m.CourseCategoryModule)
      },
      {
        path: 'course',
        loadChildren: ()=>
          import('./views/product/product.module').then((m) => m.ProductModule)
      },
      {
        path: 'upcoming-course',
        loadChildren: ()=>
          import('./views/upcoming-course/upcoming-course.module').then((m) => m.UpcomingCourseModule)
      },
      {
        path: 'blog',
        loadChildren: ()=>
          import('./views/blog/blog.module').then((m) => m.BlogModule)
      },
      {
        path: 'blog-category',
        loadChildren: ()=>
          import('./views/blog-category/blog-category.module').then((m) => m.BlogCategoryModule)
      },
      {
        path: 'crucial-skill',
        loadChildren: ()=>
          import('./views/crucial-skill/crucial-skill.module').then((m) => m.CrucialSkillModule)
      },
      {
        path: 'faq',
        loadChildren: ()=>
          import('./views/faq/faq.module').then((m) => m.FaqModule)
      },
      {
        path: 'take-course',
        loadChildren: ()=>
          import('./views/why-take-course-with-kordie/why-take-course-with-kordie.module').then((m) => m.WhyTakeCourseWithKordieModule)
      },
      {
        path: 'learn-with-kordie',
        loadChildren: ()=>
          import('./views/learn-kordie-for-hub/learn-kordie-for-hub.module').then((m) => m.LearnKordieForHubModule)
      },
      {
        path: 'contact-us',
        loadChildren: ()=>
          import('./views/contact-us/contact-us.module').then((m) => m.ContactUsModule)
      },
      {
        path: 'contact',
        loadChildren: ()=>
          import('./views/contact/contact.module').then((m) => m.ContactModule)
      },
      {
        path: 'contact-banner',
        loadChildren: ()=>
          import('./views/contact-banner/contact-banner.module').then((m) => m.ContactBannerModule)
      },
      {
        path: 'blog-banner',
        loadChildren: ()=>
          import('./views/blog-banner/blog-banner.module').then((m) => m.BlogBannerModule)
      },
      {
        path: 'impact',
        loadChildren: ()=>
          import('./views/impact/impact.module').then((m) => m.ImpactModule)
      },
      {
        path: 'about-us',
        loadChildren: ()=>
          import('./views/about/about.module').then((m) => m.AboutModule)
      },
      {
        path: 'why-kordie',
        loadChildren: ()=>
          import('./views/why-kordie-content/why-kordie-content.module').then((m) => m.WhyKordieContentModule)
      },
      {
        path: 'customer-management',
        loadChildren:()=>
          import('./views/customer-management/customer-management.module').then((m) => m.CustomerManagementModule)
      },
      {
        path: 'user',
        loadChildren: ()=>
          import('./views/user-details/user-details.module').then((m) => m.UserDetailsModule)
      },
      {
        path: 'profile-card',
        loadChildren: ()=>
          import('./views/profile-card/profile-card.module').then((m) => m.ProfileCardModule)
      },
      {
        path: 'subscription',
        loadChildren: ()=>
          import('./views/subscription/subscription.module').then((m) => m.SubscriptionModule)
      },
      {
        path: 'payment',
        loadChildren: ()=>
          import('./views/payment/payment.module').then((m) => m.PaymentModule)
      },
      {
        path: 'enquiry',
        loadChildren: ()=>
          import('./views/course-enquiry/course-enquiry.module').then((m) => m.CourseEnquiryModule)
      },
      {
        path: 'business-profile',
        loadChildren: ()=>
          import('./views/business/business.module').then((m) => m.BusinessModule)
      },
      // {
      //   path: 'hospitiality-school-mangement',
      //   loadChildren: ()=>
      //     import('./views/hospitally-school/hospitally-school.module').then((m) => m.HospitallySchoolModule)
      // },
      {
        path: 'user',
        loadChildren: () =>
          import('./views/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'access',
        loadChildren: () =>
          import('./views/access/access.module').then((m) => m.AccessModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      
      
    ]
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy'
    }
  },
  {
    path: 'delete-account',
    component: DeleteAccountComponent,
    data: {
      title: 'Delete Account'
    }
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'forgot-password',
    component: ForgotpasswordComponent,
    data: {
      title: 'Forgot Password Page'
    }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent,
    data: {
      title: 'Terms & Conditions'
    }
  },
  {
      path:'test',
      component: TestComponent
    
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
