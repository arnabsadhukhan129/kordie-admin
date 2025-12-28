import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@coreui/icons-angular';

import { UserRoutingModule } from './user-routing.module';
import { UserlistComponent } from './userlist/userlist.component';
import { StudentlistComponent } from './studentlist/studentlist.component';

import {
  AccordionModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  CollapseModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  NavModule,
  PaginationModule,
  PlaceholderModule,
  PopoverModule,
  ProgressModule,
  SharedModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule,
  ButtonGroupModule,
  AlertModule,
  ModalModule,
  ToastModule,
} from '@coreui/angular';

import { FileSaverModule } from 'ngx-filesaver';


import { EdituserComponent } from './edituser/edituser.component';
import { AdduserComponent } from './adduser/adduser.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ViewuserComponent } from './viewuser/viewuser.component';


@NgModule({
  declarations: [
    UserlistComponent,
    StudentlistComponent,
    EdituserComponent,
    AdduserComponent,
    ProfileComponent,
    ChangepasswordComponent,
    ViewuserComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UserRoutingModule,
    ButtonGroupModule,
    AlertModule,
    ModalModule,
    ToastModule,
    CommonModule,
    // BaseRoutingModule,
    AccordionModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonModule,
    CardModule,
    CollapseModule,
    GridModule,
    UtilitiesModule,
    SharedModule,
    ListGroupModule,
    IconModule,
    ListGroupModule,
    PlaceholderModule,
    ProgressModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    // ReactiveFormsModule,
    // FormsModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    // DocsComponentsModule,
    ComponentsModule,
    FileSaverModule
  ]
})
export class UserModule { }
