import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';
import {
    AccordionModule,
    ButtonModule,
    NavModule,
    PaginationModule,
    SharedModule,
} from '@coreui/angular';

@NgModule({
    declarations: [
        PaginationComponent,
    ],
    imports: [
        CommonModule,
        AccordionModule,
        ButtonModule,
        NavModule,
        PaginationModule,
        SharedModule,
    ],
    exports: [
        PaginationComponent,
    ],
    providers: [],
})
export class ComponentsModule { }