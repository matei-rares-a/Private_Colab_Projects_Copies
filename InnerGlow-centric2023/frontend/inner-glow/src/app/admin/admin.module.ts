import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ArticleFormComponent } from './article-form/article-form.component';
import {MatGridListModule} from '@angular/material/grid-list';

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ArticleFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatGridListModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
