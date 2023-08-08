import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs';
import { SharedData } from 'src/app/shared-data.service';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { format } from 'date-fns';


class CustomFile {
  content: string;
  nameOfFile: string;

  constructor(content: string, nameOfFile: string) {
    this.content = content;
    this.nameOfFile = nameOfFile;
  }
}


@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements AfterViewInit  {
  state!: string
  article!:any
  areOptionsVisible: boolean = false;
  selectedOptionsCategory: string[] = [];
  optionsCategory: string[] = [
    'Yoga',
    'Spa',
    'Meditation',
    'Zumba',
    'Nutrition',
  ];
  areOptionsVisibleCity: boolean = false;
  selectedOptionsCity: string[] = [];
  formData: any = {}; 
  currentDate: string;
  filesToUpload: CustomFile[] = [];

 
  
  isCategorySelectionValid = false;
  constructor(private formBuilder: FormBuilder,private cookieService:CookieService,private http:HttpClient,private router:Router,private route: ActivatedRoute,private sharedData:SharedData){
    this.currentDate = new Date().toISOString().slice(0, 10);
    
  }
  myForm!: FormGroup;

  ngOnInit(){
    this.myForm = this.formBuilder.group({
      text1: ['', Validators.required],
      text2: ['', Validators.required],
      date:['', [Validators.required, this.validateDateNotEmpty]],
      city: ['', Validators.required]
      
    });
  }
  validateDateNotEmpty(control: { value: any; }) {
    const dateValue = control.value;
    if (!dateValue) {
      return { dateNotSelected: true };
    }
    return null;
  }

  ngAfterViewInit() {
    console.log("view")

    try{
    this.route.queryParams.subscribe(params => {
      this.state = params['state'];
      console.log(this.state); // Use JSON.stringify() with pretty-printing (2 spaces indentation)
    });

    if(this.state==='edit'){
      
      
      //(<HTMLTextAreaElement>document.getElementById('text1')).value = this.sharedData.currentArticle.title ;
     // (<HTMLTextAreaElement>document.getElementById('text2')).value= this.sharedData.currentArticle.content ;
      setTimeout(() => {
        this.selectedOptionsCategory = this.sharedData.currentArticle.categories;
      }, 10) as unknown as number;
     // (<HTMLTextAreaElement>document.getElementById('city')).value= this.sharedData.currentArticle.city ;

     
      const dateofEv:Date= new Date(this.sharedData.currentArticle.dateOfTheEvent);

     // (<HTMLInputElement>document.getElementsByName('date')[0]).value=  this.sharedData.currentArticle.dateOfTheEvent ;
      (<HTMLInputElement>document.getElementsByName('fb')[0]).value= this.sharedData.currentArticle.facebook ;
      (<HTMLInputElement>document.getElementsByName('tt')[0]).value= this.sharedData.currentArticle.twitter ;
       (<HTMLInputElement>document.getElementsByName('ins')[0]).value= this.sharedData.currentArticle.instagram ;
        
       const articlesImages: any[] = this.sharedData.currentArticle.articleImages;

       setTimeout(() => {
        for (let i = 0; i < articlesImages.length; i++) {
          const fileToUpload = {
            content: articlesImages[i].content,
            nameOfFile: `file${i + 1}`, 
          };
          this.filesToUpload.push(fileToUpload);
        }

       //this.filesToUpload.push( {content: this.sharedData.currentArticle.articleImages[0].content as string , nameOfFile:"file1"});
      }, 10) as unknown as number;


      this.myForm = this.formBuilder.group({
        text1: [ this.sharedData.currentArticle.title, Validators.required],
        text2: [this.sharedData.currentArticle.content, Validators.required],
        date:[format(dateofEv, 'yyyy-MM-dd'), [Validators.required, this.validateDateNotEmpty]],
        city: [this.sharedData.currentArticle.city, Validators.required]
        
      });

      this.myForm.updateValueAndValidity();
      // const dateInputElement = document.getElementById('date') as HTMLInputElement;
      // dateInputElement.valueAsDate = new Date(this.sharedData.currentArticle.dateOfTheEvent);
      }
    }
    catch(error){}
  }

  addFile(file:File){
    if (
      file.type.includes('image/png') ||
      file.type.includes('image/jpeg') ||
      file.type.includes('image/jpg')
    ) {
      this.getEncodedFile(file)
      .then((base64String) => {
        this.filesToUpload.push({content:base64String, nameOfFile:file.name });
      })
      .catch((error) => {
        console.error(error);
      });

      //this.filesToUpload.push(file);
    } else {
      console.warn(`File ${file.name} is not an image and it has been discarded.`);
    }
  }

  onFileSelected(event: any) {
   if (event.target.files && event.target.files.length > 0) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.addFile(file)     
    }
  }
  }

 async getEncodedFile(filee:File){
  const file: File = filee;
  if (file) {
    try {
      const base64Data = await fileToBase64(file);
      return base64Data
    } catch (error) {
      console.error(error);
      return ""
    }
  }
  return ""
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const files = event.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.addFile(file)
        //this.filesToUpload.push(file);
      }
    }
  }

  discardFile(nameOfFile: string) {
    this.filesToUpload = this.filesToUpload.filter(f => f.nameOfFile !== nameOfFile);
  }

  @ViewChild('customSelect', { static: true }) customSelect!: ElementRef;
  toggleOptionsVisibilityCategory(isVisible: boolean) {
    this.areOptionsVisible = isVisible;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.customSelect.nativeElement.contains(event.target)) {
      this.areOptionsVisible = false;
    }
  }
 

  getSelectedDisplayCategory(): string {
    if (this.selectedOptionsCategory.length === 0) {
      this.isCategorySelectionValid = false; 
      return 'Please select at least one option'; 
    } else if (this.selectedOptionsCategory.length === 1) {
      this.isCategorySelectionValid = true; 
      return this.selectedOptionsCategory[0];
    } else {
      this.isCategorySelectionValid = true; 
      return this.selectedOptionsCategory[0] + '...';
    }
  }
  toggleSelectionCategory(option: string) {
    if (this.selectedOptionsCategory.includes(option)) {
      this.selectedOptionsCategory = this.selectedOptionsCategory.filter(
        (selectedOptionsCategory) => selectedOptionsCategory !== option
      );
    } else {
      this.selectedOptionsCategory.push(option);
    }
  }
  selectDisabled: boolean = true;
  disableSelect(disabled: boolean): void {
    this.selectDisabled = disabled;
  }
  isOptionSelected(): boolean {
    return this.selectedOptionsCategory.length > 0;
  }



  


   onSubmit() {
    //pregatire date
    const title = (<HTMLTextAreaElement>document.getElementById('text1')).value ;
    const content = (<HTMLTextAreaElement>document.getElementById('text2')).value;
    const categories =this.selectedOptionsCategory.length === 0 ? [''] : this.selectedOptionsCategory
    const city = (<HTMLTextAreaElement>document.getElementById('city')).value;
    const dateOfTheEvent = (<HTMLInputElement>document.getElementsByName('date')[0]).value;
    const facebook = (<HTMLInputElement>document.getElementsByName('fb')[0]).value;
    const twitter = (<HTMLInputElement>document.getElementsByName('tt')[0]).value;
    const instagram = (<HTMLInputElement>document.getElementsByName('ins')[0]).value;
     const datepipe=new DatePipe('en-US')
    const currentDate= datepipe.transform(new Date(), 'yyyy-MM-dd')!.toString();

   // const publicationDate =null//= this.datePipe.transform(currentDate, 'yyyy-MM-ddTHH:mm:ss.SSS');
    const authorId=this.sharedData.getUserId()
    console.log(dateOfTheEvent)
    console.log(currentDate)
    //

    //pregatire imagini


    let articleImages:any[]=[]
    if(this.filesToUpload.length !==0 ){
      for(let i =0; i< this.filesToUpload.length;i++){
        articleImages.push({content:this.filesToUpload[i].content})
      }
    }
    else{
      articleImages.push({content:""})
    }
    console.log(articleImages)


    //pregatire json
    this.formData = {
      title, //aici face:    title: title
      publicationDate: currentDate,
      content,
      city,
      dateOfTheEvent,
      facebook,
      twitter,
      instagram,
      authorId,
      categories,
      articleImages: articleImages
    };
    
    
    if(this.state==='edit'){
        console.log("send update")
        const articleID= this.sharedData.currentArticle.id
        console.log(articleID)
        const token= localStorage.getItem('token')!.toString()
        

        
        this.router.navigate(['/loading']); 

        this.http.put(`https://localhost:7207/api/Article/updateArticle/${articleID}`,this.formData,
        {
          headers: {
            'Authorization': token
          }
        }).pipe(
          map((response: any) => {
            return JSON.parse(JSON.stringify(response));
          })
        ).subscribe(
          (responseObject: any) => {
            console.log('S-a facut update:', responseObject);


            this.router.navigate(['/blog/articles']); 

            return
          },
          (error) => {
            console.error('Nu s-a facut update:', error);
            return
          }
        );
        return
      }

      else{
        const token= localStorage.getItem('token')!.toString()

          console.log(this.formData); 
          
          this.router.navigate(['/loading']); 

          this.http.post(`https://localhost:7207/api/Article/createArticle`,this.formData,
          {
            headers: {
              'Authorization': token
            }
          }).pipe(
            map((response: any) => {
              return JSON.parse(JSON.stringify(response));
            })
          ).subscribe(
            (responseObject: any) => {
              console.log('S-a postat:', responseObject);

              this.router.navigate(['/blog/articles']); 

            },
            (error) => {
              console.error('Nu s-a postat:', error);
            }
          );
        }
}



}



function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to convert file to base64."));
    };
    reader.readAsDataURL(file);
  });
}

