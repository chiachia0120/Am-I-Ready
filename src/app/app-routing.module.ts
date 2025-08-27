import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pages',
    loadComponent: () =>
      import('./pages/pages.component').then((m) => m.PagesComponent),
    children: [
      { path: '', redirectTo: 'pages', pathMatch: 'full' },
      {
        path: 'plan',
        loadComponent: () =>
          import('./pages/plan/plan.page').then((m) => m.PlanPage),
      },
      {
        path: 'checklist',
        loadComponent: () =>
          import('./pages/checklist/checklist.page').then(
            (m) => m.ChecklistPage
          ),
      },
      {
        path: 'question',
        loadComponent: () =>
          import('./pages/question/question.page').then((m) => m.QuestionPage),
      },
    ],
  },

  { path: '**', redirectTo: 'pages' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
