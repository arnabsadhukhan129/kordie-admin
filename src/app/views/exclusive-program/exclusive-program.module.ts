import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExclusiveProgramRoutingModule } from './exclusive-program-routing.module';
import { Program1ListComponent } from './program1/program1-list/program1-list.component';
import { Program2ListComponent } from './program2/program2-list/program2-list.component';
import { Program3ListComponent } from './program3/program3-list/program3-list.component';
import { ComponentsModule } from '../../../app/components/components.module';
import { NgxSpinnerModule } from "ngx-spinner";
import { IconModule } from '@coreui/icons-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
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
import { CreateComponent } from './create-program1/create/create.component';
import { ViewComponent } from './view-program1/view/view.component';
import { CreateProgram2Component } from './create-program2/create-program2.component';
import { ViewComponent2 } from './view-program2/view/view.component';
import { CreateProgram3Component } from './create-program3/create-program3.component';
import { ViewComponent3Component } from './view-program3/view-component3/view-component3.component';

@NgModule({
  declarations: [
    Program1ListComponent,
    Program2ListComponent,
    Program3ListComponent,
    CreateComponent,
    ViewComponent,
    CreateProgram2Component,
    ViewComponent2,
    CreateProgram3Component,
    ViewComponent3Component
  ],
  imports: [
    CommonModule,
    ExclusiveProgramRoutingModule,
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
        NgMultiSelectDropDownModule.forRoot()
      ],
      exports:[
        CKEditorModule
      ]
})
export class ExclusiveProgramModule { }
