import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { CategoryComponent } from './routes/category/category.component';
import { ArticleComponent } from './routes/article/article.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':category', component: CategoryComponent, runGuardsAndResolvers: 'paramsChange' },
  { path: ':category/:articleId', component: ArticleComponent },
  { path: '**', redirectTo: '' }
];