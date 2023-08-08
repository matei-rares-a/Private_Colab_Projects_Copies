import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleFormComponent } from './article-form/article-form.component';

const routes: Routes = [{
  path:'form',
  component: ArticleFormComponent
}, {
  path: '**',
  redirectTo: 'form'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
