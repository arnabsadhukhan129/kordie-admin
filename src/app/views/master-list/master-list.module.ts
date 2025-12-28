import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MasterListRoutingModule } from './master-list-routing.module';
import { TopicComponent} from '../master-list/Topic/topic/topic.component';
import { TimeToCompleteComponent } from '../master-list/Time-to-complete/time-to-complete/time-to-complete.component';
import { GoalComponent } from '../master-list/Goal/goal/goal.component';
import { TypeComponent } from '../master-list/Type/type/type.component'
import { ComponentsModule } from '../../../app/components/components.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { IconModule } from '@coreui/icons-angular';
import { ShareModule } from '../../share/share.module';
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
import { AddEditTopicComponent } from './Topic/add-edit-topic/add-edit-topic.component';
import { AddEditTimeComponent } from './Time-to-complete/add-edit-time/add-edit-time.component';
import { AddEditGoalComponent } from './Goal/add-edit-goal/add-edit-goal.component';
import { AddEditTypeComponent } from './Type/add-edit-type/add-edit-type.component';
import { TaughyByComponent } from './Taught-By/taughy-by/taughy-by.component';
import { AddEditTaughtByComponent } from './Taught-By/add-edit-taught-by/add-edit-taught-by.component';
import { IndustryComponent } from './Industry/industry/industry.component';
import { AddEditIndustryComponent } from './Industry/add-edit-industry/add-edit-industry.component';
import { InterestComponent } from './Interest/interest/interest.component';
import { AddEditInterestComponent } from './Interest/add-edit-interest/add-edit-interest.component';
import { ListComponent } from './blog-type/list/list.component';
import { CreateComponent } from './blog-type/create/create.component';

@NgModule({
  declarations: [
    TopicComponent,
    TimeToCompleteComponent,
    GoalComponent,
    TypeComponent,
    AddEditTopicComponent,
    AddEditTimeComponent,
    AddEditGoalComponent,
    AddEditTypeComponent,
    TaughyByComponent,
    AddEditTaughtByComponent,
    IndustryComponent,
    AddEditIndustryComponent,
    InterestComponent,
    AddEditInterestComponent,
    ListComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MasterListRoutingModule,
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
    CKEditorModule,
    ShareModule
  ],
  exports:[
    CKEditorModule
  ]
})
export class MasterListModule { }
