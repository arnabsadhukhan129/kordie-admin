import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeAreTrustedRoutingModule } from './we-are-trusted-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { ComponentsModule } from 'src/app/components/components.module';
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


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    WeAreTrustedRoutingModule,
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
export class WeAreTrustedModule { }
