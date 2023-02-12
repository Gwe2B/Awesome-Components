import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post.model';

@Injectable()
export class PostsService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.apiUrl}/posts`).pipe(
      tap((data) => console.log(data))
    );
  }

  addNewComment(postCommented: {comment: string, postId: number}): void {
    console.log(postCommented);
  }
}
