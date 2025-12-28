import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { INavData } from '@coreui/angular';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../app/services/common/common.service';
import { PageService } from '../../../app/services/page/page.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit,OnChanges, OnDestroy {
  public navItems: INavData[] = [];
  public loginRights: any;
  private routerSubscription: Subscription | undefined;
  private previousUrl: any ;
  private currentUrl: any;
  getRole: any;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private _pageService: PageService
  ) {
    this.getRole = localStorage.getItem('login_role');
    console.log("getRole====",this.getRole);
    
  }
  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };
  public dashboardManagmentMenu = {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  }

  public sectionTitleManagementMenu = {
    name: 'Home Page Management',
    url: '/section-title-mangement',
    iconComponent: { name: 'cil-list' },
  }

  public curatorsManagementMenu = {
    name: 'Meet Your Curators',
    url: '/meet-your-curators',
    iconComponent: { name: 'cil-list' },
  }

  public contentManagementMenu = {
    name: 'Content',
    url: '/content',
    iconComponent: { name: 'cil-list' },
  }

  public courseCategoryManagementMenu = {
    name: 'Course Category',
    url: '/course-category',
    iconComponent: { name: 'cil-list' },
  }

  public productManagementMenu = {
    name: 'Course',
    url: '/course',
    iconComponent: { name: 'cil-list' },
  }

  public upcomingCourseManagementMenu = {
    name: 'Upcoming Course',
    url: '/upcoming-course',
    iconComponent: { name: 'cil-list' },
  }

  public blogManagementMenu = {
    name: 'Blog',
    url: '/blog',
    iconComponent: { name: 'cil-list' },
  }

  public blogCategoryManagementMenu = {
    name: 'Blog Category',
    url: '/blog-category',
    iconComponent: { name: 'cil-list' },
  }

  public crucialSkillManagementMenu = {
    name: 'Crucial Skill Set',
    url: '/crucial-skill',
    iconComponent: { name: 'cil-list' },
  }

  public faqManagementMenu = {
    name: 'Faq',
    url: '/faq',
    iconComponent: { name: 'cil-list' },
  }

  // public takeCourseManagementMenu = {
  //   name: 'Why Take Course With Kordie',
  //   url: '/take-course',
  //   iconComponent: { name: 'cil-list' },
  // }

  public learnKordieHubManagementMenu = {
    name: 'Learn With Kordie',
    url: '/learn-with-kordie',
    iconComponent: { name: 'cil-list' },
  }

  public contactUsManagementMenu = {
    name: 'Contact Us Content',
    url: '/contact-us',
    iconComponent: { name: 'cil-list' },
  }

  public contactManagementMenu = {
    name: 'Contact',
    url: '/contact',
    iconComponent: { name: 'cil-list' },
  }

  public contactBannerManagementMenu = {
    name: 'Contact Banner',
    url: '/contact-banner',
    iconComponent: { name: 'cil-list' },
  }

  public blogBannerManagementMenu = {
    name: 'Blog Banner',
    url: '/blog-banner',
    iconComponent: { name: 'cil-list' },
  }

  public impactManagementMenu = {
    name: 'Impact',
    url: '/impact',
    iconComponent: { name: 'cil-list' },
  }

  public aboutManagementMenu = {
    name: 'About Us',
    url: '/about-us',
    iconComponent: { name: 'cil-list' },
  }

  public whyKordieManagementMenu = {
    name: 'Why Kordie Content',
    url: '/why-kordie',
    iconComponent: { name: 'cil-list' },
  }

  public userManagementMenu = {
    name: 'User',
    url: '/user',
    iconComponent: { name: 'cil-list' },
  }

  public subscriptionManagementMenu = {
    // name: 'Subscription Plan',
    name: 'Subscription Management',
    url: '/subscription',
    iconComponent: { name: 'cil-list' },
  }

  public paymentManagementMenu = {
    name: 'Payment Details',
    url: '/payment',
    iconComponent: { name: 'cil-list' },
  }

  public enquiryManagementMenu = {
    name: 'Course Enquiry Teams',
    url: '/enquiry',
    iconComponent: { name: 'cil-list' },
  }

  public businessManagementMenu = {
    name: 'Business Profile',
    url: '/business-profile',
    iconComponent: { name: 'cil-list' },
  }
  
  

  // public hospitialitySchool = {
  //   name: 'Hospitiality School Management',
  //   url: '/hospitiality-school-mangement',
  //   iconComponent: { name: 'cil-file' },
  // }

  public masterListManagmentMenu =  {
    name: 'Master List',
    url: '/master-list',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'Topic',
        url: '/master-list/topic-list',
        iconComponent: { name: 'cilListNumbered'}
      },
      {
        name: 'Time to complete',
        url: '/master-list/time-list',
        iconComponent: { name: 'cilCalendar'}
      },
      {
        name: 'The goal',
        url: '/master-list/goal-list',
        iconComponent: { name: 'cilChartLine'}
      },
      {
        name: ' Course Type',
        url: '/master-list/type-list',
        iconComponent: { name: 'cil-layers'}
      },
      {
        name: 'Taught By',
        url: '/master-list/taught-by-list',
        iconComponent: { name: 'cilUserFollow'}
      },
      // {
      //   name: 'Blog-Type',
      //   url: '/master-list/blog-type-list',
      //   iconComponent: { name: 'cilPen'}
      // },
      {
        name: 'Industry',
        url: '/master-list/industry-list',
        iconComponent: { name: 'cil-factory'}
      },
      {
        name: 'Interest',
        url: '/master-list/interest-list',
        iconComponent: { name: 'cilWallet'}
      },
    ]
  };


  public userManagmentMenu =  {
    name: 'User Management',
    url: '/user',
    iconComponent: { name: 'cil-user' },
    children: [
      {
        name: 'App User List',
        url: '/user/studentlist',
        iconComponent: { name: 'cil-people'}
      }
    ]
  };

  public profileCardManagmentMenu =  {
    name: 'Profile Card',
    url: '/profile-card',
    iconComponent: { name: 'cil-list' },
  };

  public contentManagmentMenu =  {
    name: 'CMS Management',
    url: '/content/contentlist',
    iconComponent: { name: 'cil-clipboard' },
  };

  public courseManagmentMenu =  {
    name: 'Course Management',
    url: '/course/courselist',
    iconComponent: { name: 'cil-file' },
  };

  public couponManagmentMenu =  {
    name: 'Coupon Management',
    url: '/coupon/couponlist',
    iconComponent: { name: 'cil-wallet' },
  };

  public chapterManagmentMenu =  {
    name: 'Chapter Management',
    url: '/chapter/chapterlist',
    iconComponent: { name: 'cil-notes' },
  };

  public transactionManagmentMenu = {
    name: 'Transaction List',
    url: '/transaction/transactionlist',
    iconComponent: { name: 'cil-money' },
  }

  public accessManagmentMenu =  {
  name: 'Access Management',
  url: '/access/rolelist',
  iconComponent: { name: 'cil-settings' },
  };

  public reportManagmentMenu =  {
    name: 'Report Management',
    url: '/report',
    iconComponent: { name: 'cil-vertical-align-bottom' },
  };

  public exclusiveProgramManagmentMenu =  {
    name: 'Exclusive Program',
    url: '/exclusive-program',
    iconComponent: { name: 'cil-list' },
    children: [
      {
        name: 'Exclusive Program 1',
        url: '/exclusive-program/program1-list',
        iconComponent: { name: 'cil-list'}
      },
      {
        name: 'Exclusive Program 2',
        url: '/exclusive-program/program2-list',
        iconComponent: { name: 'cil-list'}
      },
      {
        name: 'Exclusive Program 3',
        url: '/exclusive-program/program3-list',
        iconComponent: { name: 'cil-list'}
      },
    ]
  };

  public customerManagement = {
    name: 'Customer Management',
    url: '/customer-management',
    iconComponent: { name: 'cil-list' },

  }
  ngOnInit(): void {
    // this.routerSubscription = this.router.events.subscribe((event) => {
    //   console.log("event.....",event);

    //   if (event instanceof NavigationStart) {
    //     this._pageService.sendCurrentPage(1); // Reset the current page before navigating
    //     console.log('Page reset to 1 before route change');
    //   }
    // });
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
        // Extract the base paths
        const previousBasePath = this.getBasePath(this.previousUrl);
        const currentBasePath = this.getBasePath(this.currentUrl);

        if (previousBasePath === currentBasePath) {
          // console.log('Same base URL: hospitiality-school-mangement or its child route');
        } else {
          this._pageService.sendCurrentPage(1);
        }
      }
    });
    // this._pageService.sendCurrentPage(1);
    this.loadLoginRights();
    this.loadNavItems();
  }

  // Helper function to extract the base path
    getBasePath(url: string | null): string {
      if (!url) return '';
      const segments = url.split('/').filter((segment) => segment); // Split by '/' and remove empty segments
      return segments.length > 0 ? `/${segments[0]}` : ''; // Return the first segment with '/'
    }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  private loadLoginRights(): void {
    const storedRights = localStorage.getItem('login_rights');
    this.loginRights = storedRights ? JSON.parse(storedRights) : [];
  }

  private loadNavItems(): void {
    const role = localStorage.getItem('login_role');
    if (role === 'administrator') {
      this.navItems = this.getDefaultMenu();
    } else {
      this.commonService.get().subscribe(
        (navItems) => {
          if (navItems) {
            this.loginRights = navItems;
            this.updateNavItems();
          } else {
            this.loadLoginRights();
            this.updateNavItems();
          }
        },
        (error) => {
          console.error('Error fetching nav items:', error);
        }
      );
    }
  }

  private getDefaultMenu(): INavData[] {
    // Construct and return the default menu here
    return [
      {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'cil-speedometer' },
      },
      {
        name: 'Section Title Management',
        url: '/section-title-mangement',
        iconComponent: { name: 'cil-file' },
      },
      {
        name: 'Course Category',
        url: '/course-category',
        iconComponent: { name: 'cil-file' },
      },
      {
        name: 'Course',
        url: '/course',
        iconComponent: { name: 'cil-file' },
      },
      // {
      //     name: 'Hospitiality School Management',
      //     url: '/hospitiality-school-mangement',
      //     iconComponent: { name: 'cil-file' },
      // },
      {
        name: 'Master List',
        url: '/user',
        iconComponent: { name: 'cil-user' },
        children: [
          {
            name: 'Sub Admin List',
            url: '/user/userlist',
            iconComponent: { name: 'cil-group'}
          },
          {
            name: 'App User List',
            url: '/user/studentlist',
            iconComponent: { name: 'cil-people'}
          }
        ]
      },
      {
        name: 'User Management',
        url: '/user',
        iconComponent: { name: 'cil-file' },
        children: [
          {
            name: 'Sub Admin List',
            url: '/user/userlist',
            iconComponent: { name: 'cil-file'}
          },
          {
            name: 'App User List',
            url: '/user/studentlist',
            iconComponent: { name: 'cil-file'}
          }
        ]
      },
      {
        name: 'Course Management',
        url: '/course/courselist',
        iconComponent: { name: 'cil-file' },
      },
      {
        name: 'Chapter Management',
        url: '/chapter/chapterlist',
        iconComponent: { name: 'cil-notes' },
      },
      // {
      //   name: 'Video Management',
      //   url: '/videos/videolist',
      //   iconComponent: { name: 'cil-video' },
      // },
      {
        name: 'Coupon Management',
        url: '/coupon/couponlist',
        iconComponent: { name: 'cil-wallet' },
      },
      {
        name: 'Transaction List',
        url: '/transaction/transactionlist',
        iconComponent: { name: 'cil-money' },
      },
      {
        name: 'Report Management',
        url: '/report',
        iconComponent: { name: 'cil-vertical-align-bottom' },
      },
      {
        name: 'CMS Management',
        url: '/content/contentlist',
        iconComponent: { name: 'cil-clipboard' },
      },
      {
        name: 'Access Management',
        url: '/access/rolelist',
        iconComponent: { name: 'cil-settings' },
      }
    ];
  }

  private updateNavItems(): void {
    this.navItems = [];

    // Add menu items based on loginRights
    this.addMenuItem(this.dashboardManagmentMenu);
    // Add other menu items similarly...
  }

  private addMenuItem(menuItem: INavData): void {
    if (!menuItem || !menuItem.name) {
      console.error('Invalid menu item:', menuItem);
      return;
    }

    /**For Dashboard Management */
    this.navItems.push(this.dashboardManagmentMenu);

    /**For Section Title Management*/
    // if(this.getRole == 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.sectionTitleManagementMenu);
    // }

    /**For Master List Management*/
    if(this.getRole !== 'product_manager'){
    this.navItems.push(this.masterListManagmentMenu);
    }

    /**For Curators Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.curatorsManagementMenu);
    // }

    /**For Impact Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.contentManagementMenu);
    // }

    /**For Course Category Management*/
    if(this.getRole !== 'product_manager'){
      this.navItems.push(this.courseCategoryManagementMenu);
    }

    /**For Product Management*/
    if(this.getRole !==  'product_manager'){
    this.navItems.push(this.productManagementMenu);
    }
    
    /**For Upcoming Course Management */
    if(this.getRole !==  'product_manager'){
    this.navItems.push(this.upcomingCourseManagementMenu);
    }

    /**For Blog Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.blogManagementMenu);
    // }

    /**For Blog Category Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.blogCategoryManagementMenu);
    // }

    /**For Crucial Skill Set Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.crucialSkillManagementMenu);
    // }

    /**For Faq Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.faqManagementMenu);
    // }

    /**For Take Course Management*/
    // this.navItems.push(this.takeCourseManagementMenu);

    /**For Take Course Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.learnKordieHubManagementMenu);
    // }

    /**For Contact Us Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.contactUsManagementMenu);
    // }

    /**For Contact Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.contactManagementMenu);
    // }

    /**For Contact Banner Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.contactBannerManagementMenu);
    // }

    /**For Contact Banner Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.blogBannerManagementMenu);
    // }

    /**For Impact Management*/
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.impactManagementMenu);
    // }

    /**For About Management */
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.aboutManagementMenu);
    // }

    /**For Why Kordie Management */
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.whyKordieManagementMenu);
    // }

    /**For Profile Card Management */
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.profileCardManagmentMenu);
    // }

    /**For User Management */
    if(this.getRole !== 'product_manager'){
    this.navItems.push(this.userManagementMenu);
    }
    
    /**For Subscription Management */
    if(this.getRole !== 'product_manager'){
    this.navItems.push(this.subscriptionManagementMenu);
    }

    /**For Payment Management */
    if(this.getRole !== 'product_manager'){
    this.navItems.push(this.paymentManagementMenu);
    }

    /**For Course Equiry Management */
    if(this.getRole !== 'product_manager'){
    this.navItems.push(this.enquiryManagementMenu);
    }

    /**For Business Profile Management */
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.businessManagementMenu);
    // }

    /**For Exclusive Program Management */
    // if(this.getRole === 'product_manager' || this.getRole === 'admin'){
    this.navItems.push(this.exclusiveProgramManagmentMenu);
    // }

    /**Fo Customer Management */
    if(this.getRole !== 'product_manager'){
      this.navItems.push(this.customerManagement);
    }
    
    /**For Hospitiality School Management*/
    // this.navItems.push(this.hospitialitySchool);


    /**For User Management */
    const usersIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("users");
    if(this.loginRights[usersIndex]?.access?.create || this.loginRights[usersIndex]?.access?.read || this.loginRights[usersIndex]?.access?.update || this.loginRights[usersIndex]?.access?.delete)
    {
      //finalMenu.push(userManagmentMenu);
      this.navItems.push(this.userManagmentMenu);
    }

    /**For Course Management */
    const coursesIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("courses");
    if(this.loginRights[coursesIndex]?.access?.create || this.loginRights[coursesIndex]?.access?.read || this.loginRights[coursesIndex]?.access?.update || this.loginRights[coursesIndex]?.access?.delete)
    {
      this.navItems.push(this.courseManagmentMenu);
    }

    /**For Chapter Management */
    const chaptersIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("chapters");
    if(this.loginRights[chaptersIndex]?.access?.create || this.loginRights[chaptersIndex]?.access?.read || this.loginRights[chaptersIndex]?.access?.update || this.loginRights[chaptersIndex]?.access?.delete)
    {
      this.navItems.push(this.chapterManagmentMenu);
    }

    /**For Coupon Management */
    const couponIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("coupons");
    if(this.loginRights[couponIndex]?.access?.create || this.loginRights[couponIndex]?.access?.read || this.loginRights[couponIndex]?.access?.update || this.loginRights[couponIndex]?.access?.delete)
    {
      this.navItems.push(this.couponManagmentMenu);
    }

    /**For Transaction Mangement */
    const transactionsIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("transactions");
    if(this.loginRights[transactionsIndex]?.access?.create || this.loginRights[transactionsIndex]?.access?.read || this.loginRights[transactionsIndex]?.access?.update || this.loginRights[transactionsIndex]?.access?.delete)
    {
      this.navItems.push(this.transactionManagmentMenu);
    }

    /**For Report Mangement */
     const reportIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("report");
     if(this.loginRights[reportIndex]?.access?.create || this.loginRights[reportIndex]?.access?.read || this.loginRights[reportIndex]?.access?.update || this.loginRights[reportIndex]?.access?.delete)
     {
       this.navItems.push(this.reportManagmentMenu);
     }

    /**For Content Management */
    const contentsIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("contents");
    if(this.loginRights[contentsIndex]?.access?.create || this.loginRights[contentsIndex]?.access?.read || this.loginRights[contentsIndex]?.access?.update || this.loginRights[contentsIndex]?.access?.delete)
    {
      this.navItems.push(this.contentManagmentMenu);
    }

    /**For Role Management */
    const rolesIndex = this.loginRights.map(function(o : any) { return o.resource; }).indexOf("roles");
    if(this.loginRights[rolesIndex]?.access?.create || this.loginRights[rolesIndex]?.access?.read || this.loginRights[rolesIndex]?.access?.update || this.loginRights[rolesIndex]?.access?.delete)
    {
      this.navItems.push(this.accessManagmentMenu);
    }
  }

  setCurrentPage(){
    this._pageService.sendCurrentPage(1);
  }

  // Define menu items here...

}
