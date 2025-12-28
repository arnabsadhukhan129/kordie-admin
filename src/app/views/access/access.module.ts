import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxSpinnerModule } from "ngx-spinner";
import { ComponentsModule } from 'src/app/components/components.module';
import { IconModule } from '@coreui/icons-angular';

import { AccessRoutingModule } from './access-routing.module';

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
import { PermissionComponent } from './permission/permission.component';
import { RolelistComponent } from './rolelist/rolelist.component';
import { AddroleComponent } from './addrole/addrole.component';
import { RestrictedComponent } from './restricted/restricted.component';


@NgModule({
  declarations: [
    PermissionComponent,
    RolelistComponent,
    AddroleComponent,
    RestrictedComponent
  ],
  imports: [
    CommonModule,
    AccessRoutingModule,

    CommonModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
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
    NgxSpinnerModule
  ]
})
export class AccessModule { }
