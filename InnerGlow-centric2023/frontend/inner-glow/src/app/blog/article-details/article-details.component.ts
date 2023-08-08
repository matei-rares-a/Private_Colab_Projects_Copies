import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { SharedData } from 'src/app/shared-data.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

class Feedback {
  isValid: boolean = false;
  feedbackId: number = 0;
  commentId: number = 0;
  userId: number = 0;
  likeImage: string = '';
  dislikeImage: string = '';
  lastStatus: boolean = false;
  isLike: boolean = false;
}

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
})
export class ArticleDetailsComponent implements OnInit {
  @ViewChild('myInput') myInput!: ElementRef<HTMLInputElement>;
  loading:boolean=true;
  articleId!: string;
  imageBytecode?: string;
  imageSrcc?: string;
  loadingImage = true;
  defaultImageSrc = 'assets/loading-static.png';
  comments: any[] = [1, 2];
  my_comments: any[] = [1];

  indexCarousel: number = 0;
  sideImageToShow!: string;

  isInputDisabledMyComments: boolean[] = [];
  isInputDisabledComments: boolean[] = [];

  topImageSrc: string = 'assets/ImgBig.png';
  sideImagesSrc: string[] = [
    'assets/MaskGroup.png',
    'assets/img2.jpg',
    'assets/img3.jpg',
  ];
  eventDate: string = '';
  postDate: string = '';
  feedback: any[] = [];
  authorLetters: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sharedData: SharedData,
    private location: Location
  ) {}

  ngOnInit() {
    this.sideImageToShow = this.sideImagesSrc[0];
    this.route.params.subscribe((params) => {
      this.articleId = params['id']; 

      this.getArticle(
        'https://localhost:7207/api/Article/get/' + this.articleId
      );
    });
  }

  feedbackClass: Feedback[] = [];

  findIndexOfCommentById(id: number): number {
    for (let i = 0; i < this.article.comments.length; i++) {
      if (this.article.comments[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  findIndexFeedbackById(id: number): number {
    for (let i = 0; i < this.feedbackArray.length; i++) {
      if (this.feedbackArray[i].id === id) {
        return i;
      }
    }
    return -1;
  }
  findFeedbackByCommentIdAndUserId(
    commentId: number,
    userId: number
  ): any | undefined {
    const foundFeedback = this.feedbackArray.find(
      (item) => item.commentId === commentId && item.userId === userId
    );
    return foundFeedback; 
  }

  getLikeImage(commentId: number) {
    return this.feedbackClass[this.findIndexOfCommentById(commentId)].likeImage;
  }
  getDislikeImage(commentId: number) {
    return this.feedbackClass[this.findIndexOfCommentById(commentId)]
      .dislikeImage;
  }

  prepareArticle() {
    let imageBytecode = this.article.articleImages[0].content;
    if (imageBytecode && imageBytecode != null) {
      this.topImageSrc = imageBytecode;
    } else {
      this.topImageSrc = this.defaultImageSrc;
    }

    let sideImg: any[] = this.article.articleImages.slice(1);
    if (sideImg !== undefined && sideImg.length > 0) {
      this.sideImagesSrc = [];
      for (let img of sideImg) {
        this.sideImagesSrc.push(img.content);
      }
    }

    this.initializeCarousel();

    // this.statusFeedbackMy = this.article.comments.map(() => 0);
    // this.statusFeedback = this.article.comments.map(() => 0);

    let i = 0;
    for (let comment of this.article.comments) {
      this.feedbackClass.push(new Feedback());
      // this.feedbackClass[i].likeImage='assets\\like1.png'
      //  this.feedbackClass[i].dislikeImage='assets\\dislike1.png'
      i++;
    }

    i = 0;
    let alreadySet: number[] = [];
    for (let comm of this.article.comments) {
      const fed = comm.feedbacks;
      if (fed && fed.length > 0) {
        for (let fe of fed) {
          if (!alreadySet.includes(fe.commentId)) {
            
            if (fe.userId === this.sharedData.getUserId()) {
              console.log(' ale mele' + fe);
              this.feedbackClass[i].isValid = true;

              this.feedbackClass[i].userId = fe.userId;
              this.feedbackClass[i].commentId = fe.commentId;
              this.feedbackClass[i].isLike = fe.isLike;
              this.feedbackClass[i].lastStatus = fe.isLike;

              alreadySet.push(fe.commentId);

              if (fe.isLike) {
                this.setFeedbackImagesState(fe.commentId, 1);
              } else {
                this.setFeedbackImagesState(fe.commentId, 2);
              }

            } else {
              this.setFeedbackImagesState(fe.commentId, 0);
            }
          }
        }
      } else {
        //astea is undefined
        this.feedbackClass[i].isValid = false;
        this.feedbackClass[i].userId = fed.userId;
        this.feedbackClass[i].commentId = fed.commentId;
        this.feedbackClass[i].isLike = fed.isLike;
        this.feedbackClass[i].likeImage = 'assets\\like1.png';
        this.feedbackClass[i].dislikeImage = 'assets\\dislike1.png';
      }
      i++;

      this.feedback.push(comm.feedbacks);
    }

    console.log(this.article.comments.length);
    console.log(this.feedbackClass);

    this.feedbackArray = ([] as any[]).concat(...this.feedback);
    console.log(this.feedbackArray);

    this.comments = [];
    //se face vectorul de comentarii si de litere
    if (!this.sharedData.getUserLoggedInStatus()) {
      this.comments = this.article.comments;
      for (let comm of this.comments) {
        this.authorLetters.push(comm.authorComment[0]);
      }
    } else {
      for (let comm of this.article.comments) {
        if (comm.userId !== this.sharedData.getUserId()) {
          this.comments.push(comm);
          //this.othersFeedback.push(comm.feebacks)
        }
      }
      for (let comm of this.comments) {
        this.authorLetters.push(comm.authorComment[0]);
      }

      this.my_comments = [];
      for (let comm of this.article.comments) {
        if (comm.userId === this.sharedData.getUserId()) {
          this.my_comments.push(comm);
          //this.myFeedback.push(comm.feebacks)
        }
      }
    }

    // this.prepareFeedback();
  }

  feedbackArray: any[] = [];

  prepareFeedback() {
    // this.likeSrc = this.article.comments.map(() => 'assets\\like1.png');
    // this.dislikeSrc = this.article.comments.map(() => 'assets\\dislike1.png');
    // console.log(this.feedbackArray);
    /*
    for (let feed of this.feedbackArray) {

      if (this.sharedData.getUserId() === feed.userId) {
        if (feed.isLike) {
          this.setFeedbackImagesState(feed.commentId, 1);

        } else {
          this.setFeedbackImagesState(feed.commentId, 2);
        }
      }
    }
  */
  }

  changeFeedback(commentId: number, isLike: boolean) {
    let userId = this.sharedData.getUserId();
    let currentFeedback = this.findFeedbackByCommentIdAndUserId(
      commentId,
      userId!
    );
    let indexOfFeedback = this.findIndexOfCommentById(commentId);

    const currFed: Feedback = this.feedbackClass[indexOfFeedback];
    if (currFed.isValid === false) {
      if (isLike) {
        //inserez isLike=true
        this.insertFeedbacktPut(commentId, userId!, isLike);
        this.setFeedbackImagesState(commentId, 1);
        this.feedbackClass[indexOfFeedback].isValid = true;
        this.feedbackClass[indexOfFeedback].isLike = true;
        this.feedbackClass[indexOfFeedback].lastStatus = true;
        this.feedbackClass[indexOfFeedback].commentId = commentId;
      } else {
        this.insertFeedbacktPut(commentId, userId!, isLike);
        this.setFeedbackImagesState(commentId, 2);
        this.feedbackClass[indexOfFeedback].isValid = true;
        this.feedbackClass[indexOfFeedback].isLike = false;
        this.feedbackClass[indexOfFeedback].lastStatus = false;
        //inserez isLike=false
      }
    } else {
      if (currFed.isLike === false && !isLike) {
        //delete
        this.deleteFeedback(commentId, userId!);
        this.setFeedbackImagesState(commentId, 0);
        this.feedbackClass[indexOfFeedback].isLike = false;
        this.feedbackClass[indexOfFeedback].isValid = false;
      } else if (currFed.isLike === true && isLike) {
        //delete
        this.deleteFeedback(commentId, userId!);
        this.setFeedbackImagesState(commentId, 0);
        this.feedbackClass[indexOfFeedback].isLike = true;
        this.feedbackClass[indexOfFeedback].isValid = false;
      } else if (currFed.isLike === false && isLike) {
        //update la acel feeback
        this.updateFeedbackPut(commentId, userId!, isLike);

        /*
        this.deleteFeedback(commentId,userId!)
        this.insertFeedbacktPut(commentId,userId!,isLike)
        this.updateFortat(commentId,userId!,isLike)
*/

        this.setFeedbackImagesState(commentId, 1);
        this.feedbackClass[indexOfFeedback].isLike = true;
      } else if (currFed.isLike === true && !isLike) {
        //update pe acel feeback
        this.updateFeedbackPut(commentId, userId!, isLike);

        this.feedbackClass[indexOfFeedback].isLike = false;
        this.setFeedbackImagesState(commentId, 2);
      }
    }
  }

  setFeedbackImagesState(commentId: number, state: number) {
    //indexul e corespunzator cu indexul din this.article.comments
    const index = this.findIndexOfCommentById(commentId);
    // console.log(
    //   'indexul pentru schimbarea imaginii ' + index + ' si state ' + state
    // );
    switch (state) {
      case 0:
        this.feedbackClass[index].likeImage = 'assets\\like1.png';
        this.feedbackClass[index].dislikeImage = 'assets\\dislike1.png';

        break;
      case 1:
        this.feedbackClass[index].likeImage = 'assets\\like1-colored.png';
        this.feedbackClass[index].dislikeImage = 'assets\\dislike1.png';
        break;
      case 2:
        this.feedbackClass[index].likeImage = 'assets\\like1.png';
        this.feedbackClass[index].dislikeImage = 'assets\\dislike1-colored.png';
        break;

      default:
        this.feedbackClass[index].likeImage = 'assets\\like1.png';
        this.feedbackClass[index].dislikeImage = 'assets\\dislike1.png';
        break;
    }
  }

  deleteFeedback(commentId: number, userId: number) {
    const apiUrl = `https://localhost:7207/api/Feedback/get/delete`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });
    const data = {
      commentId: commentId,
      userId: userId,
      isLike: false, /// nu conteaza aici
    };

    this.http
      .delete(apiUrl, {
        headers: headers,
        body: data,
      })
      .subscribe(
        (response) => {
          console.log('feed delete successful:', response);
        },
        (error) => {
          console.error('feed delete error:', error);
        }
      );
  }
  updateFeedbackPut(commentId: number, userId: number, isLike: boolean) {
    const data = {
      commentId: commentId,
      userId: userId,
      isLike: isLike,
    };

    const url = `https://localhost:7207/api/Feedback/get/update`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http.put(url, data, { headers }).subscribe(
      (response) => {
        console.log('feed update cu succes:', response);
      },
      (error) => {
        console.error('Error update feed:', error);
      }
    );
  }

  insertFeedbacktPut(commentId: number, userId: number, isLike: boolean) {
    const data = {
      commentId: commentId,
      userId: userId,
      isLike: isLike,
    };
    const url = `https://localhost:7207/api/Feedback/get/insert`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http.put(url, data, { headers }).subscribe(
      (response) => {
        console.log('feed inserat cu succes:', response);
      },
      (error) => {
        console.error('feed inserat Error :', error);
      }
    );
  }

  isUserLogged() {
    return this.sharedData.getUserLoggedInStatus();
    // return true
  }

  editMyComment(index: number, text: string) {
    const data = {
      id: 0,
      userId: this.sharedData.getUserId(),
      content: text,
      createdAt: '',
      articleId: this.articleId,
    };

    const url = `https://localhost:7207/api/Comment/get/update/${this.my_comments[index].id}`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http.put(url, data, { headers }).subscribe(
      (response) => {
        console.log('Comment inserat cu succes:', response);
      },
      (error) => {
        console.error('Error inseration comment:', error);
      }
    );
  }

  isOwnerOfMyComment(): boolean {
    if (this.my_comments[0].userId == this.sharedData.getUserId()) {
      return true;
    } else {
      return false;
    }
    // return true;
  }

  isOwnerOfComment(index: number): boolean {
    if (this.comments[index].userId == this.sharedData.getUserId()) {
      return true;
    } else {
      return false;
    }
    // return true;
  }

  deleteComment(index: number) {
    const apiUrl = `https://localhost:7207/api/Comment/get/delete/${this.comments[index].id}`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http
      .delete(apiUrl, {
        headers: headers,
      })
      .subscribe(
        (response) => {
          console.log('Delete comment successful:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred during delete request:', error);
        }
      );
  }

  deleteMyComment(index: number) {
    this.my_comments[index];

    const apiUrl = `https://localhost:7207/api/Comment/get/delete/${this.my_comments[index].id}`;
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http
      .delete(apiUrl, {
        headers: headers,
      })
      .subscribe(
        (response) => {
          console.log('Delete comment successful:', response);
          window.location.reload();
        },
        (error) => {
          console.error('Error occurred during delete request:', error);
        }
      );
  }

  getArticle(url: string) {
    this.http
      .get(url)
      .pipe(
        map((response: any) => {
          return JSON.parse(JSON.stringify(response));
        })
      )
      .subscribe(
        (responseObject: any) => {
          this.article = responseObject;
          console.log('Articolul mare');
          console.log(this.article);

          this.prepareArticle();
          //this.makeGetFeedbacks();
          this.loading=false
        },
        (error) => {
          console.error('Failed to fetch data:', error);
        }
      );
  }

  isCreatorOfArticle(): boolean {
    if (
      this.sharedData.getUserLoggedInStatus() &&
      this.sharedData.isUserCreator() &&
      this.sharedData.getUserId() === this.article.authorId
    ) {
      return true;
    } else {
      return false;
    }
  }

  handleDeleteArticle() {
    const apiUrl = 'https://localhost:7207/api/Article/deleteArticle';
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http
      .delete(apiUrl, {
        headers: headers,
        params: { id: this.articleId },
      })
      .subscribe(
        (response) => {
          console.log('articol delete successful:', response);
          this.router.navigate(['/blog/my-blogs']);
        },
        (error) => {
          console.error('Error occurred during delete request:', error);
        }
      );
  }

  getUserFirstLetter(id: number, isUser: boolean) {
    return this.sharedData.getUsername()[0];
  }

  getMyUsername() {
    return this.sharedData.getUsername();
  }

  handleEdit() {
    this.sharedData.currentArticle = this.article;
    this.router.navigate(['/admin/form'], { queryParams: { state: 'edit' } });
  }

  toggleInput(index: number, text: string): void {
    this.isInputDisabledMyComments[index] =
      !this.isInputDisabledMyComments[index];
    if (this.isInputDisabledMyComments[index] === false) {
      window.location.reload();
      this.editMyComment(index, text);
    }
  }

  formatDate(inputString: string, hourExists: boolean): string {
    const date = new Date(inputString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    if (hourExists == false) {
      return `${day}-${month}-${year}`;
    } else {
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
  }

  initializeCarousel() {
    this.sideImageToShow = this.sideImagesSrc[this.indexCarousel];
  }

  prevImage() {
    this.indexCarousel--;

    if (this.indexCarousel < 0) {
      this.indexCarousel = this.sideImagesSrc.length - 1;
    }
    this.sideImageToShow = this.sideImagesSrc[this.indexCarousel];
  }

  nextImage() {
    this.indexCarousel++;
    if (this.indexCarousel >= this.sideImagesSrc.length) {
      this.indexCarousel = 0;
    }
    this.sideImageToShow = this.sideImagesSrc[this.indexCarousel];
  }

  commentText: string = '';

  onPostComment() {
    const comment: string = this.commentText;

    const data = {
      id: 0,
      userId: this.sharedData.getUserId(),
      content: comment,
      createdAt: '',
      articleId: this.articleId,
    };
    const url = 'https://localhost:7207/api/Comment/get/insert';
    const headers = new HttpHeaders({
      Authorization: localStorage.getItem('token')!.toString(),
    });

    this.http.put(url, data, { headers }).subscribe(
      (response) => {
        console.log('Comment inserat cu succes:', response);
        this.commentText = '';
        window.location.reload();
      },
      (error) => {
        console.error('Error inseration comment:', error);
      }
    );
  }

  article: any = {
    id: '',
    title: 'Event name',
    publicateDate: '2023-07-22T12:00:28.689',
    author: 'Alex Alexandru',
    authorId: 0,
    content:
      'Wellness is a concept that refers to a balanced and healthy lifestyle that combines physical, mental and emotional aspects of well-being. It is an active process by which a person takes responsibility for his own health and pursues his overall well-being.\nFirst and foremost, physical wellness involves adopting healthy habits such as a balanced diet, regular exercise, and adequate rest. Choosing a nutritious diet rich in fruits, vegetables, quality protein and healthy fats can help you maintain a healthy weight and prevent conditions such as obesity, diabetes and heart disease. Regular physical activity, such as walking, running, swimming or working out in the gym, can improve general health, flexibility, muscle strength and cardiovascular health.A holistic approach to wellness involves self-care in multiple aspects of life, such as physical, emotional, mental and spiritual health. It focuses on cultivating a healthy lifestyle that involves making smart choices about nutrition, physical activity, rest, stress management, and interpersonal  wellness refers to maintaining optimal body health. It includes a balanced diet, regular exercise, adequate rest, and taking care of the body through various methods, such as personal hygiene, skin care, and regular visits to the doctor for routine examinations.',
    city: 'Iasi',
    dateOfTheEvent: '2023-07-22T12:00:28.689',
    facebook: 'facebook.com/sample1',
    twitter: 'twitter.com/sample1',
    instagram: 'instagram.com/sample1',
    categories: ['Technology', 'Yoga'],
    articleImages: [
      {
        content: '',
      },
    ],
    comments: [],
  };
}
