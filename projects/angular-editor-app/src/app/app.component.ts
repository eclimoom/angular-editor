import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Observable, throwError} from 'rxjs';
import {AngularEditorConfig} from "../../../angular-editor/src/lib/config";
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';

  form: FormGroup;

  htmlContent1 = '';

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    // defaultFontName: 'Comic Sans MS',
    // defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    // customClasses: [
    //   {
    //     name: 'quote',
    //     class: 'quote',
    //   },
    //   {
    //     name: 'redText',
    //     class: 'redText'
    //   },
    //   {
    //     name: 'titleText',
    //     class: 'titleText',
    //     tag: 'h1',
    //   },
    // ],
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        // 'underline',
        // 'strikeThrough',
        // 'subscript',
        // 'superscript',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        'heading',
        'fontName'
      ],
      [
        'fontSize',
        // 'textColor',
        'backgroundColor',
        // 'customClasses',
        'link',
        'unlink',
        // 'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        // 'removeFormat',
        'toggleEditorMode',
      ]
    ],
    upload: (file:any) => {
      return this.uploadWithProgress(file).pipe(
        map( (event:any) => {  // NOTE: response is of type SomeType
          if(event instanceof HttpResponse){
            return {...event, body: {imageUrl: event.body.data}}; // kind of useless
          }
          return event;
        }),
        catchError( error => {
          return throwError(error); // From 'rxjs'
        })
      );
    }
  };

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    console.log(this.htmlContent1);
  }

  onChange(event) {
    console.log('changed');
  }

  onBlur(event) {
    console.log('blur ' + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }

  uploadWithProgress(file: any): Observable<HttpEvent<any>> {
    const formData: any = new FormData();
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    formData.append('file', file);
    const req = new HttpRequest('POST', `/admin/up/image`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

}
