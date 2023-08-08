import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators,ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  formGroup: FormGroup = new FormGroup({});
  constructor(private http: HttpClient,private router:Router) {}


  ngOnInit() {
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]),
      confirm: new FormControl('', [Validators.required]),
    }, { validators: passwordMatchValidator }); 
  }

  submitForm() {
    if (this.formGroup.valid) {
      const requestData = {
        name: this.formGroup.get('name')?.value,
        email: this.formGroup.get('email')?.value,
        password: this.formGroup.get('password')?.value
      };
  
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 826' 
        })
      };

      this.router.navigate(['/loading']);
  
      this.http.post<any>('https://localhost:7207/api/User/createAcount', requestData, httpOptions)
        .subscribe(
          (response) => {
            console.log('Răspuns de la server:', response);
            this.router.navigate(['/successfully']);

          },
          (error) => {
            console.error('Eroare la cerere:', error);
            this.router.navigate(['/error-cont']);
          }
        );
    }
  }
  }

export const passwordMatchValidator : ValidatorFn = (control: AbstractControl) : ValidationErrors | null =>{
  const password = control.get('password');
  const confirmpassword = control.get('confirm');

  const isPasswordMatching = password && confirmpassword && password?.value === confirmpassword?.value;
 
  return !isPasswordMatching
          ? { passwordMatchError : true }
          : null; 
}

