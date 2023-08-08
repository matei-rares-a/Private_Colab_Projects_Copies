import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  formGroup: FormGroup = new FormGroup({});
  constructor(private http: HttpClient,private router:Router) {}
  formData = { 
    name: '',
    subject: '',
    message: '',
    email: ''
  };

  ngOnInit() {
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]), 

    }); 
  }
  
  onSubmit() {


    this.router.navigate(['/loading']);

    const url = 'https://localhost:7207/api/Contact/sendFeedback';
    console.log(this.formData)
    this.http.post(url, this.formData).subscribe(
      (response) => {
        console.log('POST request successful:', response);
        this.router.navigate(['/thank-you']);
      },
      (error) => {
        console.error('Error making POST request:', error);
      }
    );
  }
}
