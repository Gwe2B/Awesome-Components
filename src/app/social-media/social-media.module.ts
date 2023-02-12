import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { SocialMediaRoutingModule } from './social-media-routing.module';
import { PostsService } from './services/posts.service';
import { PostsResolver } from './resolvers/posts.resolver';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostListItemComponent } from './components/post-list-item/post-list-item.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PostListComponent, PostListItemComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    SocialMediaRoutingModule,
    SharedModule,
  ],
  providers: [PostsResolver, PostsService],
})
export class SocialMediaModule {}
