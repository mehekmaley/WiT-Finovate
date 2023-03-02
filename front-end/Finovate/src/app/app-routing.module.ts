import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppSummarizationComponent} from './summary/summary.summarization';
import {AppComponent} from './app.component';
import {LandingPageComponent} from './landing-page/landing-page.component'
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'summarization', component: AppSummarizationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
