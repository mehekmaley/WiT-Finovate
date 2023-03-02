import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Finovate';
  constructor(private router: Router){ }
  goToPage(pageName:string){
    console.info("hello " + pageName);
    this.router.navigateByUrl('summarization');//(['/summarization']);
  }
}




