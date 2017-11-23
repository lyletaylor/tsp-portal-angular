import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AreasEditorComponent } from '../../components/areas-editor/areas-editor.component';
import { DomainsEditorComponent } from '../../components/domains-editor/domains-editor.component';
import { TopicsEditorComponent } from '../../components/topics-editor/topics-editor.component';

const routes: Routes = [
  { path: '', redirectTo: '/domains', pathMatch: 'full' },
  { path: 'areas',  component: AreasEditorComponent },
//  { path: 'detail/:id', component: HeroComponent },
  { path: 'domains', component: DomainsEditorComponent },
  { path: 'topics', component: TopicsEditorComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
