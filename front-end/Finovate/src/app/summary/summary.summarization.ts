import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent,HttpEventType} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'summarization',
  templateUrl: './summary.summarization.html',
  styleUrls: ['./summary.summarization.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppSummarizationComponent {
  size=0;
  fileName = '';
  summaryList: any = [];
  showLoader = false;
  dict: any = {
    revenue: "revenue def",
    revenues: "revenues def",
    shape: "blah!!!",
    something: "...",
    income: "sjnjsdc",
    profits: "sdcds",

    effective: {
      space: {
        tax: "njsn"
      }
    },
    tax: {
      space: {
        rate: "Sfdf"
      }
    },
    cash: {
      space: {
        flow: "njx",
        flows:"dcd"
      }
    },
    capital: {
      space: {
        ratio: "tooltip capital ration"
      }
    },
    net: {
      space: {
        income: "net income def",
        profit: "tooltip net profit",
        sales: "net sales"
      }
    },
    operating: {
      space: {
        expenses:"test",
        cash: "dsfd"

      }
    },
    diluted: {
      space: {
        earnings: "test"

      }
    },
    tangible: {
      space:{
        equity:"test"

      }
    }
  };
  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {

      const file:File = event.target.files[0];

      if (file) {
          this.showLoader = true;
          this.fileName = file.name;
          
          const formData = new FormData();

          formData.append("file", file);
          //var option = {'Content-Length' : msg.length, 'Content-Type': 'plain/text', 'body' : msg};

          const upload$ = this.http.post("http://192.168.211.65:5000/upload", formData);
          let map = new Map();  
  
          map.set('cash flow', 'cash flow tooltip');     

          upload$.subscribe((data: any) => {
            let obj = {
              "summaryOfFile": [
                " \n\nThis quarterly financial report presents a summary of the financial results of our company for the third quarter of 2020. The report provides an overview of revenue, operating expenses, net profit/loss, and other key metrics. It also includes commentary on significant changes or trends in the company's financial performance.",
                " This Quarterly Financial Report / Third Quarter 2020 contains key figures, information about the company, share performance, an interim management report, consolidated interim financial statements, notes to the financial statements, and additional information.",
                " \n This Quarterly Financial Report presents the key figures for Q3 2020 and Q3 2019, as well as Q1-Q3 2020 and Q1-Q3 2019. The total sales decreased by 2.7% from 156,225 K\u20ac to 152,007 K\u20ac, operating profit increased by 0.5% from 16,059 K\u20ac to 16,138 K\u20ac, EBIT margin increased by 0.3 Pp from 10.3 to 10.6, net income decreased by 1.3% from 11,427 K\u20ac to 11,279 K\u20ac, return on sales increased by 0.1 Pp from 7.3 to 7.4, operating cash",
                " The text discusses the financial results for a company and provides key figures, information about the company, share performance, an interim management report, consolidated interim financial statements, notes to the financial statements, and additional information."
              ]
            }
            this.summaryList = obj.summaryOfFile
            this.size = this.summaryList.length - 1;
            this.showLoader = false
            let index = 0;
            this.summaryList.forEach((summary:any)=>{
              let words = summary.split(" ");
              let wordsIndex = 0;
              words.forEach((word: string) => {
                let wordLowerCase = word.toLowerCase()
                if(wordLowerCase?.includes(',')) wordLowerCase = wordLowerCase.split(',').join('')
                if(this.dict[wordLowerCase] && this.dict[wordLowerCase].space == undefined) {
                  console.log('actual',wordLowerCase, word)
                  summary = summary.replace(word, '<div class="tooltip">' + word + '<span class="tooltiptext">' + this.dict[wordLowerCase] + '</span></div>');
                } else if(this.dict[word] && this.dict[word].space != undefined) {
                  let nextWord = words[wordsIndex+1]
                  let lowerCaseNextWord = nextWord?.toLowerCase()
                  // nextWord = nextWord.toLowerCase()
                  if(lowerCaseNextWord?.includes(',')) lowerCaseNextWord = lowerCaseNextWord.split(',').join('')
                  console.log('2 word',word+' '+nextWord);
                  if(this.dict[wordLowerCase].space[lowerCaseNextWord]) {
                    console.log('2 word passed',word+' '+nextWord);
                    summary = summary.replace(word+' '+nextWord, '<div class="tooltip">' + word+' '+nextWord + '<span class="tooltiptext">' + this.dict[wordLowerCase].space[lowerCaseNextWord] + '</span></div>');
                  }
                }
                wordsIndex++
              })
              this.summaryList[index] = summary.replace('net profit', '<div class="tooltip">net profit<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('profit before tax', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('operating profit', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('EBIT margin', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('cash equivalents', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('net income', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('earnings per share', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('capital expenditures', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('effective tax', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('tax rate', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('cash flow', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('capital ratio', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('net sales', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('opeating expenses', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('diluted earnings', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('tangible equity', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('cash flows', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('comprehensive income', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');
              this.summaryList[index] = summary.replace('operating cash flow', '<div class="tooltip">profit before tax<span class="tooltiptext">Tooltip text</span></div>');

              index +=1
            })
          }, (error) => {
            console.log("error",error)
          });
      }

  
}

}