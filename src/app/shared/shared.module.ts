import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './components/comments/comments.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ShortenPipe } from './pipes/shorten.pipe';
import { UsernamePipe } from './pipes/username.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { HighlightDirective } from './directives/highlight.directive';


@NgModule({
  declarations: [
    CommentsComponent,
    HighlightDirective,
    ShortenPipe,
    TimeAgoPipe,
    UsernamePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommentsComponent,
    HighlightDirective,
    MaterialModule,
    ReactiveFormsModule,
    ShortenPipe,
    TimeAgoPipe,
    UsernamePipe,
  ]
})
export class SharedModule { }
