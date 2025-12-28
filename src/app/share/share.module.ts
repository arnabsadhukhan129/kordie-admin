import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TruncatePipe} from '../custom-pipe/truncate.pipe';


@NgModule({
  declarations: [
    TruncatePipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TruncatePipe
  ]
})
export class ShareModule { }
