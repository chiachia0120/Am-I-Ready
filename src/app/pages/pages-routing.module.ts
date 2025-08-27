import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'plan', pathMatch: 'full' },

      {
        path: 'plan',
        loadChildren: () => import('./plan/plan.page').then((m) => m.PlanPage),
      },
      {
        path: 'checklist',
        loadChildren: () =>
          import('./checklist/checklist.page').then((m) => m.ClecklistPage),
      },
      {
        path: 'question',
        loadChildren: () =>
          import('./question/question.page').then((m) => m.QuestionPage),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
