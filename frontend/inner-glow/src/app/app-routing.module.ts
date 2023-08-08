import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { RecoveryaccountComponent } from './recoveryaccount/recoveryaccount.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { InvalidComponent } from './invalid/invalid.component';
import { CheckcodeComponent } from './checkcode/checkcode.component';
import { Guardian } from './gardian.guard';
import { SuccessfullyComponent } from './successfully/successfully.component';
import { LoadingComponent } from './loading/loading.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ErrorContComponent } from './error-cont/error-cont.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { BadrequestComponent } from './badrequest/badrequest.component';
//TODO poate trebuie gardian si la altele
const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'badrequest',
    component: BadrequestComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'changepass',
    component: ChangepassComponent
  },
  {
    path: 'error-cont',
    component: ErrorContComponent
  },
  {
    path: 'recoveryaccount',
    component: RecoveryaccountComponent
  },
  {
    path: 'invalid',
    component: InvalidComponent
  },
  {
    path:'thank-you',
    component: ThankYouComponent
  },
  {
    path:'successfully',
    component: SuccessfullyComponent
  },
  {
    path:'loading',
    component: LoadingComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  {
    path:'checkcode',
    component: CheckcodeComponent
  },
  {
    path: 'blog',
    canActivate: [Guardian],

    loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule)
  },
  {
    path: 'admin',
    canActivate: [Guardian],

    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
