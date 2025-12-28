import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsRoutingModule } from './user-details-routing.module';
import { ListComponent } from './list/list.component';
import { ComponentsModule } from '../../../app/components/components.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { IconModule } from '@coreui/icons-angular';
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
import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from 'ckeditor4-angular';
import { CreateComponent } from './create/create.component';
import { EnrolledCourseListComponent } from './enrolled-course-list/enrolled-course-list.component';
import { PlanListComponent } from './plan-list/plan-list.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EnrolledCourseListComponent,
    PlanListComponent,
    RolePermissionComponent
  ],
  imports: [
    CommonModule,
    UserDetailsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonGroupModule,
    AlertModule,
    ModalModule,
    ToastModule,
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
    PlaceholderModule,
    ProgressModule,
    SpinnerModule,
    TabsModule,
    NavModule,
    TooltipModule,
    CarouselModule,
    FormModule,
    DropdownModule,
    PaginationModule,
    PopoverModule,
    TableModule,
    ComponentsModule,
    NgxEditorModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  exports:[
    CKEditorModule
  ]
})
export class UserDetailsModule { }
