import {
  animate,
  animateChild,
  group,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
  useAnimation,
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.model';
import { flashAnimation } from '../../animations/flash.animation';
import { slideAndFadeAnimation } from '../../animations/slide-and-fade.animation';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [
    trigger('listItem', [
      state(
        'default',
        style({
          transform: 'scale(1)',
          'background-color': 'white',
          'z-index': 1,
        })
      ),
      state(
        'active',
        style({
          transform: 'scale(1.05)',
          'background-color': 'rgb(201, 157, 242)',
          'z-index': 2,
        })
      ),
      transition('default => active', [animate('100ms ease-in-out')]),
      transition('active => default', [animate('500ms ease-in-out')]),
      transition(':enter', [
        query('.comment-text, .comment-date', [
          style({
            opcaity: 0,
          }),
        ]),
        useAnimation(slideAndFadeAnimation, {
          params: {
            time: '500ms',
            startColor: 'rgb(201, 157, 242)',
          },
        }),
        group([
          useAnimation(flashAnimation, {
            params: { time: '250ms', flashColor: 'rgb(201, 157, 242)' },
          }),
          query('.comment-text', [animate('250ms', style({ opacity: 1 }))]),
          query('.comment-date', [animate('500ms', style({ opacity: 1 }))]),
        ]),
      ]),
    ]),
    trigger('list', [
      transition(':enter', [
        query('@listItem', [stagger(50, [animateChild()])]),
      ]),
    ]),
  ],
})
export class CommentsComponent implements OnInit {
  @Input() comments!: Comment[];
  @Output() newComment = new EventEmitter<string>();

  animationStates: { [key: number]: 'default' | 'active' } = {};
  commentCtrl!: FormControl;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.commentCtrl = this.formBuilder.control('', [
      Validators.required,
      Validators.minLength(10),
    ]);

    for (let index in this.comments) {
      this.animationStates[index] = 'default';
    }
  }

  onListItemMouseEnter(index: number) {
    this.animationStates[index] = 'active';
  }

  onListItemMouseLeave(index: number) {
    this.animationStates[index] = 'default';
  }

  onLeaveComment(): void {
    if (!this.commentCtrl.invalid) {
      const maxId = Math.max(...this.comments.map((comment) => comment.id));
      this.comments.unshift({
        id: maxId + 1,
        comment: this.commentCtrl.value,
        createdDate: new Date(),
        userId: 1,
      });

      this.newComment.emit(this.commentCtrl.value);
      this.commentCtrl.reset();
    }
  }
}
