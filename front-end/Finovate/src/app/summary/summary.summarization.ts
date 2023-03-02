import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent,HttpEventType} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'summarization',
  templateUrl: './summary.summarization.html',
  styleUrls: ['./summary.summarization.css']
})
export class AppSummarizationComponent {
  
  fileName = '';
  summaryList = [];
  showLoader = false;
  //summaryFinalList = [];
  summaryFinalList: any[] =[];
  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {

      const file:File = event.target.files[0];

      if (file) {
          this.showLoader = true;
          this.fileName = file.name;
          
          const formData = new FormData();

          formData.append("file", file);
          //var option = {'Content-Length' : msg.length, 'Content-Type': 'plain/text', 'body' : msg};

          const upload$ = this.http.post("http://127.0.0.1:5000/upload", formData);
          let map = new Map();  
  
          map.set('cash flow', 'cash flow tooltip');     

          upload$.subscribe((data: any) => {

            this.summaryList = data["summaryOfFile"]
            for (var index in this.summaryList) {
              let summary :any = this.summaryList[index];
              console.log('summary :' + summary);
              let newSummary : any = summary.replace('UBS', '<div class="tooltip"> '+ 'cash flow' +' <span class="tooltiptext"> ' +'tootltip test' + ' </span> </div>');
              // summaryFinalList.push(newSummary)
              this.summaryFinalList.push(newSummary);
              // prints values: 10, 20, 30, 40
            }
            
            

            // for (var summary: any of this.summaryList) {
            //   summary.replace(re, "oranges"); 
            //   console.log(summary); // prints values: 10, 20, 30, 40
            // }
            
            this.showLoader = false
            console.log('data',this.summaryFinalList)
          }, (error) => {
            console.log("error",error)
          });
      }

  
}

}