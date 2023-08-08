import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { FilterComponent } from './shared/filter/filter.component';
import { CardComponent } from './shared/card/card.component';
import { PaginatorComponent } from './shared/paginator/paginator.component';
import {TuiInputDateModule} from '@taiga-ui/kit';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { FavoritesComponent } from './favorites/favorites.component';
import { MyBlogsComponent } from './my-blogs/my-blogs.component';
import { FormsModule } from '@angular/forms';
import { MyCardComponent } from './shared/my-card/my-card.component';
import { FavoriteCardComponent } from './shared/favorite-card/favorite-card.component';

//grid
import {MatGridListModule} from '@angular/material/grid-list';




@NgModule({
  declarations: [
    ArticlesComponent,
    ArticleDetailsComponent,
    FilterComponent,
    CardComponent,
    PaginatorComponent,
    FavoritesComponent,
    MyBlogsComponent,
    MyCardComponent,
    FavoriteCardComponent
    
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    ReactiveFormsModule,
    TuiInputDateModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,FormsModule, MatGridListModule
  ],

  exports:[]
})
export class BlogModule { }
