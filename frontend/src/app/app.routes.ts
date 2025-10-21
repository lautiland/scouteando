import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { CategoryComponent } from './routes/category/category.component';
import { ArticleComponent } from './routes/article/article.component';
import { ErrorComponent } from './shared/error/error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'error/:code', component: ErrorComponent },
  { path: ':category/:articleId', component: ArticleComponent },
  { path: ':category', component: CategoryComponent, runGuardsAndResolvers: 'paramsChange' },
  { path: '**', component: ErrorComponent, data: { code: '404' } }
];