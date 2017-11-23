import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http'

//import { ApolloClient } from 'apollo-client';
import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
//import gql from 'graphql-tag';

import { AppRoutingModule } from './modules/app-routing/app-routing.module';

// in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './services/in-memory-data.service';

import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AreaDetailComponent } from './components/area-detail/area-detail.component';
import { AreasEditorComponent } from './components/areas-editor/areas-editor.component';
import { DomainDetailComponent } from './components/domain-detail/domain-detail.component';
import { DomainsEditorComponent } from './components/domains-editor/domains-editor.component';
import { TopicDetailComponent } from './components/topic-detail/topic-detail.component';

import { AreaService } from './services/area.service';
// import { DomainService } from './services/domain.service';
// import { TopicService } from './services/topic.service';
import { GraphService } from './services/graph-service.service';
import { UuidService } from './services/uuid.service'

import { SortObjArrayPipe } from './pipes/sort-obj-array.pipe';
import { TopicsEditorComponent } from './components/topics-editor/topics-editor.component';

// const client = new ApolloClient();
// export function provideClient(): ApolloClient {
//   return client;
// }

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TopicDetailComponent,
    AreaDetailComponent,
    DomainDetailComponent,
    AreasEditorComponent,
    DomainsEditorComponent,
    SortObjArrayPipe,
    TopicsEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    //InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule,
    HttpClientModule,
    HttpLinkModule,
    ApolloModule
  ],
  providers: [
    AreaService,
    // DomainService,
    // TopicService,
    GraphService,
    UuidService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      link: httpLink.create({ uri: 'http://localhost:7474/graphql//' }),
      cache: new InMemoryCache({
        dataIdFromObject: o => o["uuid"]
      })
    });
  }
}

