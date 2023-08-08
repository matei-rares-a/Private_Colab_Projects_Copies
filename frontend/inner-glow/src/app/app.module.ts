import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER, TuiButtonModule } from "@taiga-ui/core";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HttpClientModule } from  '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { TopbarComponent } from './shared/topbar/topbar.component';
// import {TuiInputDateModule} from '@taiga-ui/kit';
import {ReactiveFormsModule} from '@angular/forms';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatInputModule} from '@angular/material/input';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatNativeDateModule} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { ForgotpasswordComponent } from "./forgotpassword/forgotpassword.component";
import { ThankYouComponent } from './thank-you/thank-you.component';
import { InvalidComponent } from './invalid/invalid.component';
import { RecoveryaccountComponent } from "./recoveryaccount/recoveryaccount.component";
import { CheckcodeComponent } from './checkcode/checkcode.component';
import { CommonModule } from "@angular/common";
import { CookieService } from "ngx-cookie-service";
import { SharedData } from "./shared-data.service";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SuccessfullyComponent } from './successfully/successfully.component';
import { LoadingComponent } from './loading/loading.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ErrorContComponent } from './error-cont/error-cont.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { BadrequestComponent } from './badrequest/badrequest.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    ContactUsComponent,
    TopbarComponent,
    ForgotpasswordComponent,
    ThankYouComponent,
    InvalidComponent,
    RecoveryaccountComponent,
    CheckcodeComponent,
    SuccessfullyComponent,
    LoadingComponent,
    UnauthorizedComponent,
    ErrorContComponent,
    ChangepassComponent,
    BadrequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    TuiRootModule,
    ReactiveFormsModule,
    CommonModule,
    SweetAlert2Module
    
    
    // TuiDialogModule,
    // TuiAlertModule,
    // TuiButtonModule,
    // TuiInputDateModule,MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule
],
  providers: [{provide: TUI_SANITIZER, useClass: NgDompurifySanitizer}],
  bootstrap: [AppComponent]
})
export class AppModule {
 }
